const getDB = require('../../ddbb/db');

const { deletePhoto } = require('../../helpers');

const deleteFotoEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimientos, idPhoto } = req.params;

		const [photo] = await connection.query(
			`SELECT name FROM imagenes WHERE id = ? AND idImagenes = ?;`,
			[idPhoto, idEstablecimientos]
		);

		if (photo.length < 1) {
			const error = new Error('La foto no existe');
			error.httpStatus = 404;
			throw error;
		}

		// Borramos la foto del servidor.
		await deletePhoto(photo[0].name);

		// Borramos la foto de la base de datos.
		await connection.query(
			`DELETE FROM imagenes WHERE id = ? AND idImagenes = ?;`,
			[idPhoto, idEstablecimientos]
		);

		res.send({
			status: 'ok',
			message: 'Foto eliminada',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteFotoEstablecimiento;
