"use client";
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './Booking.css';
import pricing from '../../data/pricing.json';

const Booking = ({ service, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    oriCode: service.code,
    serviceName: service.title
  });
  const [currentStep, setCurrentStep] = useState(1); // 1: Date, 2: Time, 3: Details, 4: Payment, 5: Confirmation
  const [paymentError, setPaymentError] = useState('');
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [helcimCardToken, setHelcimCardToken] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [bookedSlotId, setBookedSlotId] = useState('');
  const [disabledTimes, setDisabledTimes] = useState([]);

  // Debug logging toggle
  const helcimDebug = process.env.NEXT_PUBLIC_HELCIM_DEBUG === '1';

  // ENV (public)
  const helcimJsToken = process.env.NEXT_PUBLIC_HELCIM_JS_TOKEN || '';
  const helcimLanguage = 'en';
  const helcimTest = process.env.NEXT_PUBLIC_HELCIM_TEST || '1'; // '1' for sandbox, '0' for live
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  const captchaEnabled = false; // Helcim captcha disabled in settings
  const envAmount = process.env.NEXT_PUBLIC_BOOKING_PRICE ? parseFloat(process.env.NEXT_PUBLIC_BOOKING_PRICE) : undefined;

  // Price (configurable via env, defaults to service-specific pricing if available, else 65.00 USD)
  const mappedPrice = pricing?.[service.code] ?? undefined;
  const priceAmount = Number.isFinite(envAmount) ? envAmount : (Number.isFinite(mappedPrice) ? mappedPrice : 65.0);

  // Refs for Helcim.js form inputs
  const cardNumberRef = useRef(null);
  const cardExpiryMonthRef = useRef(null);
  const cardExpiryYearRef = useRef(null);
  const cardCVVRef = useRef(null);
  const cardHolderNameRef = useRef(null);
  const cardHolderAddressRef = useRef(null);
  const cardHolderPostalCodeRef = useRef(null);
  const recaptchaRef = useRef(null);
  const cardTokenInputRef = useRef(null);
  const hiddenIframeRef = useRef(null);

  // Switch to HelcimPay.js modal approach
  const useHelcimPay = true;

  // Instrumentation for Helcim results and iframe loads
  useEffect(() => {
    if (!helcimDebug || currentStep !== 4) return;
    const resultsEl = typeof document !== 'undefined' ? document.getElementById('helcimResults') : null;
    let observer;
    if (resultsEl) {
      observer = new MutationObserver(() => {
        const txt = resultsEl.textContent || '';
        console.log('[Helcim] helcimResults changed:', txt.slice(0, 400));
      });
      observer.observe(resultsEl, { childList: true, subtree: true, characterData: true });
      console.log('[Helcim] Observer attached to #helcimResults');
    } else {
      console.log('[Helcim] #helcimResults not found for observer');
    }
    const iframe = hiddenIframeRef.current;
    const onLoad = () => console.log('[Helcim] hidden iframe load event');
    if (iframe) iframe.addEventListener('load', onLoad);

    return () => {
      if (observer) observer.disconnect();
      if (iframe) iframe.removeEventListener('load', onLoad);
    };
  }, [helcimDebug, currentStep]);

  // Generate next 30 days for calendar
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (closed)
      if (date.getDay() !== 0) {
        days.push({
          date: date,
          day: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isToday: i === 0,
          isPast: i < 0
        });
      }
    }
    return days;
  };

  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  // Load confirmed (paid) bookings for the selected day and disable overlapping time slots
  useEffect(() => {
    const fetchBookedForDay = async () => {
      if (!selectedDate) return;
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const nextDay = new Date(startOfDay);
        nextDay.setDate(startOfDay.getDate() + 1);

        const { data, error } = await supabase
          .from('booked_slots')
          .select('start_at, end_at, status')
          .eq('status', 'confirmed')
          .gte('start_at', startOfDay.toISOString())
          .lt('start_at', nextDay.toISOString());

        if (error) {
          console.error('Failed loading booked slots:', error.message);
          setDisabledTimes([]);
          return;
        }

        const booked = Array.isArray(data) ? data : [];
        const blocked = [];

        for (const t of timeSlots) {
          const { startISO, endISO } = getSelectedSlotISO(selectedDate, t);
          const slotStart = new Date(startISO).getTime();
          const slotEnd = new Date(endISO).getTime();
          const overlaps = booked.some((b) => {
            const bStart = new Date(b.start_at).getTime();
            const bEnd = new Date(b.end_at).getTime();
            return slotStart < bEnd && slotEnd > bStart;
          });
          if (overlaps) blocked.push(t);
        }

        setDisabledTimes(blocked);
      } catch (e) {
        console.error('Error computing disabled times:', e);
        setDisabledTimes([]);
      }
    };

    fetchBookedForDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleTimeSelect = async (time) => {
    if (isRedirecting) return; // prevent stacking if already redirecting
    setSelectedTime(time);
    // Do not pre-hold; proceed to details
    setCurrentStep(3);
  };

  const handleInputChange = (e) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [e.target.name]: e.target.value
    });
  };

  const refreshRecaptcha = async () => {
    if (!captchaEnabled) return '';
    try {
      if (typeof window !== 'undefined' && window.grecaptcha && recaptchaRef.current) {
        if (helcimDebug) console.log('[Helcim] Requesting reCAPTCHA token…');
        const token = await new Promise((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(recaptchaSiteKey, { action: 'helcimJSCheckout' })
              .then(resolve)
              .catch(reject);
          });
        });
        recaptchaRef.current.value = token || '';
        if (helcimDebug) console.log('[Helcim] reCAPTCHA token set:', token ? token.slice(0, 8) + '...' : '');
        return token || '';
      }
    } catch (e) {
      if (helcimDebug) console.error('[Helcim] reCAPTCHA error:', e);
    }
    return '';
  };

  const handleContinueToPayment = async () => {
    setCurrentStep(4);
    setPaymentError('');
    setHelcimCardToken('');
    await refreshRecaptcha();
    // No pre-hold creation; payment step only
  };

  const handleHelcimTokenize = async () => {
    setPaymentError('');
    setIsTokenizing(true);
    setHelcimCardToken('');
    try {
      if (helcimDebug) console.log('[Helcim] Begin tokenization');
      if (!helcimJsToken) {
        throw new Error('Missing Helcim.js token configuration');
      }
      if (typeof window === 'undefined' || typeof window.helcimProcess !== 'function') {
        throw new Error('Payment script not loaded. Please wait and try again.');
      }

      // Ensure reCAPTCHA fresh token and wait until it's populated
      const rcToken = await refreshRecaptcha();
      if (helcimDebug && captchaEnabled) console.log('[Helcim] recaptcha token present:', !!rcToken, rcToken ? rcToken.slice(0, 8) + '...' : '');
      if (captchaEnabled && !rcToken) {
        throw new Error('Captcha not ready. Please refresh and try again.');
      }

      // Set cardToken input to "Enable" so Helcim.js returns a token
      if (cardTokenInputRef.current) {
        cardTokenInputRef.current.value = 'Enable';
      }

      if (helcimDebug) {
        console.log('[Helcim] Field snapshot:', {
          cardNumber: cardNumberRef.current?.value?.replace(/\d(?=\d{4})/g, '•').slice(-4),
          expiryMonth: cardExpiryMonthRef.current?.value,
          expiryYear: cardExpiryYearRef.current?.value,
          cvvLen: cardCVVRef.current?.value?.length || 0,
          holderName: cardHolderNameRef.current?.value,
          addressLen: cardHolderAddressRef.current?.value?.length || 0,
          postal: cardHolderPostalCodeRef.current?.value,
        });
      }

      // Trigger Helcim.js processing
      const formEl = typeof document !== 'undefined' ? document.getElementById('helcimForm') : null;
      if (helcimDebug && formEl) {
        const hiddenSnapshot = {
          token: (document.getElementById('token') || {}).value,
          language: (document.getElementById('language') || {}).value,
          test: (document.getElementById('test') || {}).value,
          recaptchaLen: ((document.getElementById('g-recaptcha-response') || {}).value || '').length,
          amount: (document.getElementById('amount') || {}).value,
          cardToken: (document.getElementById('cardToken') || {}).value,
        };
        console.log('[Helcim] Form attrs:', { name: formEl.getAttribute('name'), target: formEl.getAttribute('target'), action: formEl.getAttribute('action') || '(none)' });
        console.log('[Helcim] Hidden fields snapshot:', hiddenSnapshot);
      }
      // Normalize numeric fields just before processing
      const numEl = typeof document !== 'undefined' ? document.getElementById('cardNumber') : null;
      if (numEl) {
        numEl.value = (numEl.value || '').replace(/\D/g, '');
        if (helcimDebug) console.log('[Helcim] cardNumber digits length:', numEl.value.length);
      }
      window.helcimProcess();
      if (helcimDebug) console.log('[Helcim] helcimProcess() called');

      // Poll for token (Helcim.js populates the cardToken input)
      const start = Date.now();
      let token = '';
      while (Date.now() - start < 12000) { // up to 12s
        await new Promise(r => setTimeout(r, 300));
        const value = cardTokenInputRef.current ? cardTokenInputRef.current.value : '';
        if (value && value !== 'Enable') {
          token = value;
          break;
        }
      }

      if (!token) {
        // Try reading #helcimResults as fallback
        const resultsEl = document.getElementById('helcimResults');
        const resultsTxt = resultsEl?.textContent || '';
        if (helcimDebug) console.log('[Helcim] helcimResults text:', resultsTxt?.slice(0, 300));
        if (resultsTxt && resultsTxt.includes('cardToken')) {
          const match = resultsTxt.match(/cardToken\"?:\"?([A-Za-z0-9_-]+)/i);
          if (match && match[1]) token = match[1];
        }
      }

      if (!token) {
        throw new Error('Unable to tokenize card. Please check details and try again.');
      }

      if (helcimDebug) console.log('[Helcim] Token acquired');
      setHelcimCardToken(token);
    } catch (err) {
      if (helcimDebug) console.error('[Helcim] Tokenization error:', err);
      setPaymentError(String(err?.message || err));
    } finally {
      setIsTokenizing(false);
    }
  };

  const handleChargeAndConfirm = async () => {
    setPaymentError('');
    setIsCharging(true);
    try {
      const description = `LiveScan Appointment - ${appointmentDetails.serviceName} (${appointmentDetails.oriCode})`;
      const res = await fetch('/api/helcim/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceAmount,
          currency: 'USD',
          description,
          cardToken: helcimCardToken,
          customer: {
            name: `${appointmentDetails.firstName} ${appointmentDetails.lastName}`.trim(),
            email: appointmentDetails.email,
            phone: appointmentDetails.phone
          },
          metadata: {
            oriCode: appointmentDetails.oriCode,
            serviceName: appointmentDetails.serviceName,
            date: selectedDate?.toISOString(),
            time: selectedTime
          }
        })
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Payment failed');
      }

      const confirmationDescription = [
        `Service: ${service.title} (ORI: ${service.code})`,
        `Client: ${appointmentDetails.firstName} ${appointmentDetails.lastName}`,
        `Email: ${appointmentDetails.email}`,
        `Phone: ${appointmentDetails.phone}`,
      ].join('\n');

      // Create the confirmed booking now in Supabase
      const { startISO, endISO } = getSelectedSlotISO(selectedDate, selectedTime);
      await fetch('/api/appointments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: data?.transactionId || null,
          startISO,
          endISO,
          serviceName: service.title,
          oriCode: service.code,
          customer: {
            firstName: appointmentDetails.firstName,
            lastName: appointmentDetails.lastName,
            email: appointmentDetails.email,
            phone: appointmentDetails.phone,
          },
          notes: confirmationDescription,
        })
      });

      // Success UI
      setCurrentStep(5);
      // No longer open manual Google Calendar link
      // createGoogleCalendarEvent();
    } catch (err) {
      setPaymentError(String(err?.message || err));
    } finally {
      setIsCharging(false);
    }
  };

  const handleHelcimRedirect = async () => {
    if (isRedirecting) return; // debounce
    setPaymentError('');
    setIsRedirecting(true);
    try {
      const { startISO } = getSelectedSlotISO(selectedDate, selectedTime);
      const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const bookingId = `${service.code}-${startISO}-${uniqueSuffix}`;
      const res = await fetch('/api/helcim/hpp/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceAmount,
          sku: 'SERVICE',
          description: `${service.title} (${service.code})`,
          quantity: 1,
          bookingId,
        })
      });
      const data = await res.json();
      if (!res.ok || !data?.action || !data?.fields) throw new Error(data?.error || 'Unable to start checkout');

      // Build and submit a hidden POST form (single line item) to a uniquely named window
      const existing = document.getElementById('hppAutoForm');
      if (existing) existing.remove();
      const form = document.createElement('form');
      form.id = 'hppAutoForm';
      form.method = 'POST';
      form.action = data.action;
      const targetWindowName = `helcim_${uniqueSuffix}`;
      // open a brand-new window to avoid cart/session carryover
      window.open('about:blank', targetWindowName);
      form.target = targetWindowName;
      Object.entries(data.fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = String(name);
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setPaymentError(String(err?.message || err));
    } finally {
      setIsRedirecting(false);
    }
  };

  // Utility: compute ISO start/end from date and 'h:mm AM/PM'
  function getSelectedSlotISO(dateObj, timeLabel) {
    const startDate = new Date(dateObj);
    const [time, period] = String(timeLabel).split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours, 10);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    startDate.setHours(hour24, parseInt(minutes, 10), 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(hour24 + 1, parseInt(minutes, 10), 0, 0);
    return { startISO: startDate.toISOString(), endISO: endDate.toISOString() };
  }

  // (Removed Google Calendar edit URL builder)

  const renderStep1 = () => (
    <div className="booking-step">
      <h3>Select Date</h3>
      <p>Choose your preferred date for the appointment</p>
      <div className="calendar-grid">
        {generateCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.isToday ? 'today' : ''}`}
            onClick={() => handleDateSelect(day.date)}
          >
            <div className="day-name">{day.dayName}</div>
            <div className="day-number">{day.day}</div>
            <div className="day-month">{day.month}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="booking-step">
      <h3>Select Time</h3>
      <p>Available time slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <div className="time-slots">
        {timeSlots.map((time, index) => (
          <button
            key={index}
            className="time-slot"
            onClick={() => handleTimeSelect(time)}
            disabled={isHolding || isRedirecting || disabledTimes.includes(time)}
          >
            {disabledTimes.includes(time) ? `${time} (Booked)` : (isHolding || isRedirecting ? 'Please wait…' : time)}
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => setCurrentStep(1)}>
        ← Back to Date Selection
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="booking-step">
      <h3>Appointment Details</h3>
      <p>Please provide your contact information</p>
      <div className="form-group">
        <label>First Name *</label>
        <input
          type="text"
          name="firstName"
          value={appointmentDetails.firstName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name *</label>
        <input
          type="text"
          name="lastName"
          value={appointmentDetails.lastName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email Address *</label>
        <input
          type="email"
          name="email"
          value={appointmentDetails.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={appointmentDetails.phone}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="appointment-summary">
        <h4>Appointment Summary</h4>
        <p><strong>Service:</strong> {service.title}</p>
        <p><strong>ORI Code:</strong> {service.code}</p>
        <p><strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <p><strong>Time:</strong> {selectedTime}</p>
        <p><strong>Amount:</strong> ${priceAmount.toFixed(2)} USD</p>
      </div>
      <div className="form-actions">
        <button className="back-btn" onClick={() => setCurrentStep(2)}>
          ← Back to Time Selection
        </button>
        <button 
          className="book-btn"
          onClick={handleContinueToPayment}
          disabled={!appointmentDetails.firstName || !appointmentDetails.lastName || !appointmentDetails.email || !appointmentDetails.phone}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <>
      {/* Hidden iframe to prevent page navigation if a submit occurs */}
      <iframe ref={hiddenIframeRef} title="helcimHiddenFrame" name="helcimHiddenFrame" style={{ display: 'none' }} />
      <form name="helcimForm" id="helcimForm" target="helcimHiddenFrame" method="POST" action="" noValidate autoComplete="off">
        {/* Results area for Helcim.js */}
        <div id="helcimResults" style={{ display: 'none' }}></div>

        {/* Required hidden settings */}
        <input type="hidden" id="token" name="token" value={helcimJsToken} />
        <input type="hidden" id="language" name="language" value={helcimLanguage} />
        <input type="hidden" id="test" name="test" value={helcimTest} />
        {/* Captcha disabled */}
        {captchaEnabled && (
          <input type="hidden" id="g-recaptcha-response" name="g-recaptcha-response" ref={recaptchaRef} defaultValue="" />
        )}

        {/* Amount (hidden). Required if Helcim.js config is Purchase */}
        <input type="hidden" id="amount" name="amount" value={priceAmount.toFixed(2)} />

        {/* Card token enable + will receive token after processing */}
        <input type="hidden" id="cardToken" name="cardToken" ref={cardTokenInputRef} defaultValue="Enable" />

        {/* Card fields */}
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" id="cardNumber" name="cardNumber" ref={cardNumberRef} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
        </div>
        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Expiry Month (MM)</label>
            <input type="text" id="cardExpiryMonth" name="cardExpiryMonth" ref={cardExpiryMonthRef} inputMode="numeric" placeholder="MM" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Expiry Year (YY or YYYY)</label>
            <input type="text" id="cardExpiryYear" name="cardExpiryYear" ref={cardExpiryYearRef} inputMode="numeric" placeholder="YY" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>CVV</label>
            <input type="text" id="cardCVV" name="cardCVV" ref={cardCVVRef} inputMode="numeric" placeholder="123" />
          </div>
        </div>
        <div className="form-group">
          <label>Card Holder Name</label>
          <input type="text" id="cardHolderName" name="cardHolderName" ref={cardHolderNameRef} placeholder="Jane Doe" />
        </div>
        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Address</label>
            <input type="text" id="cardHolderAddress" name="cardHolderAddress" ref={cardHolderAddressRef} placeholder="123 Main St" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Postal Code</label>
            <input type="text" id="cardHolderPostalCode" name="cardHolderPostalCode" ref={cardHolderPostalCodeRef} placeholder="12345" />
          </div>
        </div>
      </form>
    </>
  );

  // Check if HelcimPay script is loaded (should be from layout.js)
  const checkHelcimPayReady = () => {
    if (typeof window !== 'undefined' && typeof window.appendHelcimPayIframe === 'function') {
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('HelcimPay script not loaded. Please refresh the page.'));
  };

  const openHelcimPay = async () => {
    setPaymentError('');
    setIsRedirecting(true);
    try {
      // Hold is handled via Supabase earlier (appointments/create)

      // Initialize HelcimPay session on server
      const initRes = await fetch('/api/helcim/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType: 'purchase', amount: priceAmount, currency: 'USD', confirmationScreen: true }),
      });
      const initData = await initRes.json();
      if (!initRes.ok || !initData?.checkoutToken || !initData?.secretToken) {
        throw new Error(initData?.error || 'Unable to start checkout');
      }

      // Check if HelcimPay is ready and open modal
      await checkHelcimPayReady();
      
      // Set up event listener for payment response
      let hasSaved = false;
      const helcimPayJsIdentifierKey = 'helcim-pay-js-' + initData.checkoutToken;
      const handlePaymentMessage = async (event) => {
        if (event.data.eventName === helcimPayJsIdentifierKey) {
          if (event.data.eventStatus === 'SUCCESS') {
            try {
              const result = JSON.parse(event.data.eventMessage);
              const confirmationDescription = [
                `Service: ${service.title} (ORI: ${service.code})`,
                `Client: ${appointmentDetails.firstName} ${appointmentDetails.lastName}`,
                `Email: ${appointmentDetails.email}`,
                `Phone: ${appointmentDetails.phone}`,
                result?.data?.transactionId ? `Txn: ${result.data.transactionId}` : '',
              ].filter(Boolean).join('\n');

              // Create the confirmed booking now in Supabase
              const { startISO, endISO } = getSelectedSlotISO(selectedDate, selectedTime);
              await fetch('/api/appointments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  transactionId: result?.data?.transactionId || null,
                  startISO,
                  endISO,
                  serviceName: service.title,
                  oriCode: service.code,
                  customer: {
                    firstName: appointmentDetails.firstName,
                    lastName: appointmentDetails.lastName,
                    email: appointmentDetails.email,
                    phone: appointmentDetails.phone,
                  },
                  notes: confirmationDescription,
                })
              });
              hasSaved = true;
              setCurrentStep(5);
              // Remove iframe after success
              setTimeout(() => {
                const frame = document.getElementById('helcimPayIframe');
                if (frame) frame.remove();
              }, 1000);
            } catch (e) {
              setPaymentError(String(e?.message || e));
            }
          } else if (event.data.eventStatus === 'ABORTED') {
            setPaymentError('Payment was declined or cancelled.');
          } else if (event.data.eventStatus === 'HIDE') {
            // User closed modal (after confirmation screen). If not saved yet, do nothing.
          }
          window.removeEventListener('message', handlePaymentMessage);
          // Close booking modal only after we finished handling the payment event
          onClose();
        }
      };

      window.addEventListener('message', handlePaymentMessage);
      
      // Open the HelcimPay modal using the correct function from docs
      window.appendHelcimPayIframe(initData.checkoutToken);
      
      // Keep booking modal open until we process the payment event
    } catch (err) {
      setPaymentError(String(err?.message || err));
    } finally {
      setIsRedirecting(false);
    }
  };

  const renderStep4 = () => (
    <div className="booking-step">
      <h3>Payment</h3>
      <p>Secure checkout powered by Helcim</p>
      <div className="appointment-summary">
        <h4>Order</h4>
        <p><strong>Service:</strong> {service.title}</p>
        <p><strong>ORI Code:</strong> {service.code}</p>
        <p><strong>Amount:</strong> ${priceAmount.toFixed(2)} USD</p>
        <p style={{ marginTop: '0.5rem', color: '#7f8c8d' }}>Description will be shown on the payment: {`${service.title} (${service.code})`}</p>
      </div>

      {!useHelcimPay && renderPaymentForm()}

      {paymentError && (
        <div className="appointment-summary" style={{ borderColor: '#e74c3c' }}>
          <p style={{ color: '#e74c3c' }}>{paymentError}</p>
        </div>
      )}

      <div className="form-actions">
        <button className="back-btn" onClick={() => setCurrentStep(3)} type="button">
          ← Back to Details
        </button>
        {/* Removed Google Calendar related actions */}
        {useHelcimPay ? (
          <button
            className="book-btn"
            onClick={openHelcimPay}
            disabled={isRedirecting}
            type="button"
          >
            {isRedirecting ? 'Opening Checkout…' : `Pay $${priceAmount.toFixed(2)}`}
          </button>
        ) : (
          !helcimCardToken ? (
            <button 
              className="book-btn"
              onClick={handleHelcimTokenize}
              disabled={isTokenizing}
              type="button"
            >
              {isTokenizing ? 'Securing Card…' : 'Get Secure Card Token'}
            </button>
          ) : (
            <button 
              className="book-btn"
              onClick={handleChargeAndConfirm}
              disabled={isCharging}
              type="button"
            >
              {isCharging ? 'Charging…' : 'Charge and Confirm'}
            </button>
          )
        )}
      </div>

      {!useHelcimPay && helcimCardToken && (
        <div className="appointment-summary">
          <p>Card token ready. We will charge your card securely.</p>
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="booking-step confirmation">
      <h3>Appointment Booked!</h3>
      <div className="confirmation-details">
        <p>Your appointment has been scheduled:</p>
        <div className="appointment-card">
          <h4>{service.title}</h4>
          <p><strong>ORI Code:</strong> {service.code}</p>
          <p><strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Client:</strong> {appointmentDetails.firstName} {appointmentDetails.lastName}</p>
        </div>
        <p className="next-steps">Payment successful. Your appointment is confirmed.</p>
        <div className="confirmation-actions">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="booking-header">
          <h2>Book Appointment - {service.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="booking-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Date</label>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>Time</label>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>Details</label>
          </div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <span>4</span>
            <label>Payment</label>
          </div>
          <div className={`progress-step ${currentStep >= 5 ? 'active' : ''}`}>
            <span>5</span>
            <label>Confirm</label>
          </div>
        </div>

        <div className="booking-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
};

export default Booking;
