import HeroSection from '../features/hero/HeroSection';
// import AudienceSection from '../features/audience/AudienceSection';
import NLTPlus from '../features/plus/NLTPlus';
import Free from '../features/free/Free';
// import SocialProof from '../features/social-proof/SocialProof';
// import Inbox from '../features/inbox/Inbox';
// import FreePodcasts from '../features/podcasts/FreePodcasts';
import FAQSection from '../features/faq/FAQSection';
import AboutSection from '../features/about/AboutSection';
// import NewsletterCapture from '../features/newsletter/NewsletterCapture';

function Landing() {
  return (
    <div className="landing-page">
        <HeroSection />
        <Free />
        {/* <Inbox /> */}
        {/* <NewsletterCapture /> */}
        {/* <AudienceSection /> */}
        {/* <SocialProof /> */}
        {/* <FreePodcasts /> */}
        <NLTPlus />
        <FAQSection />
        <AboutSection />
    </div>
  );
}
export default Landing;