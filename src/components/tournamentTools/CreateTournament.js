import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { supabase } from '../../supabaseClient';

const CreateTournament = () => {
  const [tournamentType, setTournamentType] = useState('');
  const [tournamentDate, setTournamentDate] = useState(new Date().toLocaleDateString('en-CA')); // Local date in YYYY-MM-DD format
  const [locationId, setLocationId] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [entryFee, setEntryFee] = useState(10);
  const [barContribution, setBarContribution] = useState(6);
  const [tournamentFee, setTournamentFee] = useState(1);
  const [extraPrizeMoney, setExtraPrizeMoney] = useState(0);
  const [payoutSpots, setPayoutSpots] = useState(3);
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState(''); // Store the selected location name for the tournament name
  const navigate = useNavigate(); // Initialize navigate hook

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

  const handleLocationChange = (e) => {
    const selectedLocationId = e.target.value;
    setLocationId(selectedLocationId);

    // Get the location name based on the selected ID
    const selectedLocation = locations.find(location => location.id === parseInt(selectedLocationId));
    if (selectedLocation) {
      setLocationName(selectedLocation.name);
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();

    const createdAt = new Date().toISOString(); // Capture the exact timestamp in UTC
    const tournamentName = `${tournamentDate} - ${locationName}`; // Combine date and location name for the tournament name

    const tournamentId = uuidv4(); // Generate a unique UUID for the tournament

    try {
      // Insert the new tournament into the database
      const { data, error } = await supabase.from('tournaments').insert([
        {
          id: tournamentId, // Use UUID as the ID
          name: tournamentName, // Tournament name based on date and location
          tournament_type: tournamentType,
          created_at: createdAt, // Actual time the tournament is created
          location_id: locationId,
          organizer_name: organizerName,
          entry_fee: entryFee,
          bar_contribution: barContribution,
          tournament_fees: tournamentFee,
          extra_prize_money: extraPrizeMoney,
          payout_spots: payoutSpots,
          is_active: true,
        },
      ]);

      if (error) {
        console.error('Error creating tournament:', error);
        alert('An error occurred while creating the tournament.');
      } else {
        console.log('Tournament Created:', data);
        // Redirect to the specific tournament page using the unique tournamentId
        navigate(`/tournament-tools/${tournamentId}`); // Use useNavigate instead of window.location.href
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
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
                <select value={locationId} onChange={handleLocationChange} required>
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
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
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
            <tr>
              <td>Payout Spots:</td>
              <td>
                <input
                  type="number"
                  value={payoutSpots}
                  onChange={(e) => setPayoutSpots(Number(e.target.value))}
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
