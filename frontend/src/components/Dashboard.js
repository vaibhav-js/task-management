import React from 'react'
import Client from './Client';
import Provider from './Provider';
import '../styles/Dashboard.css'

function Dashboard() {
  const role = localStorage.getItem('role');
  return (
    <div className='dashboard'>
      {
        role === 'Client' ? <Client /> : (role === 'Provider') ? <Provider /> : <></>
      }
    </div>
  )
}

export default Dashboard