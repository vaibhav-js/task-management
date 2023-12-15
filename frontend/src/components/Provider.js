import React from 'react'
import Form from './Form';
import TicketTable from './TicketTable';
import axios from 'axios';
import swal from 'sweetalert';
import '../styles/Provider.css'

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
    <div className='provider'>
        <h1>Welcome to Dashboard</h1>
        <h2>Hi { localStorage.getItem('name') } </h2>
        <button className='button__logout' onClick={handleLogout}>Log Out</button>
        <div className='table'>
          <h3>Client List</h3>
          <TicketTable />
        </div>
        <div className='form'>
          <Form />
        </div>
    </div>
  )
}

export default Provider