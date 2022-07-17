const CW = 300
const CH = 300
const DEFAULTSIZE = 12;
const DEFAULTV = '3';

const canvas = document.createElement('canvas')
const canvas2 = document.createElement('canvas')
const canvas3 = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const ctx2 = canvas2.getContext('2d')
const ctx3 = canvas3.getContext('2d')
canvas3.width = canvas2.width = canvas.width = CW
canvas3.height = canvas2.height = canvas.height = CH

const image = document.getElementById('image')
const text = document.getElementById('text')
const background = document.getElementById('bg')
const sizeInput = document.getElementById('scale')
const colorInput = document.getElementById('color')
const pixelartBox = document.getElementById('pixelartbox')
const params = new URLSearchParams(window.location.search)
import { ccToPaletteIndex, hexToRGBA, ENDESGA, PASTEL, hsvToRgb } from "./palettes.js";


let size = +params.get('size') || +sizeInput.value || DEFAULTSIZE;
if (size < 1 || size > 300) size = DEFAULTSIZE;
sizeInput.value = size;


let pixelart = params.get('pixelart') !== null || pixelartBox.checked;
pixelartBox.checked = pixelart;
ctx2.imageSmoothingEnabled = !pixelart;


let v = params.get('v') || colorInput.value || DEFAULTV;
if (v < 0 || v > 300) v = DEFAULTV;


if (params.get('text') != null) text.value = params.get('text');



const letterToPixel = {
	'0': (cc) => [
		(cc % 2 === 1 && 255) + cc / 2,
		cc % 3 === 2 && 255,
		(cc % 5 === 4 && 255) + cc,
		255,
	],
	'1': (cc) => [
		(cc % 2 === 1 && 200) + cc * 2 - 100,
		(cc % 5 === 4 && 200) + cc * 2 - 100,
		(cc % 3 === 2 && 200) + cc * 2 - 100,
		255,
	],
	'2': (cc) =>
		hexToRGBA(PASTEL[ccToPaletteIndex(cc)]),
	'3': (cc) =>
		hexToRGBA(ENDESGA[ccToPaletteIndex(cc, 1)]),
}
for (let i = 0; i < (64); i++) {
	letterToPixel[i+4] = (cc) =>
		[...hsvToRgb(((ccToPaletteIndex(cc, 2) + i) % 64) / 63, 1, 1), 255]
}
letterToPixel.max = Object.keys(letterToPixel).length - 1
colorInput.max = letterToPixel.max


let lastValidInput = (() => {
	// if we don't have text at start we use this
	const noNewLines = Array.from(text.value).filter((c) => c !== '\n');
	return noNewLines.length ? noNewLines : Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz .')
})()

draw()
text.addEventListener('input', draw)
sizeInput.addEventListener('input', (e) => {
	if (sizeInput.value > 300) sizeInput.value = 300;
	if (sizeInput.value >= 1 && sizeInput.value <= 300) {
		size = +sizeInput.value
		draw()
	}
})
colorInput.addEventListener('input', (e) => {
	if (colorInput.value > letterToPixel.max) colorInput.value = letterToPixel.max;
	if (colorInput.value >= 0 && colorInput.value <= letterToPixel.max) {
		v = +colorInput.value
		draw()
	}
})
pixelartBox.addEventListener('input', () => {
	pixelart = pixelartBox.checked
	ctx2.imageSmoothingEnabled = !pixelart
	draw()
})


function copyLink() {
	const linkParams = new URLSearchParams()
	if (pixelart) linkParams.append('pixelart', '')
	if (size !== DEFAULTSIZE) linkParams.append('size', size)
	if (v !== '0') linkParams.append('v', v)
	linkParams.append('text', text.value)
	const url = window.location.origin + '?' + linkParams
	navigator.clipboard.writeText(url)
	dialog('Link copied to clipboard', 3)
}

function draw() {
	let data = Array.from(text.value).filter((c) => c !== '\n')
	if (!data.length) data = lastValidInput // so when ?text=& our background will change gradually
	else lastValidInput = data

	ctx.clearRect(0, 0, CW, CH)
	ctx2.clearRect(0, 0, CW, CH)

	let w = size;
	const charsNeeded = w * w

	let arr = data.map((s) => s.charCodeAt(0))

	const multiply = Math.ceil(charsNeeded / arr.length)
	arr = Array.from({ length: multiply }, () => arr).flat()

	arr = arr.flatMap((s) => letterToPixel[v](s))

	const pixNeededToFitWidth = w - ((arr.length / 4) % w)
	arr = arr.concat(new Array(pixNeededToFitWidth * 4).fill(0))

	ctx.putImageData(new ImageData(new Uint8ClampedArray(arr), w), 0, 0)
	if (!pixelart) // second pass so borders don't fade
		ctx2.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * (CW / size), CW * (CW / size))
	ctx2.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * (CW / size), CW * (CW / size))
	ctx3.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * (CW / size), CW * (CW / size))
	ctx3.globalAlpha = 0.1
	if (text.value) image.src = canvas2.toDataURL() // first draw will be transparent
	bg.src = canvas3.toDataURL()
}

function dialog(text, duration) {
	let div = document.createElement('div')
	div.innerText = text
	div.classList = 'dialog'
	div.style.animation = `fade-out ${duration}s`
	document.body.appendChild(div)
	setTimeout(() => div.remove(), duration * 1000)
}