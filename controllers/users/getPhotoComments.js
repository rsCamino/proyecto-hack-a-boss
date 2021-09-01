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
				`SELECT id, idImagen, fechaCreacion, comentario,likes, idUsuario
        FROM usuarios_imagenes
        WHERE deleted != 1  AND idImagen = ?
        ORDER BY ${orderBy} ${orderDirection};`,
				[idImagen]
			);

			//ELiminamos comentario IS NOT NULL de abajo y arriba lineas 43 y 33
		} else {
			[photoComments] = await connection.query(
				`SELECT id, idImagen, fechaCreacion, comentario, likes, idUsuario
        FROM usuarios_imagenes
        WHERE deleted != 1 
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
