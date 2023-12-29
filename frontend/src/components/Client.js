import React from 'react';
import TicketForm from './TicketForm';
import '../styles/Client.css'
import Tickets from './Tickets';


function Client() {

  return (
    <div className='client'>
      <TicketForm />
      <Tickets />
      <br></br>
    </div>
  );
}

export default Client