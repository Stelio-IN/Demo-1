import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VerificationTool from './components/VerificationTool';
import EducationalContent from './components/EducationalContent';
import ShareStory from './components/ShareStory';
import Reintegration from './components/Reintegration';
import Report from './components/Report';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      <Header />
      <main>
        <Hero />
        <VerificationTool />
        <EducationalContent />
        <ShareStory />
        <Reintegration />
        <Report />
      </main>
      <Footer />
    </div>
  );
}

export default App;