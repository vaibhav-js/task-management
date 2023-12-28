import React from 'react';
import TicketForm from './TicketForm';
import '../styles/Client.css'
import Tickets from './Tickets';


function Client() {

  return (
    <div className='client'>
      <h1>Welcome to Dashboard</h1>
      <TicketForm />
      <Tickets />
      <br></br>
      </div>
  );
}

export default Client