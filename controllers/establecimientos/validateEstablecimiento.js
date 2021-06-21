const getDB = require('../../bbdd/db');

const validateEstablecimiento = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { registrationCode } = req.params;

        const [establecimiento] = await connection.query(
            `SELECT id FROM establecimientos WHERE registrationCode = ?;`,
            [registrationCode]
        );

        if (establecimiento.length < 1) {
            const error = new Error(
                'No hay establecimientos pendientes de validar con este código'
            );
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(
            `UPDATE establecimientos SET active = true, registrationCode = NULL WHERE registrationCode = ?;`,
            [registrationCode]
        );

        res.send({
            status: 'ok',
            message: 'Usuario verificado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validateEstablecimiento;

