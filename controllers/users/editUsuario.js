const getDB = require('../../ddbb/db');
const { savePhoto, deletePhoto, formatDate } = require('../../helpers');

const editUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		const { name, nickname, email } = req.body;

		if (req.authEntity.idUsuario !== Number(idUsuario)) {
			const error = new Error(
				'No tienes permisos para editar este usuario'
			);
			error.httpStatus = 403;
			throw error;
		}

		if (
			!name &&
			!nickname &&
			!email &&
			!(req.files && req.files.fotoperfil)
		) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [usuario] = await connection.query(
			`SELECT email, nombre, fechaCreacion, nickname, fotoperfil FROM usuarios WHERE id = ?`,
			[idUsuario]
		);

		const now = new Date();

		if (req.files && req.files.fotoperfil) {
			if (usuario[0].fotoperfil) {
				await deletePhoto(usuario[0].fotoperfil);
			}

			const fotoperfilName = await savePhoto(req.files.fotoperfil);

			await connection.query(
				`UPDATE usuarios SET fotoperfil = ?, modificadoEn = ? WHERE id = ?;`,
				[fotoperfilName, formatDate(now), idUsuario]
			);
		}

		if (email && email !== usuario[0].email) {
			const [existingEmail] = await connection.query(
				`SELECT id FROM usuarios WHERE email = ?;`,
				[email]
			);

			if (existingEmail.length > 0) {
				const error = new Error(
					'Ya existe un usuario con el email proporcionado en la base de datos'
				);
				error.httpStatus = 409;
				throw error;
			}

			await connection.query(
				`UPDATE usuarios SET email = ?, modificadoEn = ? WHERE id = ?;`,
				[email, formatDate(now), idUsuario]
			);
		}
		if (nickname && nickname !== usuario[0].nickname) {
			const [existingNickname] = await connection.query(
				`SELECT id FROM usuarios WHERE nickname = ?;`,
				[nickname]
			);

			if (existingNickname.length > 0) {
				const error = new Error(
					'Ya existe un usuario con el nickname proporcionado en la base de datos'
				);
				error.httpStatus = 409;
				throw error;
			}

			await connection.query(
				`UPDATE usuarios SET nickname = ?, modificadoEn = ? WHERE id = ?`,
				[nickname, formatDate(now), idUsuario]
			);
		}

		if (name && usuario[0].name !== name) {
			await connection.query(
				`UPDATE usuarios SET name = ?, modificadoEn = ? WHERE id = ?`,
				[name, formatDate(now), idUsuario]
			);
		}

		res.send({
			status: 'ok',
			message: 'Datos de usuario actualizados',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = editUsuario;
