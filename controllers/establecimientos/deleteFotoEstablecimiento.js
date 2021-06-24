const getDB = require('../../ddbb/db');

const { deletePhoto } = require('../../helpers');

const deleteFotoEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimiento, idPhoto } = req.params;

		const [photo] = await connection.query(
			`SELECT imagen FROM imagenes WHERE idEstablecimiento = ?;`,
			[idEstablecimiento]
		);

		if (photo.length < 1) {
			const error = new Error('La foto no existe');
			error.httpStatus = 404;
			throw error;
		}

		// Borramos la foto del servidor.
		await deletePhoto(photo[idPhoto].name);

		// Borramos la foto de la base de datos.
		await connection.query(
			`DELETE imagen FROM imagenes WHERE imagen = ?, idEstablecimiento = ?;`,
			[photo[idPhoto].name, idEstablecimiento]
		);

		res.send({
			status: 'Ok',
			message: 'Foto eliminada',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteFotoEstablecimiento;
