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

import PartViewer from "webface/wef/PartViewer";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import TaskKey from "bekasi/ui/TaskKey";
import ConsolePage from "bekasi/ui/ConsolePage";
import TaskContent from "bekasi/ui/TaskContent";
import HomeConsolePage from "bekasi/ui/HomeConsolePage";
import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";
import ConsolePageFactory from "bekasi/ui/ConsolePageFactory";
import WorkspaceConsoleMenuBar from "bekasi/ui/WorkspaceConsoleMenuBar";

import * as directors from "bekasi/directors";

export default class WorkspaceConsolePanel implements TaskContent, ConsolePageSelector {

	public static SELECTED_PAGE: string = "selected-page";

	private static CONSOLE = "console";
	private static MENU_WIDTH = 180;

	private composite: Composite = null;

	private key = new TaskKey(WorkspaceConsolePanel.CONSOLE, this);
	private mainPart: Composite = null;
	private menuBar: WorkspaceConsoleMenuBar = null;
	private pagesPart: Composite = null;
	private pages: ConsolePage[] = [];
	private selectedPage: ConsolePage = null;

	private rootViewer: BasePartViewer = null;
	private homeConsolePage: HomeConsolePage = null;
	private consolePages: ConsolePage[] = [];

	constructor(rootViewer: BasePartViewer) {
		this.rootViewer = rootViewer;
		this.homeConsolePage = new HomeConsolePage(rootViewer, this);
	}

	public getTaskIcon(): string {
		return this.homeConsolePage.getIcon();
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-console-panel");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createMainPart(this.composite);

	}

	private createMainPart(parent: Composite): void {

		this.mainPart = new Composite(parent);

		let element = this.mainPart.getElement();
		element.addClass("bekasi-workspace-console-panel-container");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.mainPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.mainPart.setLayoutData(layoutData);

		this.createMenuBar(this.mainPart);

	}

	private createMenuBar(parent: Composite): void {

		this.menuBar = new WorkspaceConsoleMenuBar();
		this.menuBar.createControl(parent);
		let control = this.menuBar.getControl();

		let layoutData = new GridData(WorkspaceConsolePanel.MENU_WIDTH, true);
		control.setLayoutData(layoutData);

	}

	public prepareMenuList(): void {
		this.createPages(this.mainPart);
		this.homeConsolePage.populateMenuList();
	}

	private createPages(parent: Composite): void {

		this.pagesPart = new Composite(parent);

		let element = this.pagesPart.getElement();
		element.addClass("bekasi-workspace-console-panel-pages");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.pagesPart.setLayout(layout);

		// Container shown by default
		let layoutData = new GridData(true, true);
		this.pagesPart.setLayoutData(layoutData);

		// Add home page
		this.createPageControl(this.homeConsolePage);

		// Create pages dari factory
		let factory = ConsolePageFactory.getInstance();
		let pages = factory.createPages(this.rootViewer);
		for (let page of pages) {
			this.createPageControl(page);
			page.configure();
			this.consolePages.push(page);
		}

		// Complete
		// this.menuBar.completeMenu(this.rootViewer);

	}

	private createPageControl(page: ConsolePage): void {

		// Buat control
		page.createControl(this.pagesPart);
		let control = page.getControl();

		// Hide by default
		let layoutData = new GridData(true, 0);
		control.setLayoutData(layoutData);

		// Buatkan menu untuk menampilkan content
		let icon = page.getIcon();
		let label = page.getLabel();
		this.menuBar.addMainMenu(icon, label, () => {
			this.setShowPage(page, true);
		});

		this.pages.push(page);

	}

	public revealSelectedPage(): void {
		let director = directors.getSystemWorkspaceDirector(this.rootViewer);
		director.getPreference(WorkspaceConsolePanel.SELECTED_PAGE, (selectedPage: string) => {
			let preferenced = false;
			for (let page of this.pages) {
				let name = page.getName();
				if (name === selectedPage) {
					this.setShowPage(page, false);
					preferenced = true;
				}
			}
			if (preferenced === false) {
				this.setShowPage(this.homeConsolePage, true);
			}
		});
	}

	public selectPage(name: string): void {
		for (let i = 0; i < this.pages.length; i++) {
			let page = this.pages[i];
			if (page.getName() === name) {
				this.setShowPage(page, true);
				return;
			}
		}
	}

	private setShowPage(page: ConsolePage, preference: boolean): void {

		if (this.selectedPage !== null) {
			this.selectedPage.setSelected(false);
		}
		for (let i = 0; i < this.pages.length; i++) {

			let panel = this.pages[i];
			let control = panel.getControl();
			let layoutData = <GridData>control.getLayoutData();
			if (page === panel) {
				layoutData.applyFillVertical();
				page.setSelected(true);
				this.selectedPage = page;
				let label = page.getLabel();
				this.menuBar.setSelected(label);
			} else {
				layoutData.applyZeroHeight();
			}
		}

		if (preference === true) {
			let director = directors.getSystemWorkspaceDirector(this.rootViewer);
			let name = page.getName();
			director.setPreference(WorkspaceConsolePanel.SELECTED_PAGE, name);
		}
		this.pagesPart.relayout();
	}

	public getTaskKey(): TaskKey {
		return this.key;
	}

	public getPartViewer(): PartViewer {
		return this.rootViewer;
	}

	public activated(_state: boolean): void {

	}

	public close(): void {
		// Workspace console cannot be closed.
	}

	public getControl(): Control {
		return this.composite;
	}

}
