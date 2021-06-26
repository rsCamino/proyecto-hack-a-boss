const getDB = require('../ddbb/db');

const comentarioExist = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { idComentario } = req.params;

		const [comentario] = await connection.query(
			`SELECT id FROM usuarios_imagenes WHERE id = ? AND deleted = 0;`,
			[idComentario]
		);

		if (comentario.length < 1) {
			const error = new Error(
				'El comentario que usted ha ingresado no existe.'
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

module.exports = comentarioExist;
