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
import Lean from "webface/core/Lean";
import Caution from "webface/core/Caution";

import EObject from "webface/model/EObject";
import FeatureCall from "webface/model/FeatureCall";
import Modification from "webface/model/Modification";

import RunstackFile from "bekasi/resources/RunstackFile";

import RestFileRunstack from "bekasi/rest/RestFileRunstack";

import RunstackDirector from "bekasi/directors/RunstackDirector";

export default class BaseRunstackDirector implements RunstackDirector {

	private runstack: RestFileRunstack = null;

	constructor(runstack: RestFileRunstack) {
		this.runstack = runstack;
	}

	public getOpenedList(callback: (list: RunstackFile[]) => void): void {
		this.runstack.getOpenedList(callback);
	}

	public getUntitledNameList(callback: (names: string[]) => void): void {
		this.runstack.getUntitledNameList(callback);
	}

	public createUntitled(name: string, callback: (file: RunstackFile) => void): void {
		this.runstack.postCreateUntitled(name, callback);
	}

	public cancelUntitled(fileId: string, callback: () => void): void {
		this.runstack.postCancelUntitled(fileId, callback);
	}

	public open(fileId: string, callback: (file: RunstackFile, pass: boolean) => void): void {
		this.runstack.postOpen(fileId, callback);
	}

	public close(fileId: string, callback: () => void): void {
		this.runstack.postClose(fileId, callback);
	}

	public save(fileId: string, callback: (file: RunstackFile) => void): void {
		this.runstack.postSave(fileId, callback);
	}

	public saveAs(fileId: string, folderId: string, newName: string, callback: (file: RunstackFile) => void): void {
		this.runstack.postSaveAs(fileId, folderId, newName, callback);
	}

	public revert(fileId: string, callback: (file: RunstackFile) => void): void {
		this.runstack.postRevert(fileId, callback);
	}

	public getModel(fileId: string, callback: (model: EObject) => void): void {
		this.runstack.getModel(fileId, callback);
	}

	public putModel(fileId: string, model: EObject, callback: () => void): void {
		this.runstack.putModel(fileId, model, callback);
	}

	public postModification(fileId: string, modification: Modification, callback: () => void): void {
		this.runstack.postModification(fileId, modification, callback);
	}

	public getCheckupState(fileId: string, featureCall: FeatureCall): Promise<any> {
		return new Promise((resolve, reject) => {
			this.runstack.getCheckupState(fileId, featureCall,
				(value: any, caution: Caution) => {
					if (value !== null) {
						resolve(value);
					} else {
						reject(caution);
					}
				});
		});
	}

	public getInspectValue(fileId: string, featureCall: FeatureCall): Promise<Lean> {
		return new Promise((resolve, reject) => {
			this.runstack.getInspectValue(fileId, featureCall,
				(value: Lean, caution: Caution) => {
					if (value !== null) {
						resolve(value);
					} else {
						reject(caution);
					}
				});
		});
	}

}