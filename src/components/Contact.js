import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General questions or comments', // Default subject
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error(result.error || 'There was an issue submitting the form.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="App-section">
      <div className="info-box">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Please fill out the form below to get in touch with us.</p>
        {success ? (
          <p>Thank you! Your message has been sent.</p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              className="contact-dropdown"
              value={formData.subject}
              onChange={handleInputChange}
            >
			  <option value="">--- Please Select ---</option>
              <option value="General questions or comments">General questions or comments</option>
              <option value="Inquiry about dart board installation">Inquiry about dart board installation</option>
              <option value="Questions about leagues/league sign ups">Questions about leagues/league sign ups</option>
              <option value="Website feedback">Website feedback</option>
              <option value="Report an issue with a dart board">Report an issue with a dart board</option>
              <option value="Request a Dart Event">Request a Dart Event</option>
            </select>

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;
