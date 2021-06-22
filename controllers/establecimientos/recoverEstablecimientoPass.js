const getDB = require('../../ddbb/db');
const { generateRandomString, sendMail } = require('../../helpers');

const recoverEstablecimientoPass = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { email } = req.body;

		if (!email) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [establecimiento] = await connection.query(
			`SELECT id FROM establecimientos WHERE email = ?;`,
			[email]
		);

		if (establecimiento.length < 1) {
			const error = new Error(`No existe ningún usuario con ese email`);
			error.httpStatus = 404;
			throw error;
		}

		const recoverCode = generateRandomString(20);

		const emailBody = `
            Se solicitó un cambio de contraseña para el establecimiento registrado con este email en la app Ruta do Camiño.

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
			`UPDATE establecimientos SET codigoRecuperacion = ? WHERE email = ?;`,
			[recoverCode, email]
		);

		res.send({
			status: 'ok',
			message: 'Email enviado',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = recoverEstablecimientoPass;
