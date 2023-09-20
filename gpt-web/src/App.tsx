import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import './css/App.css';
import EventLogs from './components/EventLogs';
import Settings from './components/Settings';
import About from './components/About';
import Integrations from './components/Integrations';
import Drawer from '@mui/material/Drawer';
import ButtonBase from '@mui/material/ButtonBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import IntegrationIcon from '@mui/icons-material/IntegrationInstructions';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

interface IntegrationStatus {
  [key: string]: boolean;
}

const App: React.FC = () => {
  const location = useLocation();
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    Spotify: false,
    GoogleCalendar: false,
    PhilipsHue: false,
  });
  const [showOverlay, setShowOverlay] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 768);

  const toggleStatus = (name: string) => {
    setIntegrations({ ...integrations, [name]: !integrations[name] });
  };

  const toggleOverlay = (visible: boolean) => {
    setShowOverlay(visible);
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current && sidebarVisible) {
      sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    }
  }, [sidebarVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      {showOverlay && <div className="overlay"></div>}
      <header className="App-header">
        <div className="dashboard-container">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="menu-toggle"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="persistent"
            open={sidebarVisible}
            className={sidebarVisible ? 'sidebar open' : 'sidebar closed'}
          >
            <div 
              ref={sidebarRef}
              className={sidebarVisible ? 'MuiPaper-root open' : 'MuiPaper-root closed'}>
              <Link to="/integrations" className='sidebar-title-link'>
                <h1 className="sidebar-title">GPT Home</h1>
              </Link>
              <List>
                <Link to="/integrations">
                  <ButtonBase>
                    <ListItem key="Integrations" className={location.pathname === "/integrations" ? "active" : ""}>
                      <ListItemIcon>
                        <IntegrationIcon />
                      </ListItemIcon>
                      <ListItemText primary="Integrations" />
                    </ListItem>
                  </ButtonBase>
                </Link>
                <Link to="/event-logs">
                  <ButtonBase>
                    <ListItem key="Event Logs" className={location.pathname === "/event-logs" ? "active" : ""}>
                      <ListItemIcon>
                        <ChatIcon />
                      </ListItemIcon>
                      <ListItemText primary="Event Logs" />
                    </ListItem>
                  </ButtonBase>
                </Link>
                <Link to="/settings">
                  <ButtonBase>
                    <ListItem key="Settings" className={location.pathname === "/settings" ? "active" : ""}>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Settings" />
                    </ListItem>
                  </ButtonBase>
                </Link>
                <Link to="/about">
                  <ButtonBase>
                    <ListItem key="About" className={location.pathname === "/about" ? "active" : ""}>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText primary="About" />
                    </ListItem>
                  </ButtonBase>
                </Link>
              </List>
            </div>
          </Drawer>
          <Routes>
            <Route path="/event-logs" element={<EventLogs />} />
            <Route path="/integrations" element={<Integrations toggleStatus={toggleStatus} toggleOverlay={toggleOverlay} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route index element={<Navigate to="/integrations" />} />
          </Routes>
        </div>
      </header>
    </div>
  );  
};

export default App;
