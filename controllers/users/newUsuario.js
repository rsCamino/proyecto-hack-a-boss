const getDB = require('../../ddbb/db');
const { generateRandomString, sendMail, formatDate } = require('../../helpers');

const newUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { name, email, password } = req.body;

		if (!email || !password || !name) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE email = ?;`,
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
			`INSERT INTO establecimientos (nombre, email, contraseña, codigoRegistro, fechaCreacion, direccion) VALUES (?, ?, SHA2(?, 512), ?, ?, ?);`,
			[
				name,
				email,
				password,
				registrationCode,
				formatDate(new Date()),
				direction,
			]
		);

		res.send({
			status: 'ok',
			message:
				'Establecimiento registrado, comprueba tu email para activarlo',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = newUsuario;
