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
import Lean from "webface/core/Lean";
import * as ajax from "webface/core/ajax";

import EObject from "webface/model/EObject";
import EPackage from "webface/model/EPackage";
import * as builder from "webface/model/builder";
import FeatureCall from "webface/model/FeatureCall";
import Modification from "webface/model/Modification";
import * as serializer from "webface/model/serializer";

import * as functions from "webface/functions";
import { jsonLeanFactory } from "webface/constants";

import Caution from "webface/core/ExceptionCaution";

import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";
import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

import RunstackFile from "bekasi/resources/RunstackFile";

import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

export abstract class RestFileRunstack {

	private endPoint: string = null;

	constructor(endPoint: string) {
		this.endPoint = RestSystemWorkspace.WORKSPACE + endPoint;
	}

	public getOpenedList(callback: (files: RunstackFile[]) => void): void {
		ajax.doGet(this.endPoint + "", {
		}).done((jsons: any) => {
			let files: RunstackFile[] = [];
			for (let i = 0; i < jsons.length; i++) {
				let json = jsons[i];
				let file = <RunstackFile>jsonLeanFactory.create(json);
				files.push(file);
			}
			callback(files);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Opened List");
		});
	}

	public getUntitledNameList(callback: (names: string[]) => void): void {
		ajax.doGet(this.endPoint + "/list-untitles", {
		}).done((jsons: any) => {
			let names: string[] = [];
			for (let i = 0; i < jsons.length; i++) {
				let json = jsons[i];
				let file = <string>json;
				names.push(file);
			}
			callback(names);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Untitled Name List");
		});
	}

	public postCreateUntitled(name: string, callback: (file: RunstackFile) => void): void {
		ajax.doPost(this.endPoint + "/create-untitled", {
			name: name
		}).done((json: any) => {
			let file = <RunstackFile>jsonLeanFactory.create(json);
			callback(file);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Create Untitled");
		});
	}

	public postCancelUntitled(fileId: string, callback: () => void): void {
		ajax.doPost(this.endPoint + "/cancel-untitled", {
			fileId: fileId
		}).done(() => {
			callback();
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Cancel Untitled");
		});
	}

	public postOpen(fileId: string, callback: (file: RunstackFile, pass: boolean) => void): void {
		ajax.doPost(this.endPoint + "/" + fileId + "/open", {
		}).done((json: any) => {
			let file = <RunstackFile>jsonLeanFactory.create(json);
			callback(file, false);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Open", () => {
				let dialog = new ConfirmationDialog();
				dialog.setWindowTitle("Workspace Confirmation");
				dialog.setPrompt("Do you want continue open file?");
				dialog.open((result: string) => {
					if (result === ConfirmationDialog.OK) {
						callback(null, true);
					}
				});
			});
		});
	}

	public postClose(fileId: string, callback: () => void): void {
		ajax.doPost(this.endPoint + "/" + fileId + "/close", {
		}).done(() => {
			callback();
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Close");
		});
	}

	public postSave(key: string, callback: (file: RunstackFile) => void): void {
		ajax.doPost(this.endPoint + "/" + key + "/save", {
		}).done((json) => {
			let file = <RunstackFile>jsonLeanFactory.create(json);
			callback(file);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Save As");
		});
	}

	public postSaveAs(fileId: string,
		folderId: string, newName: string, callback: (file: RunstackFile) => void): void {
		ajax.doPost(this.endPoint + "/" + fileId + "/save-as", {
			folderId: folderId,
			newName: newName,
		}).done((json) => {
			let file = <RunstackFile>jsonLeanFactory.create(json);
			callback(file);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Save As");
		});
	}

	public postRevert(fileId: string, callback: (file: RunstackFile) => void): void {
		ajax.doPost(this.endPoint + "/" + fileId + "/revert", {
		}).done((json) => {
			let file = <RunstackFile>jsonLeanFactory.create(json);
			callback(file);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Revert");
		});
	}

	public getModel(fileId: string, callback: (model: EObject) => void): void {
		ajax.doGet(this.endPoint + "/" + fileId + "/model", {
		}).done((json) => {
			let ePackage = this.getEPackage();
			let model = builder.createEObject(json, ePackage);
			callback(model);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Model");
		});
	}

	protected abstract getEPackage(): EPackage;

	public putModel(fileId: string, model: EObject, callback: () => void): void {
		let serialized = model === null ? null : serializer.serializeEObject(model);
		ajax.doPut(this.endPoint + "/" + fileId + "/model", {
			model: serialized,
		}).done(() => {
			callback();
		}).fail((error) => {
			DetailMessageDialog.open(error, "Put Model");
		});
	}

	public postModification(fileId: string, modification: Modification, callback: () => void): void {
		let serialized = serializer.serializeLean(modification);
		ajax.doPost(this.endPoint + "/" + fileId + "/modification", {
			modification: serialized
		}).done(() => {
			callback();
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Model Modification");
		});
	}

	public getCheckupState(fileId: string, featureCall: FeatureCall,
		callback: (value: Lean, caution?: Caution) => void): void {
		let serialized = serializer.serializeLean(featureCall);
		ajax.doPost(this.endPoint + "/" + fileId + "/checkup-state", {
			call: serialized
		}).done((json) => {
			if (functions.isSimple(json)) {
				callback(json);
			} else {
				let result = <Lean>jsonLeanFactory.create(json);
				callback(result);
			}
		}).fail((error) => {
			let caution = new Caution(error);
			callback(null, caution);
		});
	}

	public getInspectValue(fileId: string, call: FeatureCall,
		callback: (value: Lean, caution?: Caution) => void): void {
		let serialized = serializer.serializeLean(call);
		ajax.doPost(this.endPoint + "/" + fileId + "/inspect-value", {
			call: serialized
		}).done((json) => {
			let result = <Lean>jsonLeanFactory.create(json);
			callback(result);
		}).fail((error) => {
			let caution = new Caution(error);
			callback(null, caution);
		});
	}

}

export default RestFileRunstack;