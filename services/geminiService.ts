import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

// FIX: Removed duplicate global declaration for `window.aistudio` to resolve type conflict errors.
const POLLING_INTERVAL = 10000; // 10 seconds

export const generateVideo = async (
  prompt: string,
  aspectRatio: AspectRatio,
  onProgress: (message: string) => void
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please select one.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  onProgress("Initializing video generation...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  onProgress("Processing request... This may take a few minutes.");
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    onProgress("Checking video status...");
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Could not retrieve video download link.");
  }

  onProgress("Downloading video...");
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  onProgress("Video generation complete!");
  return videoUrl;
};
