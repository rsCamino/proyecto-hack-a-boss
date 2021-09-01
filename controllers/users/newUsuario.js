const getDB = require('../../ddbb/db');
const { generateRandomString, sendMail, formatDate } = require('../../helpers');

const newUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { name, email, password, nickname } = req.body;

		if (!email || !password || !name || !nickname) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE email = ? OR nickname = ?;`,
			[email, nickname]
		);

		if (usuario.length > 0) {
			const error = new Error(
				'Ya existe un usuario con ese email o nombre de usuario en la base de datos'
			);
			error.httpStatus = 409;
			throw error;
		}

		const registrationCode = generateRandomString(40);

		const emailBody = `
            Te acabas de registrar en Ruta do Camiño.
            Pulsa en este link para verificar tu cuenta: http://localhost:3000/usuarios/validate/${registrationCode}
        `;

		// Enviamos el mensaje.
		await sendMail({
			to: email,
			subject: 'Activa tu usuario en Ruta do Camiño',
			body: emailBody,
		});

		await connection.query(
			`INSERT INTO usuarios (nombre, nickname, email, contraseña, codigoRegistro, fechaCreacion) VALUES (?, ?, ?, SHA2(?, 512), ?, ?);`,
			[
				name,
				nickname,
				email,
				password,
				registrationCode,
				formatDate(new Date()),
			]
		);

		res.send({
			status: 'ok',
			message: 'Usuario registrado, comprueba tu email para activarlo',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = newUsuario;
