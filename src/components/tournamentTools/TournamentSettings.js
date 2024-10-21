import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Import supabase for database interaction

const TournamentSettings = ({ tournamentId }) => {
  const [tournamentDate, setTournamentDate] = useState(''); 
  const [locationId, setLocationId] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [barContribution, setBarContribution] = useState('');
  const [extraPrizeMoney, setExtraPrizeMoney] = useState('');
  const [tournamentFee, setTournamentFee] = useState('');
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState(''); // Store the selected location name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tournament details from the database
  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();

        if (error) throw error;

        setTournamentDate(data.created_at.split('T')[0]); // Extract date only
        setLocationId(data.location_id);
        setOrganizerName(data.organizer_name);
        setEntryFee(data.entry_fee);
        setBarContribution(data.bar_contribution);
        setExtraPrizeMoney(data.extra_prize_money);
        setTournamentFee(data.tournament_fees);
      } catch (error) {
        console.error('Error fetching tournament details:', error);
        setError('Could not load tournament settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [tournamentId]);

  // Fetch locations from the database
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

  // Handle settings update submission
  const handleUpdateSettings = async (e) => {
    e.preventDefault();

    const updatedName = `${tournamentDate} - ${locationName}`;

    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
          name: updatedName,
          location_id: locationId,
          organizer_name: organizerName,
          entry_fee: entryFee,
          bar_contribution: barContribution,
          extra_prize_money: extraPrizeMoney,
          tournament_fees: tournamentFee,
          created_at: tournamentDate,
        })
        .eq('id', tournamentId);

      if (error) throw error;
      alert('Tournament settings updated successfully!');
    } catch (error) {
      console.error('Error updating tournament settings:', error);
      alert('Error updating settings. Please try again.');
    }
  };

  if (loading) return <p>Loading settings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tournament-settings-container">
      <h2>Tournament Settings</h2>

      {/* Tournament Settings Form */}
      <form onSubmit={handleUpdateSettings}>
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
              <td>Organizer Name:</td>
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
          </tbody>
        </table>
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};

export default TournamentSettings;
