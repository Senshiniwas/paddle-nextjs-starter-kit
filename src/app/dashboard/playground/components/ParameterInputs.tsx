// components/ImageParametersInput.tsx

import React, { useEffect, useRef } from 'react';

interface ImageParameters {
  batchSize: number;
  cfgScale: number;
  height: number;
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
  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = () => {
    if (editorRef.current) {
      const input = editorRef.current.innerText;

      try {
        const parsedParameters = JSON.parse(input);
        onChange(parsedParameters);
      } catch (error) {
        console.error('Invalid input format:', error);
      }
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerText = JSON.stringify(parameters, null, 2);
    }
  }, [parameters]);

  return (
    <div className="border p-4 rounded-lg overflow-auto bg-black text-white">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        className="min-h-[200px] font-mono whitespace-pre border-2 border-gray-600 rounded-lg p-2"
        placeholder="Editable JSON parameters..."
      />
    </div>
  );
};

export default ImageParametersInput;
