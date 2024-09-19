import React, { useRef } from 'react';

const LeagueManagementWindow = ({ teamData }) => {
  const leagueWindowRef = useRef(null);
  const toolbarWindowRef = useRef(null);

  const leagueWindowWidth = 800;
  const toolbarWindowWidth = 400;
  const windowHeight = 600;

  // Function to calculate positions for centering the windows side by side
  const calculatePositions = () => {
    const screenWidth = window.screen.availWidth;

    // Total width of both windows
    const totalWidth = leagueWindowWidth + toolbarWindowWidth;

    // Calculate the starting position for the league window (centered)
    const leftPosition = (screenWidth - totalWidth) / 2;

    // Positions for the league and toolbar windows
    return {
      leagueLeft: leftPosition,
      toolbarLeft: leftPosition + leagueWindowWidth,
    };
  };

  // Function to open the external leagueleader window or focus if it's already open
  const openOrFocusLeagueWindow = (left) => {
    if (leagueWindowRef.current && !leagueWindowRef.current.closed) {
      // Focus the existing window if already open
      leagueWindowRef.current.focus();
    } else {
      // Open the window if it's not already open
      leagueWindowRef.current = window.open(
        'https://leagueleader.net',
        'leagueManagementWindow',
        `width=${leagueWindowWidth},height=${windowHeight},resizable=yes,scrollbars=yes,left=${left},top=100`
      );
    }
  };

// Function to open the toolbar window or focus if it's already open
const openOrFocusToolbarWindow = (left) => {
    if (toolbarWindowRef.current && !toolbarWindowRef.current.closed) {
      // Focus the existing window if already open
      toolbarWindowRef.current.focus();
    } else {
      // Generate the HTML content for the toolbar window
      const toolbarContent = `
        <html>
          <head>
            <title>Team and Player Info</title>
          </head>
          <body>
            <h3>Team Information</h3>
            <table className="test">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Players</th>
                </tr>
              </thead>
              <tbody>
                ${teamData.teams.map((team, index) => {
                  const [player1, player2] = teamData.players[index];
                  return `
                    <tr>
                      <td><span class="copyable" data-name="${team}">${team}</span></td>
                      <td><span class="copyable" data-name="${player1}">${player1}</span> | <span class="copyable" data-name="${player2}">${player2}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            <script>
              document.querySelectorAll('.copyable').forEach((item) => {
                item.addEventListener('click', () => {
                  const textToCopy = item.getAttribute('data-name');
                  navigator.clipboard.writeText(textToCopy).then(() => {
                    item.classList.add('copied');
                    setTimeout(() => item.classList.remove('copied'), 1000);
                  });
                });
              });
            </script>
          </body>
        </html>
      `;
  
      // Create a Blob from the HTML content
      const blob = new Blob([toolbarContent], { type: 'text/html' });
      const toolbarURL = URL.createObjectURL(blob);
  
      // Open the toolbar window with the blob URL
      toolbarWindowRef.current = window.open(
        toolbarURL,
        'toolbarWindow',
        `width=${toolbarWindowWidth},height=${windowHeight},resizable=yes,scrollbars=yes,left=${left},top=100`
      );
  
      // Revoke the blob URL once the window is loaded
      toolbarWindowRef.current.onload = () => {
        URL.revokeObjectURL(toolbarURL);
      };
    }
  };
  

  // Combined function to handle both windows with an extended delay for Edge
  const handleWindows = () => {
    const { leagueLeft, toolbarLeft } = calculatePositions(); // Calculate the positions

    // Open or focus the league window
    openOrFocusLeagueWindow(leagueLeft);

    // Delay opening or focusing the toolbar window to avoid conflicts (extended delay for Edge)
    setTimeout(() => {
      openOrFocusToolbarWindow(toolbarLeft);
    }, 300); // 300ms delay to ensure both windows open correctly
  };

  return (
    <div>
      {/* Button to open both pop-up windows */}
      <button onClick={handleWindows}>Open/Focus Tournament Setup</button>
    </div>
  );
};

export default LeagueManagementWindow;
