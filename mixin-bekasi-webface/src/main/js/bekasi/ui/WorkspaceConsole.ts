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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import EditDomain from "webface/wef/EditDomain";
import PartViewer from "webface/wef/PartViewer";
import RootPartViewer from "webface/wef/RootPartViewer";

import MessageDialog from "webface/dialogs/MessageDialog";

import ArrayCommandStackDomain from "webface/wef/base/ArrayCommandStackDomain";

import TaskKey from "bekasi/ui/TaskKey";
import TaskContent from "bekasi/ui/TaskContent";
import TaskManager from "bekasi/ui/TaskManager";
import WorkspaceSite from "bekasi/ui/WorkspaceSite";
import ConsoleTaskItem from "bekasi/ui/ConsoleTaskItem";
import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";
import TaskContentViewer from "bekasi/ui/TaskContentViewer";
import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";
import WorkspaceConsolePanel from "bekasi/ui/WorkspaceConsolePanel";

import * as bekasi from "bekasi/bekasi";
import * as directors from "bekasi/directors";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";
import BaseConsoleDirector from "bekasi/directors/BaseConsoleDirector";
import BaseReconcileDirector from "bekasi/directors/BaseReconcileDirector";
import BaseProgressQueueDirector from "bekasi/directors/BaseProgressQueueDirector";
import BaseSystemWorkspaceDirector from "bekasi/directors/BaseSystemWorkspaceDirector";

export default class WorkspaceConsole extends TaskContentViewer {

	public static SELECTED_TASK: string = "selected-task";

	private editDomain = new ArrayCommandStackDomain();

	private composite: Composite = null;
	private site: WorkspaceSite = null;
	private taskManager: TaskManager = null;
	private consolePanel: WorkspaceConsolePanel = null;
	private onCloseCallback: (code: number) => void = this.reconcileClose;
	private consoleDirector: BaseConsoleDirector = null;
	private reconcileDirector: BaseReconcileDirector = null;
	private progressQueueDirector = new BaseProgressQueueDirector();
	private systemWorkspaceDirector = new BaseSystemWorkspaceDirector();

	constructor(site: WorkspaceSite, taskManager: TaskManager, advertiserSupport: AdvertiserAgent) {
		super();

		this.site = site;
		this.taskManager = taskManager;

		this.registerConsoleDirector();
		this.registerReconcileDirector();
		this.registerSystemWorkspaceDirector();
		this.registerProgressQueueDirector(advertiserSupport);

		this.consolePanel = new WorkspaceConsolePanel(this);
	}

	public getConsolePageSelector(): ConsolePageSelector {
		return this.consolePanel;
	}

	private registerProgressQueueDirector(support: AdvertiserAgent): void {
		let key = directors.PROGRESS_QUEUE_DIRECTOR;
		this.progressQueueDirector.registerSupport(support);
		this.registerDirector(key, this.progressQueueDirector);
	}

	private registerReconcileDirector(): void {
		this.reconcileDirector = new BaseReconcileDirector(bekasi.SPACE, this.onCloseCallback);
		this.registerDirector(directors.RECONCILE_DIRECTOR, this.reconcileDirector);
	}

	private registerConsoleDirector(): void {
		this.consoleDirector = new BaseConsoleDirector(this.taskManager, this);
		this.registerDirector(directors.CONSOLE_DIRECTOR, this.consoleDirector);
	}

	private registerSystemWorkspaceDirector(): void {
		this.systemWorkspaceDirector = new BaseSystemWorkspaceDirector();
		this.registerDirector(directors.SYSTEM_WORKSPACE_DIRECTOR, this.systemWorkspaceDirector);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-console");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.taskManager.setContentContainer(this.composite);
		this.createConsolePanel(this.composite);

	}

	private createConsolePanel(parent: Composite): void {

		this.consolePanel.createControl(parent);
		let control = this.consolePanel.getControl();

		let layoutData = new GridData(true, 0);
		control.setLayoutData(layoutData);

		// Console panel adalah task item pertama
		let key = this.consolePanel.getTaskKey();
		let item = new ConsoleTaskItem(key, this.consolePanel, this.site);
		this.taskManager.setDefault(item);

	}

	public getCurrentPartViewer(): PartViewer {
		let content = this.taskManager.getSelectedContent();
		return content.getPartViewer();
	}

	public setSelectedTask(key: TaskKey): void {
		let itemKey = key.getIdentity();
		this.systemWorkspaceDirector.setPreference(WorkspaceConsole.SELECTED_TASK, itemKey);
	}

	public getEditDomain(): EditDomain {
		return this.editDomain;
	}

	public selectContent(content: TaskContent): void {
		let key = content.getTaskKey();
		this.setSelectedTask(key);
	}

	public setFullDeckCallback(callback: (panel: FullDeckPanel,
		callback: (result: string) => void) => void): void {
		this.consoleDirector.setFullDeckCallback(callback);
	}

	public getRootViewer(): RootPartViewer {
		return this;
	}

	public getControl(): Control {
		return this.composite;
	}

	private reconcileClose(code: number): void {
		let dialog = new MessageDialog();
		dialog.setWindowTitle("Connection Service");
		dialog.setMessage("Connection is closed (" + code + "), application will be reloaded");
		dialog.open(() => {
			location.reload();
		});
	}

	public prepareMenuList(): void {
		this.consolePanel.prepareMenuList();
	}

	public openDefault(): void {
		this.taskManager.selectDefault();
		this.consolePanel.revealSelectedPage();
	}

	public openFile(_runserver: string, _fileId: string, _callback: () => void): void {

	}

	public showSelectedFile(): void {
		this.systemWorkspaceDirector.getPreference(WorkspaceConsole.SELECTED_TASK, (fileId: string) => {
			let key = new TaskKey(fileId);
			this.taskManager.selectItem(key, false, true, () => {
				this.consolePanel.revealSelectedPage();
			});
		});
	}

	public addContent(panel: TaskContent): void {

		panel.createControl(this.composite);

		// Layout data full span
		let control = panel.getControl();
		let layoutData = new GridData(true, 0);
		control.setLayoutData(layoutData);
		this.composite.relayout();

	}

}
