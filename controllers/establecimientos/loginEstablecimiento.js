const getDB = require('../../bbdd/db');
const jwt = require('jsonwebtoken');

const loginEstablecimiento = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [establecimiento] = await connection.query(
            `SELECT id, role, active FROM establecimientos WHERE email = ? AND password = SHA2(?, 512);`,
            [email, password]
        );

        console.log(email, password);
        console.log(establecimiento);

        if (establecimiento.length < 1) {
            const error = new Error('Email o contraseña incorrectos');
            error.httpStatus = 401;
            throw error;
        }

        if (!establecimiento[0].active) {
            const error = new Error('Usuario pendiente de validar');
            error.httpStatus = 401;
            throw error;
        }

        const tokenInfo = {
            idEstablecimiento: establecimiento[0].id,
            role: establecimiento[0].role,
        };

        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '7d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = loginEstablecimiento;

