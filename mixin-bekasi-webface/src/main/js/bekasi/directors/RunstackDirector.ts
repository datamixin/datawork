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
export let RUNSTACK_DIRECTOR = "runstack-director";

import Lean from "webface/core/Lean";

import EObject from "webface/model/EObject";
import FeatureCall from "webface/model/FeatureCall";
import Modification from "webface/model/Modification";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import RunstackFile from "bekasi/resources/RunstackFile";

export interface RunstackDirector {

	getOpenedList(callback: (list: RunstackFile[]) => void): void;

	getUntitledNameList(callback: (names: string[]) => void): void;

	createUntitled(name: string, callback: (file: RunstackFile) => void): void;

	cancelUntitled(name: string, callback: () => void): void;

	open(fileId: string, callback: (file: RunstackFile, workspace: boolean) => void): void;

	close(fileId: string, callback: () => void): void;

	save(fileId: string, callback: (file: RunstackFile) => void): void;

	saveAs(fileId: string, folderId: string, newName: string, callback: (file: RunstackFile) => void): void;

	revert(fileId: string, callback: (file: RunstackFile) => void): void;

	getModel(fileId: string, callback: (model: EObject) => void): void;

	putModel(fileId: string, model: EObject, callback: () => void): void;

	postModification(fileId: string, modification: Modification, callback: () => void): void;

	getCheckupState(fileId: string, featureCall: FeatureCall): Promise<any>;

	getInspectValue(fileId: string, featureCall: FeatureCall): Promise<Lean>;

}

export function getRunstackDirector(host: Controller | PartViewer): RunstackDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <RunstackDirector>viewer.getDirector(RUNSTACK_DIRECTOR);
}

export default RunstackDirector;

