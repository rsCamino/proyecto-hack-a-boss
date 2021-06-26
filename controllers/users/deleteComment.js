const getDB = require('../../ddbb/db');
const deleteComment = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario, idPhoto, idComentario } = req.params;

		if (
			req.authEntity.idUsuario !== Number(idUsuario) &&
			req.authEntity.role !== 'admin'
		) {
			const error = new Error(
				'No tienes permisos para eliminar comentarios de este usuario'
			);
			error.httpStatus = 403;
			throw error;
		}

		const [comentarios] = await connection.query(
			`SELECT id FROM usuarios_imagenes WHERE idUsuario = ? AND idImagen = ?;`,
			[idUsuario, idPhoto]
		);

		if (comentarios.length < 1) {
			const error = new Error(
				'No existe el comentario en esta imagen de tu usuario.'
			);
			error.httpStatus = 404;
			throw error;
		}

		const idComentarios = comentarios.map((comentario) => comentario.id);

		if (idComentarios.includes(Number(idComentario))) {
			await connection.query(
				`UPDATE usuarios_imagenes SET deleted = 1 WHERE id = ?;`,
				[idComentario]
			);
		} else {
			const error = new Error(
				'No existe el comentario que quieres eliminar.'
			);
			error.httpStatus = 404;
			throw error;
		}

		res.send({
			status: 'Ok',
			message: `El comentario ha sido eliminado`,
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteComment;
