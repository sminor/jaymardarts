import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const CreateTournament = () => {
  const [tournamentType, setTournamentType] = useState('');
  const [tournamentDate, setTournamentDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [locationId, setLocationId] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [entryFee, setEntryFee] = useState(10);
  const [barContribution, setBarContribution] = useState(6);
  const [tournamentFee, setTournamentFee] = useState(1);
  const [extraPrizeMoney, setExtraPrizeMoney] = useState(0);
  const [locations, setLocations] = useState([]);

  // Fetch locations from Supabase on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from('locations').select('id, name');
      if (error) {
        console.error('Error fetching locations:', error);
      } else {
        setLocations(data);
      }
    };

    fetchLocations();
  }, []);

  const handleCreateTournament = (e) => {
    e.preventDefault();
    // Handle the creation logic here (e.g., API call, state update, etc.)
    console.log('Tournament Created:', {
      tournamentType,
      tournamentDate,
      locationId,
      operatorName,
      entryFee,
      barContribution,
      tournamentFee,
      extraPrizeMoney,
    });
    // Redirect back to the main page or do something else upon submission
    window.location.href = '/tournament-tools';
  };

  return (
    <div className="create-tournament-container">
      <h2>Create a New Tournament</h2>
      <form onSubmit={handleCreateTournament}>
        <table>
          <tbody>
            <tr>
              <td>Tournament Date:</td>
              <td>
                <input
                  type="date"
                  value={tournamentDate}
                  onChange={(e) => setTournamentDate(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Location:</td>
              <td>
                <select value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                  <option value="">Select location...</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Tournament Type:</td>
              <td>
                <select value={tournamentType} onChange={(e) => setTournamentType(e.target.value)} required>
                  <option value="">Select tournament type...</option>
                  <option value="A/B Draw">A/B Draw</option>
                  <option value="Blind Draw">Blind Draw</option>
                  <option value="Player Pick">Player Pick</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Operator Name:</td>
              <td>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Entry Fee:</td>
              <td>
                <input
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Bar Contribution:</td>
              <td>
                <input
                  type="number"
                  value={barContribution}
                  onChange={(e) => setBarContribution(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Tournament Fee:</td>
              <td>
                <input
                  type="number"
                  value={tournamentFee}
                  onChange={(e) => setTournamentFee(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Extra Prize Money:</td>
              <td>
                <input
                  type="number"
                  value={extraPrizeMoney}
                  onChange={(e) => setExtraPrizeMoney(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Create Tournament</button>
      </form>
    </div>
  );
};

export default CreateTournament;
