import React, { useRef } from 'react';

const TournamentHelper = ({ teamData }) => {
  const leagueleaderWindowRef = useRef(null);
  const toolbarWindowRef = useRef(null);

  const leagueleaderWindowWidth = 800;
  const toolbarWindowWidth = 400;
  const windowHeight = 600;

  // Store team data in localStorage
  localStorage.setItem('teamData', JSON.stringify(teamData));

  // Function to calculate positions for centering the windows side by side
  const calculatePositions = () => {
    const screenWidth = window.screen.availWidth;

    // Total width of both windows
    const totalWidth = leagueleaderWindowWidth + toolbarWindowWidth;

    // Calculate the starting position for the leagueleader window (centered)
    const leftPosition = (screenWidth - totalWidth) / 2;

    return {
      leagueleaderLeft: leftPosition,
      toolbarLeft: leftPosition + leagueleaderWindowWidth,
    };
  };

  // Open or focus the leagueleader window
  const openOrFocusLeagueleaderWindow = (left) => {
    if (leagueleaderWindowRef.current && !leagueleaderWindowRef.current.closed) {
      leagueleaderWindowRef.current.focus();
    } else {
      leagueleaderWindowRef.current = window.open(
        'https://leagueleader.net',
        'leagueleaderWindow',
        `width=${leagueleaderWindowWidth},height=${windowHeight},resizable=yes,scrollbars=yes,left=${left},top=100`
      );
    }
  };

  // Open or focus the toolbar window
  const openOrFocusToolbarWindow = (left) => {
    if (toolbarWindowRef.current && !toolbarWindowRef.current.closed) {
      toolbarWindowRef.current.focus();
      // Refresh content without closing the window
      populateToolbarContent();
    } else {
      // Check if teamData is valid before proceeding
      if (!teamData || !teamData.teams || !teamData.players) {
        alert('Invalid team data.');
        return;
      }

      const toolbarContent = `
      <html>
        <head>
          <title>JayMar Tournament Helper</title>
          <link rel="stylesheet" type="text/css" href="/styles/toolbar.css">
        </head>
        <body>
          <h2>JayMar Tournament Helper</h2>
          <div id="team-info"></div>
      
          <div id="footer">
            &copy; 2024 JayMar Entertainment
          </div>
      
          <a href="#" id="refresh-link">Refresh</a>
      
          <script>
            function populateTeamData() {
              const teamData = JSON.parse(localStorage.getItem('teamData'));
              const teamHTML = \`
                <table>
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th colspan="2">Players</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${teamData.teams.map((team, index) => {
                      const players = teamData.players[index] || ['', ''];
                      const [player1FirstName, player1LastName] = players[0].split(' ');
                      const [player2FirstName, player2LastName] = players[1].split(' ');
      
                      return \`
                        <tr>
                          <td><span class="copyable" data-name="\${team}">\${team}</span></td>
                          <td>
                            <span class="copyable" data-name="\${player1FirstName}">\${player1FirstName}</span> 
                            <span class="copyable" data-name="\${player1LastName}">\${player1LastName}</span>
                          </td>
                          <td>
                            <span class="copyable" data-name="\${player2FirstName}">\${player2FirstName}</span> 
                            <span class="copyable" data-name="\${player2LastName}">\${player2LastName}</span>
                          </td>
                        </tr>
                      \`;
                    }).join('')}
                  </tbody>
                </table>
              \`;
              document.getElementById('team-info').innerHTML = teamHTML;
      
              // Reapply copy functionality after refresh
              document.querySelectorAll('.copyable').forEach((item) => {
                item.addEventListener('click', () => {
                  const textToCopy = item.getAttribute('data-name');
                  navigator.clipboard.writeText(textToCopy).then(() => {
                    item.classList.add('copied');
                    setTimeout(() => item.classList.remove('copied'), 1000);
                  });
                });
              });
            }
      
            populateTeamData();
      
            document.getElementById('refresh-link').addEventListener('click', function(event) {
              event.preventDefault();
              populateTeamData(); // Refresh the content
            });
          </script>
        </body>
      </html>
      `;

      // Open a new toolbar window with content
      toolbarWindowRef.current = window.open(
        '',
        'toolbarWindow',
        `width=${toolbarWindowWidth},height=${windowHeight},resizable=yes,scrollbars=yes,left=${left},top=100`
      );

      // Write the content to the toolbar window
      toolbarWindowRef.current.document.write(toolbarContent);
      toolbarWindowRef.current.document.close(); // Important to close document stream
    }
  };

  // Populate toolbar content (for refresh)
  const populateToolbarContent = () => {
    if (toolbarWindowRef.current && !toolbarWindowRef.current.closed) {
      toolbarWindowRef.current.document.getElementById('refresh-link').click(); // Trigger refresh
    }
  };

  // Combined function to handle both windows with an extended delay for Edge
  const handleWindows = () => {
    const { leagueleaderLeft, toolbarLeft } = calculatePositions();

    // Open both windows
    openOrFocusLeagueleaderWindow(leagueleaderLeft);
    openOrFocusToolbarWindow(toolbarLeft);

  };

  return (
    <div>
      {/* Button to open both pop-up windows */}
      <button onClick={handleWindows}>Open Tournament Helper</button>
    </div>
  );
};

export default TournamentHelper;
