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

export default class ProjectSaveAction extends ProjectFileAction {

	private onSave: () => void = () => { };

	constructor(host: any, file: RunstackFile) {
		super(host, file);
	}

	public setOnSave(callback: () => void): void {
		this.onSave = callback;
	}

	public run(): void {

		let queueEntry = this.createQueueEntry("Save Model");
		queueEntry.progress("Saving modified persisted model");

		let fileId = this.file.getFileId();
		let director = bekasi.getRunstackDirector(this.host);
		director.save(fileId, (file: RunstackFile) => {

			// Sesuaikan file yang baru tersimpan ke composer
			let director = bekasi.getConsoleDirector(this.host);
			director.replaceFile(this.file, file);

			this.onSave();
			queueEntry.complete();

		});

	}
}