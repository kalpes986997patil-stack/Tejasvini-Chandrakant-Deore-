
import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo } from '../services/geminiService';
import { AspectRatio, LoadingState } from '../types';
import { LandscapeIcon, PortraitIcon, SparklesIcon, WarningIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

const defaultPrompt = `नमस्ते दोस्तो! मैं हूँ बंदर व्लॉगर, आज हम आए हैं केदारनाथ—यहाँ की हवा भी बोलती है… जय बाबा केदार

बंदर मंदिर के सामने हाथ जोड़ता है
“दोस्तो! ऊपर वाला सबका भला करे…
और मेरा चैनल SUBSCRIBE जरूर करे! 🙏📱”`;

const loadingMessages = [
  "Warming up the digital director...",
  "Setting up the virtual set...",
  "Casting digital actors...",
  "Rendering initial frames...",
  "Applying special effects...",
  "Finalizing the cut...",
];

interface VideoGeneratorProps {
    onApiKeyError: () => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onApiKeyError }) => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Landscape);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: number;
    if (loadingState === 'generating' || loadingState === 'polling') {
      interval = window.setInterval(() => {
        setCurrentLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loadingState]);

  const handleGenerateVideo = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate a video.");
      return;
    }
    setError(null);
    setVideoUrl(null);
    setLoadingState('generating');
    setProgressMessage('Starting...');
    setCurrentLoadingMessageIndex(0);

    try {
      const url = await generateVideo(prompt, aspectRatio, setProgressMessage);
      setVideoUrl(url);
      setLoadingState('success');
    } catch (e) {
      const err = e as Error;
      console.error(err);
      if (err.message.includes("Requested entity was not found")) {
        setError("API Key is invalid or missing. Please select a valid key.");
        onApiKeyError();
      } else {
        setError(err.message || "An unknown error occurred.");
      }
      setLoadingState('error');
    }
  }, [prompt, aspectRatio, onApiKeyError]);

  const isLoading = loadingState === 'generating' || loadingState === 'polling';

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center">
      <header className="w-full text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Veo Video Generator
        </h1>
        <p className="text-gray-400 mt-2">Bring your ideas to life with AI-powered video creation.</p>
      </header>

      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Your Video Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A neon hologram of a cat driving at top speed"
                rows={8}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAspectRatio(AspectRatio.Landscape)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    aspectRatio === AspectRatio.Landscape ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <LandscapeIcon className="w-8 h-8 mb-2" />
                  <span>16:9 Landscape</span>
                </button>
                <button
                  onClick={() => setAspectRatio(AspectRatio.Portrait)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    aspectRatio === AspectRatio.Portrait ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <PortraitIcon className="w-8 h-8 mb-2" />
                  <span>9:16 Portrait</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleGenerateVideo}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[300px] lg:min-h-0 border border-gray-700">
            {isLoading && (
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold text-gray-300">{loadingMessages[currentLoadingMessageIndex]}</p>
                <p className="mt-1 text-sm text-gray-400">{progressMessage}</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg">
                <WarningIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {videoUrl && (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full rounded-md object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
            {loadingState === 'idle' && !videoUrl && (
                <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="mt-4">Your generated video will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </div>
       <footer className="w-full text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VideoGenerator;
