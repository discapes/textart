const CW = 300
const CH = 300

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
const scaleInput = document.getElementById('scale')
const pixelartBox = document.getElementById('pixelartbox')
const params = new URLSearchParams(window.location.search)

let scale = 30
let pixelart = params.get('pixelart') != null
if (pixelart || pixelartBox.checked) {
	pixelartBox.checked = true
	ctx2.imageSmoothingEnabled = false
}
if (params.get('text') != null) text.value = params.get('text')
if (params.get('scale') != null) {
	num = +params.get('scale')
	scaleInput.value = num
	if (!(isNaN(num) || num < 1 || num > 100)) scale = num
} else if (scaleInput.value != 30) {
	num = +scaleInput.value
	if (!(isNaN(num) || num < 1 || num > 100)) scale = num
}

draw()
text.addEventListener('input', draw)
scaleInput.addEventListener('input', (e) => {
	const num = +e.target.value
	if (isNaN(num) || num < 1 || num > 100) return
	scale = num
	draw()
})
pixelartBox.addEventListener('input', () => {
	pixelart = pixelartBox.checked
	ctx2.imageSmoothingEnabled = !pixelart
	draw()
})

function copyLink() {
	const linkParams = new URLSearchParams()
	if (pixelart) linkParams.append('pixelart', '')
	if (scale !== 30) linkParams.append('scale', scale)
	linkParams.append('text', text.value)
	const url = window.location.origin + '?' + linkParams
	navigator.clipboard.writeText(url)
	dialog('Link copied to clipboard', 3)
}

function draw() {
	if (!text.value) return
	ctx.clearRect(0, 0, CW, CH)
	ctx2.clearRect(0, 0, CW, CH)

	let w = Math.ceil(CW / scale)
	const charsNeeded = w * w

	let arr = Array.from(text.value)
		.filter((c) => c !== '\n')
		.map((s) => s.charCodeAt(0))

	const multiply = Math.ceil(charsNeeded / arr.length)
	arr = Array.from({ length: multiply }, () => arr).flat()

	arr = arr.flatMap((s) => letterToPixel(s))

	const pixNeededToFitWidth = w - ((arr.length / 4) % w)
	arr = arr.concat(new Array(pixNeededToFitWidth * 4).fill(0))

	ctx.putImageData(new ImageData(new Uint8ClampedArray(arr), w), 0, 0)
	ctx2.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * scale, CH * scale)
	ctx3.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * scale, CH * scale)
	ctx3.globalAlpha = 0.1
	image.src = canvas2.toDataURL()
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

function letterToPixel(cc) {
	return [
		(cc % 2 === 1 && 200) + cc*2-100,
		(cc % 5 === 4 && 200) + cc*2-100,
		(cc % 3 === 2 && 200) + cc*2-100,
		255,
	]
}
