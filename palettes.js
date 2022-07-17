export function hexToRGBA(hex) {
	const r = parseInt(hex.slice(1, 1 + 2), 16)
	const g = parseInt(hex.slice(3, 3 + 2), 16)
	const b = parseInt(hex.slice(5, 5 + 2), 16)
	return [r, g, b, 255];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export function hsvToRgb(h, s, v) {
	let r, g, b;

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function ccToPaletteIndex(cc, alternative) {
	if (alternative === 1) {
		if (cc == 32) // space
			return 1;
		if (cc == 46) // dot
			return 0;
		if (cc >= 48 && cc < 58) // 0-9
			return cc - 48 + 2;
		if (cc >= 65 && cc < 91)
			return cc - 65 + 2 + 10 // A-Z
		if (cc >= 97 && cc < 123)
			return cc - 97 + 2 + 10 + 26 // a-z
		return cc % 64
	} else if (alternative === 2) {
		if (cc >= 65 && cc < 91)
			return cc - 65 // A-Z
		if (cc >= 48 && cc < 58) // 0-9
			return cc - 48 + 26;
		if (cc >= 97 && cc < 123)
			return cc - 97 + 26 + 10 // a-z
		if (cc == 32) // space
			return 62;
		if (cc == 46) // dot
			return 63;
		return cc % 64
	}
	else {
		if (cc >= 48 && cc < 58) // 0-9
			return cc - 48;
		if (cc >= 65 && cc < 91)
			return cc - 65 + 10 // A-Z
		if (cc >= 97 && cc < 123)
			return cc - 97 + 10 + 26 // a-z
		if (cc == 32) // space
			return 62;
		if (cc == 46) // dot
			return 63;
		return cc % 64
	}
}

export const ENDESGA = [
	"#ff0040",
	"#131313",
	"#1b1b1b",
	"#272727",
	"#3d3d3d",
	"#5d5d5d",
	"#858585",
	"#b4b4b4",
	"#ffffff",
	"#c7cfdd",
	"#92a1b9",
	"#657392",
	"#424c6e",
	"#2a2f4e",
	"#1a1932",
	"#0e071b",
	"#1c121c",
	"#391f21",
	"#5d2c28",
	"#8a4836",
	"#bf6f4a",
	"#e69c69",
	"#f6ca9f",
	"#f9e6cf",
	"#edab50",
	"#e07438",
	"#c64524",
	"#8e251d",
	"#ff5000",
	"#ed7614",
	"#ffa214",
	"#ffc825",
	"#ffeb57",
	"#d3fc7e",
	"#99e65f",
	"#5ac54f",
	"#33984b",
	"#1e6f50",
	"#134c4c",
	"#0c2e44",
	"#00396d",
	"#0069aa",
	"#0098dc",
	"#00cdf9",
	"#0cf1ff",
	"#94fdff",
	"#fdd2ed",
	"#f389f5",
	"#db3ffd",
	"#7a09fa",
	"#3003d9",
	"#0c0293",
	"#03193f",
	"#3b1443",
	"#622461",
	"#93388f",
	"#ca52c9",
	"#c85086",
	"#f68187",
	"#f5555d",
	"#ea323c",
	"#c42430",
	"#891e2b",
	"#571c27",
]

export const PASTEL = [
	"#998276",
	"#c4c484",
	"#abd883",
	"#a2f2bd",
	"#b88488",
	"#d1b182",
	"#d4eb91",
	"#ccfcc4",
	"#907699",
	"#c484a4",
	"#ea8c79",
	"#f2e5a2",
	"#9a84b8",
	"#d182ca",
	"#eb91a8",
	"#ffddc4",
	"#768d99",
	"#8484c4",
	"#c479ea",
	"#f2a2d7",
	"#84b8b4",
	"#82a2d1",
	"#a791eb",
	"#fbc8f5",
	"#7c957a",
	"#84c4a4",
	"#79d7ea",
	"#a2aff2",
	"#a2b884",
	"#82d189",
	"#91ebd4",
	"#c9e5fa",
	"#b8a784",
	"#b9ca89",
	"#91eb91",
	"#c9fce9",
	"#957686",
	"#c49484",
	"#eade7a",
	"#c3f2a2",
	"#b884af",
	"#d1828f",
	"#ebbd91",
	"#f7f9c4",
	"#797699",
	"#b484c4",
	"#ea79bb",
	"#f2a9a2",
	"#8495b8",
	"#9d82d1",
	"#ea91eb",
	"#ffc8d4",
	"#76958d",
	"#84b4c4",
	"#7982ea",
	"#d1a2f2",
	"#84b88d",
	"#82d1c4",
	"#91beeb",
	"#d2c6fa",
	"#969976",
	"#94c484",
	"#79eaa8",
	"#a2ebf2",
]