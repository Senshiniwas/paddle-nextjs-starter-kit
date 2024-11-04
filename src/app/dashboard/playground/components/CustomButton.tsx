// components/CustomButton.tsx

import React from 'react';
import { Button } from '@/components/ui/button'; // Import your Button component

interface CustomButtonProps {
  textInput: string;
  selectedModel: string;
  onImageGenerated: (imageSrc: string) => void;
  className?: string; // Optional className prop
  batchSize?: number; // Dynamic batch size
  cfgScale?: number; // Dynamic cfg scale
  distilledCfgScale?: number; // Dynamic distilled cfg scale
  height?: number; // Dynamic height
  width?: number; // Dynamic width
  samplerName?: string; // Dynamic sampler name
  scheduler?: string; // Dynamic scheduler
  seed?: number; // Dynamic seed
  steps?: number; // Dynamic steps
}

const CustomButton: React.FC<CustomButtonProps> = ({
  textInput,
  selectedModel,
  onImageGenerated,
  className,
  batchSize = 1, // Default value if not provided
  cfgScale = 1,
  distilledCfgScale = 3.5,
  height = 1152,
  width = 896,
  samplerName = 'Euler',
  scheduler = 'Simple',
  seed = -1,
  steps = 20,
}) => {
  const handleClick = async () => {
    try {
      const response = await fetch('https://ofor.j1seki.cc/sdapi/v1/txt2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sd_model_name: selectedModel,
          prompt: textInput,
          batch_size: batchSize,
          cfg_scale: cfgScale,
          distilled_cfg_scale: distilledCfgScale,
          height: height,
          width: width,
          sampler_name: samplerName,
          scheduler: scheduler,
          seed: seed,
          steps: steps,
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
