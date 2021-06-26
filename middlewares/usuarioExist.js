const getDB = require('../ddbb/db');

const usuarioExist = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE id = ?;`,
			[idUsuario]
		);

		if (usuario.length < 1) {
			const error = new Error(
				'El usuario que usted ha ingresado no existe.'
			);
			error.httpStatus = 404;
			throw error;
		}
		next();
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = usuarioExist;
