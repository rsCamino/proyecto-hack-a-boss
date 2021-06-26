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
			`SELECT id, imagen FROM imagenes WHERE id = ?;`,
			[idPhoto]
		);

		if (photo.length < 1) {
			const error = new Error('La foto no existe');
			error.httpStatus = 404;
			throw error;
		}

		await deletePhoto(photo[0].imagen);

		await connection.query(`DELETE FROM imagenes WHERE id = ?;`, [idPhoto]);
		await connection.query(
			`UPDATE usuarios_imagenes SET deleted = 1 WHERE idImagen = ?;`[
				idPhoto
			]
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

module.exports = deletePhotoUsuario;
