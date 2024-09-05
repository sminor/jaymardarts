import React, { useState } from 'react';

const PlayerStatSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [playerStats, setPlayerStats] = useState([]);
    const [error, setError] = useState('');

    const searchPlayerStats = async (searchTerm) => {
        const response = await fetch('/.netlify/functions/player-stat-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchValue: searchTerm }),
        });
        const data = await response.json();

        if (response.ok) {
            setPlayerStats(data.players);
            setError('');
        } else {
            setError(data.error || 'An error occurred.');
            setPlayerStats([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            searchPlayerStats(searchTerm);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="player-search-form">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter player name"
                />
                <button type="submit">Search</button>
            </form>
            {error && <p>{error}</p>}
            {playerStats.length > 0 && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Player ID</th>
                                <th>01 Games</th>
                                <th>Cricket Games</th>
                                <th>01 Avg</th>
                                <th>Cricket Avg</th>
                                <th>01 Rating</th>
                                <th>Cricket Rating</th>
                                <th>Rolling Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerStats.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.name}</td>
                                    <td>{player.playerId}</td>
                                    <td>{player.games01}</td>
                                    <td>{player.cricketGames}</td>
                                    <td>{player.avg01}</td>
                                    <td>{player.cricketAvg}</td>
                                    <td>{player.rating01}</td>
                                    <td>{player.cricketRating}</td>
                                    <td>{player.rollingRating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PlayerStatSearch;
