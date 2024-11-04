'use client'; // Mark this component as a Client Component

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust the import path as necessary

const supabase = createClient();

const FileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null); // State for the selected file
  const [userId, setUserId] = useState<string | null>(null); // State for user ID
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const [message, setMessage] = useState<string>(''); // State for messages

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Session data:', data); // Log the full session data

      if (data?.session) {
        setUserId(data.session.user.id);
        console.log('User ID retrieved:', data.session.user.id);
      } else {
        console.error('No session found');
      }
    };

    fetchUserId();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('Selected file:', selectedFile.name); // Log the selected file
    } else {
      console.log('No file selected');
    }
  };

  const uploadFile = async () => {
    console.log('File:', file);
    console.log('User ID:', userId);

    if (!file || !userId) {
      setMessage('File or User ID is missing.');
      return;
    }

    setUploading(true);
    setMessage('');

    const folderPath = `fluence/${userId}/`;
    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage.from('fluence').upload(`${folderPath}${fileName}`, file, {
      contentType: file.type,
      upsert: true,
    });

    setUploading(false);

    if (error) {
      console.error('Error uploading file:', error.message);
      setMessage('Error uploading file. Please try again.');
    } else {
      console.log('File uploaded successfully:', data);
      setMessage('File uploaded successfully!');
      // Optionally reset the file input
      setFile(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Upload File</h1>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*" // Accepting only images
        className="border rounded p-2 w-full"
      />
      <button
        onClick={uploadFile}
        disabled={uploading || !file}
        className={`mt-4 p-2 bg-blue-500 text-white rounded ${uploading ? 'opacity-50' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default FileUploadPage;
