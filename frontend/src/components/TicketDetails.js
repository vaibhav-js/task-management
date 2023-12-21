import React from 'react'
import { useParams } from 'react-router-dom';
import { Box, Button, Snackbar, TextField } from '@mui/material';
import axios from 'axios';
import '../styles/TicketDetails.css'
import swal from 'sweetalert';
import Comment from './Comment';
import MuiAlert from '@mui/material/Alert';
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
                    setCommentMessage('');
                } else {
                    await swal('Error', response.data.message, 'error');
                    setCommentMessage('');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className='ticket__details__container'>
            <div className='ticket__details'>
                <center>
                    <Box sx={{ width: 400}}>
                        <h1>Ticket Details</h1>
                        <br />
                        <h2>Vendor: {ticketAssignee ? ticketAssignee : 'loading..'}</h2>
                        <br/>
                        <h2>Client: {ticketReporter ? ticketReporter : 'loading..'}</h2>
                        <br />
                        <h2>Description: {ticketDescription ? ticketDescription : 'loading..'}</h2>
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
                    sx={{marginLeft: 2}}
                />
                <Button onClick={addComment} sx={{margin: 1}}>Send</Button>
            </div>
            <div className='comments__container'>
                <h3>COMMENTS</h3>
                {
                    (Array.isArray(commentsList) && commentsList.length > 0) ? (
                        commentsList.map(comment => (
                            <Comment id={comment.id} key={comment.id} time={comment.time} commenter={comment.commentername} message={comment.message} />
                        ))
                    ) : (<>No comments</>)
                }
            </div>
            <Snackbar open={snackbarState.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    Wrong information
                </Alert>
            </Snackbar>
        </div>
        
    )
}

export default TicketDetails