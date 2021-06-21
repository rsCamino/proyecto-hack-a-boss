const getDB = require('../../bbdd/db');
const {
    validate,
    generateRandomString,
    sendMail,
    formatDate,
} = require('../../helpers');
const { newEstablecimientoSchema } = require('../../schemas');

const newEstablecimiento = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        await validate(newEstablecimientoSchema, req.body);

        const { email, password } = req.body;


        const [establecimiento] = await connection.query(
            `SELECT id FROM establecimientos WHERE email = ?;`,
            [email]
        );

        if (establecimiento.length > 0) {
            const error = new Error(
                'Ya existe un establecimiento con ese email en la base de datos'
            );
            error.httpStatus = 409;
            throw error;
        }

        const registrationCode = generateRandomString(40);

        const emailBody = `
            Te acabas de registrar en Ruta do Camiño.
            Pulsa en este link para verificar tu cuenta: ${process.env.PUBLIC_HOST}/establecimientos/validate/${registrationCode}
        `;

        // Enviamos el mensaje.
        await sendMail({
            to: email,
            subject: 'Activa tu establecimiento en Ruta do Camiño',
            body: emailBody,
        });

        await connection.query(
            `INSERT INTO establecimientos (email, password, registrationCode, createdAt) VALUES (?, SHA2(?, 512), ?, ?);`,
            [email, password, registrationCode, formatDate(new Date())]
        );

        res.send({
            status: 'ok',
            message: 'Establecimiento registrado, comprueba tu email para activarlo',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newEstablecimiento;

