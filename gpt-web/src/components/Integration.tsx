import React, { useState } from 'react';
import axios from 'axios';
import '../css/Integration.css';

interface IntegrationProps {
  name: string;
  status: boolean;
  usage: string[];
  requiredFields: { [key: string]: string[] };
  toggleStatus: (name: string) => void;
  setShowOverlay: (visible: boolean) => void;
}

const Integration: React.FC<IntegrationProps> = ({ name, usage, status, requiredFields, toggleStatus, setShowOverlay }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({} as { [key: string]: string });
  const [error, setError] = useState('');
  const apiRefs: { [key: string]: string[] } = {
    Spotify: ['https://developer.spotify.com/documentation/web-api/'],
    GoogleCalendar: ['https://developers.google.com/calendar/api/quickstart/python'],
    PhilipsHue: ['https://developers.meethue.com/develop/get-started-2/', 'https://github.com/studioimaginaire/phue'],
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const connectService = async () => {
    for (const field of requiredFields[name]) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please enter a value for ${field}`);
        setShowOverlay(false);
        return;
      }
    }

    let fields: { [key: string]: string } = {};
    for (const field of requiredFields[name]) {
      fields[field] = formData[field as keyof typeof formData];
    }

    axios.post('/connect-service', { name, fields }).then((response) => {
      if (response.data.success) {
        toggleStatus(name);
        setShowOverlay(false);
        setShowForm(false);
        // clear all fields except for PhilipsHue
        if (name !== "PhilipsHue") setFormData({} as { [key: string]: string });
      } else {
        setError(`Error connecting to ${name}: ${response.data.error}`);
        console.log(response.data.traceback);
        setShowOverlay(false);
      }
    }).catch((error) => {
      setError(`Error connecting to ${name}: ${error}`);
      console.log("Error: ", error);
      console.log("Error Response: ", error.response);
      setShowOverlay(false);
    });
  };

  const disconnectService = async () => {
    if (window.confirm(`Are you sure you want to disconnect from ${name}?`))
      axios.post('/disconnect-service', { name }).then((response) => {
        if (response.data.success) {
          toggleStatus(name);
          setShowOverlay(false);
          setShowForm(false);
          // clear all fields
          setFormData({} as { [key: string]: string });
        } else {
          setError(`Error disconnecting from ${name}: ${response.data.error}`);
          console.log(response.data.traceback);
          setShowOverlay(false);
        }
      }).catch((error) => {
        setError(`Error disconnecting from ${name}: ${error}`);
        console.log("Error: ", error);
        console.log("Error Response: ", error.response);
        setShowOverlay(false);
      });
  };

  const editService = async () => {
    for (const field of requiredFields[name]) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please enter a value for ${field}`);
        setShowOverlay(false);
        return;
      }
    }

    let fields: { [key: string]: string } = {};
    for (const field of requiredFields[name]) {
      fields[field] = formData[field as keyof typeof formData];
    }

    axios.post('/connect-service', { name, fields }).then((response) => {
      if (response.data.success) {
        setShowOverlay(false);
        setShowForm(false);
        // clear all fields except for PhilipsHue
        if (name !== "PhilipsHue") setFormData({} as { [key: string]: string });
      } else {
        setError(`Error connecting to ${name}: ${response.data.error}`);
        console.log(response.data.traceback);
        setShowOverlay(false);
      }
    }).catch((error) => {
      setError(`Error editing ${name}: ${error}`);
      console.log("Error: ", error);
      console.log("Error Response: ", error.response);
      setShowOverlay(false);
    });
  };

  return (
    <div className="integration">
      {usage.map((phrase) => (
        <h4 key={phrase}>{phrase}</h4>
      ))}
      {status && 
        <button className="btn-edit" onClick={() => setShowForm(true)}>
          Edit
        </button>
      }
      {showForm &&
        <div className="overlay">
          <div className="form-container">
            { apiRefs[name] && apiRefs[name].length > 0 &&
              <h4>{name} API Integration Reference:<hr/>
                {apiRefs[name].map((link) => (
                  <a key={link} target='_blank' rel='noopener noreferrer' href={link}>{link}<br/></a>
                ))}
              </h4>
            }
            {name === 'PhilipsHue' && <div style={{ color: 'red' }}>NOTE: Press the button on the bridge before submitting.</div> }
            {name === 'Spotify' &&
              <div style={{ color: 'red' }}>
                NOTE: You may provide your own redirect URI<br/>
                or use mine but be sure to set it in your application settings:<br />
                My Callback Server: <span style={{color: 'green'}}>https://gpt-home.judahpaul.com/callback</span> <br />
                See <a target='_blank' rel='noopener noreferrer' href="https://github.com/judahpaul16/gpt-home-spotify-callback">here</a> for how to implement your own callback server.
              </div>
            }
            {requiredFields[name].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  placeholder={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <button onClick={status ? editService : connectService}>Submit</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
            {error && <div className="error-text">{error}</div>}
          </div>
        </div>
      }
      <button
        className={status ? 'btn-disconnect' : 'btn-connect'}
        onClick={status ? disconnectService : () => setShowForm(true)}
      >
        {status ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

export default Integration;
