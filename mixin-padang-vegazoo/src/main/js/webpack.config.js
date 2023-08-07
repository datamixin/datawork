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
let mode = process.env.MODE || "development";
let devtoolEnv = process.env.DEVTOOL || false;

let devtool = mode === 'production' ? false : "inline-source-map";
if (devtoolEnv) {
    devtool = devtoolEnv
}

const path = require("path");

module.exports = {
    mode: mode,
    entry: {
        "vegazoo": "./vegazoo/index.ts"
    },
    module: {
        rules: [{
            loader: 'ts-loader',
            options: {
                allowTsInNodeModules: true
            }
        },],
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            "vegazoo": path.resolve("./vegazoo"),
        }
    },
    output: {
        path: path.resolve(__dirname, "js-gen"),
        filename: "vegazoo.js",
        library: "vegazoo"
    },
    externals: [
        function(_context, request, callback) {
            if (/^webface\/.+$/.test(request)
                || /^bekasi\/.+$/.test(request)
                || /^lawang\/.+$/.test(request)
                || /^sleman\/.+$/.test(request)
                || /^padang\/.+$/.test(request)) {
                // Replace webface/module/Class menjadi webface.module.Class
                return callback(null, request.replace(/\//g, '.'));
            }
            callback();
        },
        {
            "vega": "vega",
            "vega-lite": "vegaLite",
            "vega-embed": "vegaEmbed"
        },
    ],
    performance: {
        hints: false
    },
    devtool: devtool
};