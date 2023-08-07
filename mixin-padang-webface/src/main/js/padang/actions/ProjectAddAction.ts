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
import Action from "webface/action/Action";

import * as bekasi from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

import * as padang from "padang/padang";

import XProject from "padang/model/XProject";

import PadangCreator from "padang/model/PadangCreator";

export default class ProjectAddAction extends Action {

	private host: any = null;
	private folderId: string = null;
	private model: XProject = null;
	private onOpen = () => { };

	constructor(host: any, folderId: string, project?: XProject) {
		super();
		this.host = host;
		this.folderId = folderId;
		this.model = project === undefined ? null : project;
	}

	public setOnOpen(callback: () => void): void {
		this.onOpen = callback;
	}

	public run(): void {

		let creator = PadangCreator.eINSTANCE;
		if (this.model === null) {
			this.model = creator.createProject();
		}

		// Buat nama project baru
		let director = bekasi.getRunspaceDirector(this.host);
		director.getNewFileName(this.folderId, "Project", (name: string) => {

			// Ambil full path baru dengan resolve nama datacase yang di baru
			let extension = padang.PROJECT;
			let filename = name + "." + extension;

			// Buat untitled di runstack
			let director = bekasi.getRunstackDirector(this.host);
			director.createUntitled(filename, (file: RunstackFile) => {

				// Berikan model ke runstack
				let fileId = file.getFileId();
				director.putModel(fileId, this.model, () => {

					// Buka composer untuk runmodel yang baru dibuat
					let director = bekasi.getConsoleDirector(this.host);
					director.openFile(file, this.onOpen);

				});
			});

		});

	}

}