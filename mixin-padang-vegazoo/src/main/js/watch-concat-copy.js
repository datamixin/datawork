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
let watch = require('node-watch');
let concatcopy = require('./concat-copy.js');

watch(concatcopy.mainpath, { recursive: false, filter: /\.js$/ }, concatcopy.mainbuild);
console.log("Watching " + concatcopy.mainpath + "...")

watch(concatcopy.libpath, { recursive: false, filter: /\.js$/ }, concatcopy.libbuild);
console.log("Watching " + concatcopy.libpath + "...")

watch(concatcopy.csspath, { recursive: false, filter: /\.css$/ }, concatcopy.cssbuild);
console.log("Watching " + concatcopy.csspath + "...")
