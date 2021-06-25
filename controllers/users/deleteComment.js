const getDB = require('../../ddbb/db');
const deleteComment = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario, idPhoto, idComentario } = req.params;
		console.log(req.params);
		const [comentarios] = await connection.query(
			`SELECT id FROM usuarios_imagenes WHERE idUsuario = ? AND idImagen = ?;`,
			[idUsuario, idPhoto]
		);
		console.log(idComentario);

		await connection.query(`DELETE FROM usuarios_imagenes WHERE id = ?;`, [
			idComentario,
		]);

		res.send({
			status: 'ok',
			message: `La entrada ha sido eliminada`,
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteComment;
