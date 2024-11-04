'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import ModelSelect from './components/ModelSelect';
import { Textarea } from '@/components/ui/textarea'; // Adjust the import based on your structure
import CustomButton from './components/CustomButton'; // Import the CustomButton component
import { createClient } from '@/utils/supabase/client'; // Adjust the path as necessary
import { GeneratedImages } from './components/GeneratedImages'; // Adjust the import path

const supabase = createClient();

const Page: React.FC = () => {
  const [textInput, setTextInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageParameters, setImageParameters] = useState({
    height: 1152,
    width: 896,
    samplerName: 'Euler',
    batchSize: 1,
    cfgScale: 1,
    seed: -1,
    steps: 20,
  });

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

  const uploadImage = async (imageBase64: string) => {
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const response = await fetch(`data:image/png;base64,${imageBase64}`);
    const blob = await response.blob();
    const folderPath = `${userId}/`;
    const fileName = `${Date.now()}.png`;

    const { data, error } = await supabase.storage.from('fluence').upload(`${folderPath}${fileName}`, blob, {
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
    setImageSrc(generatedImage);
    await uploadImage(generatedImage);
  };

  // Handle parameter changes
  const handleParameterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const newParams = JSON.parse(e.target.value);
      setImageParameters(newParams);
    } catch (error) {
      console.error('Invalid JSON format', error);
    }
  };

  return (
    <div>
      <div className="max-w-auto mx-auto p-4 space-y-4">
        <div className="flex w-full mx-auto p-6 space-x-4 rounded-md shadow-lg">
          {/* Column 1: Textarea and Model Select */}
          <div className="flex flex-col w-1/3 space-y-4">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your input here..."
              className="w-full min-h-[230px] text-white"
            />
            <ModelSelect onSelect={setSelectedModel} />
          </div>

          {/* Column 2: Editable JSON and Button */}
          <div className="flex flex-col w-1/3 space-y-4">
            <div className="bg-black text-white p-4 rounded-md overflow-auto">
              <h3 className="font-semibold mb-2">Image Parameters (JSON format)</h3>
              <textarea
                value={JSON.stringify(imageParameters, null, 2)} // Format for readability
                onChange={handleParameterChange}
                className="w-full h-40 bg-black text-white outline-none resize-none"
              />
            </div>
            <CustomButton
              textInput={textInput}
              selectedModel={selectedModel}
              imageParameters={imageParameters}
              onImageGenerated={handleImageGenerated}
            />
          </div>

          {/* Column 3: Generated Image */}
          <div className="flex flex-col w-1/3">
            {imageSrc ? (
              <img src={`data:image/png;base64,${imageSrc}`} alt="Generated" className="mt-4 h-auto" />
            ) : (
              <div className="mt-4 w-full h-64  flex items-center justify-center">
                <span>No image generated. Please submit.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <GeneratedImages />
    </div>
  );
};

export default Page;
