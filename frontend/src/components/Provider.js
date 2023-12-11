import React from 'react'
import Form from './Form';
import TicketTable from './TicketTable';
import axios from 'axios';
import swal from 'sweetalert';

function Provider() {

  async function handleLogout() {
    try {
      const data = {
        "token": localStorage.getItem('token')
      }
      const response = await axios.post('http://localhost:8080/logout', data);
      if (response.data.error === false) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        window.location.reload();
      } else {
        await swal("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
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