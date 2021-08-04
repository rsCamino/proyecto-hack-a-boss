const getDB = require('../../ddbb/db');

const getPhotoComments = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idImagen, order, direction } = req.query;

		const validOrderFields = [
			'idUsuario',
			'fechaCreacion',
			'idImagen',
			'id',
		];
		const validOrderDirection = ['DESC', 'ASC'];

		const orderBy = validOrderFields.includes(order)
			? order
			: 'fechaCreacion';

		const orderDirection = validOrderDirection.includes(direction)
			? direction
			: 'DESC';

		let photoComments;

		if (idImagen) {
			[photoComments] = await connection.query(
				`SELECT id, idImagen, fechaCreacion, comentario, idUsuario
        FROM usuarios_imagenes
        WHERE deleted != 1 AND comentario IS NOT NULL AND idImagen = ?
        ORDER BY ${orderBy} ${orderDirection};`,
				[idImagen]
			);
		} else {
			[photoComments] = await connection.query(
				`SELECT id, idImagen, fechaCreacion, comentario, idUsuario
        FROM usuarios_imagenes
        WHERE deleted != 1 AND comentario IS NOT NULL
        ORDER BY ${orderBy} ${orderDirection};`
			);
		}

		res.send({
			status: 'Ok',
			data: photoComments,
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getPhotoComments;
