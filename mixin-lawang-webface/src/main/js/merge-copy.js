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
                    console.log("Fail copy " + resources + " to " + classes, error);
                } else {
                    console.log(resources + " copied to " + classes);
                }
            });
        })
            .catch((error) => {
                console.log("Error:", output, error);
            });
    }).catch(err => {
        console.log("Fail to ensure target file");
    })
}

let lawang = "META-INF/resources/lawang";

let jsPath = "js-gen";
let mainJsMerge = (event, name) => {
    let input = [
        jsPath + "/lawang.js",
    ];
    let output = lawang + "/lawang.js";
    merge(input, output);
}

let jsMerge = (event, name) => {
    mainJsMerge();
}
jsMerge();

let cssPath = "css";
let cssMerge = (event, name) => {
    let input = [cssPath + "/lawang.css"];
    let output = lawang + "/lawang.css";
    merge(input, output);
}
cssMerge();

module.exports = {
    jsPath: jsPath,
    jsMerge: jsMerge,
    cssPath: cssPath,
    cssMerge: cssMerge
};
