
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success after the dialog is opened to handle potential race conditions.
      onKeySelected();
    } catch (error) {
      console.error("Error opening API key selection:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg text-center">
        <div className="flex justify-center">
          <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 0110.257-4.257M15 7A2 2 0 0013 5M3 7a2 2 0 012-2m4 0a6 6 0 017.743-5.743L17 5v2h2v2h2v4a6 6 0 01-10.257 4.257M15 7A2 2 0 0117 9"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-white">API Key Required</h1>
        <p className="text-gray-300">
          To use the Veo Video Generator, you need to select an API key. This will be used to authenticate your requests.
        </p>
        <p className="text-sm text-gray-400">
          Please note that usage may incur costs. For more details, see the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            billing documentation
          </a>.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full px-4 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-transform transform hover:scale-105"
        >
          Select Your API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeySelector;
