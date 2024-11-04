'use client'; // Mark this component as a Client Component

import { useState, useEffect } from 'react';
import ModelSelect from './components/ModelSelect';
import { Textarea } from '@/components/ui/textarea'; // Adjust the import based on your structure
import CustomButton from './components/CustomButton'; // Import the CustomButton component
import { createClient } from '@/utils/supabase/client'; // Adjust the path as necessary
import { GeneratedImages } from './components/GeneratedImages'; // Adjust the import path

const supabase = createClient();

const Page: React.FC = () => {
  const [textInput, setTextInput] = useState<string>(''); // State for the text area
  const [selectedModel, setSelectedModel] = useState<string>(''); // State for the selected model
  const [imageSrc, setImageSrc] = useState<string | null>(null); // State for the generated image
  const [userId, setUserId] = useState<string | null>(null); // State for user ID

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Session data:', data); // Log the full session data

      if (data?.session) {
        setUserId(data.session.user.id);
        console.log('User ID retrieved:', data.session.user.id); // Log user ID
      } else {
        console.error('No session found');
      }
    };

    fetchUserId();
  }, []);

  const uploadImage = async (imageBase64: string) => {
    if (!userId) {
      console.error('User ID is not set');
      return; // Ensure userId is available
    }

    // Log the image base64 to check its validity
    console.log('Uploading image with base64:', imageBase64);

    // Convert Base64 to Blob
    const response = await fetch(`data:image/png;base64,${imageBase64}`);
    const blob = await response.blob();

    // Define the folder path using userId
    const folderPath = `${userId}/`; // Use userId directly

    // Generate a unique file name
    const fileName = `${Date.now()}.png`;

    console.log('Uploading to path:', `${folderPath}${fileName}`); // Log upload path

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

  const handleImageGenerated = async (generatedImage: string) => {
    console.log('Generated image:', generatedImage); // Log generated image
    setImageSrc(generatedImage);
    await uploadImage(generatedImage); // Upload the generated image
  };

  return (
    <div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {' '}
        {/* Main container with spacing and centered */}
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type your input here..."
          className="w-full"
        />
        <ModelSelect onChange={setSelectedModel} /> {/* Pass onChange to update selected model */}
        {/* Use CustomButton and pass necessary props */}
        <CustomButton
          textInput={textInput}
          selectedModel={selectedModel}
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
