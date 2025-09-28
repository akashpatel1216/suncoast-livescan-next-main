import Navbar from '@@/components/Navbar/Navbar';
import HeroSection from '@@/components/HeroSection/HeroSection';
import SolutionsSection from '@@/components/Solutions/Solutions';
import ServicesSection from '@@/components/Services/Services';
import AboutSection from '@@/components/About/About';
import ContactSection from '@@/components/ContactForm/ContactForm';
import FooterSection from '@@/components/Footer/Footer';


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <ServicesSection />
      <AboutSection/>
      <ContactSection/>
      <FooterSection/>
    </>
  );
}
