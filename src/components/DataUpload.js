import React, { useState } from 'react';

const DataUpload = ({ generatedDate, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to wait for a specified amount of time
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to attempt to fetch the file, retrying if necessary
  const fetchFileWithRetry = async (retries) => {
    try {
      const response = await fetch('/.netlify/functions/parse-player-stats?dateOnly=true');
      if (!response.ok) {
        throw new Error('File not found');
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying fetch... (${3 - retries + 1})`);
        await wait(2000); // Wait for 2000ms before retrying
        return await fetchFileWithRetry(retries - 1);
      } else {
        throw new Error('Error fetching file after upload.');
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setLoading(true); // Start loading
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const fileContent = reader.result.split(',')[1];

      try {
        const uploadResponse = await fetch('/.netlify/functions/upload-to-drive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileContent }),
        });

        const result = await uploadResponse.json();
        if (uploadResponse.ok) {
          setMessage('File uploaded successfully.');

          // Unset localStorage modified date to force a re-download
          localStorage.removeItem('fileModifiedDate');

          // Retry fetching the file up to 3 times with a delay
          try {
            await fetchFileWithRetry(3);
            onFileUpload(); // Re-fetch player stats after upload
          } catch (error) {
            setMessage('Error fetching file after upload.');
          }

        } else {
          setMessage(`Error uploading file: ${result.error}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessage('An error occurred during the upload.');
      } finally {
        setLoading(false); // End loading
      }
    };
  };

  return (
    <div className="data-upload-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-text">
            Loading<span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>
      )}
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
