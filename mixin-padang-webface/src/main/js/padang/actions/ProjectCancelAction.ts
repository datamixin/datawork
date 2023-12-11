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
import * as bekasi from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

import ProjectFileAction from "padang/actions/ProjectFileAction";

export default class ProjectCancelAction extends ProjectFileAction {

	private onCancel: () => void = () => { };

	constructor(host: any, file: RunstackFile) {
		super(host, file);
	}

	public setOnCancel(callback: () => void): void {
		this.onCancel = callback;
	}

	public run(): void {

		let queueEntry = this.createQueueEntry("Remove Model");
		queueEntry.progress("Remove modified edited model");

		let fileId = this.file.getFileId();
		let director = bekasi.getRunstackDirector(this.host);
		director.cancelUntitled(fileId, () => {
			this.onCancel();
			queueEntry.complete();
		});

	}
}