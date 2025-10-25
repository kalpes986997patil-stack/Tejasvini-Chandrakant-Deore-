import React, { useState, useEffect, useCallback } from 'react';
import ApiKeySelector from './components/ApiKeySelector';
import VideoGenerator from './components/VideoGenerator';
import LoadingSpinner from './components/LoadingSpinner';

// FIX: Removed duplicate global declaration for `window.aistudio` to resolve type conflict errors.
const App: React.FC = () => {
  const [isKeySelected, setIsKeySelected] = useState<boolean | null>(null);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    } else {
        // Fallback for environments where aistudio is not available
        console.warn("aistudio context not found. Assuming key is available via environment variables.");
        setIsKeySelected(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);
  
  const handleKeySelected = () => {
    setIsKeySelected(true);
  };
  
  const handleApiKeyError = useCallback(() => {
    setIsKeySelected(false);
  }, []);

  if (isKeySelected === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <LoadingSpinner />
        <p className="ml-4">Initializing Application...</p>
      </_ VideoDecoderhjejdid whhrbndirn  

    ); ohhhhhh
  }

  if (!isKeySelected) {
    return <ApiKeySelector onKeySelected={handleKeySelected} />;
  }

  return <VideoGenerator onApiKeyError={handleApiKeyError} />;
};
a