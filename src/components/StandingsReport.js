import React, { useState, useEffect } from 'react';

// Helper function to convert ASCII to structured data for JSX rendering and remove repeated header rows
const parseAsciiTable = (asciiTable) => {
  const rows = asciiTable.split('\n').filter(row => row.trim() !== '' && !row.startsWith('-'));
  let headers = [];
  let dataRows = [];

  rows.forEach((row, index) => {
    let columns = row.split('|').map(col => col.trim());

    if (columns[columns.length - 1] === '') {
      columns.pop(); // Remove the last empty column
    }

    if (columns.length > 1) {
      if (index === 0) {
        headers = columns; // First row as headers
      } else if (columns.join('') !== headers.join('')) {
        dataRows.push(columns); // Add the row only if it's not identical to the header row
      }
    }
  });

  return { headers, dataRows };
};

const StandingsReport = ({ statsUrl, onClose }) => {
  const [reportContent, setReportContent] = useState([]);
  const [topInfo, setTopInfo] = useState(''); // Track top info (league, date, division)
  const [footer, setFooter] = useState(''); // Track footer info
  const [sortConfig, setSortConfig] = useState({}); // For sorting each table independently

  // Disable background scroll on modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Sorting functionality
  const handleSort = (columnIndex, tableId) => {
    setSortConfig((prevConfig) => {
      const currentDirection = prevConfig[tableId]?.direction;
      const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      return { ...prevConfig, [tableId]: { column: columnIndex, direction: newDirection } };
    });
  };

  // Sort the data based on the current config
  const sortData = (data, columnIndex, direction) => {
    const sortedData = [...data];
    if (direction === 'asc') {
      sortedData.sort((a, b) => a[columnIndex].localeCompare(b[columnIndex], undefined, { numeric: true }));
    } else if (direction === 'desc') {
      sortedData.sort((a, b) => b[columnIndex].localeCompare(a[columnIndex], undefined, { numeric: true }));
    }
    return sortedData;
  };

  useEffect(() => {
    const fetchStandingsData = async () => {
      try {
        const response = await fetch('/.netlify/functions/fetch-standings', {
          method: 'POST',
          body: JSON.stringify({ url: statsUrl }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch standings: ${response.statusText}`);
        }

        const rawData = await response.json();
        const htmlContent = rawData.data;

        // Extract tables and content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const preElement = doc.querySelector('pre');
        const preText = preElement?.textContent || '';

        // Extract top info (League, Date, Division)
        let topInfoContent = preText.match(/League:.*\n\nReport Date:.*\n\nDivision .*\n----------/);
        if (topInfoContent) {
          topInfoContent = topInfoContent[0].replace(/\n/g, '<br>').replace('----------', '');
          setTopInfo(`${topInfoContent}<hr>`); // Set top info with <hr>
        }

        // Extract and parse tables
        const sections = preText.split(/(?:Team Standings, sorted by Percent Wins|All X01 games, sorted by Percent Wins:|Cricket \/ 200 games, sorted by Percent Wins:)/).map(part => part.trim());

        const teamStandings = sections[1] ? parseAsciiTable(sections[1]) : null;
        const x01Games = sections[2] ? parseAsciiTable(sections[2]) : null;
        const cricketGames = sections[3] ? parseAsciiTable(sections[3]) : null;

        // Set report content
        setReportContent([
          { title: 'Team Standings, sorted by Percent Wins', data: teamStandings, id: 'teamStandings' },
          { title: 'All X01 games, sorted by Percent Wins', data: x01Games, id: 'x01Games' },
          { title: 'Cricket / 200 games, sorted by Percent Wins', data: cricketGames, id: 'cricketGames' }
        ]);

        // Set footer content
        setFooter(`
          <p style="text-align: center; font-size: 0.8em; margin-top: 20px;">
            &copy; 2024 Arachnid 360, LLC | Created by LeagueLeader with <span style="font-weight: bold;">ARACHNET™</span> processing
          </p>
        `);
      } catch (error) {
        console.error('Error fetching standings:', error);
        setReportContent([{ title: 'Error', data: [['Error loading report']], id: 'error' }]);
      }
    };

    fetchStandingsData();
  }, [statsUrl]);

  // Function to render the sorting indicator
  const renderSortIndicator = (tableId, colIndex) => {
    if (!sortConfig[tableId]) return null;
    const { column, direction } = sortConfig[tableId];
    if (column === colIndex) {
      if (direction === 'asc') return <span style={{ fontSize: '0.7em' }}>▲</span>;
      if (direction === 'desc') return <span style={{ fontSize: '0.7em' }}>▼</span>;
    }
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        
        {/* Add H2 Heading for JayMar Darts */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>JayMar Darts</h2>

        {/* Render top information */}
        {topInfo && <div dangerouslySetInnerHTML={{ __html: topInfo }} />}

        {/* Render tables */}
        {reportContent.map((section) => (
          section.data && (
            <div key={section.id} className="table-container">
              <h3>{section.title}</h3>
              <table className="teams-table schedule-table">
                <thead>
                  <tr>
                    {section.data.headers.map((header, colIndex) => (
                      <th
                        key={colIndex}
                        onClick={() => handleSort(colIndex, section.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {header} {renderSortIndicator(section.id, colIndex)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortConfig[section.id]
                    ? sortData(section.data.dataRows, sortConfig[section.id].column, sortConfig[section.id].direction).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))
                    : section.data.dataRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )
        ))}

        {/* Render footer */}
        {footer && <div dangerouslySetInnerHTML={{ __html: footer }} />}
      </div>
    </div>
  );
};

export default StandingsReport;
