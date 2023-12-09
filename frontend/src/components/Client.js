import React, { useState } from 'react';
import axios from 'axios';

function Client() {
    const [option, setOption] = useState('Mehendi');
    const [providerArray, setProviderArray] = useState([]);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        window.location.reload();
    }

    async function handle() {
      const data = {
        "service": option
      }
      try {
        setProviderArray([]);
        const response = await axios.get('http://localhost:8080/providers', {params: data});
        setProviderArray(response.data);
      } catch (error) {
        console.error(error);
      }
    }

  return (
      <div>
        <h1>Welcome to Dashboard</h1>
        <h2>Hi { localStorage.getItem('name') } </h2>
        <h3>Provider List</h3>
        <h4>Groups</h4>
        <select name='group' id='group' onChange={(e) => setOption(e.target.value)}>
          <option value="Mehendi">Mehendi</option>
          <option value="DJ">DJ</option>
          <option value="Catering">Catering</option>
        </select>
        <table>
          <tbody>
            {
              (Array.isArray(providerArray) && providerArray.length > 0) ? (providerArray.map(provider => (
                <tr key={provider.id}>
                  {
                    <td key={provider.id}>
                      {provider.name}
                    </td>
                  }
                </tr>
              ))) : 
              <tr>
                <td>No providers</td>
              </tr>
            }
          </tbody>
        </table>
        <button onClick={handle}>Submit</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
  );
}

export default Client