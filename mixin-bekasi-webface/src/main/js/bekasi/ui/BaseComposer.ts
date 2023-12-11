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

import EditDomain from "webface/wef/EditDomain";
import RootPartViewer from "webface/wef/RootPartViewer";
import ConductorRequest from "webface/wef/ConductorRequest";

import EObject from "webface/model/EObject";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ObjectMap from "webface/util/ObjectMap";

import FeatureCall from "webface/model/FeatureCall";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import TaskKey from "bekasi/ui/TaskKey";

import * as directors from "bekasi/directors";

import VisageValue from "bekasi/visage/VisageValue";

import RunstackFile from "bekasi/resources/RunstackFile";

import ProgressQueueEntry from "bekasi/directors/ProgressQueueEntry"

export abstract class BaseComposer extends BasePartViewer {

	private postAddRequest = new ObjectMap<ConductorRequest>();
	private closed: boolean = false;

	private key: TaskKey = null;

	constructor(key: TaskKey) {
		super();
		this.key = key;
	}

	public getFile(): RunstackFile {
		return <RunstackFile>this.key.getReference();
	}

	public getFileId(): string {
		let file = this.getFile();
		return file.getFileId();
	}

	public getRootViewer(): RootPartViewer {
		return this;
	}

	public abstract getEditDomain(): EditDomain;

	public isDirty(): boolean {
		let file = this.getFile();
		return !file.isCommitted();
	}

	public getPostAddRequest(name: string): ConductorRequest {
		return this.postAddRequest.get(name);
	}

	public setPostAddRequest(name: string, request: ConductorRequest): void {
		this.postAddRequest.put(name, request);
	}

	public checkupState(model: EObject, name: string, args: any[], success: (value: any) => void): void {

		if (this.closed === true) {
			return;
		}

		if (this.isContained(model) === false) {
			return;
		}

		let className = this.getModelName(model);
		let message = "Checkup " + "  " + name + " at " + className;
		let queueEntry = this.createQueueEntry("Checkip State", message);

		let fileId = this.getFileId();
		let featureCall = new FeatureCall(model, name, args);

		let director = directors.getRunstackDirector(this);
		let promise = director.getCheckupState(fileId, featureCall);
		promise.then((value: any) => {

			success(value);
			queueEntry.complete();

		}, (caution: any) => {

			queueEntry.raise(caution);

		});
	}

	private getModelName(model: EObject): string {
		let eClass = model.eClass();
		let className = eClass.getNameWithoutPackage();
		return className.substring(1);
	}

	public inspectValue(model: EObject, name: string, args: any[], success: (value: Lean) => void): void {

		if (this.closed === true) {
			return;
		}

		if (this.isContained(model) === false) {
			return;
		}

		let fileId = this.getFileId();
		let featureCall = new FeatureCall(model, name, args);

		let className = this.getModelName(model);
		let caption = "Inspect " + "  " + name + " at " + className;
		let queueEntry = this.createQueueEntry("Inspect Value", caption);

		let director = directors.getRunstackDirector(this);
		let promise = director.getInspectValue(fileId, featureCall);
		promise.then((result: VisageValue) => {

			success(result);
			queueEntry.complete();

		}, (caution: any) => {

			queueEntry.raise(caution);

		});
	}

	private createQueueEntry(title: string, message: string): ProgressQueueEntry {
		let director = directors.getProgressQueueDirector(this);
		let entry = director.createQueueEntry(title);
		entry.progress(message)
		return entry
	}

	public inspectFormats(model: EObject, name: string, callback: (extensions: any) => void): void {
		if (this.closed === true) {
			return;
		}
		let fileId = this.getFileId();
		let featureCall = new FeatureCall(model, name, []);
		let director = directors.getExportDirector(this);
		director.inspectFormats(fileId, featureCall, callback);
	}

	public inspectDownload(model: EObject, name: string,
		extension: string, filename: string, callback: () => void): void {
		if (this.closed === true) {
			return;
		}
		let fileId = this.getFileId();
		let featureCall = new FeatureCall(model, name, [extension]);
		let director = directors.getExportDirector(this);
		director.inspectDownload(fileId, featureCall, filename, callback);
	}

	public abstract isContained(model: EObject): boolean;

	public abstract activated(state: boolean): void;

	public abstract createControl(parent: Composite, index?: number): void;

	public abstract configure(): void;

	public abstract composeModel(model: EObject, callback: () => void): void;

	public abstract getControl(): Control;

	public close(): void {

		this.closed = true;

		// Close notebook di server
		let fileId = this.getFileId();
		let director = directors.getRunstackDirector(this);
		director.close(fileId, () => {

			// Dispose control
			let control = this.getControl();
			control.dispose();

		});

	}
}

export default BaseComposer;