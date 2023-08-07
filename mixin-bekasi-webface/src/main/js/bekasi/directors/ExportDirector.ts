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
export let EXPORT_DIRECTOR = "export-director";

import FeatureCall from "webface/model/FeatureCall";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export interface ExportDirector {

    inspectFormats(key: string, call: FeatureCall, callback: (extensions: any) => void): void;

    inspectDownload(key: string, call: FeatureCall, filename: string, callback: () => void): void;

}

export function getExportDirector(host: Controller | PartViewer): ExportDirector {
    let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
    return <ExportDirector>viewer.getDirector(EXPORT_DIRECTOR);
}

export default ExportDirector;

