import React, { useState, useEffect, useRef } from 'react';
import validateFile from './validateReportFile';

const uploadEnabled = true;

const PlayerStatsUploader = ({ handleMessage, parseResult }) => {
  const [file, setFile] = useState(null);
  const [uploadTime, setUploadTime] = useState(null); // Stores the file modified time from the server
  const [lastParsedDate, setLastParsedDate] = useState(null); // Stores the last parsed date from localStorage
  const [loading, setLoadingState] = useState(false); // Local loading state
  const [statusMessage, setStatusMessage] = useState(''); // Status message state
  
  const messageSentRef = useRef(false); // Flag to avoid sending repeated messages about modified dates

  // On component mount, fetch modified date and compare with last parsed date from localStorage
  useEffect(() => {
    const fetchModifiedDate = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-modified-date');
        if (!response.ok) {
          throw new Error('Error fetching modified date');
        }
        const data = await response.json();
        const modifiedDate = new Date(data.modifiedDate);
        setUploadTime(modifiedDate); // Set the file's modified time from the server

        // Check the last parsed date from localStorage
        const savedParseDate = localStorage.getItem('parseDate');
        if (savedParseDate) {
          const parsedDate = new Date(savedParseDate);
          setLastParsedDate(parsedDate);

          // Compare dates and send a warning if the data file was modified after the last import
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
  }, [handleMessage]);

  // Handle file change event
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to simulate waiting (used for retry mechanism)
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Retry fetching the modified date with exponential backoff
  const fetchFileWithRetry = async (retries, delay) => {
    try {
      const response = await fetch('/.netlify/functions/get-modified-date');
      if (!response.ok) {
        throw new Error('Error fetching modified date');
      }
      const data = await response.json();
      const modifiedDate = new Date(data.modifiedDate);
      if (isNaN(modifiedDate.getTime())) {
        throw new Error('Invalid date received');
      }

      setUploadTime(modifiedDate);
      localStorage.setItem('modifiedDate', modifiedDate.toISOString());
    } catch (error) {
      if (retries > 0) {
        await wait(delay);
        return await fetchFileWithRetry(retries - 1, delay * 2);
      } else {
        handleMessage('Error fetching modified date after upload.', 'error');
      }
    }
  };

  // Handle the file upload
  const handleFileUpload = async () => {
    if (!file) {
      handleMessage('You must select a file to upload.', 'warning');
      return;
    }

    // Validate the file
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
        await wait(3000); // Wait before attempting to fetch the modified date

        setStatusMessage('Fetching modified date');
        await fetchFileWithRetry(3, 2000); // Retry fetching modified date

        setStatusMessage('Parsing the report file');
        // Call the parse-report-file function to parse the uploaded file
        const parseResponse = await fetch('/.netlify/functions/parse-report-file');
        if (!parseResponse.ok) {
          throw new Error('Error parsing the report file.');
        }
        const parseResultData = await parseResponse.json();

        if (parseResultData.error) {
          throw new Error(parseResultData.error);
        }

        // Save the parsed data and date to localStorage
        localStorage.setItem('parseResult', JSON.stringify(parseResultData));
        const currentDateTime = new Date().toISOString();
        localStorage.setItem('parseDate', currentDateTime);
        setLastParsedDate(new Date(currentDateTime)); // Update the lastParsedDate state

        handleMessage('File uploaded successfully.', 'success');
        window.location.reload(); // Reload the page to reflect new data
      } catch (error) {
        handleMessage(error.message, 'error');
      } finally {
        setLoadingState(false); // Hide loading overlay
        setStatusMessage(''); // Clear status message
      }
    };
  };

  // Handle the re-sync process
  const handleResync = async () => {
    setLoadingState(true); // Show loading overlay
    setStatusMessage('Parsing the report file...');
    try {
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
      setLastParsedDate(new Date(currentDateTime)); // Update lastParsedDate

      handleMessage('File synced successfully.', 'success');
      window.location.reload();
    } catch (error) {
      handleMessage(error.message, 'error');
    } finally {
      setLoadingState(false); // Hide loading overlay
      setStatusMessage('');
    }
  };

  return (
    <div className="data-upload-container">
      <h2 style={{ textAlign: 'center' }}>Upload Player Stats</h2>
      <div className="upload-section">
        <div className="instructions">
          <h3>Instructions</h3>
          <ol>
            <li>Upload player data before the tournament begins.</li>
            <li>Generate the report file from <a href='http://leagueleader.net'>leagueleader.net</a></li>
            <li>Ensure the file is in the correct format before uploading.</li>
            <li>Once uploaded, the data will be parsed and ready for use.</li>
            <li>Click "Resync" to re-parse the file without re-uploading it.</li>
          </ol>
          <p style={{marginLeft: 40,}}><strong>Note:</strong> Uploading a new file will overwrite existing data.</p>
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
                  <td className='hover-info' title="This is the date that the report was generated.">File Date:</td>
                  <td>{parseResult?.generatedDate || 'Unknown'}</td>
                </tr>
                <tr>
                  <td className='hover-info' title="This is the date that the file was uploaded.">File Upload Date:</td>
                  <td>{uploadTime ? uploadTime.toLocaleString() : 'Unknown'}</td>
                </tr>  
                <tr>  
                  <td className='hover-info' title="This is the date that browser synced the file.">Last Sync Date:</td>
                  <td>{lastParsedDate ? lastParsedDate.toLocaleString() : 'Unknown'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <p>Loading ...</p>
            <p className="status-message">{statusMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsUploader;
