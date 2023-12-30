const pool = require('../config/dbConfig')

const auth = async (request, response, next) => {
    try {
        const token = request.headers.authorization;

        if (!token) {
            response.send({ message: 'Unauthorized: Missing token'});
            return;
        }
        
        const user = await pool.query('select * from users where token = $1', [token.replace("Bearer ", "")]);
        
        if (user.rowCount === 0) {
            response.send({ message: 'Unauthorized: Invalid token'});
            return;
        }
        request.user = user.rows[0];
        next();
    } catch (error) {
        console.error(error)
        response.send({ message: 'Something went wrong..'});
    }
}

module.exports = auth;