const getDB = require('../../ddbb/db');
const { formatDate } = require('../../helpers');

const addNewComment = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { comentario } = req.body;
		const { idUsuario, idImagen } = req.params;

		if (
			!req.authEntity.idUsuario ||
			req.authEntity.idUsuario !== Number(idUsuario)
		) {
			const error = new Error('No puedes comentar como otro usuario.');
			error.httpStatus = 403;
			throw error;
		}

		if (!comentario) {
			const error = new Error(
				'No puedes dejar el campo vacio, por favor escribe algo'
			);
			error.httpStatus = 401;
			throw error;
		}

		const [photo] = await connection.query(
			`SELECT id FROM imagenes WHERE id = ?;`,
			[idImagen]
		);

		console.log(photo);

		if (photo.length < 1) {
			const error = new Error('La foto que quieres comentar no existe.');
			error.httpStatus = 404;
			throw error;
		}

		const now = formatDate(new Date());

		await connection.query(
			`INSERT INTO usuarios_imagenes ( comentario, idImagen, idUsuario, fechaCreacion) VALUES (?, ?, ?, ?);`,
			[comentario, idImagen, idUsuario, now]
		);

		const [idComment] = await connection.query(
			`SELECT id FROM usuarios_imagenes WHERE idImagen = ? AND idUsuario = ?;`,
			[idImagen, idUsuario]
		);

		res.send({
			status: 'ok',
			data: {
				id: idComment[idComment.length - 1].id,
				idImage: idImagen,
				user: idUsuario,
				comment: comentario,
				createdAt: now,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release;
	}
};
module.exports = addNewComment;
