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
import TaskKey from "bekasi/ui/TaskKey";

import PartViewer from "webface/wef/PartViewer";

import TaskItem from "bekasi/ui/TaskItem";
import TaskManager from "bekasi/ui/TaskManager";
import TaskContent from "bekasi/ui/TaskContent";
import TaskItemFactory from "bekasi/ui/TaskItemFactory";
import TaskContentViewer from "bekasi/ui/TaskContentViewer";
import TaskContentFactory from "bekasi/ui/TaskContentFactory";

import * as directors from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";
import ConsoleDirector from "bekasi/directors/ConsoleDirector";
import ConsoleApplication from "bekasi/directors/ConsoleApplication";

export default class BaseConsoleDirector implements ConsoleDirector {

	private static OPENED_FILES: string = "opened-files";

	private taskManager: TaskManager = null;
	private applications: { [extension: string]: ConsoleApplication } = {};
	private contentViewer: TaskContentViewer = null;
	private onLogout = () => { };
	private fullDeckCallback = (panel: FullDeckPanel, callback: (result: string) => void) => { };

	constructor(taskManager: TaskManager, contentViewer: TaskContentViewer) {
		this.taskManager = taskManager;
		this.contentViewer = contentViewer;
	}

	public setOnLogout(callback: () => void) {
		this.onLogout = callback;
	}

	public logout(): void {
		this.onLogout();
	}

	public getCurrentFileId(): string {
		let content = this.taskManager.getSelectedContent();
		if (content instanceof TaskContent) {
			let key = content.getTaskKey();
			return key.getIdentity();
		}
		return null;
	}

	public getCurrentPartViewer(): PartViewer {
		let content = this.taskManager.getSelectedContent();
		return content.getPartViewer();
	}

	public registerApplication(application: ConsoleApplication): void {
		let extension = application.getExtension();
		this.applications[extension] = application;
	}

	public openFile(file: RunstackFile, callback: () => void): void {
		this.doOpenFile(file, true, true, callback);
	}

	private doOpenFile(file: RunstackFile, preference: boolean, content: boolean, callback: () => void): void {
		let key = this.getOrCreateKey(file);
		if (this.taskManager.isItemExists(key) === true) {
			this.taskManager.selectItem(key, true, true, callback);
		} else {
			let panel = this.addContent(key, file);
			this.addTask(key, file, panel, preference, content, callback);
			if (preference === true) {
				this.contentViewer.setSelectedTask(key);
				this.markOpenedFiles();
			}
		}
	}

	public markOpenedFiles(): void {
		let director = directors.getSystemWorkspaceDirector(this.contentViewer);
		let keys = this.taskManager.getItemKeys();
		let files: { [fileId: string]: string } = {};
		for (let key of keys) {
			let item = this.taskManager.getItem(key);
			let taskKey = item.getKey();
			let reference = taskKey.getReference();
			if (reference instanceof RunstackFile) {
				let fileId = reference.getFileId();
				let extension = reference.getExtension();
				files[fileId] = extension;
			}
		}
		let text = JSON.stringify(files);
		director.setPreference(BaseConsoleDirector.OPENED_FILES, text);
	}

	public reopenOpenedFiles(callback: (files: number) => void): void {
		let director = directors.getSystemWorkspaceDirector(this.contentViewer);
		director.getPreference(BaseConsoleDirector.OPENED_FILES, (text: string) => {
			if (text === undefined) {
				callback(0);
			} else {
				let files = JSON.parse(text);
				let keys = Object.keys(files);
				if (keys.length === 0) {
					callback(0);
				} else {
					let counter = 0;
					for (let key of keys) {
						let extension = files[key];
						let application = this.applications[extension];
						application.getFile(key, (file: RunstackFile, pass: boolean) => {

							let complete = () => {
								counter++;
								if (counter === keys.length) {
									callback(counter);
								}
							}

							if (file !== null) {
								this.doOpenFile(file, false, false, complete);
							} else {
								if (pass === true) {

									delete files[key];
									let text = JSON.stringify(files);
									director.setPreference(BaseConsoleDirector.OPENED_FILES, text);
									complete();
								}
							}
						});
					}
				}
			}
		});
	}

	private getOrCreateKey(file: RunstackFile): TaskKey {
		let keys = this.taskManager.getItemKeys();
		for (let key of keys) {
			let identity = key.getIdentity();
			let fileId = file.getFileId();
			if (identity === fileId) {
				return key;
			}
		}
		return this.createKey(file);
	}

	private createKey(file: RunstackFile): TaskKey {
		let fileId = file.getFileId();
		let key = new TaskKey(fileId, file)
		return key;
	}

	private addContent(key: TaskKey, file: RunstackFile): TaskContent {
		let extension = file.getExtension();
		let application = this.applications[extension];
		let factory = TaskContentFactory.getInstance();
		let parent = application.getPartViewer();
		let panel = factory.create(extension, parent, key, file);
		this.contentViewer.addContent(panel);
		return panel;
	}

	private addTask(key: TaskKey, file: RunstackFile, content: TaskContent,
		preference: boolean, composer: boolean, callback: () => void): void {
		let extension = file.getExtension();
		let factory = TaskItemFactory.getInstance();
		let image = content.getTaskIcon();
		let taskItem = factory.create(extension, key, content, image, this.contentViewer);
		this.addOpenTask(taskItem, preference, composer, callback);
	}

	private addOpenTask(item: TaskItem, preference: boolean, content: boolean, callback: () => void): void {
		let key = item.getKey();
		this.taskManager.addItem(item);
		this.taskManager.selectItem(key, preference, content, callback);
	}

	public replaceFile(original: RunstackFile, replacement: RunstackFile): void {
		let key = this.getOrCreateKey(original);
		if (this.taskManager.isItemExists(key) === true) {
			key.setReference(replacement);
			this.taskManager.refreshItem(key);
		}
	}

	public refreshFile(file: RunstackFile): void {
		let key = this.getOrCreateKey(file);
		if (this.taskManager.isItemExists(key) === true) {
			this.taskManager.refreshItem(key);
		}
	}

	public openFullDeck(panel: FullDeckPanel, callback: (result: string) => void): void {
		this.fullDeckCallback(panel, callback);
	}

	public setFullDeckCallback(callback: (panel: FullDeckPanel, callback: (result: string) => void) => void): void {
		this.fullDeckCallback = callback;
	}

}