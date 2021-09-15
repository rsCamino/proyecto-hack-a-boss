const getDB = require('../../ddbb/db');

const { savePhoto } = require('../../helpers');

const addPhotoUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		console.log(idUsuario);
		if (req.authEntity.idUsuario !== Number(idUsuario)) {
			const error = new Error(
				'No tienes permisos para subir fotos en el perfil de este usuario'
			);
			error.httpStatus = 403;
			throw error;
		}

		let photoName;

		if (req.files && req.files.photo) {
			photoName = await savePhoto(req.files.photo);

			await connection.query(
				`UPDATE usuarios SET fotoperfil = ? WHERE id = ?;`,
				[photoName, idUsuario]
			);
		}

		const [user] = await connection.query(
			'SELECT id, nombre, fotoperfil, email, fechaCreacion FROM usuarios WHERE id = ?',
			[idUsuario]
		);

		res.send({
			status: 'ok',
			data: user[0],
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = addPhotoUsuario;
