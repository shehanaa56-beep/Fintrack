import React, { useState, useEffect } from 'react';
import './InstallPWA.css';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log("we are being triggered :");
      setSupportsPWA(true);
      setPromptInstall(e);
      
      // Show the prompt
      setVisible(true);

      // Hide the prompt after 10 seconds if not clicked
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setSupportsPWA(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
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

  if (!visible || !supportsPWA) {
    return null;
  }

  return (
    <div className="install-pwa-container">
      <div className="install-pwa-card">
        <div className="install-pwa-icon">
          <img src="/logo.png" alt="FinTrack" />
        </div>
        <div className="install-pwa-content">
          <h3>Install FinTrack</h3>
          <p>Add to your home screen for better experience.</p>
        </div>
        <div className="install-pwa-actions">
          <button className="install-btn" onClick={onClick}>
            Install
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
