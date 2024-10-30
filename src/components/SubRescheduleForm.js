import React, { useState, useEffect } from 'react';
import leagueScheduleData from '../data/leagueSchedule.json';

const SubRescheduleForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matchDateTime: '',
    currentPlayer: '',
    substitutePlayer: '',
    reason: '',
    flight: '',
    team: '',
    requestType: '',
    rescheduleConfirmation: false,
    finalConfirmation: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [teams, setTeams] = useState([]);
  const [scheduleInfo, setScheduleInfo] = useState({ day: '', time: '' });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update schedule info and teams when flight changes
  useEffect(() => {
    const selectedFlight = leagueScheduleData.schedules.find(schedule => schedule.flight === formData.flight);
    if (selectedFlight) {
      setScheduleInfo({ day: selectedFlight.day, time: selectedFlight.time });
      setTeams(selectedFlight.teams);
    } else {
      setScheduleInfo({ day: '', time: '' });
      setTeams([]);
    }
  }, [formData.flight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const subject = formData.requestType === 'Substitute Player' ? 'Substitution request' : 'Reschedule request';
      const message = [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Request Type: ${formData.requestType}`,
        `Flight: ${formData.flight}`,
        `Day and Time: ${scheduleInfo.day} ${scheduleInfo.time}`,
        `Team: ${formData.team}`,
        `Date Match to be Played: ${formData.matchDate}`,
        formData.requestType === 'Substitute Player' ? `Current Player: ${formData.currentPlayer}\nSubstitute Player: ${formData.substitutePlayer}` : '',
        `Reason: ${formData.reason}`,
        formData.requestType === 'Match Reschedule' ? `Reschedule Confirmation: ${formData.rescheduleConfirmation ? 'Confirmed' : 'Not Confirmed'}` : '',
        `Final Confirmation: ${formData.finalConfirmation ? 'Acknowledged' : 'Not Acknowledged'}`
      ]
      .filter(Boolean) // Remove any empty lines
      .join('\n'); // Join all lines without any indentation or blank lines
      

      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        body: JSON.stringify({ ...formData, subject, message }), // Send all data in request
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (response.ok) setSuccess(true);
      else throw new Error(result.message || 'There was an issue submitting the form.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      matchDate: '',
      currentPlayer: '',
      substitutePlayer: '',
      reason: '',
      flight: '',
      team: '',
      requestType: '',
    });
    setSuccess(false);
    setError('');
  };
  
  // Update onClose to reset form as well
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={handleClose}>X</button>
        <h2>Substitute or Reschedule Request</h2>
        {!success ? (
          <>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Your Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

              <label>Your Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

              <label>Request Type</label>
              <select name="requestType" value={formData.requestType} onChange={handleInputChange} required>
                <option value="">-- Select Request Type --</option>
                <option value="Match Reschedule">Match Reschedule</option>
                <option value="Substitute Player">Substitute Player</option>
              </select>

              <label>Flight</label>
              <select name="flight" value={formData.flight} onChange={handleInputChange} required>
                <option value="">-- Select a Flight --</option>
                {leagueScheduleData.schedules.map((schedule, index) => (
                  <option 
                  key={index} 
                  value={schedule.flight}
                >
                  {`${schedule.flight} - ${schedule.day} ${schedule.time}`}
                </option>
                ))}
              </select>

              {teams.length > 0 && (
                <>
                  <label>Team</label>
                  <select name="team" value={formData.team} onChange={handleInputChange} required>
                    <option value="">-- Select a Team --</option>
                    {teams.map((team, index) => (
                      <option key={index} value={team.team_name}>{team.team_name}</option>
                    ))}
                  </select>
                </>
              )}

              {formData.requestType === 'Substitute Player' && teams.length > 0 && (
                <>
                  <label>Current Player</label>
                  <select name="currentPlayer" value={formData.currentPlayer} onChange={handleInputChange} required>
                    <option value="">-- Select Current Player --</option>
                    {teams.find(team => team.team_name === formData.team)?.players.map((player, index) => (
                      <option key={index} value={player}>{player}</option>
                    ))}
                  </select>

                  <label>Substitute Player</label>
                  <input type="text" name="substitutePlayer" value={formData.substitutePlayer} onChange={handleInputChange} required />
                </>
              )}

              <label>Date Match to be Played</label>
              <input 
                type="date" 
                name="matchDate" 
                value={formData.matchDate} 
                onChange={handleInputChange} 
                required 
              />

              <label>Reason for Request</label>
              <textarea name="reason" rows="4" value={formData.reason} onChange={handleInputChange} required></textarea>

              {formData.requestType === 'Match Reschedule' && (
                <div>
                    <input 
                    type="checkbox" 
                    name="rescheduleConfirmation" 
                    checked={formData.rescheduleConfirmation} 
                    onChange={() => setFormData({ ...formData, rescheduleConfirmation: !formData.rescheduleConfirmation })} 
                    required 
                    />
                    <label style={{ marginLeft: '.5em' }}>
                    I confirm that I have discussed this rescheduling request with the opposing team,<br /> and they have agreed to the proposed change.
                    </label>
                </div>
                )}

                <div>
                <input 
                    type="checkbox" 
                    name="finalConfirmation" 
                    checked={formData.finalConfirmation} 
                    onChange={() => setFormData({ ...formData, finalConfirmation: !formData.finalConfirmation })}
                    required 
                />
                <label style={{ marginLeft: '.5em' }}>
                    I understand that this request is not finalized until I receive official confirmation.
                </label>
                </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Submit Request'}
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </>
        ) : (
          <>
            <p>Thank you! Your request has been submitted.</p>
            <p>We will review your request as soon as possible and reach out to confirm or discuss any further details needed.</p>

          </>
        )}
      </div>
    </div>
  );
};

export default SubRescheduleForm;
