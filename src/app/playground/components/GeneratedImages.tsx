'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust the import path
import { FocusCards } from '@/components/ui/focus-cards'; // Adjust the import path

const supabase = createClient();

export const GeneratedImages = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedImages = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const userId = session.user.id;
        // Fetch the files from the user's folder in the bucket
        const { data, error } = await supabase.storage
          .from('fluence') // Adjust the bucket name as necessary
          .list(`${userId}/`);

        if (error) {
          console.error('Error fetching images:', error.message);
        } else {
          const imagePromises = data.map(async (file) => {
            const { data: urlData, error: urlError } = await supabase.storage
              .from('fluence')
              .createSignedUrl(`${userId}/${file.name}`, 60); // 60 seconds expiration

            if (urlError) {
              console.error('Error creating signed URL:', urlError.message);
              return null;
            }

            return { title: file.name, src: urlData.signedUrl }; // Use signedUrl here
          });

          const images = (await Promise.all(imagePromises)).filter(Boolean);
          setCards(images);
        }
      } else {
        console.error('No session found');
      }
      setLoading(false);
    };

    fetchGeneratedImages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Generated Images</h2>
      {cards.length > 0 ? <FocusCards cards={cards} /> : <div className="text-center">No images generated yet.</div>}
    </div>
  );
};
