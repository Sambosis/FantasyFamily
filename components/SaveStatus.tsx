import React, { useState, useEffect } from 'react';
import { getStorageInfo } from '../utils/storage';

export function SaveStatus() {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for updates every second
    const interval = setInterval(() => {
      const info = getStorageInfo();
      if (info.lastSaved && info.lastSaved !== lastSaved) {
        setLastSaved(info.lastSaved);
        setIsVisible(true);
        
        // Hide after 3 seconds
        setTimeout(() => setIsVisible(false), 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (!isVisible || !lastSaved) return null;

  const timeAgo = new Date(lastSaved).toLocaleTimeString();

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg transition-opacity duration-300 text-sm z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Saved at {timeAgo}</span>
      </div>
    </div>
  );
}