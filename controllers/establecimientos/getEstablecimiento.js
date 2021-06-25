const getDB = require('../../ddbb/db');

const getEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimiento } = req.params;

		const [establecimiento] = await connection.query(
			`SELECT id, nombre, avatar, direccion, email, descripcion, fechaCreacion, modificadoEn FROM establecimientos WHERE id = ?;`,
			[idEstablecimiento]
		);

		if (!establecimiento[0].descripcion) {
			establecimiento[0].descripcion = 'No hay descripcion.';
		}
		if (!establecimiento[0].modificadoEn) {
			establecimiento[0].modificadoEn =
				'Este establecimiento nunca se ha editado';
		}

		const establecimientoInfo = {
			name: establecimiento[0].nombre,
			avatar: establecimiento[0].avatar,
			description: establecimiento[0].descripcion,
			direction: establecimiento.direccion,
		};

		if (req.entityAuth.idEstablecimiento === Number(idEstablecimiento)) {
			establecimientoInfo.email = establecimiento[0].email;
			establecimientoInfo.modifiedAt = establecimiento[0].modificadoEn;
			establecimientoInfo.createdAt = establecimiento[0].fechaCreacion;
		}

		res.send({
			status: 'ok',
			data: establecimientoInfo,
		});
	} catch (error) {
		cnext(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getEstablecimiento;
