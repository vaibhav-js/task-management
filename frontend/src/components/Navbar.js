import React from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
const url = process.env.REACT_APP_SERVICE_URL

function Navbar() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    const navigate = useNavigate();

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

    function navigateToDashboard() {
        navigate('/dashboard')
    }

  return (
    <Box sx={{ flexGrow: 1, width: '100vw' }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Hi { localStorage.getItem('name') }
                </Typography>
                <Button color="inherit" onClick={navigateToDashboard}>Dashboard</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    </Box>
  )
}

export default Navbar