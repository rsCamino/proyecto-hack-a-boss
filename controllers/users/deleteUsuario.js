const getDB = require('../../ddbb/db');

const {
	deletePhoto,
	generateRandomString,
	formatDate,
} = require('../../helpers');

const deleteUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		if (
			req.authEntity.idUsuario !== Number(idUsuario) &&
			req.authEntity.role !== 'admin'
		) {
			const error = new Error(
				'No tienes permisos para eliminar este usuario'
			);
			error.httpStatus = 401;
			throw error;
		}

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE id = ?;`,
			[idUsuario]
		);

		if (establecimiento[0].fotoperfil) {
			await deletePhoto(establecimiento[0].fotoperfil);
		}

		// Hacemos un update en la tabla de usuarios.
		await connection.query(
			`
                UPDATE usuarios
                SET contraseña = ?, nombre = "[deleted]", fotoperfil = NULL, activo = 0, deleted = 1, modificadoEn = ? 
                WHERE id = ?;
            `,
			[generateRandomString(40), formatDate(new Date()), idUsuario]
		);

		res.send({
			status: 'ok',
			message: 'Usuario eliminado',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteUsuario;
