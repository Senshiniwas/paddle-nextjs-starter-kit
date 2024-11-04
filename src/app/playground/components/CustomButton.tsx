// components/CustomButton.tsx

import React from 'react';
import { Button } from '@/components/ui/button'; // Import your Button component

interface CustomButtonProps {
  textInput: string;
  selectedModel: string;
  onImageGenerated: (imageSrc: string) => void;
  className?: string; // Optional className prop
}

const CustomButton: React.FC<CustomButtonProps> = ({ textInput, selectedModel, onImageGenerated, className }) => {
  const handleClick = async () => {
    try {
      const response = await fetch('https://ofor.j1seki.cc/sdapi/v1/txt2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: textInput,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      onImageGenerated(data.images[0]); // Pass the generated image back to the parent
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <Button onClick={handleClick} className={`w-full ${className}`}>
      Submit
    </Button>
  );
};

export default CustomButton;
