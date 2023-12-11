import React from 'react'
import Client from './Client';
import Provider from './Provider';

function Dashboard() {
  const role = localStorage.getItem('role');
  return (
    <div>
      {
        role === 'Client' ? <Client /> : (role === 'Provider') ? <Provider /> : <></>
      }
    </div>
  )
}

export default Dashboard