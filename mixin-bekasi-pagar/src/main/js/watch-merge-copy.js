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
let watch = require('node-watch');
let mergeCopy = require('./merge-copy.js');

watch(mergeCopy.jsPath, {
    recursive: false,
    filter: /\.js$/
}, mergeCopy.jsMerge);
console.log("Watching " + mergeCopy.jsPath + "...")

watch(mergeCopy.cssPath, {
    recursive: false,
    filter: /\.css$/
}, mergeCopy.cssMerge);
console.log("Watching " + mergeCopy.cssPath + "...")
