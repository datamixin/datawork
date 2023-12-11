/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
let mode = process.env.MODE || "development";
let devtoolEnv = process.env.DEVTOOL || false;

let devtool = mode === 'production' ? false : "inline-source-map";
if (devtoolEnv){
	devtool = devtoolEnv
}

const path = require("path");
const webpack = require("webpack");

module.exports = {
	mode : mode,
	entry : "./webface/index.ts",
	module : {
		rules : [ {
			loader : 'ts-loader',
			options : {
				allowTsInNodeModules : true
			}
		}, ],
	},
	resolve : {
		extensions : [ '.ts' ],
		alias : {
			"webface" : path.resolve("./webface"),
		}
	},
	output : {
		path : path.resolve(__dirname, "js-gen"),
		filename : "webface.js",
		library : "webface"
	},
	externals : {
	    luxon : "luxon",
		lodash : {
			root : "_"
		},
		jquery : {
			root : [ "$", "JQuery", "JQueryUI" ]
		},
	},
	performance : {
		hints : false
	},
	devtool : devtool
};