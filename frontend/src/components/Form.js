import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import swal from 'sweetalert';
const url = process.env.REACT_APP_SERVICE_URL

function Form() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    const [open, setOpen] = React.useState(false);
    const [service, setService] = React.useState('');

    async function addService() {
      setOpen(false);
      const data = {
          "service": service.toLowerCase()
      }
      console.log(service);
      try {
          const response = await axios.post(`${url}/users/service`, data);
          if (response.data.error === false) {
            console.log(response);
            await swal('Successful', response.data.message, 'success')
          } else {
            await swal('Error', response.data.message, 'error');
          }
      } catch (error) {
          console.error(error);
      }
    }
  
    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
    };
  
    return (
      <React.Fragment>
        <Button variant="contained" onClick={handleClickOpen}>
          Add new service
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add your service</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new service please type the name of the service you can provide
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name of service"
              type="text"
              fullWidth
              variant="standard"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addService}>Add</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}

export default Form