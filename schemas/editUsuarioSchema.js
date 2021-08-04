const Joi = require('joi');

const editUsuarioSchema = Joi.object()
	.keys({
		name: Joi.string()
			.min(3)
			.max(16)
			.error((errors) => {
				switch (errors[0].code) {
					case 'any.min':
						return new Error(
							'Tu nombre debe contener al menos 3 carácteres.'
						);
					default:
						return new Error(
							'Tu nombre no debe contener más de 16 carácteres.'
						);
				}
			}),
		nickname: Joi.string()
			.min(1)
			.max(20)
			.error((errors) => {
				switch (errors[0].code) {
					case 'any.min':
						return new Error(
							'Tu apodo debe contener al menos 1 carácter.'
						);
					default:
						return new Error(
							'Tu apodo no debe contener más de 20 carácteres.'
						);
				}
			}),
		email: Joi.string()
			.email()
			.error((errors) => {
				if (errors[0].code) {
					return new Error('El email no es válido');
				}
			}),
	})
	.min(1)
	.error((errors) => {
		return new Error('Se requiere al menos un campo para editar.');
	});

module.exports = editUsuarioSchema;
