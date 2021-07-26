const getDB = require('../ddbb/db');

const photoExist = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { idPhoto } = req.params;

		const [photo] = await connection.query(
			`SELECT id FROM imagenes WHERE id = ? AND deleted = 0;`,
			[idPhoto]
		);

		if (photo.length < 1) {
			const error = new Error('La foto que usted ha elegido no existe.');
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

module.exports = photoExist;
