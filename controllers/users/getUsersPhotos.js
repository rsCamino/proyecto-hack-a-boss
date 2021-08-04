const getDB = require('../../ddbb/db');
const { PUBLIC_HOST } = process.env;

const getUsersPhotos = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { order, direction } = req.query;

		const validOrderFields = ['idUsuario', 'date', 'likes', 'id'];
		const validOrderDirection = ['DESC', 'ASC'];

		const orderBy = validOrderFields.includes(order) ? order : 'likes';

		const orderDirection = validOrderDirection.includes(direction)
			? direction
			: 'DESC';

		const [photoInfo] = await connection.query(
			`SELECT id, imagen, fechasubida, descripcion, likes, idUsuario
      FROM imagenes
      WHERE deleted != 1 
      ORDER BY ${orderBy} ${orderDirection};`
		);

		for (let i = 0; i < photoInfo.length; i++) {
			photoInfo[i].url = `${PUBLIC_HOST}/uploads/${photoInfo[i].imagen}`;
		}

		res.send({
			status: 'Ok',
			data: photoInfo,
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getUsersPhotos;
