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
import FeatureCall from "webface/model/FeatureCall";

import RestFileExport from "bekasi/rest/RestFileExport";

import ExportDirector from "bekasi/directors/ExportDirector";

export default class BaseExportDirector implements ExportDirector {

    private fileExport: RestFileExport = null;

    constructor(fileExport: RestFileExport) {
        this.fileExport = fileExport;
    }

    public inspectFormats(fileId: string, call: FeatureCall,
        callback: (extensions: any) => void): void {
        this.fileExport.getFormatList(fileId, call, callback);
    }

    public inspectDownload(fileId: string, call: FeatureCall,
        filename: string, callback: () => void): void {
        this.fileExport.getDownload(fileId, call, filename, callback);
    }

}