// components/ImageParametersInput.tsx

import React from 'react';

interface ImageParameters {
  batchSize: number;
  cfgScale: number;
  height: number;
  prompt: string;
  samplerName: string;
  seed: number;
  steps: number;
  width: number;
}

interface ImageParametersInputProps {
  parameters: ImageParameters;
  onChange: (params: ImageParameters) => void;
}

const ImageParametersInput: React.FC<ImageParametersInputProps> = ({ parameters, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...parameters, [name]: value }); // Update the specific parameter
  };

  return (
    <div className="space-y-4">
      <input
        type="number"
        name="batchSize"
        value={parameters.batchSize}
        onChange={handleChange}
        placeholder="Batch Size"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="cfgScale"
        value={parameters.cfgScale}
        onChange={handleChange}
        placeholder="CFG Scale"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="height"
        value={parameters.height}
        onChange={handleChange}
        placeholder="Height"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="prompt"
        value={parameters.prompt}
        onChange={handleChange}
        placeholder="Prompt"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="samplerName"
        value={parameters.samplerName}
        onChange={handleChange}
        placeholder="Sampler Name"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="seed"
        value={parameters.seed}
        onChange={handleChange}
        placeholder="Seed"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="steps"
        value={parameters.steps}
        onChange={handleChange}
        placeholder="Steps"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="width"
        value={parameters.width}
        onChange={handleChange}
        placeholder="Width"
        className="w-full border p-2"
      />
    </div>
  );
};

export default ImageParametersInput;
