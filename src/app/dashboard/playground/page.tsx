'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import ModelSelect from './components/ModelSelect';
import { Textarea } from '@/components/ui/textarea'; // Adjust the import based on your structure
import CustomButton from './components/CustomButton'; // Import the CustomButton component
import { createClient } from '@/utils/supabase/client'; // Adjust the path as necessary
import { GeneratedImages } from './components/GeneratedImages'; // Adjust the import path
import ImageParametersInput from './components/ParameterInputs'; // New component for additional parameters

const supabase = createClient();

const Page: React.FC = () => {
  // State management for user input and selected model
  const [textInput, setTextInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageParameters, setImageParameters] = useState({
    batchSize: 1,
    cfgScale: 1,
    height: 1152,
    prompt: '',
    samplerName: 'Euler',
    seed: -1,
    steps: 20,
    width: 896,
  });

  // Effect to fetch user ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUserId(data.session.user.id);
      } else {
        console.error('No session found');
      }
    };

    fetchUserId();
  }, []);

  // Function to upload the generated image
  const uploadImage = async (imageBase64: string) => {
    if (!userId) {
      console.error('User ID is not set');
      return; // Ensure userId is available
    }

    // Convert Base64 to Blob
    const response = await fetch(`data:image/png;base64,${imageBase64}`);
    const blob = await response.blob();

    // Define the folder path using userId and generate a unique file name
    const folderPath = `${userId}/`;
    const fileName = `${Date.now()}.png`;

    // Upload the image to Supabase Storage
    const { data, error } = await supabase.storage
      .from('fluence') // Replace with your bucket name
      .upload(`${folderPath}${fileName}`, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading image:', error.message);
    } else {
      console.log('Image uploaded successfully:', data);
    }
  };

  // Handle the generated image from the CustomButton
  const handleImageGenerated = async (generatedImage: string) => {
    setImageSrc(generatedImage); // Update image source
    await uploadImage(generatedImage); // Upload the generated image
  };

  return (
    <div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type your input here..."
          className="w-full"
        />
        <ModelSelect onSelect={setSelectedModel} />

        {/* New component for additional parameters */}
        <ImageParametersInput
          parameters={imageParameters}
          onChange={setImageParameters} // Update parameters state
        />

        <CustomButton
          textInput={textInput}
          selectedModel={selectedModel}
          imageParameters={imageParameters} // Pass parameters to CustomButton
          onImageGenerated={handleImageGenerated} // Use the new function
        />

        {/* Render the generated image or placeholder if it doesn't exist */}
        {imageSrc ? (
          <img src={`data:image/png;base64,${imageSrc}`} alt="Generated" className="mt-4" />
        ) : (
          <div className="mt-4 w-full h-64 bg-gray-200 flex items-center justify-center">
            <span>No image generated. Please submit.</span>
          </div>
        )}
      </div>
      <GeneratedImages />
    </div>
  );
};

export default Page;
