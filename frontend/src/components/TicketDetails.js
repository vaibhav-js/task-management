import React from 'react'
import { useParams } from 'react-router-dom';
import { Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import axios from 'axios';
import '../styles/TicketDetails.css'
import swal from 'sweetalert';
import Comment from './Comment';
import MuiAlert from '@mui/material/Alert';
import Navbar from './Navbar';
const url = process.env.REACT_APP_SERVICE_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TicketDetails() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    const ticketParams = useParams();
    const [ticketAssignee, setTicketAssignee] = React.useState('')
    const [ticketReporter, setTicketReporter] = React.useState('')
    const [ticketDescription, setTicketDescription] = React.useState('')
    const [commentMessage, setCommentMessage] = React.useState('')
    const [commentsList, setCommentsList] = React.useState([])
    const [snackbarState, setSnackbarState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const getTicketDetails = React.useCallback(async () => {
        try {
            const response = await axios.get(`${url}/tickets/ticket/${ticketParams.id}`);
            if (response.data.error === false) {
                setTicketAssignee(response.data.details.assigneename)
                setTicketReporter(response.data.details.reportername)
                setTicketDescription(response.data.details.description)
            } else {

            }
        } catch (error) {
            console.error(error);   
        }
    }, [ticketParams.id]);

    const getComments = React.useCallback(async () => {
        try {
            const response = await axios.get(`${url}/tickets/ticket/${ticketParams.id}/comments`);
            if (response.data.error === false) {
                setCommentsList(response.data.commentsList)
            } 
        } catch (error) {
            console.error(error);
        }
    }, [ticketParams.id]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarState({...snackbarState, open: false});
    };

    React.useEffect(() => {
        getTicketDetails();
        getComments();
    }, [ticketAssignee, ticketDescription, getTicketDetails, getComments, ticketReporter, commentsList])

    async function addComment() {
        if (!commentMessage.trim()) {
            setSnackbarState({...snackbarState, open: true});
        } else {
            try {
                const data = {
                    "ticketId": ticketParams.id,
                    "message": commentMessage
                }
                const response = await axios.post(`${url}/tickets/ticket/comment`, data);
                if (response.data.error === false) {
                    await swal('Success', response.data.message, 'success');
                } else {
                    await swal('Error', response.data.message, 'error');
                }
            } catch (error) {
                console.error(error);
            }
        }
        setCommentMessage('');
    }

    return (
        <div className='ticket__details__container'>
            <Navbar />
            <div className='ticket__details'>
                <center>
                    <Box sx={{ width: 400, backgroundColor: '#f0f0f0', padding: 3, borderRadius: 4, boxShadow: 2 }}>
                        <Typography variant="h4" sx={{ marginBottom: 2 }}>
                            Ticket Details
                        </Typography>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            Vendor: {ticketAssignee ? ticketAssignee : 'loading..'}
                        </Typography>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            Client: {ticketReporter ? ticketReporter : 'loading..'}
                        </Typography>
                        <Typography variant="h6">
                            Description: {ticketDescription ? ticketDescription : 'loading..'}
                        </Typography>
                    </Box>
                </center>
            </div>
            <div className='add__comment'>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Type your message"
                    multiline
                    maxRows={4}
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                    variant="outlined"
                    sx={{ margin: 2, width: '30%' }}
                />
                <Button onClick={addComment} sx={{margin: 1}} variant="contained" color="primary">Send</Button>
            </div>
            <div className='comments__container'>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    COMMENTS
                </Typography>
                {
                    (Array.isArray(commentsList) && commentsList.length > 0) ? (
                        commentsList.map(comment => (
                            <Comment id={comment.id} key={comment.id} time={comment.time} commenter={comment.commentername} message={comment.message} />
                        ))
                    ) : (<Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            No comments
                        </Typography>)
                }
            </div>
            <Snackbar open={snackbarState.open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Cannot read empty
                </Alert>
            </Snackbar>
        </div>
        
    )
}

export default TicketDetails