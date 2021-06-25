const getDB = require('../../ddbb/db');

const { savePhoto, formatDate } = require('../../helpers');

const addPhotoUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;
		const { description } = req.body;
		console.log(idUsuario);
		if (req.authEntity.idUsuario !== Number(idUsuario)) {
			const error = new Error(
				'No tienes permisos para subir fotos en el perfil de este usuario'
			);
			error.httpStatus = 403;
			throw error;
		}

		let photoName;

		const now = formatDate(new Date());

		if (req.files && req.files.photo) {
			photoName = await savePhoto(req.files.photo);

			await connection.query(
				`INSERT INTO imagenes (imagen, descripcion, idUsuario, fechasubida) VALUES (?, ?, ?, ?);`,
				[photoName, description, idUsuario, now]
			);
		}

		res.send({
			status: 'ok',
			data: {
				foto: photoName,
				descripcion: description,
				fechaDeSubida: now,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = addPhotoUsuario;
