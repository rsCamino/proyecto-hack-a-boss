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

		const idComentarios = comentarios.map((comentario) => comentario.id);

		if (idComentarios.includes(Number(idComentario))) {
			await connection.query(
				`UPDATE usuarios_imagenes SET deleted = 1 WHERE id = ?;`,
				[idComentario]
			);
		} else {
			const error = new Error(
				'El comentario que intentas eliminar, no existe en esta imagen.'
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
