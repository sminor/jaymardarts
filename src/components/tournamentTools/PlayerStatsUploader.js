import React, { useState, useEffect, useRef } from 'react';
import validateFile from './validateReportFile';

const uploadEnabled = true;

const PlayerStatsUploader = ({ handleMessage, parseResult }) => {
  const [file, setFile] = useState(null);
  const [uploadTime, setUploadTime] = useState(null);
  const [lastParsedDate, setLastParsedDate] = useState(null);
  const [loading, setLoadingState] = useState(false); // Local loading state
  const [statusMessage, setStatusMessage] = useState(''); // Status message state
  
  const messageSentRef = useRef(false);

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

            // Fetch the last parsed date from localStorage and convert it to a Date object
            const savedParseDate = localStorage.getItem('parseDate');
            if (savedParseDate) {
                const parsedDate = new Date(savedParseDate);
                setLastParsedDate(parsedDate);

                // Compare the dates
                if (modifiedDate > parsedDate && !messageSentRef.current) {
                    handleMessage('Warning: The data file has been modified since the last import. Consider importing the new data.', 'warning');
                    messageSentRef.current = true;
                }
            }
        } catch (error) {
            console.error('Error fetching modified date:', error);
        }
    };

    fetchModifiedDate();
  }, [handleMessage])

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
      setStatusMessage('Uploading file');

      try {
        const fileContentBase64 = btoa(fileContent);
        const uploadResponse = await fetch('/.netlify/functions/upload-report-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileContent: fileContentBase64 }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Error uploading file.');
        }

        setStatusMessage('Waiting for server to process the file');
        await wait(3000); // Wait for 3 seconds before attempting to fetch the modified date

        setStatusMessage('Fetching modified date');
        await fetchFileWithRetry(3, 2000); // 3 retries with initial 2 seconds delay

        setStatusMessage('Parsing the report file');
        // Call parse-report-file function to parse the uploaded file
        const parseResponse = await fetch('/.netlify/functions/parse-report-file');
        if (!parseResponse.ok) {
          throw new Error('Error parsing the report file.');
        }
        const parseResultData = await parseResponse.json();

        if (parseResultData.error) {
          throw new Error(parseResultData.error);
        }

        localStorage.setItem('parseResult', JSON.stringify(parseResultData));
        const currentDateTime = new Date().toISOString();
        localStorage.setItem('parseDate', currentDateTime);

        // Update the lastParsedDate state to the new parsed date
        setLastParsedDate(new Date(currentDateTime));
        
        handleMessage('File uploaded successfully.', 'success');
        window.location.reload()
      } catch (error) {
        handleMessage(error.message, 'error');
      } finally {
        setLoadingState(false); // Hide loading overlay
        setStatusMessage(''); // Clear status message
      }
    };
  };

  const handleResync = async () => {
    setLoadingState(true); // Show loading overlay
    setStatusMessage('Parsing the report file...');
    try {
      // Call parse-report-file function to parse the uploaded file
      const parseResponse = await fetch('/.netlify/functions/parse-report-file');
      if (!parseResponse.ok) {
        throw new Error('Error parsing the report file.');
      }
      const parseResultData = await parseResponse.json();

      if (parseResultData.error) {
        throw new Error(parseResultData.error);
      }

      localStorage.setItem('parseResult', JSON.stringify(parseResultData));
      const currentDateTime = new Date().toISOString();
      localStorage.setItem('parseDate', currentDateTime);

      // Update the lastParsedDate state to the new parsed date
      setLastParsedDate(new Date(currentDateTime));

      handleMessage('File synced successfully.', 'success');
      window.location.reload()
    } catch (error) {
      handleMessage(error.message, 'error');
    } finally {
      setLoadingState(false); // Hide loading overlay
      setStatusMessage(''); // Clear status message
    }
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
            <button onClick={handleResync}>Resync</button>
          </div>
          {(uploadTime || parseResult) && (
            <table>
              <tbody>
                <tr>
                  <td>File Generated Date:</td>
                  <td>{parseResult?.generatedDate || 'Unknown'}</td>
                </tr>
                <tr>
                  <td>Last Modified Date:</td>
                  <td>
                    {uploadTime ? uploadTime.toLocaleString(undefined, { 
                      year: 'numeric', 
                      month: 'numeric', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: 'numeric' 
                    }) : 'Unknown'}
                  </td>
                </tr>  
                <tr>  
                  <td>Last Sync Date:</td>
                  <td>
                    {lastParsedDate ? lastParsedDate.toLocaleString(undefined, { 
                      year: 'numeric', 
                      month: 'numeric', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: 'numeric' 
                    }) : 'Unknown'}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <p>Loading ...</p>
          <p className='status-message'>{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsUploader;