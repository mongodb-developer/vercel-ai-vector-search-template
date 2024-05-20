// pages/admin.tsx
"use client";
import Link from 'next/link';

import { useState, ChangeEvent } from 'react';


const AdminPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload. (PDF, JSON, or CSV)');
      return;
    }

    if (!apiKey) {
      setMessage('Please enter the API key.');
      return;
    }

    const formData = new FormData();
    setLoading(true);
    formData.append('file', file);

    const response = await fetch('http://localhost:3000/api/admin', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    });

    setLoading(false);
    if (response.ok) {
      setMessage('File uploaded and processed successfully!');
      
    } else {
      const errorMessage = await response.text();
      setMessage(`Failed to upload file: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Page</h1>
        <p className="text-gray-700 mb-4">Upload a file (PDF, JSON or CSV) to be added as context for the chatbot. You will need to provide an admin API key.</p>
        <input
          type="password"
          placeholder="Enter API key"
          value={apiKey}
          onChange={handleApiKeyChange}
          title="Enter the admin API key"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          accept=".pdf,.csv,.json"
          title="Upload a PDF, CSV, or JSON file"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-green-600 text-white p-2 rounded mb-4 hover:bg-green-700 transition duration-300"
        >
          {!loading ? "Upload" : "Uploading..."}
        </button>
        <p className="text-center text-gray-700 mb-4">{message}</p>
        <Link href="/" className="text-green-600 hover:underline"> 
          Go back to Chat
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
