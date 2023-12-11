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

import EObject from "webface/model/EObject";
import EPackage from "webface/model/EPackage";
import * as builder from "webface/model/builder";
import * as serializer from "webface/model/serializer";

import ExceptionCaution from "webface/core/ExceptionCaution";

import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

export abstract class RestFileRunextra {

	private endPoint: string = null;

	constructor(endPoint: string) {
		this.endPoint = RestSystemWorkspace.WORKSPACE + endPoint;
	}

	public getNames(group: string, callback: (names: string[]) => void): void {
		ajax.doGet(this.endPoint + "/" + group, {}
		).done((routines: string[]) => {
			callback(routines);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Connector Names");
		});
	}

	public getNamesByType(group: string, type: string, callback: (names: string[]) => void): void {
		ajax.doGet(this.endPoint + "/" + group, {
			type: type
		}).done((routines: string[]) => {
			callback(routines);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Connector Names By Type");
		});
	}

	protected abstract getEPackage(): EPackage;

	public load(group: string, name: string): Promise<EObject> {
		return new Promise((resolve, reject) => {
			ajax.doGet(this.endPoint + "/" + group + "/" + name, {
			}).done((json: any) => {
				let ePackage = this.getEPackage();
				let model = builder.createEObject(json, ePackage);
				resolve(model);
			}).fail((error) => {
				let caution = new ExceptionCaution(error);
				reject(caution);
			});
		});
	}

	public save(group: string, name: string, model: EObject, callback: (result: string) => void): void {
		let serialized = serializer.serializeEObject(model);
		ajax.doPut(this.endPoint + "/" + group + "/" + name, {
			model: serialized
		}).done((result: string) => {
			callback(result);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Save Connector");
		});
	}

	public remove(group: string, name: string, callback: () => void): void {
		ajax.doDelete(this.endPoint + "/" + group + "/" + name, {
			name: name
		}).done((_result) => {
			callback();
		}).fail((error) => {
			DetailMessageDialog.open(error, "Remove Connector");
		});
	}
}

export default RestFileRunextra;