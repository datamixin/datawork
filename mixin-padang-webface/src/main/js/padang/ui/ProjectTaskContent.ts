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
import Director from "webface/wef/Director";
import PartViewer from "webface/wef/PartViewer";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import TaskKey from "bekasi/ui/TaskKey";
import TaskContent from "bekasi/ui/TaskContent";
import TaskContentFactory from "bekasi/ui/TaskContentFactory";

import * as bekasi from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

import * as padang from "padang/padang";

import XProject from "padang/model/XProject";

import ProjectComposer from "padang/ui/ProjectComposer";

export default class ProjectTaskContent implements TaskContent {

	private composite: Composite = null;
	private composer: ProjectComposer = null;

	private parent: PartViewer = null;
	private key: TaskKey = null;
	private file: RunstackFile = null;

	constructor(parent: PartViewer, key: TaskKey, file: RunstackFile) {
		this.parent = parent;
		this.key = key;
		this.file = file;
	}

	public getTaskKey(): TaskKey {
		return this.key;
	}

	public getTaskIcon(): string {
		let director = bekasi.getRunspaceDirector(this.parent);
		return director.getFileIcon();
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-project-task-content");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

	}

	public open(callback: () => void): void {

		// Loading model project
		let fileId = this.file.getFileId();
		let director = bekasi.getRunstackDirector(this.parent);
		director.getModel(fileId, (model: XProject) => {

			// Buat project composer
			this.composer = new ProjectComposer(this.key);
			this.composer.createControl(this.composite);
			this.composer.configure();

			// Daftarkan director yang ada di task content viewer
			this.registerDirector(bekasi.CONSOLE_DIRECTOR, bekasi.getConsoleDirector(this.parent));
			this.registerDirector(bekasi.RECONCILE_DIRECTOR, bekasi.getReconcileDirector(this.parent));
			this.registerDirector(bekasi.PROGRESS_QUEUE_DIRECTOR, bekasi.getProgressQueueDirector(this.parent));

			// Daftarkan director yand di findout part viewer
			this.registerDirector(bekasi.RUNSPACE_DIRECTOR, bekasi.getRunspaceDirector(this.parent));
			this.registerDirector(bekasi.RUNSTACK_DIRECTOR, bekasi.getRunstackDirector(this.parent));

			// Setting model di composer
			this.composer.setModel(model, () => {
				callback();
			});

			// Layout data full span
			let control = this.composer.getControl();
			let layoutData = new GridData(true, true);
			control.setLayoutData(layoutData);
			this.composite.relayout();

		});
	}

	private registerDirector(key: string, director: Director): void {
		this.composer.registerDirector(key, director);
	}

	public activated(state: boolean, callback: () => void): void {
		if (state === true) {
			this.open(() => {
				this.composer.activated(true);
				callback();
			});
		} else {
			if (this.composer !== null) {
				this.composer.activated(false);
				this.dispose();
			}
		}
	}

	public getComposer(): ProjectComposer {
		return this.composer;
	}

	public getPartViewer(): PartViewer {
		return this.composer;
	}

	public getControl(): Control {
		return this.composite;
	}

	private dispose(): void {
		let control = this.composer.getControl();
		control.dispose();
	}

	public close(): void {
		if (this.composer !== null) {
			this.composer.close();
			this.dispose();
		}
	}

}

let factory = TaskContentFactory.getInstance();
factory.register(padang.PROJECT, <any>ProjectTaskContent);