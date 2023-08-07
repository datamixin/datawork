/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const fs = require('fs-extra');
let mergeFiles = require('merge-files');

let merge = (input, output) => {

	// Pastikan resources directory siap
	let resources = "../resources/" + output;
	fs.ensureFile(resources).then(() => {

		// Merge daftar file input ke file di directory resources
		mergeFiles(input, resources).then((status) => {

			// Copy dari resources ke classes
			console.log(resources + " merged", status);
			let classes = "../../../target/classes/" + output;
			fs.copy(resources, classes, (error) => {
				if (error) {
					console.err("Fail copy " + resources + " to " + classes, error);
				} else {
					console.log(resources + " copied to " + classes);
				}
			});
		})
			.catch((error) => {
				console.log("Error:", output, error);
			});
	}).catch(_err => {
		console.log("Fail to ensure target file");
	})
}

let webface = "META-INF/resources/webface";

let jsLib = "js-lib";
let libJsMerge = (_event, _name) => {
	let input = [
		jsLib + "/luxon.min.js",
		jsLib + "/jquery.min.js",
		jsLib + "/numeral.min.js",
		jsLib + "/jquery-ui.min.js",
		jsLib + "/bootstrap.min.js",
		jsLib + "/jquery-simulate-dnd.js",
	];
	let output = webface + "/webface-lib.js";
	merge(input, output);
}

let jsPath = "js-gen";
let mainJsMerge = (_event, _name) => {
	let input = [
		jsPath + "/webface.js",
	];
	let output = webface + "/webface-main.js";
	merge(input, output);
}

let jsMerge = (_event, _name) => {
	libJsMerge();
	mainJsMerge();
}
jsMerge();

let cssPath = "css";
let cssMerge = (_event, _name) => {
	let input = [
		cssPath + "/bootstrap.min.css",
		cssPath + "/jquery-ui.min.css",
		cssPath + "/open-sans.css",
		cssPath + "/materialdesignicons.min.css",
		cssPath + "/pace-theme.css",
		cssPath + "/webface.css"
	];
	let output = webface + "/webface.css";
	merge(input, output);
}
cssMerge();

//Copy fonts and images
console.log("Copy pace.js, css fonts and images");
let resources = "../resources/" + webface;
fs.copySync(jsLib + "/pace-min.js", resources + "/pace.js");
fs.copySync("css/fonts", resources + "/fonts");
fs.copySync("css/images", resources + "/images");

module.exports = {
	jsPath: jsPath,
	jsMerge: jsMerge,
	cssPath: cssPath,
	cssMerge: cssMerge
};
