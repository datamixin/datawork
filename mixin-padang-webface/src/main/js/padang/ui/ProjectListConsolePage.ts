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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import * as directors from "bekasi/directors";

import ConsolePage from "bekasi/ui/ConsolePage";
import ConsolePageFactory from "bekasi/ui/ConsolePageFactory";

import ConsoleDirector from "bekasi/directors/ConsoleDirector";
import RunspaceDirector from "bekasi/directors/RunspaceDirector";

import RunspaceItemList from "bekasi/resources/RunspaceItemList";

import FindoutPartViewer from "padang/ui/FindoutPartViewer";
import ProjectApplication from "padang/ui/ProjectApplication";

import FindoutControllerFactory from "padang/controller/findout/FindoutControllerFactory";

export default class ProjectListConsolePage extends ConsolePage {

	public static NAME = "projects";

	private composite: Composite = null;

	private findoutPartViewer = new FindoutPartViewer();

	constructor(rootViewer: BasePartViewer) {
		super(rootViewer, ProjectListConsolePage.NAME, "Projects", "mdi-view-module");
		this.findoutPartViewer.setParent(rootViewer);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-projects-console-page");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createFindoutPartViewer(this.composite);
	}

	private createFindoutPartViewer(parent: Composite): void {

		this.findoutPartViewer.createControl(parent);
		let control = this.findoutPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.findoutPartViewer.setControllerFactory(new FindoutControllerFactory());
		this.populateContent();
		this.registerApplication();
	}

	private populateContent(): void {
		let key = directors.RUNSPACE_DIRECTOR;
		let director = <RunspaceDirector>this.findoutPartViewer.getDirector(key);
		director.getHomeList((list: RunspaceItemList) => {
			this.findoutPartViewer.setContents(list);
		});
	}

	private registerApplication(): void {
		let key = directors.CONSOLE_DIRECTOR;
		let director = <ConsoleDirector>this.findoutPartViewer.getDirector(key);
		let application = new ProjectApplication(this.findoutPartViewer);
		director.registerApplication(application);
	}

	public openDirectory(folderId: string, callback: (viewer: any) => void): void {
		this.findoutPartViewer.openDirectory(folderId, () => {
			callback(this.findoutPartViewer);
		});
	}

	public refreshContents(): void {
		this.findoutPartViewer.refreshContents();
	}

	public getControl(): Control {
		return this.composite;
	}

}

let registry = ConsolePageFactory.getInstance();
registry.register(<any>ProjectListConsolePage);
