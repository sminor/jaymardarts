import React, { useState } from 'react';

const OperatorTools = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    // Read the file content
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const fileContent = reader.result.split(',')[1]; // Extract base64 data
      const fileName = file.name;

      try {
        // Send a POST request to the serverless function
        const response = await fetch('/.netlify/functions/upload-to-drive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileContent, fileName }),
        });

        const result = await response.json();
        if (response.ok) {
          setMessage(`File uploaded successfully: ${result.fileId}`);
        } else {
          setMessage(`Error uploading file: ${result.error}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessage('An error occurred during the upload.');
      }
    };
  };

  return (
    <div>
      <h2>Tournament Operator Tools</h2>
      <p>This page contains helpful tools and resources for running tournaments.</p>
      
      {/* File upload section */}
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload to Google Drive</button>
      </div>

      {/* Display upload message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default OperatorTools;
