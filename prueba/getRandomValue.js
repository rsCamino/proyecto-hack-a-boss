imgs = {
	img1: 'asd',
	img2: 'asd222',
};

function getRandomImg(obj) {
	const keys = Object.keys(obj);
	return obj[keys[(keys.length * Math.random()) << 0]];
}

console.log(getRandomImg(imgs));
