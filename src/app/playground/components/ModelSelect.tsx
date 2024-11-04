'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Adjust imports accordingly

interface Model {
  title: string;
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
      try {
        const response = await fetch('https://ofor.j1seki.cc/sdapi/v1/sd-models');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.title} value={model.title}>
            {model.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
