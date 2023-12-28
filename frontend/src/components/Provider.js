import React from 'react'
import Form from './Form';
import '../styles/Provider.css'
import Tickets from './Tickets';

function Provider() {

  return (
    <div className='provider'>
        <h1>Welcome to Dashboard</h1>
        <div className='form'>
          <Form />
        </div>
        <Tickets />
    </div>
  )
}

export default Provider