const getDB = require('../../bbdd/db');
const { generateRandomString, sendMail } = require('../../helpers');

const recoverUsuarioPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        console.log('HOLA');

        if (!email) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [usuario] = await connection.query(
            `SELECT id FROM usuarioss WHERE email = ?;`,
            [email]
        );

        if (usuario.length < 1) {
            const error = new Error(`No existe ningún usuario con ese email`);
            error.httpStatus = 404;
            throw error;
        }

        const recoverCode = generateRandomString(20);

        const emailBody = `
            Se solicitó un cambio de contraseña para el usuario registrado con este email en la app Ruta do Camiño.

            El código de recuperación es: ${recoverCode}

            Si no has sido tu por favor, ignora este email.

            ¡Gracias!
        `;

        await sendMail({
            to: email,
            subject: 'Cambio de contraseña en Ruta do Camiño',
            body: emailBody,
        });

        await connection.query(
            `UPDATE usuarios SET recoverCode = ? WHERE email = ?;`,
            [recoverCode, email]
        );

        res.send({
            status: 'ok',
            message: 'Email enviado',
        });

        /*MODELO TELEFONICO
        const recoverCode = generateRandomString(20);

        const smsBody = `
            Código recuperación: ${recoverCode}
            Si no has sido tu por favor, ignora este sms.
            ¡Gracias!
        `;

        await sendSMS({
            to: phoneNumber,
            body: smsBody,
        });

        await connection.query(
            `UPDATE usuarios SET recoverCode = ? WHERE phoneNumber = ?;`,
            [recoverCode, phoneNumber]
        );

        res.send({
            status: 'ok',
            message: 'SMS enviado',
        });
        */
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = recoverUsuarioPass;
