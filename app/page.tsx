"use client";

import { useState, useEffect } from "react";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Fix hydration error
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleGenerateImageAndCaption = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.imageUrl && data.caption) {
        setGeneratedImage(data.imageUrl);
        setCaption(data.caption);
      } else {
        alert(data.error || "Failed to generate image or caption.");
      }
    } catch (error) {
      console.error("Error fetching image and caption:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white font-mono">
      <h1 className="text-4xl font-extrabold mb-6 text-teal-400 tracking-widest">
        AI IMAGE & CAPTION GENERATOR
      </h1>
      <div className="flex space-x-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleGenerateImageAndCaption}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md font-semibold text-black ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-teal-400 hover:bg-teal-500"
          }`}
        >
          {isLoading ? "Loading..." : "Generate"}
        </button>
      </div>
      {generatedImage && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <img
            src={generatedImage}
            alt="Generated"
            className="w-64 h-64 object-cover rounded-md shadow-lg border-4 border-teal-400"
          />
          {caption && (
            <p className="mt-4 text-center text-gray-300 px-8 py-2">
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
