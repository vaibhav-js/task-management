import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Protected from './protected/Protected'
import TicketDetails from './components/TicketDetails';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/dashboard/ticket/:id/:status" element={<Protected><TicketDetails /></Protected>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
