import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Protected from './protected/Protected'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
