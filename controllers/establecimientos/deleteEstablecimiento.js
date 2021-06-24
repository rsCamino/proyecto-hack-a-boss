const getDB = require('../../ddbb/db');

const {
	deletePhoto,
	generateRandomString,
	formatDate,
} = require('../../helpers');

const deleteEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimiento } = req.params;

		if (
			req.authEntity.idEstablecimiento !== Number(idEstablecimiento) &&
			req.authEntity.role !== 'admin'
		) {
			const error = new Error(
				'No tienes permisos para eliminar este establecimiento'
			);
			error.httpStatus = 401;
			throw error;
		}

		const [establecimiento] = await connection.query(
			`SELECT avatar FROM establecimientos WHERE id = ?;`,
			[idEstablecimiento]
		);

		if (establecimiento[0].avatar) {
			await deletePhoto(establecimiento[0].avatar);
		}

		// Hacemos un update en la tabla de usuarios.
		await connection.query(
			`
                UPDATE establecimientos
                SET contraseña = ?, nombre = "[deleted]", avatar = NULL, activo = 0, deleted = 1, modificadoEn = ? 
                WHERE id = ?;
            `,
			[
				generateRandomString(40),
				formatDate(new Date()),
				idEstablecimiento,
			]
		);

		res.send({
			status: 'ok',
			message: 'Establecimiento eliminado',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteEstablecimiento;
