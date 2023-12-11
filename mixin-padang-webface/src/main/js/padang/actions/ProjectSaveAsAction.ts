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
import * as webface from "webface/webface";

import InputDialog from "webface/dialogs/InputDialog";
import InputValidator from "webface/dialogs/InputValidator";

import * as bekasi from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

import * as directors from "padang/directors";

import ProjectFileAction from "padang/actions/ProjectFileAction";

export default class ProjectSaveAsAction extends ProjectFileAction {

	private postOKCallback: (fileId: string, newName: string) => void = () => { };
	private postCancelCallback: () => void = () => { };

	constructor(host: any, file: RunstackFile) {
		super(host, file);
	}

	public setPostOK(callback: (fileId: string, newName: string) => void): void {
		this.postOKCallback = callback;
	}

	public setPostCancel(callback: () => void): void {
		this.postCancelCallback = callback;
	}

	public run(): void {

		let folderId = this.file.getParentId();
		if (this.file.isUntitled()) {
			let director = bekasi.getRunspaceDirector(this.host);
			folderId = director.getCurrentFolderId();
		}

		// Siapkan name validator untuk validasi nama baru
		let validator = <InputValidator>{
			validate: (name: string, callback: (message: string) => void) => {
				let extension = this.file.getExtension();
				name = name.trim();
				if (!name.endsWith(extension)) {
					name += "." + extension;
				}
				let director = bekasi.getRunspaceDirector(this.host);
				director.validateItemName(folderId, name, callback)
			}
		}

		// Tampilkan input name dialog untuk meminta nama baru
		let dialog = new InputDialog(validator);
		dialog.setWindowTitle("Project Name");
		dialog.setPrompt("Please specify project name");

		dialog.open((result: string) => {

			if (result === InputDialog.OK) {

				// Ambil nama baru untuk project ini, berikan extension
				let newName = dialog.getValue();
				let extension = this.file.getExtension();
				let dotExtension = webface.PERIOD + extension;
				if (!newName.endsWith(dotExtension)) {
					newName += dotExtension;
				}

				let queueEntry = this.createQueueEntry("Save Model As");
				queueEntry.progress("Saving model to '" + newName + "'");

				let fileId = this.file.getFileId();
				let director = bekasi.getRunstackDirector(this.host);
				director.saveAs(fileId, folderId, newName, (file: RunstackFile) => {

					// Sesuaikan file yang baru tersimpan ke composer
					let director = bekasi.getConsoleDirector(this.host);
					director.replaceFile(this.file, file);

					// Panggil save as callback dengan file id dan nama yang baru
					this.postOKCallback(fileId, newName);
					queueEntry.complete();

				});

			} else {

				this.postCancelCallback();

			}
		});

		// Setelah dialog dibuka ropose name and validate
		let director = directors.getProjectComposerDirector(this.host);
		let file = director.getFile();
		let proposedName = file.getNameOnly();
		dialog.setInitialInput(proposedName);
		dialog.validate();

	}
}