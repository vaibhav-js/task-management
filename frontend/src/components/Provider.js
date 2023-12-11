import React from 'react'
import Form from './Form';
import TicketTable from './TicketTable';

function Provider() {

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
        <h3>Client List</h3>
        <TicketTable />
        <Form />&nbsp;&nbsp;
        <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default Provider