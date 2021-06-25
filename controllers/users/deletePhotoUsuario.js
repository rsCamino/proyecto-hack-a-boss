const getDB = require('../../ddbb/db');

const { deletePhoto } = require('../../helpers');

const deletePhotoUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario, idPhoto } = req.params;

		if (
			req.authEntity.idUsuario !== Number(idUsuario) &&
			req.authEntity.role !== 'admin'
		) {
			const error = new Error(
				'No tienes permisos para eliminar fotos de este usuario'
			);
			error.httpStatus = 401;
			throw error;
		}

		const [photo] = await connection.query(
			`SELECT imagen FROM imagenes WHERE idUsuario = ?;`,
			[idUsuario]
		);

		if (photo.length < 1) {
			const error = new Error('La foto no existe');
			error.httpStatus = 404;
			throw error;
		}

		console.log(photo);
		const uuid = Number(idPhoto);

		await deletePhoto(photo[uuid - 1].imagen);

		await connection.query(`DELETE FROM imagenes WHERE imagen = ?;`, [
			photo[uuid - 1].imagen,
		]);

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

module.exports = deletePhotoUsuario;
