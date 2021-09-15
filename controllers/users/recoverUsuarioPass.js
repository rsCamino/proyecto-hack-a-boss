const getDB = require('../../ddbb/db');
const { generateRandomString, sendMail } = require('../../helpers');

const recoverUsuarioPass = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { email } = req.body;

		if (!email) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE email = ?;`,
			[email]
		);

		if (usuario.length < 1) {
			const error = new Error(`No existe ningún usuario con ese email`);
			error.httpStatus = 404;
			throw error;
		}

		const recoverCode = generateRandomString(8);

		const emailBody = `
            Se solicitó un cambio de contraseña para el usuario registrado con este email en la app Ruta do Camiño.

            Por favor copia y pega este codigo para recuperar tu constraseña:${recoverCode}

            Si no has sido tu por favor, ignora este email.

            ¡Gracias!
        `;

		await sendMail({
			to: email,
			subject: 'Cambio de contraseña en Ruta do Camiño',
			body: emailBody,
		});

		await connection.query(
			`UPDATE usuarios SET codigoRecuperacion = ? WHERE email = ?;`,
			[recoverCode, email]
		);

		res.send({
			status: 'ok',
			message:
				'Se ha enviado un correo a tu email con el codigo de recuperacion, por favor revisalo y sigue los pasos para recuperar la contraseña',
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
