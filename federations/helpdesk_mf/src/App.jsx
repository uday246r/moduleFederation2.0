import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Shell } from './components/Shell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { TicketList } from './pages/TicketList.jsx';
import { CreateTicket } from './pages/CreateTicket.jsx';
import { TicketDetails } from './pages/TicketDetails.jsx';
import { UpdateTicket } from './pages/UpdateTicket.jsx';
import './index.css';

import { NxButton } from '@myorg/shared';

export const App = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <div id="helpdesk-mf-scope" className="helpdesk-app-container">
      <NxButton label="Helpdesk Nx Button" />
      <Shell>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="create" element={<CreateTicket />} />
          <Route path="ticket/:guid" element={<TicketDetails />} />
          <Route path="update/:guid" element={<UpdateTicket />} />
        </Routes>
      </Shell>
    </div>
  );
};

export default App;
