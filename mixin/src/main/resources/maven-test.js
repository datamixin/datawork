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

// Gunakan command: node maven-test.js

let execa = require('execa');
let watch = require('node-watch');

let changes = 0;
let seconds = 1000;
let interval = 30 * seconds;

// Change rectory to workspace location
let path = "../../../../";
process.chdir(path);

// Looping forever checking changes
let test = setInterval(() => {
	if(changes > 0){
		changes = 0;
		process.chdir("mixin");
		execa("mvn", [ "test" ]).stdout.pipe(process.stdout);
		process.chdir("../");
	}
}, interval);

// Watching java file changes
watch("./", {
	recursive : true,
	filter : /\.java$/
}, function(event, name) {
	console.log("%s changed.", name);
	changes++;
});
console.log("Watching %s", path);
