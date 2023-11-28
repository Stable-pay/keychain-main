// hooks/useStandaloneMode.js
"use client";
import { useEffect, useState } from 'react';

function isStandalone() {
  // Check if the app is running in a standalone PWA mode
  return window.matchMedia('(display-mode: standalone)').matches;
}

export default function useStandaloneMode() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is in standalone mode when the component mounts
    setStandalone(isStandalone());

    // Add an event listener to handle changes in standalone mode
    const listener = () => {
      setStandalone(isStandalone());
    };

    window.addEventListener('beforeinstallprompt', listener);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', listener);
    };
  }, []);

  return standalone;
}
