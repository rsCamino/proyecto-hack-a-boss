const getDB = require('../../ddbb/db');
const { savePhoto, deletePhoto, formatDate } = require('../../helpers');

const editEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimiento } = req.params;
		const { name, email, description, direction } = req.body;

		if (req.entityAuth.idEstablecimiento !== Number(idEstablecimiento)) {
			const error = new Error(
				'No tienes permisos para editar este establecimiento'
			);
			error.httpStatus = 403;
			throw error;
		}

		if (!name && !email && !direction && !(req.files && req.files.avatar)) {
			const error = new Error('Faltan campos');
			error.httpStatus = 400;
			throw error;
		}

		const [establecimiento] = await connection.query(
			`SELECT email, avatar, nombre, descripcion, direccion FROM establecimientos WHERE id = ?`,
			[idEstablecimiento]
		);

		const now = new Date();

		if (req.files && req.files.avatar) {
			if (establecimiento[0].avatar) {
				await deletePhoto(establecimiento[0].avatar);
			}

			const avatarName = await savePhoto(req.files.avatar);

			await connection.query(
				`UPDATE establecimientos SET avatar = ?, modificadoEn = ? WHERE id = ?;`,
				[avatarName, formatDate(now), idEstablecimiento]
			);
		}

		if (email && email !== establecimiento[0].email) {
			const [existingEmail] = await connection.query(
				`SELECT id FROM establecimientos WHERE email = ?;`,
				[email]
			);

			if (existingEmail.length > 0) {
				const error = new Error(
					'Ya existe un establecimiento con el email proporcionado en la base de datos'
				);
				error.httpStatus = 409;
				throw error;
			}

			await connection.query(
				`UPDATE establecimientos SET email = ?, modificadoEn = ? WHERE id = ?`,
				[email, formatDate(now), idEstablecimiento]
			);
		}

		if (name && establecimiento[0].nombre !== name) {
			await connection.query(
				`UPDATE establecimientos SET nombre = ?, modificadoEn = ? WHERE id = ?`,
				[name, formatDate(now), idEstablecimiento]
			);
		}

		if (direction && establecimiento[0].direccion !== direction) {
			await connection.query(
				`UPDATE establecimientos SET direccion = ?, modificadoEn = ? WHERE id = ?`,
				[direction, formatDate(now), idEstablecimiento]
			);
		}

		if (description && establecimiento[0].descripcion !== description) {
			await connection.query(
				`UPDATE establecimientos SET direccion = ?, modificadoEn = ? WHERE id = ?`,
				[description, formatDate(now), idEstablecimiento]
			);
		}
		res.send({
			status: 'Ok',
			message: 'Datos de establecimiento actualizados',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = editEstablecimiento;
