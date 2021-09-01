const getDB = require('../../ddbb/db');

const { saveAndCropPhoto, formatDate } = require('../../helpers');

const uploadPhotoUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;
		const { description, crop } = req.body;

		console.log(req.files);

		const cropProportions = JSON.parse(crop);

		if (req.authEntity.idUsuario !== Number(idUsuario)) {
			const error = new Error(
				'No tienes permisos para subir fotos en el perfil de este usuario'
			);
			error.httpStatus = 403;
			throw error;
		}

		let photoName;
		let result;

		const now = formatDate(new Date());

		if (req.files && req.files.photo) {
			photoName = await saveAndCropPhoto({
				image: req.files.photo,
				...cropProportions,
			});

			[result] = await connection.query(
				`INSERT INTO imagenes (imagen, descripcion, idUsuario, fechasubida) VALUES(?,?,?,?);`,
				[photoName, description, idUsuario, now]
			);
		} else {
			throw new Error('No hay ninguna foto');
		}

		const [image] = await connection.query(
			'SELECT * FROM imagenes WHERE id = ?',
			[result.insertId]
		);

		res.send({
			status: 'ok',
			data: image[0],
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = uploadPhotoUsuario;
