const crypto = require('crypto');
const path = require('path');
const uuid = require('uuid');
const { ensureDir, unlink } = require('fs-extra');
const sgMail = require('@sendgrid/mail');
const sharp = require('sharp');
const { format } = require('date-fns');
const { UPLOADS_DIRECTORY } = process.env;
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateRandomString(length) {
	return crypto.randomBytes(length).toString('hex');
}

function formatDate(date) {
	return format(date, 'yyyy-MM-dd HH:mm:ss');
}

async function savePhoto(image) {
	await ensureDir(uploadsDir);

	const sharpImage = sharp(image.data);
	const imageInfo = await sharpImage.metadata();
	const IMAGE_MAX_WIDTH = 1000;

	if (imageInfo.width > IMAGE_MAX_WIDTH) {
		sharpImage.resize(IMAGE_MAX_WIDTH);
	}

	const savedImageName = `${uuid.v4()}.jpg`;
	const imagePath = path.join(uploadsDir, savedImageName);

	await sharpImage.toFile(imagePath);
	return savedImageName;
}

async function saveAndCropPhoto({ image, x, y, width, height }) {
	await ensureDir(uploadsDir);
	const IMAGE_MAX_WIDTH = 1000;
	const sharpImage = sharp(image.data);
	const imageInfo = await sharpImage.metadata();

	const originalPhotoWidth = imageInfo.width;
	const originalPhotoHeight = imageInfo.height;

	sharpImage.extract({
		left: parseInt((originalPhotoWidth * x) / 100),
		top: parseInt((originalPhotoHeight * y) / 100),
		width: parseInt((originalPhotoWidth * width) / 100),
		height: parseInt((originalPhotoHeight * height) / 100),
	});

	const croppedImageInfo = await sharpImage.metadata();

	if (croppedImageInfo.width > IMAGE_MAX_WIDTH) {
		sharpImage.resize(IMAGE_MAX_WIDTH);
	}

	const savedImageName = `${uuid.v4()}.jpg`;
	const imagePath = path.join(uploadsDir, savedImageName);

	await sharpImage.toFile(imagePath);
	return savedImageName;
}

async function deletePhoto(photoName) {
	const photoPath = path.join(uploadsDir, photoName);
	await unlink(photoPath);
}

async function sendMail({ to, subject, body }) {
	try {
		const msg = {
			to,
			from: process.env.SENDGRID_FROM,
			subject,
			text: body,
			html: `
				<div>
					<h1>${subject}</h1>
					<p>${body}</p>
				</div>
			`,
		};
		await sgMail.send(msg);
	} catch (error) {
		throw new Error('Error enviando email');
	}
}

async function validate(schema, data) {
	try {
		await schema.validateAsync(data);
	} catch (error) {
		error.httpStatus = 400;
		throw error;
	}
}

module.exports = {
	generateRandomString,
	formatDate,
	deletePhoto,
	sendMail,
	savePhoto,
	saveAndCropPhoto,
	validate,
};
