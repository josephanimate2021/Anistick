const express = require("express"),
      router = express.Router(),
      fUtil = require("../models/file"),
      stuff = require("../models/page"),
      http = require("http"),
      url = require("url"),
      get = require("../models/get")

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
var title, attrs, params;
router.get("/cc", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	title = "Character Creator";
	attrs = {
		data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
		type: "application/x-shockwave-flash",
		id: "char_creator",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			original_asset_id: query["id"] || null,
			themeId: "business",
			ut: 60,
			bs: "default",
			appCode: "go",
			page: "",
			siteId: "go",
			m_mode: "school",
			isLogin: "Y",
			isEmbed: 1,
			ctc: "go",
			tlang: "en_US",
		},
		allowScriptAccess: "always",
		movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc_browser.swf'
	};
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.send(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages["/cc"] || ""}`
	);
})
router.get("/cc_browser", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	title = "CC Browser";
	attrs = {
		data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
		type: "application/x-shockwave-flash",
		id: "char_creator",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			original_asset_id: query["id"] || null,
			themeId: "family",
			ut: 60,
			appCode: "go",
			page: "",
			siteId: "go",
			m_mode: "school",
			isLogin: "Y",
			isEmbed: 1,
			ctc: "go",
			tlang: "en_US",
			lid: 13,
		},
		allowScriptAccess: "always",
		movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
	};
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.send(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>`
	);
})
router.get("/go_full", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	const noruffle = query.noruffle ? `&noruffle=${query.noruffle}` : '';
	var prefix;
	if (req.headers.host == "localhost" && req.headers.host == `localhost:${process.env.port}`) prefix = "http";
	else prefix = "https";
	if (query.tray == "zimmertwins") res.send(`<html><head><script>function redirect() { 
	  location.href = 'https://zimmertwins.onrender.com/starters?homeUrl=${prefix}://${req.headers.host}/html/homepage.html${noruffle}'; 
	}</script></head><body onload="redirect()"></body></html>`);
	else {
		var swf;
		title = "Video Editor";
		if (p.query.mode != "dark") swf = !p.query.v ? 
			process.env.SWF_URL + `/go_full.swf` : `https://josephanimate2021.github.io/animation/${p.query.v}/go_full.swf`;
		else swf = "https://josephanimate2021.github.io/Animium-Swfs/go_dark.swf";
		attrs = {
			data: swf,
			type: "application/x-shockwave-flash",
			width: "100%",
			height: "100%",
		};
		params = {
			flashvars: {
				apiserver: "/",
				storePath: !p.query.v ? process.env.STORE_URL + "/<store>" : "https://josephanimate2021.github.io/store/50/<store>",
				isEmbed: 1,
				ctc: "go",
				ut: 50,
				bs: "default",
				appCode: "go",
				page: "",
				siteId: "go",
				lid: 13,
				isLogin: "Y",
				retut: 1,
				clientThemePath: !p.query.v ? 
				process.env.CLIENT_URL + "/<client_theme>" : "https://josephanimate2021.github.io/static/477/<client_theme>",
				tray: "retro",
				tlang: "en_US",
				movieId: query.movieId || "",
				goteam_draft_only: 1,
				isWide: 1,
				collab: 0,
				nextUrl: "/html/list.html",
			},
			allowScriptAccess: "always",
		};
		res.setHeader("Content-Type", "text/html; charset=UTF-8");
		Object.assign(params.flashvars, query);
		res.send(
			`<script>document.title='${title}',flashvars=${JSON.stringify(
				params.flashvars
			)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages["/go_full"] || ""}`
		);
	}
})
router.get("/player", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	title = "Player";
	attrs = {
		data: process.env.SWF_URL + "/player.swf",
		type: "application/x-shockwave-flash",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			ut: 60,
			autostart: 1,
			isWide: 1,
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
		},
		allowScriptAccess: "always",
		allowFullScreen: "true",
	};
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.send(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>`
	);
})
router.get("/test/aniPlayer", (req, res) => {
	const p = url.parse(req.url, true);
	attrs = {
		data: p.query.swfUrl,
		type: "application/x-shockwave-flash",
		width: "100%",
		height: "100%"
	};
	params = {
		flashvars: {
			vURL: p.query.fileUrl
		},
		allowScriptAccess: "always"
	};
	res.setHeader("Content-Type", "text/html; charset=utf8");
	res.send(`<body style="margin:0px">${toObjectString(attrs, params)}</body>`);
})
module.exports = router;
