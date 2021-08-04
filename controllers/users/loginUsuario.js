const getDB = require('../../ddbb/db');
const jwt = require('jsonwebtoken');

const loginUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { email, password } = req.body;

		if (!email || !password) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [usuario] = await connection.query(
			`SELECT id, activo FROM usuarios WHERE email = ? AND contraseña = SHA2(?, 512);`,
			[email, password]
		);

		if (usuario.length < 1) {
			const error = new Error('Email o contraseña incorrectos');
			error.httpStatus = 401;
			throw error;
		}

		if (!usuario[0].activo) {
			const error = new Error('Usuario pendiente de validar');
			error.httpStatus = 401;
			throw error;
		}

		const tokenInfo = {
			idUsuario: usuario[0].id,
		};

		const token = jwt.sign(tokenInfo, process.env.SECRET, {
			expiresIn: '60d',
		});
		console.log(token);
		res.send({
			status: 'ok',
			data: {
				token,
				idUsuario: usuario[0].id,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = loginUsuario;
