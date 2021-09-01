const getDB = require('../../ddbb/db');
const { formatDate } = require('../../helpers');

const likePhoto = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { idUsuario, idPhoto } = req.params;

		if (
			!req.authEntity.idUsuario ||
			req.authEntity.idUsuario !== Number(idUsuario)
		) {
			const error = new Error('No puedes dar like como otro usuario.');
			error.httpStatus = 403;
			throw error;
		}

		const [photo] = await connection.query(
			`SELECT id FROM imagenes WHERE id = ?;`,
			[idPhoto]
		);

		if (photo.length < 1) {
			const error = new Error('La foto que quieres dar like no existe.');
			error.httpStatus = 404;
			throw error;
		}

		const [dadoLike] = await connection.query(
			`SELECT id, likes FROM usuarios_imagenes WHERE idUsuario = ? AND idImagen = ? AND comentario IS NULL ;`,
			[idUsuario, idPhoto]
		);

		if (dadoLike[0] !== undefined && dadoLike[0].likes === 1) {
			await connection.query(
				`UPDATE usuarios_imagenes SET likes = 0 WHERE idUsuario = ? AND idImagen = ? AND comentario IS NULL;`,
				[idUsuario, idPhoto]
			);

			await connection.query(
				`UPDATE imagenes SET likes = likes - 1 WHERE idUsuario = ? AND id = ?;`,
				[idUsuario, idPhoto]
			);

			[likes] = await connection.query(
				`SELECT sum(likes = 1) as totalLikes FROM usuarios_imagenes WHERE idImagen = ?;`,
				[idPhoto]
			);

			res.send({
				status: 'Has dado dislike',
				data: {
					idImage: idPhoto,
					user: idUsuario,
					like: false,
					totalLikes: likes[0].totalLikes,
				},
			});
		} else if (dadoLike[0] !== undefined && dadoLike[0].likes === 0) {
			await connection.query(
				`UPDATE usuarios_imagenes SET likes = 1 WHERE idUsuario = ? AND idImagen = ? AND comentario IS NULL;`,
				[idUsuario, idPhoto]
			);

			await connection.query(
				`UPDATE imagenes SET likes = likes + 1 WHERE idUsuario = ? AND id = ?;`,
				[idUsuario, idPhoto]
			);

			[likes] = await connection.query(
				`SELECT sum(likes = 1) as totalLikes FROM usuarios_imagenes WHERE idImagen = ?;`,
				[idPhoto]
			);

			res.send({
				status: 'Has dado like',
				data: {
					idImage: idPhoto,
					user: idUsuario,
					like: true,
					totalLikes: likes[0].totalLikes,
				},
			});
		} else if (!dadoLike[0]) {
			const now = formatDate(new Date());

			await connection.query(
				`INSERT INTO usuarios_imagenes (likes, idImagen, idUsuario, fechaCreacion) VALUES(?, ?, ?, ?);`,
				[true, idPhoto, idUsuario, now]
			);

			await connection.query(
				`UPDATE imagenes SET likes = likes + 1 WHERE idUsuario = ? AND id = ?;`,
				[idUsuario, idPhoto]
			);

			[likes] = await connection.query(
				`SELECT sum(likes = 1) as totalLikes FROM usuarios_imagenes WHERE idImagen = ?;`,
				[idPhoto]
			);

			res.send({
				status: 'Has dado like por primera vez, Ok',
				data: {
					idImage: idPhoto,
					user: idUsuario,
					like: true,
					totalLikes: likes[0].totalLikes,
				},
			});
		}
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release;
	}
};
module.exports = likePhoto;
