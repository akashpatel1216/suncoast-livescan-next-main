"use client";
import React, { useState } from 'react';
import './Services.css';
import Booking from '../Booking/Booking';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedAHCA, setSelectedAHCA] = useState(null);

  const services = [
    {
      id: 1,
      title: "AHCA and FL Department of Health",
      description: "Healthcare administration and health department fingerprinting services",
      category: "Healthcare",
      ahcaServices: [
        { code: "EDOH4420Z", title: "RN by Endorsement (with Photo)" },
        { code: "EDOH2550Z", title: "RN/LPN by Exam-Initial (with Photo)" },
        { code: "EDOH0380Z", title: "CNA Applicants (with Photo)" },
        { code: "EAHCA020Z", title: "AHCA ALL (with Photo)" },
        { code: "EDOH4410Z", title: "LPN by Endorsement (with Photo)" },
        { code: "EDOH4570Z", title: "Dietics/Nutrition (with Photo)" },
        { code: "EDOH4510Z", title: "Anesthesiologist Assistant (with Photo)" },
        { code: "EDOH4530Z", title: "Clinical Lab Personnel (with Photo)" },
        { code: "EDOH4550Z", title: "Clinical Social Work (with Photo)" },
        { code: "EDOH4500Z", title: "Acupuncture (with Photo)" },
        { code: "EDOH2017Z", title: "Podiatric Physician (with Photo)" },
        { code: "EDOH2016Z", title: "Chiropractic Physician (with Photo)" },
        { code: "EDOH4690Z", title: "Physical Therapy (with Photo)" },
        { code: "EDOH4560Z", title: "Dentistry (with Photo)" },
        { code: "EDOH2015Z", title: "Osteopathic Physician (with Photo)" },
        { code: "EDOH4740Z", title: "Speech‑Language Pathology & Audiology (with Photo)" },
        { code: "EDOH3415Z", title: "Orthotist & Prosthetist (with Photo)" },
        { code: "EDOH4590Z", title: "Hearing Aid Specialist (with Photo)" },
        { code: "EDOH4520Z", title: "Athletic Training (with Photo)" },
        { code: "EDOH4720Z", title: "Respiratory Care (with Photo)" },
        { code: "EDOH4580Z", title: "Electrolysis (with Photo)" },
        { code: "EDOH4610Z", title: "Medical Physicist (with Photo)" },
        { code: "EDOH4600Z", title: "Massage Therapy (with Photo)" },
        { code: "EDOH4660Z", title: "Opticianry (with Photo)" },
        { code: "EDOH4640Z", title: "Nursing Home Admin (with Photo)" },
        { code: "EDOH4670Z", title: "Optometry (with Photo)" },
        { code: "EDOH4680Z", title: "Pharmacist (with Photo)" },
        { code: "FL924890Z", title: "DOH-Office of Medical Marijuana Use" },
        { code: "EDOH4630Z", title: "Naturopath (with Photo)" },
        { code: "EDOH2014Z", title: "Physician/Medical Doctor (with Photo)" },
        { code: "EDOH4620Z", title: "Midwifery (with Photo)" },
        { code: "EDOH4710Z", title: "Psychology (with Photo)" },
        { code: "EDOH4700Z", title: "Physician Assistant (with Photo)" },
        { code: "EDOH4540Z", title: "Clinical Nurse Specialist (with Photo)" },
        { code: "EDOH4650Z", title: "Occupational Therapy (with Photo)" },
        { code: "EAHCA790Z", title: "Managed Care (with Photo)" },
        { code: "EAHCA013Z", title: "Florida Medicaid Providers and Enrollees (with Photo)" },
        { code: "EDOH4730Z", title: "School Psychology (with Photo)" }
      ]
    },
    {
      id: 2,
      title: "Vocational Rehabilitation",
      description: "Rehabilitation services background checks and compliance",
      category: "Rehabilitation",
      ahcaServices: [
        { code: "EDOEVR100", title: "Vendor Registration Employee (with Photo)" },
        { code: "EDOEVR200", title: "Independent Living Employee (with Photo)" },
        { code: "VDOEVR100", title: "Vendor Registration Volunteer (with Photo)" },
        { code: "VDOEVR200", title: "Independent Living Volunteer (with Photo)" }
      ]
    },
    {
      id: 3,
      title: "FL Highway Safety and Motor Vehicles",
      description: "Driver's license and motor vehicle related fingerprinting",
      category: "Transportation",
      ahcaServices: [
        { code: "FL924360Z", title: "CDL School Instructor License" },
        { code: "FL921700Z", title: "Auto Dealer License" }
      ]
    },
    {
      id: 4,
      title: "Florida OFR Office of Financial Regulation",
      description: "Financial services licensing and compliance",
      category: "Financial",
      ahcaServices: [
        { code: "FL921250Z", title: "Division of Securities" },
        { code: "FL737111Z", title: "Florida Mortgage Loan Originator License" },
        { code: "FL921050Z", title: "Florida Mortgage Broker & Lender License" },
        { code: "FL921060Z", title: "Insurance Agent License" }
      ]
    },
    {
      id: 5,
      title: "Florida Dept of Juvenile Justice",
      description: "Juvenile justice system background checks",
      category: "Justice",
      ahcaServices: [
        { code: "EDJJ1940Z", title: "Department of Juvenile Justice (Employee) (with Photo)" },
        { code: "VDJJ1940Z", title: "Department of Juvenile Justice (Volunteer) (with Photo)" }
      ]
    },
    {
      id: 6,
      title: "Florida Department of Children and Families",
      description: "Childcare and family services compliance",
      category: "Family Services",
      ahcaServices: [
        { code: "EDCFMH20Z", title: "Mental Health Providers (with Photo)" },
        { code: "EDCFCC40Z", title: "Child Care Providers (New) (with Photo)" },
        { code: "EDCFGH50Z", title: "Child Welfare Group Home Providers (New) (with Photo)" },
        { code: "EDCFGN10Z", title: "General DCF (with Photo)" },
        { code: "EDCFSC30Z", title: "Summer Camp (with Photo)" }
      ]
    },
    {
      id: 7,
      title: "FL Department of Revenue",
      description: "Revenue department licensing and compliance",
      category: "Government",
      ahcaServices: [
        { code: "FL921650Z", title: "Second-Hand Dealer License" }
      ]
    },
    {
      id: 8,
      title: "FL Department of Education",
      description: "Educational institution staff background checks",
      category: "Education",
      ahcaServices: [
        { code: "EDOEPUBS1", title: "Teacher Certification (with Photo)" },
        { code: "EDOEPUBS0", title: "General Employment for Public School (with Photo)" },
        { code: "EDOEPUBS2", title: "Contractor/vendor (with Photo)" },
        { code: "VDOEPUBS3", title: "Volunteers (with Photo)" },
        { code: "V42040091", title: "Marion County Youth Football" },
        { code: "V42030001", title: "Rasmussen Ocala Campus" },
        { code: "V51030013", title: "Rasmussen Central Pasco" },
        { code: "V29030051", title: "Rasmussen Tampa/Brandon Campus" },
        { code: "EDOEPRIV0", title: "Private School Employees, Contractors and Vendors (with Photo)" },
        { code: "EDOEPRIV1", title: "Private Schools Owners and Operators (with Photo)" },
        { code: "VDOEPRIV3", title: "Volunteers (with Photo)" }
      ]
    },
    {
      id: 9,
      title: "Department of Elder Affairs",
      description: "Elder care services and compliance",
      category: "Healthcare",
      ahcaServices: [
        { code: "EDOEA310Z", title: "Department of Elder Affairs (with Photo)" }
      ]
    },
    {
      id: 10,
      title: "Agency For Persons With Disabilities",
      description: "Disability services background verification",
      category: "Healthcare",
      ahcaServices: [
        { code: "EAPDFC20Z", title: "APD CDC (with Photo)" },
        { code: "EAPDGN10Z", title: "APD General (with Photo)" }
      ]
    },
    {
      id: 11,
      title: "The County Clerks",
      description: "County clerk office requirements and compliance",
      category: "Government",
      ahcaServices: [
        { code: "FL923920Z", title: "The Marion County (Name Change)" },
        { code: "FL923600Z", title: "The Citrus County (Name Change)" },
        { code: "FL924030Z", title: "The Pinellas County (Name Change)" },
        { code: "FL923790Z", title: "The Hillsborough County (Name Change)" },
        { code: "FL009044Z", title: "Non-Professional Guardianship" }
      ]
    },
    {
      id: 12,
      title: "(DBPR) FL Department of Business and Professional Regulation",
      description: "Business and professional licensing services",
      category: "Business",
      ahcaServices: [
        { code: "FL925090Z", title: "Florida Supreme Court - Mediators" },
        { code: "FL920010Z", title: "Real Estate Sales & Brokers" },
        { code: "FL923400Z", title: "Construction" },
        { code: "FL920150Z", title: "Alcoholic, Beverages and Tobacco" },
        { code: "FL924250Z", title: "Home Inspectors" },
        { code: "FL921932Z", title: "Community Association Managers" },
        { code: "FL737127Z", title: "FL Court Dispute Resolution Center - Mediators" },
        { code: "FL922050Z", title: "Real Estate Appraisers" },
        { code: "FL924260Z", title: "Mold Remediation or Assessment" },
        { code: "FL924270Z", title: "Temporary License for Military, Military Endorsement Spouse (All Boards)" },
        { code: "FL925183Z", title: "Pari-Mutuel Wagering (PMW)" },
        { code: "FL924780Z", title: "Drugs, Devices & Cosmetics" },
        { code: "FL921880Z", title: "Employee Leasing" },
        { code: "FL925185Z", title: "Pari-Mutuel Slots (PMW)" },
        { code: "FL921900Z", title: "Florida Condominiums, Timeshares, and Mobile Homes (FCTMH)" },
        { code: "FL922040Z", title: "Athlete Agents" },
        { code: "FL921670Z", title: "Talent Agents" },
        { code: "FL920190Z", title: "Florida Board of Bar Examiners" },
        { code: "FL925184Z", title: "Pari-Mutuel Occupational Licenses" },
        { code: "FL925186Z", title: "Cardroom Occupational Licenses" }
      ]
    },
    {
      id: 13,
      title: "Department of Agriculture & Consumer Services",
      description: "Agriculture licensing and consumer protection",
      category: "Government"
    },
    {
      id: 14,
      title: "DOA (Security/PI/Firearm Instructor)",
      description: "Security, private investigator, and firearm instructor licensing",
      category: "Security"
    }
  ];

  const handleBookNow = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    
    if (service.ahcaServices && service.ahcaServices.length) {
      setSelectedService(service);
      setShowModal(true);
    } else {
      // For other services, show the regular alert
      alert(`Redirecting to booking for: ${service.title}\n\nThis would typically take you to the appropriate ORI booking system.`);
    }
  };

  const handleAHCABooking = (ahcaService) => {
    setSelectedAHCA(ahcaService);
    setShowBooking(true);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const closeBooking = () => {
    setShowBooking(false);
    setSelectedAHCA(null);
  };

  return (
    <div id="services" className="services-container">
      <div className="services-header">
        <h1>LiveScan Fingerprinting Services</h1>
        <p className="services-subtitle">
          Professional fingerprinting services for various Florida state agencies and departments
        </p>
        <div className="services-highlight">
          <p>Get in and out in 10 minutes with our state-of-the-art biometric Live Scan technology.</p>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-header">
              <h3>{service.title}</h3>
              <span className="service-category">{service.category}</span>
            </div>
            <p className="service-description">{service.description}</p>
            <button 
              className="book-now-btn"
              onClick={() => handleBookNow(service.id)}
            >
              BOOK NOW
            </button>
          </div>
        ))}
      </div>

      <div className="services-info">
        <div className="info-section">
          <h2>Why Choose Our LiveScan Services?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h4>Convenient Location</h4>
              <p>Easily accessible with ample parking</p>
            </div>
            <div className="benefit-item">
              <h4>Advanced Technology</h4>
              <p>State-of-the-art biometric Live Scan for precise results</p>
            </div>
            <div className="benefit-item">
              <h4>Fast & Efficient</h4>
              <p>Complete your fingerprinting in under 10 minutes!</p>
            </div>
            <div className="benefit-item">
              <h4>Trusted & Compliant</h4>
              <p>Adhering to all state and federal regulatory standards</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Additional Services</h2>
          <div className="additional-services">
            <ul>
              <li>Mobile Fingerprinting – We Come to You!</li>
              <li>Corporate Accounts with Volume Discounts</li>
              <li>Background Check Services</li>
              <li>Regulatory Compliance Support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AHCA Services Modal */}
      {showModal && selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedService.title}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Select your specific service to book your fingerprinting appointment:
              </p>
              <div className="ahca-services-grid">
                {selectedService.ahcaServices.map((ahcaService, index) => (
                  <div key={index} className="ahca-service-item">
                    <div className="ahca-service-info">
                      <span className="ahca-code">{ahcaService.code}</span>
                      <span className="ahca-title">{ahcaService.title}</span>
                    </div>
                    <button 
                      className="ahca-book-btn"
                      onClick={() => handleAHCABooking(ahcaService)}
                    >
                      BOOK NOW
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedAHCA && (
        <Booking 
          service={selectedAHCA} 
          onClose={closeBooking}
        />
      )}
    </div>
  );
};

export default Services;
