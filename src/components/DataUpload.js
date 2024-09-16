import React, { useState } from 'react';

const DataUpload = ({ generatedDate, onFileUpload }) => {
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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const fileContent = reader.result.split(',')[1];

      try {
        const response = await fetch('/.netlify/functions/upload-to-drive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileContent }),
        });

        const result = await response.json();
        if (response.ok) {
          setMessage('File uploaded successfully.');
          onFileUpload(); // Re-fetch player stats after upload
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
    <div className="data-upload-container section-container">
      <h3>Data Upload</h3>
      {/* Instructions */}
      <p className="instructions">
        Use this section to upload player data before the start of each tournament. 
        You can download the player data file from <a href="https://leagueleader.net/" target="_blank" rel="noopener noreferrer">leagueleader.net</a>. 
        Ensure that the file is in the correct format before uploading. The current report date indicates the last time the data was updated.
      </p>
      <div className="data-upload-controls">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload Player Data</button>
      </div>
      {/* Display the generated date */}
      <p>Current Report Date: {generatedDate}</p>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DataUpload;
