import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

function Client() {
    const [option, setOption] = useState('Mehendi');
    const [providerArray, setProviderArray] = useState([]);
    const [servicesList, setServicesList] = useState([]);

    useEffect(() => {
      getServices();
    }, [])

    async function getServices() {
      try {
        const response = await axios.get("http://localhost:8080/service");
        setServicesList(response.data.list);
      } catch (error) {
        console.error(error);
      }
    }

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
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Services</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={option}
            label="Services"
            onChange={(e) => setOption(e.target.value)}
          >
            {
              (Array.isArray(servicesList) && servicesList.length > 0) ? (servicesList.map(item => (
                <MenuItem value={item.service} key={item.service}>{item.service.toUpperCase()}</MenuItem>
              ))) : 
                <MenuItem value={''}>No services</MenuItem>
            }
          </Select>
          <br></br>
          <button onClick={handle}>Show results</button>&nbsp;&nbsp;
        </FormControl>
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
        <button onClick={handleLogout}>Log Out</button>
      </div>
  );
}

export default Client