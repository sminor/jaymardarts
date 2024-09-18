import React, { useState, useEffect } from 'react';
import validateFile from './validateReportFile';

const uploadEnabled = true;

const PlayerStatsUploader = ({ handleMessage }) => {
  const [file, setFile] = useState(null);
  const [uploadTime, setUploadTime] = useState(null);
  const [loading, setLoadingState] = useState(false); // Local loading state

  useEffect(() => {
    const fetchModifiedDate = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-modified-date');
        if (!response.ok) {
          throw new Error('Error fetching modified date');
        }
        const data = await response.json();
        const modifiedDate = new Date(data.modifiedDate);
        setUploadTime(modifiedDate);
      } catch (error) {
        console.error('Error fetching modified date:', error);
      }
    };

    fetchModifiedDate();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchFileWithRetry = async (retries, delay) => {
    try {
      const response = await fetch('/.netlify/functions/get-modified-date');
      if (!response.ok) {
        throw new Error('Error fetching modified date');
      }
      const data = await response.json();
      const modifiedDate = new Date(data.modifiedDate);

      // Check if the modifiedDate is valid
      if (isNaN(modifiedDate.getTime())) {
        throw new Error('Invalid date received');
      }

      setUploadTime(modifiedDate);
      localStorage.setItem('modifiedDate', modifiedDate.toISOString());
    } catch (error) {
      if (retries > 0) {
        await wait(delay); // Wait before retrying
        return await fetchFileWithRetry(retries - 1, delay * 2); // Exponential backoff
      } else {
        handleMessage('Error fetching modified date after upload.', 'error');
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      handleMessage('You must select a file to upload.', 'warning');
      return;
    }

    // Validate file before uploading
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const fileContent = reader.result;
      const validationResult = validateFile(file.name, fileContent);

      if (!validationResult.valid) {
        handleMessage(validationResult.message, 'error');
        return;
      }

      if (!uploadEnabled) {
        handleMessage('Upload feature is disabled.', 'info');
        return;
      }

      setLoadingState(true); // Show loading overlay

      try {
        const fileContentBase64 = btoa(fileContent);
        const uploadResponse = await fetch('/.netlify/functions/upload-to-drive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileContent: fileContentBase64 }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Error uploading file.');
        }
  
        await wait(3000); // Wait for 3 seconds before attempting to fetch the modified date
        await fetchFileWithRetry(3, 2000); // 3 retries with initial 2 seconds delay

        setLoadingState(false); // Hide loading overlay
        handleMessage('File uploaded successfully.', 'success');

      } catch (error) {
        setLoadingState(false); // Hide loading overlay
        handleMessage(error.message, 'error');
      }
    };
  };

  return (
    <div className="data-upload-container">
      <h2 style={{ textAlign: 'center' }}>Upload Player Stats</h2>
      <div className="upload-section">
        <div className="instructions">
          <h3>Instructions</h3>
          <p>Use this section to upload player data before the start of each tournament.</p>
          <p>You can download the player data file from <a href="https://leagueleader.net" target="_blank" rel="noopener noreferrer">leagueleader.net</a>.</p>
          <p>Ensure that the file is in the correct format before uploading.</p>
          <p>The current report date indicates the last time the data was updated.</p>
        </div>
        <div className="upload-controls">
          <div className="file-upload">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
          </div>
          {uploadTime && (
            <table>
              <tbody>
                <tr>
                  <td>Last Uploaded:</td>
                  <td>{uploadTime.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsUploader;