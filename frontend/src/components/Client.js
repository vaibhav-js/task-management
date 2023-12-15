import React from 'react';
import TicketForm from './TicketForm';
import TicketTable from './TicketTable';
import swal from 'sweetalert';
import axios from 'axios';
import '../styles/Client.css'

function Client() {
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
    <div className='client'>
      <h1>Welcome to Dashboard</h1>
      <h2>Hi { localStorage.getItem('name') } </h2>
      <button className='button__logout' onClick={handleLogout}>Log Out</button>
      <TicketTable />
      <br></br>
      <TicketForm />
      </div>
  );
}

export default Client