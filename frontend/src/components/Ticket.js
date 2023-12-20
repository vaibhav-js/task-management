    import * as React from 'react';
    import { Grid, Button, Card, CardActions, CardContent, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, Typography} from '@mui/material';
    import '../styles/Ticket.css'
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import swal from 'sweetalert';
    const url = process.env.REACT_APP_SERVICE_URL


    export default function Ticket({id, name='no ticket found', description='no data', date='no data', status}) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

        const navigate = useNavigate();
        const [open, setOpen] = React.useState(false);
        const [ticketStatus, setTicketStatus] = React.useState('');

        var filteredStatusList = [];

        if (localStorage.getItem('role') === 'Client') {
            filteredStatusList = ['Acknowledge', 'In progress', 'Close'].filter(item => item !== status)
        } else {
            filteredStatusList = ['Acknowledge', 'In progress'].filter(item => item !== status)
        }

        async function navigateToTicketDetails() {
            navigate(`ticket/${id}/${status}`)
        }

        async function updateTicketStatus() {
            setOpen(false);
            try {
                if (!ticketStatus.trim()) {
                    await swal('Error', 'Status field empty', 'warning');
                }
                else {
                    const data = {
                        "status": ticketStatus,
                    }
                    const response = await axios.put(`${url}/tickets/ticket/${id}`, data);
                    if (response.data.error === false) {
                        await swal('Successful', response.data.message, 'success');
                        navigate('/dashboard');
        
                    } else {
                        await swal('Error', response.data.message, 'error');
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        return (
            <Grid>
                <Card sx={{ minWidth: 275, width: 100, borderRadius: 4}} className='ticket__container' key={id} onClick={handleClickOpen}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.primary">
                            {status}
                        </Typography>
                        <Typography variant="body2">
                            {description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={navigateToTicketDetails}>More Details</Button>
                    </CardActions>
                </Card>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Current Status: {status}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{marginBottom: 2}}>
                            You can change the status of the ticket below
                        </DialogContentText>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={ticketStatus}
                                label="Status"
                                onChange={(e) => setTicketStatus(e.target.value)}
                            >
                                {
                                    (Array.isArray(filteredStatusList) && filteredStatusList.length > 0) ? (filteredStatusList.map(item => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))) 
                                    : (<MenuItem aria-label="None" value="" />)
                                }
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={updateTicketStatus}>Update</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }