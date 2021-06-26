const getDB = require('../ddbb/db');

const establecimientoExist = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { idEstablecimiento } = req.params;

		const [establecimiento] = await connection.query(
			`SELECT id FROM establecimientos WHERE id = ? AND deleted = 0;`,
			[idEstablecimiento]
		);

		if (establecimiento.length < 1) {
			const error = new Error(
				'El establecimiento que usted ha ingresado no existe.'
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

module.exports = establecimientoExist;
