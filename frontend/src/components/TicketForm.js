import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import axios from 'axios';
import swal from 'sweetalert'
import dayjs from 'dayjs';


function TicketForm() {
  const [open, setOpen] = React.useState(false);
  const [service, setService] = React.useState('');
  const [servicesList, setServicesList] = React.useState([]);
  const [providerArray, setProviderArray] = React.useState([]);
  const [provider, setProvider] = React.useState();
  const [providerId, setProviderId] = React.useState();

  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState(dayjs(currentDate));

  React.useEffect(() => {
    getServices();
  }, [])

  async function getServices() {
    try {
      const response = await axios.get("http://localhost:8080/services");
      setServicesList(response.data.list);
    } catch (error) {
      console.error(error);
    }
  }

  async function getProviders() {
    const data = {
        "service": service
      }
      try {
        setProviderArray([]);
        const response = await axios.get('http://localhost:8080/providers', {params: data});
        setProviderArray(response.data);
        console.log(response.data);
        console.log(selectedDate);
      } catch (error) {
        console.error(error);
      }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
        setOpen(false);
    }
  }

  const createTicket = async (event, reason) => {
    setOpen(false);
    console.log(service, provider);
    const data = {
        "service": service,
        "token": localStorage.getItem('token'),
        "assigneeid": providerId,
        "assigneename": provider,
        "reportername": localStorage.getItem('name'),
    }
    const response = await axios.post('http://localhost:8080/ticket', data);
    if (response.data.error === false) {
        await swal('Created', response.data.message, "success");
    } else {
        await swal('Error', response.data.message, "error");
    }
  };

  const deleteAllTickets = async () => {
    const data = {
        "token": localStorage.getItem('token')
    }
    const response = await axios.delete('http://localhost:8080/tickets', {params: data})
    if (response.data.error === false) {
        await swal("Deleted", response.data.message, "success")
    } else {
        await swal("Error", response.data.message, "error");
    }
  }

  return (
    <div>
        <Button onClick={handleClickOpen}>Create ticket</Button>
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
            <DialogTitle>Fill the form</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="demo-dialog-native">Service</InputLabel>
                        <Select
                        native
                        value={service}
                        onChange={(e) => {setService(e.target.value);getProviders()}}
                        onClick={(e) => getProviders()}
                        input={<OutlinedInput label="Service" id="demo-dialog-native" />}
                        >
                            (<option aria-label="None" value="" />)
                            {
                                (Array.isArray(servicesList) && servicesList.length > 0) ? (servicesList.map(item => (
                                    <option key={item.service} value={item.service}>{item.service}</option>
                                ))) 
                                : (<option aria-label="None" value="" />)
                            }
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="demo-dialog-select-label">Providers</InputLabel>
                        <Select
                            labelId="demo-dialog-select-label"
                            id="demo-dialog-select"
                            value={provider}
                            onChange={(event) => setProvider(event.target.value)}
                            input={<OutlinedInput label="Providers" />}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                (Array.isArray(providerArray) && providerArray.length > 0)
                                ?
                                (
                                    providerArray.map(item => (
                                        <MenuItem key={item.name} value={item.name} onClick={(e) => setProviderId(item.id)}>
                                            <em>{item.name}</em>
                                        </MenuItem>
                                    ))
                                ) 
                                : 
                                (
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                )
                            }
                        </Select>
                        <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>                    
                                <DateCalendar value={selectedDate} onChange={(newDate) => {setSelectedDate(newDate);console.log(selectedDate.$d);}} />
                            </LocalizationProvider>
                        </Box>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createTicket}>Ok</Button>
            </DialogActions>
        </Dialog>
        <button onClick={deleteAllTickets}>Delete all tickets</button>
    </div>
  );
}

export default TicketForm;