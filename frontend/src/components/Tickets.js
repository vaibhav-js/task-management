import React, { useEffect, useState } from 'react'
import Ticket from './Ticket'
import '../styles/Tickets.css'
import axios from 'axios'
const url = process.env.REACT_APP_SERVICE_URL

function Tickets() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        getTickets();
    }, [tickets])
    async function getTickets() {
        try {
            const response = await axios.get(`${url}/tickets/tickets`);
            if (response.data.error === false) {
                setTickets(() => [...response.data.list]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='tickets__container'>
            <div className='tickets'>
            <h2>Created</h2>
                {
                    (Array.isArray(tickets) && tickets.filter((ticket) => ticket.status === 'created').length > 0) ? (tickets.filter((ticket) => ticket.status === 'created').map((ticket) => {
                        return <Ticket key={ticket.id} id={ticket.id} name={ticket.assigneename ? ticket.assigneename : ticket.reportername} description={ticket.description} date={ticket.createdat} status={ticket.status} />
                    })) : (<></>)
                }
            </div>
            <div className='tickets'>
            <h2>Acknowledged</h2>
                {
                    (Array.isArray(tickets) && tickets.filter((ticket) => ticket.status === 'Acknowledge').length > 0) ? (tickets.filter((ticket) => ticket.status === 'Acknowledge').map((ticket) => {
                        return <Ticket key={ticket.id} id={ticket.id} name={ticket.assigneename ? ticket.assigneename : ticket.reportername} description={ticket.description} date={ticket.createdat} status={ticket.status} />
                    })) : (<></>)
                }
            </div>
            <div className='tickets'>
            <h2>In Progress</h2>
                {
                    (Array.isArray(tickets) && tickets.filter((ticket) => ticket.status === 'In progress').length > 0) ? (tickets.filter((ticket) => ticket.status === 'In progress').map((ticket) => {
                        return <Ticket key={ticket.id} id={ticket.id} name={ticket.assigneename ? ticket.assigneename : ticket.reportername} description={ticket.description} date={ticket.createdat} status={ticket.status} />
                    })) : (<></>)
                }
            </div>
            <div className='tickets'>
            <h2>Closed</h2>
                {
                    (Array.isArray(tickets) && tickets.filter((ticket) => ticket.status === 'Close').length > 0) ? (tickets.filter((ticket) => ticket.status === 'Close').map((ticket) => {
                        return <Ticket key={ticket.id} id={ticket.id} name={ticket.assigneename ? ticket.assigneename : ticket.reportername} description={ticket.description} date={ticket.createdat} status={ticket.status} />
                    })) : (<></>)
                }
            </div>
        </div>
    )
}

export default Tickets;