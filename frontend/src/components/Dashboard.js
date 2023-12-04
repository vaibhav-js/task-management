import React from 'react'

function Dashboard() {
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
  return (
    <div>
        <h1>Welcome to Dashboard</h1>
        <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default Dashboard