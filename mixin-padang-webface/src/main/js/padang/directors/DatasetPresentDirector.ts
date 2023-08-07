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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export let DATASET_PRESENT_DIRECTOR = "dataset-present-director";

import XDataset from "padang/model/XDataset";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";

export interface DatasetPresentDirector {

	openInstoreComposer(controller: Controller, mutation: XMutation): void;

	openPreparationComposer(controller: Controller, pristine: boolean, preparation: XPreparation): void;

	addPreparation(controller: Controller, source: XDataset): void;

	readSampleFile(path: string, callback: (text: string) => void): void;

	computeResult(model: XDataset, callback?: () => void): void;

	generateFormula(model: XPreparation): string;

}

export function getDatasetPresentDirector(host: Controller | PartViewer): DatasetPresentDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <DatasetPresentDirector>viewer.getDirector(DATASET_PRESENT_DIRECTOR);
}

export default DatasetPresentDirector;

