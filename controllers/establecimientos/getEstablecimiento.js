const getDB = require('../../ddbb/db');

const getEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEstablecimiento } = req.params;

		const [establecimiento] = await connection.query(
			`SELECT id, nombre, direccion FROM establecimientos WHERE id = ?;`,
			[idEstablecimiento]
		);
		console.log(establecimiento);

		const establecimientoInfo = {
			name: establecimiento[0].nombre,
			avatar: establecimiento[0].direccion,
		};

		res.send({
			status: 'ok',
			data: establecimientoInfo,
		});
	} catch (error) {
		console.log(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getEstablecimiento;
