const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');
const auth = require('../middleware/auth.js')


router.post('/ticket', auth, async (request, response) => {
    try {
        const {service, assigneeid, assigneename, reportername} = request.body;
        const reporterid = request.user.id;
        const date = (new Date()).toISOString();
        const ticketResult = await pool.query('insert into tickets(reporterid, reportername, assigneeid, assigneename, description, createdat) values($1, $2, $3, $4, $5, $6)', [reporterid, reportername, assigneeid, assigneename, service, date]);
            if (ticketResult.rowCount) {
                response.send({message: "Ticket details submitted", error: false});
            }
    } catch (error) {
        response.send({message: "Could not create ticket", error: true});
    }
});

router.get('/tickets', auth, async (request, response) => {
    try {
        const userId = request.user.id;
        const userrole = request.user.userrole;
        if (userrole === 'Client') {
            const ticketResult = await pool.query('select id, assigneename, description, createdat, status from tickets where reporterid = $1', [userId])
            if (ticketResult.rowCount > 0) {
                response.send({ message: "Successful", error: false, list: ticketResult.rows });
            }
        } else {
            const ticketResult = await pool.query('select id, reportername, description, createdat, status from tickets where assigneeid = $1', [userId])
            if (ticketResult.rowCount > 0) {
                response.send({ message: "Successful", error: false, list: ticketResult.rows });
            }
        }
    } catch (error) {
        console.error(error);
        response.send({ message: "Could not retreive tickets details", error: true });
    }
});

router.delete('/tickets', auth, async (request, response) => {
    try {
        const reporterid = request.user.id;

        const ticketResult = await pool.query('delete from tickets where reporterid = $1', [reporterid]);

        if (ticketResult.rowCount > 0) {
            response.send({ message: "Tickets deleted successfully", error: false });
        } else {
            response.send({ message: "No tickets found for the user", error: true });
        }
    } catch (error) {
        console.error(error);
        response.send({ message: "An error occurred", error: true });
    }
});

router.put('/ticket/:id', auth, async(request, response) => {
    const { status } = request.body;
    const ticketId = request.params.id;
    try {
        const ticket = await pool.query('update tickets set status = $1 where id = $2', [status, ticketId]);
        if (ticket.rowCount) {
            response.send({message: 'Status updated', error: false});
        } else {
            response.send({message: 'Ticket not found', error: true});
        }
    } catch (error) {
        console.error(error);
        response.send({message: 'Something went wrong', error: true});
    }
});

router.get('/ticket/:id', auth, async (request, response) => {
    const ticketId = request.params.id;
    try {
        const ticket = await pool.query('select * from tickets where id = $1', [ticketId]);
        if (ticket.rowCount) {
            response.send({message: 'Ticket found', error: false, details: ticket.rows[0]});
        } else {
            response.send({message: 'Ticket not found', error: true});
            }
    } catch (error) {
        console.error(error);
        response.send({message: 'User not authorised', error: true});
    }
});

router.post('/ticket/comment', auth, async (request, response) => {
    const { ticketId, message} = request.body;
    try {
        const date = (new Date()).toISOString();
        const userid = request.user.id;
        const name = request.user.name;
        const result = await pool.query('insert into comments(ticketid, commenterid, commentername, message, time) values($1, $2, $3, $4, $5)', [ticketId, userid, name, message, date]);
        if (result.rowCount) {
            response.send({message: 'Successfull', error: false});
        } else {
            response.send({message: 'Unsuccessful', error: true});
        }
    } catch (error) {
        console.error(error)
        response.send({message: 'Unauthorised user', error: true});
    }
});

router.get('/ticket/:id/comments', auth, async (request, response) => {
    const ticketId = request.params.id
    try {
        const comments = await pool.query('select * from comments where ticketid = $1', [ticketId]);
            if (comments.rowCount) {
                response.send({message: 'comments found', error: false, commentsList: comments.rows})
            } else {
                response.send({message: 'comments not found', error: true})
            }
    } catch (error) {
        console.error(error)
        response.send({message: 'Unauthorised user', error: true})
    }
})

module.exports = router