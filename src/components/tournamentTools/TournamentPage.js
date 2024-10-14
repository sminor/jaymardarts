import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Get the id from the URL
import { supabase } from '../../supabaseClient'; // Import Supabase client

const TournamentPage = () => {
  const { id } = useParams(); // Get the UUID from the URL
  const [tournament, setTournament] = useState(null); // State to store tournament data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the tournament details using the UUID
  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single(); // Get the tournament with the matching UUID

      if (error) {
        setError('Error fetching tournament details.');
        console.error('Error fetching tournament details:', error);
      } else {
        setTournament(data);
      }
      setLoading(false);
    };

    fetchTournament();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>Date: {new Date(tournament.created_at).toLocaleDateString()}</p>
      <p>Location: {tournament.location_id}</p>
      {/* Add more tournament details here */}
    </div>
  );
};

export default TournamentPage;
