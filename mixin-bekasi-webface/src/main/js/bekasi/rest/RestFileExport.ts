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
import * as ajax from "webface/core/ajax";

import FeatureCall from "webface/model/FeatureCall";
import * as serializer from "webface/model/serializer";

import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

export default class RestFileExport {

    private endPoint: string = null;

    constructor(endPoint: string) {
        this.endPoint = RestSystemWorkspace.WORKSPACE + endPoint;
    }

    protected getEndPoint(): string {
        return this.endPoint;
    }

    public getFormatList(fileId: string, featureCall: FeatureCall,
        callback: (extensions: any) => void): void {
        let serialized = serializer.serializeLean(featureCall);
        let data = {
            call: serialized
        };
        ajax
            .doPost(this.endPoint + "/" + fileId + "/formats", data)
            .done((json: any) => {
                callback(json);
            });
    }

    public getDownload(fileId: string, featureCall: FeatureCall,
        filename: string, callback: () => void): void {
        let serialized = serializer.serializeLean(featureCall);
        let data = {
            call: serialized
        };
        ajax
            .doPostDownload(this.endPoint + "/" + fileId + "/download", data, filename);
    }

}
