const getDB = require('../../ddbb/db');

const { savePhoto, formatDate } = require('../../helpers');

const addPhotoEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimiento } = req.params;
		const { description } = req.body;

		if (req.authEntity.idEstablecimiento !== Number(idEstablecimiento)) {
			const error = new Error(
				'No tienes permisos para subir fotos en el perfil de este establecimiento'
			);
			error.httpStatus = 403;
			throw error;
		}

		let photoName;

		const now = formatDate(new Date());

		if (req.files && req.files.photo) {
			// Guardamos la foto en el servidor y obtenemos el idEntrynombre con el que la guardamos.
			photoName = await savePhoto(req.files.photo);
			// Guardamos la foto.idUser
			await connection.query(
				`INSERT INTO imagenes (imagen, descripcion, idEstablecimiento, fechasubida) VALUES (?, ?, ?, ?);`,
				[photoName, description, idEstablecimiento, now]
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

module.exports = addPhotoEstablecimiento;
