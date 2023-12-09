import React from 'react';
import TicketForm from './TicketForm';
import TicketTable from './TicketTable';

function Client() {
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    window.location.reload();
  }

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <h2>Hi { localStorage.getItem('name') } </h2>
      <button onClick={handleLogout}>Log Out</button>
      <TicketTable />
      <br></br>
      <TicketForm />
      </div>
  );
}

export default Client