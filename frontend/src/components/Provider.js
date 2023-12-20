import React from 'react'
import Form from './Form';
import axios from 'axios';
import swal from 'sweetalert';
import '../styles/Provider.css'
import Tickets from './Tickets';
const url = process.env.REACT_APP_SERVICE_URL

function Provider() {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  async function handleLogout() {
    try {
      const response = await axios.post(`${url}/users/logout`);
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
        <div className='form'>
          <Form />
        </div>
        <Tickets />
    </div>
  )
}

export default Provider