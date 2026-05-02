import React, { useState, useEffect } from 'react';
import './InstallPWA.css';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    const handler = (e) => {
      e.preventDefault();
      console.log("Install prompt event triggered!");
      setSupportsPWA(true);
      setPromptInstall(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If it's iOS and not already installed, show instructions
    if (isIosDevice && !window.matchMedia('(display-mode: standalone)').matches) {
      setSupportsPWA(true);
      setVisible(true);
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setVisible(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (isIOS) {
      alert('To install FinTrack on your iPhone/iPad: \n1. Click the "Share" button at the bottom of Safari.\n2. Scroll down and click "Add to Home Screen".');
      return;
    }
    
    if (!promptInstall) {
      return;
    }
    
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setVisible(false);
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="install-pwa-container">
      <div className="install-pwa-card">
        <div className="install-pwa-icon">
          <img src="/logo.png" alt="FinTrack" />
        </div>
        <div className="install-pwa-content">
          <h3>{isIOS ? 'Install FinTrack' : 'Get the App'}</h3>
          <p>{isIOS ? 'Tap Share and "Add to Home Screen"' : 'Install for a better experience.'}</p>
        </div>
        <div className="install-pwa-actions">
          <button className="install-btn" onClick={onClick}>
            {isIOS ? 'How?' : 'Install'}
          </button>
          <button className="close-btn" onClick={() => setVisible(false)}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
