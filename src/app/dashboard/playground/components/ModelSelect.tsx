'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Adjust imports accordingly

interface Model {
  model_name: string; // Use model_name from the API response
}

interface ModelSelectProps {
  onSelect: (model: string) => void; // Callback to notify parent of selected model
}

const ModelSelect: React.FC<ModelSelectProps> = ({ onSelect }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('https://ofor.j1seki.cc/sdapi/v1/sd-models');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setModels(data); // Assuming data is an array of models
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading models...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.model_name} value={model.model_name}>
            {' '}
            {/* Use model.model_name */}
            {model.model_name} {/* Display model name */}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
