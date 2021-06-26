const getDB = require('../../ddbb/db');
const { formatDate } = require('../../helpers');

const addNewComment = async (req, res, next) => {
	let connection;
	try {
		connection = await getDB();

		const { comentario, idImagen } = req.body;
		const { idUsuario } = req.authEntity;
		const now = formatDate(new Date());
		const [texto] = await connection.query(
			`
            INSERT INTO usuarios_imagenes ( comentario, idImagen, idUsuario)
            VALUES (?,?,?);
            `,
			[comentario, Number(idImagen), idUsuario]
		);
		const { insertID: idcomment } = addNewComment;

		res.send({
			status: 'ok',
			data: {
				id: idcomment,
				idUsuario,
				comentario,
				idImagen,
				creadoEn: now,
				likes: 0,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release;
	}
};
module.exports = addNewComment;
