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
const fs = require("fs-extra");
const globby = require("globby");
const concat = require("concat");

// Gabungkan files dan jadikan dengan nama filename
let concatCopy = (files, filename) => {

    // Concat files into a file in meta-inf
    let metafile = "META-INF/resources/padang/" + filename;
    concat(files, metafile);

    // Copy file into classes
    let classfile = "../../../target/classes/" + filename;
    fs.copy(metafile, classfile, (error) => {
        if (error) {
            console.log("Fail copy " + filename + " to " + classfile + ", error: " + error);
        } else {
            console.log(filename + " copied to " + classfile);
        }
    });

}

// Script utama
let mainpath = "js-gen";
let mainbuild = async () => {
    const mainfiles = await globby([mainpath + "/*.js"]);
    concatCopy(mainfiles, "padang-malang-main.js");
}

// Script pustaka
let libpath = "js-lib";
let libbuild = async () => {
    const libfiles = await globby([libpath + "/*.js"]);
    concatCopy(libfiles, "padang-malang-lib.js");
}

// Style
let csspath = "css";
let cssbuild = async () => {
    const cssfiles = await globby([csspath + "/*.css"]);
    concatCopy(cssfiles, "padang-malang.css");
}

//Default jalankan sekali
mainbuild();
libbuild();
cssbuild();

// Export untuk dipanggil oleh module lain
module.exports = {
    mainpath: mainpath,
    mainbuild: mainbuild,
    libpath: libpath,
    libbuild: libbuild,
    csspath: csspath,
    cssbuild: cssbuild,
};
