export const manifest = {
	appDir: "_app",
	assets: new Set([".nojekyll","data/linechart.json","data/nyc_neighborhoods.json","data/pub_pri.json","data/school_coor.json","data/us_states.topojson","favicon.png","robots.txt"]),
	_: {
		mime: {".json":"application/json",".png":"image/png",".txt":"text/plain"},
		entry: {"file":"start-c1b68d6c.js","js":["start-c1b68d6c.js","chunks/index-322b1d5a.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/\+layout\/?$/,
				params: null,
				path: "/+layout",
				shadow: null,
				a: [0,3],
				b: [1]
			}
		]
	}
};
