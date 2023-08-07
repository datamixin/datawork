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
import * as functions from "webface/widgets/functions";

import GridData from "webface/layout/GridData";
import FillLayout from "webface/layout/FillLayout";
import GridLayout from "webface/layout/GridLayout";
import AbsoluteData from "webface/layout/AbsoluteData";
import AbsoluteLayout from "webface/layout/AbsoluteLayout";

import * as directors from "bekasi/directors";

import TaskKey from "bekasi/ui/TaskKey";
import TaskManager from "bekasi/ui/TaskManager";
import LoginProcess from "bekasi/ui/LoginProcess";
import WorkspaceSite from "bekasi/ui/WorkspaceSite";
import AdvertiserPart from "bekasi/ui/AdvertiserPart";
import AdvertiserPanel from "bekasi/ui/AdvertiserPanel";
import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";
import WorkspaceConsole from "bekasi/ui/WorkspaceConsole";
import WorkspaceFullDeck from "bekasi/ui/WorkspaceFullDeck";
import WorkspaceTaskManager from "bekasi/ui/WorkspaceTaskManager";
import SecurityProviderRegistry from "bekasi/ui/SecurityProviderRegistry";

import StarterRegistry from "bekasi/StarterRegistry";

import WelcomeDialog from "bekasi/dialogs/WelcomeDialog";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

import RestExtensionRegistry from "bekasi/rest/RestExtensionRegistry";
import RestApplicationRegistry from "bekasi/rest/RestApplicationRegistry";

export default class WorkspaceShell implements AdvertiserAgent, WorkspaceSite {

	public static WELCOME_SHOW = "workspace.welcome.show";

	private static TASK_BAR_HEIGHT = 32;
	private static ADVERTISER_WIDTH = 540;
	private static ADVERTISER_MARGIN = 10;

	private composite: Composite = null;
	private container: Composite = null;
	private planePart: Composite = null;
	private contentPart: Composite = null;
	private taskConsolePart: Composite = null;

	private fullDeck: WorkspaceFullDeck = null;
	private taskManager = new WorkspaceTaskManager(this);
	private console = new WorkspaceConsole(this, this.taskManager, this);
	private advertiserPanel: AdvertiserPanel = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-shell");

		let layout = new FillLayout();
		this.composite.setLayout(layout);

		this.composite.relayout();

		this.createContainer(this.composite);
		this.timeoutCheck();

	}

	private createContainer(parent: Composite): void {

		// Extension loading
		this.loadExtensionStyles(() => {
			this.loadExtensions(() => {

				// Request to logout
				let director = directors.getConsoleDirector(this.console);
				director.setOnLogout(() => {
					this.logout();
				});

				this.login(parent, true);

			});
		});
	}

	private logout(): void {
		let registry = SecurityProviderRegistry.getInstance();
		let provider = registry.getProvider();
		provider.logout((url: string) => {
			if (url !== null) {
				window.location = <any>url;
			} else {
				this.resetLogin();
			}
		});
	}

	private resetLogin(): void {
		this.taskManager.reset();
		functions.removeChildren(this.composite);
		this.composite.relayout();
		this.login(this.composite, false);
	}

	private timeoutCheck(): void {
		let inactivityTime = () => {

			let minutes = 1000 * 60;
			let time: number = 0;
			window.onload = resetTimer;
			document.onmousemove = resetTimer;
			document.onkeydown = resetTimer;
			document.onclick = resetTimer;

			let timeout = () => {
				this.timeout();
			}

			function resetTimer() {
				clearTimeout(time);
				time = setTimeout(timeout, 30 * minutes);
			}

		};
		inactivityTime();
	}

	private timeout(): void {
		let registry = SecurityProviderRegistry.getInstance();
		let provider = registry.getProvider();
		provider.timeout((url: string) => {
			if (url !== null) {
				window.location = <any>url;
			} else {
				this.resetLogin();
			}
		});
	}

	private login(parent: Composite, first: boolean): void {

		let registry = SecurityProviderRegistry.getInstance();
		let provider = registry.getProvider();
		provider.login(parent, <LoginProcess>{

			prompt: () => {
				this.composite.relayout();
			},

			success: () => {

				// Reset shell
				functions.removeChildren(this.composite);
				this.composite.relayout();

				// Application container
				this.container = new Composite(this.composite)

				let layout = new GridLayout(1, 0, 0, 0, 0);
				this.container.setLayout(layout);

				// Persiapkan tampilan semua application.
				this.createPlanePart(this.container);

				if (first === true) {

					// Loading application resurces
					this.loadApplicationStyles(() => {
						this.loadApplications(() => {

							// Starter
							let registry = StarterRegistry.getInstance();
							registry.starts(() => {

								// Open files
								this.doOpenFiles();

							});
						});
					});

				} else {

					this.doOpenFiles();

				}

			}
		});
	}

	private doOpenFiles(): void {
		this.console.prepareMenuList();
		this.openFiles(() => {

			this.console.showSelectedFile();
			this.composite.relayout();

			// First time
			let director = directors.getSystemWorkspaceDirector(this.console);
			director.getProperty(WorkspaceShell.WELCOME_SHOW, (value: any) => {
				if (value === null || value === undefined || parseInt(value) === -1) {
					director.getPreference(WorkspaceShell.WELCOME_SHOW, (value: any) => {
						if (value === null || value === undefined) {
							this.showWelcome(1);
						} else {
							this.showWelcome(parseInt(value));
						}
					});
				} else {
					this.showWelcome(parseInt(value));
				}
			});

		});
	}

	private showWelcome(value: number): void {
		if (value === 1) {
			let pageSelector = this.console.getConsolePageSelector();
			let dialog = new WelcomeDialog(this.console, pageSelector);
			dialog.open();
		}
	}

	private loadExtensionStyles(callback: () => void): void {

		let registry = RestExtensionRegistry.getInstance();
		registry.getStyles((styles: { [key: string]: string }) => {

			let counter = 0;
			let keys = Object.keys(styles);
			if (keys.length === 0) {
				callback();
			} else {
				for (let key of keys) {
					let style = styles[key];
					this.createLinkElement(style, () => {
						counter++;
						if (counter === keys.length) {
							callback();
						}
					});
				}
			}

		});
	}

	private loadExtensions(callback: () => void): void {
		let registry = RestExtensionRegistry.getInstance();
		registry.getScripts((scripts: { [key: string]: string }) => {
			let keys = Object.keys(scripts);
			if (keys.length === 0) {
				callback();
			} else {
				this.loadExtensionScript(0, scripts, callback);
			}
		});
	}

	private loadApplicationStyles(callback: () => void): void {

		let registry = RestApplicationRegistry.getInstance();
		registry.getStyles((styles: { [key: string]: { [key: string]: string } }) => {

			let counter = 0;
			let keys = Object.keys(styles);
			let total = this.calculateTotal(styles);
			for (let key of keys) {
				let map = styles[key];
				let keys = Object.keys(map);
				for (let key of keys) {
					let style = map[key];
					this.createLinkElement(style, () => {
						counter++;
						if (counter === total) {
							callback();
						}
					});
				}
			}

		});
	}

	private createLinkElement(style: string, onload: () => void): void {
		var element = document.createElement("link");
		element.rel = "stylesheet";
		element.type = "text/css";
		element.href = style;
		element.onload = onload;
		document.head.appendChild(element);
	}

	private loadExtensionScript(counter: number, scripts: { [key: string]: string }, callback: () => void): void {
		let keys = Object.keys(scripts);
		let key = keys[counter];
		let script = scripts[key];
		this.createScriptElement(script, () => {
			counter++;
			if (counter === keys.length) {
				callback();
			} else {
				this.loadExtensionScript(counter, scripts, callback);
			}
		});
	}

	private loadApplications(callback: () => void): void {

		let registry = RestApplicationRegistry.getInstance();
		registry.getScripts((scripts: { [app: string]: { [key: string]: string } }) => {

			let apps = Object.keys(scripts);
			let total = this.calculateTotal(scripts);
			for (let app of apps) {
				let map = scripts[app];
				let keys = Object.keys(map);
				this.loadApplicationScript(0, total, map, keys, 0, callback);
			}
		});
	}

	private createScriptElement(src: string, onload: () => void): void {
		var element = document.createElement("script");
		element.type = "text/javascript";
		element.setAttribute("charset", "UTF-8");
		element.src = src;
		element.onload = onload;
		document.head.appendChild(element);
	}

	private loadApplicationScript(counter: number, total: number, map: { [key: string]: string }, keys: string[], index: number, callback: () => void): void {
		let key = keys[index];
		let script = map[key];
		this.createScriptElement(script, () => {
			counter++;
			if (counter === total) {
				callback();
			} else {
				this.loadApplicationScript(counter, total, map, keys, index + 1, callback);
			}
		});
	}

	private calculateTotal(maps: { [key: string]: { [key: string]: string } }): number {
		let keys = Object.keys(maps);
		let total = 0;
		for (let key of keys) {
			let map = maps[key];
			let keys = Object.keys(map);
			total += keys.length;
		}
		return total;
	}

	private openFiles(callback: () => void): void {
		let part = this.createAdvertiserPart("Loading ...");
		part.message("Opening files");
		let director = directors.getConsoleDirector(this.console);
		director.reopenOpenedFiles((files: number) => {
			if (files === 0) {
				this.console.openDefault();
			}
			part.close(0);
			callback();
		});
	}

	private createPlanePart(parent: Composite): void {

		this.planePart = new Composite(parent);

		let element = this.planePart.getElement();
		element.addClass("bekasi-workspace-shell-plane-part");

		let layout = new AbsoluteLayout();
		this.planePart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.planePart.setLayoutData(layoutData);

		this.createContentPart(this.planePart);
		this.createAdvertiserPanel(this.planePart);
	}

	private createContentPart(parent: Composite): void {

		this.contentPart = new Composite(parent);

		let element = this.contentPart.getElement();
		element.addClass("bekasi-workspace-shell-content-part");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.contentPart.setLayout(layout);

		let layoutData = new AbsoluteData(0, 0, "100%", "100%");
		this.contentPart.setLayoutData(layoutData);

		this.createTaskConsolePart(this.contentPart);
		this.createFullDeckPart(this.contentPart);
	}

	private createTaskConsolePart(parent: Composite): void {

		this.taskConsolePart = new Composite(parent);

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.taskConsolePart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.taskConsolePart.setLayoutData(layoutData);

		this.createTaskBarPart(this.taskConsolePart);
		this.createConsolePart(this.taskConsolePart);

	}

	private createTaskBarPart(parent: Composite): void {

		this.taskManager.createControl(parent);

		let control = this.taskManager.getControl();

		let layoutData = new GridData(true, WorkspaceShell.TASK_BAR_HEIGHT);
		control.setLayoutData(layoutData);

	}

	private createConsolePart(parent: Composite): void {

		this.console.createControl(parent);
		let control = this.console.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

		this.console.setFullDeckCallback((panel: FullDeckPanel, callback: (result: string) => void) => {

			// Tampilkan full deck penuh
			let control = this.fullDeck.getControl();
			let layout = <GridLayout>this.contentPart.getLayout();
			layout.grabVerticalExclusive(this.contentPart, control);
			this.contentPart.relayout();

			let element = control.getElement();
			element.addClass("opened");

			this.fullDeck.open(panel, (result: string) => {

				// Tampilkan kembali task console penuh
				layout.grabVerticalExclusive(this.contentPart, this.taskConsolePart);
				this.contentPart.relayout();

				let element = control.getElement();
				element.removeClass("opened");

				callback(result);

				let panelControl = panel.getControl();
				panelControl.dispose();

			});

		});
	}

	private createFullDeckPart(parent: Composite): void {

		this.fullDeck = new WorkspaceFullDeck();
		this.fullDeck.createControl(parent);

		let control = this.fullDeck.getControl();
		let layoutData = new GridData(true, 0);
		control.setLayoutData(layoutData);

	}

	private createAdvertiserPanel(parent: Composite): void {

		this.advertiserPanel = new AdvertiserPanel();
		this.advertiserPanel.createControl(parent);
		let control = this.advertiserPanel.getControl();

		let layoutData = new AbsoluteData();
		layoutData.height = 0;
		layoutData.width = WorkspaceShell.ADVERTISER_WIDTH;
		layoutData.right = WorkspaceShell.ADVERTISER_MARGIN;
		layoutData.bottom = WorkspaceShell.ADVERTISER_MARGIN;
		control.setLayoutData(layoutData);

		this.advertiserPanel.setCallback((panel: AdvertiserPanel) => {

			let height = panel.adjustHeight();
			let control = panel.getControl();
			let layoutData = <AbsoluteData>control.getLayoutData();
			layoutData.height = height;

			parent.relayout();
		});

	}

	public createAdvertiserPart(title: string): AdvertiserPart {
		return this.advertiserPanel.createAdvertiserPart(title);
	}

	public getTaskManager(): TaskManager {
		return this.taskManager;
	}

	public setSelectedTask(key: TaskKey): void {
		this.console.setSelectedTask(key);
	}

	public setTaskListChanged(): void {
		let director = directors.getConsoleDirector(this.console);
		director.markOpenedFiles();
	}

	public getControl(): Control {
		return this.composite;
	}

}
