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

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import AbsoluteData from "webface/layout/AbsoluteData";
import AbsoluteLayout from "webface/layout/AbsoluteLayout";

import LabelProvider from "webface/viewers/LabelProvider";

import ListSelectionDialog from "webface/dialogs/ListSelectionDialog";

import TaskKey from "bekasi/ui/TaskKey";
import TaskItem from "bekasi/ui/TaskItem";
import TaskContent from "bekasi/ui/TaskContent";
import TaskManager from "bekasi/ui/TaskManager";
import WorkspaceSite from "bekasi/ui/WorkspaceSite";
import WorkspaceTaskItemPanel from "bekasi/ui/WorkspaceTaskItemPanel";

import TaskManagerSaveAllAction from "bekasi/actions/TaskManagerSaveAllAction";
import TaskManagerCloseAllAction from "bekasi/actions/TaskManagerCloseAllAction";
import TaskManagerCloseAllInactiveAction from "bekasi/actions/TaskManagerCloseAllInactiveAction";

export default class WorkspaceTaskManager implements TaskManager {

	private static ITEM_WIDTH = 160;
	private static HOME_WIDTH = 48;
	private static LIST_WIDTH = 32;
	private static MENU_WIDTH = 34;

	private site: WorkspaceSite = null;
	private composite: Composite = null;
	private homePart: Composite = null;
	private homePanel: WorkspaceTaskItemPanel = null;
	private itemPart: Composite = null;
	private itemContainer: Composite = null;
	private listPart: Composite = null;
	private listIcon: WebFontIcon = null;
	private menuPart: Composite = null;
	private menuIcon: WebFontIcon = null;
	private contentContainer: Composite = null;
	private itemPanels: WorkspaceTaskItemPanel[] = [];
	private selectedItemPanel: WorkspaceTaskItemPanel = null;

	constructor(site: WorkspaceSite) {
		this.site = site;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-task-manager");

		let layout = new GridLayout(4, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createHomePart(this.composite);
		this.createItemPart(this.composite);
		this.createListPart(this.composite);
		this.createMenuPart(this.composite);

	}

	public createHomePart(parent: Composite): void {

		this.homePart = new Composite(parent);

		let element = this.homePart.getElement();
		element.addClass("bekasi-workspace-task-manager-home-part");
		element.css("background", "#4d5e6d");
		element.css("border-right", "2px solid #FFF");

		let layout = new GridLayout(1, 0, 0);
		this.homePart.setLayout(layout);

		let layoutData = new GridData(WorkspaceTaskManager.HOME_WIDTH, WorkspaceTaskItemPanel.HEIGHT);
		this.homePart.setLayoutData(layoutData);

	}

	private createItemPart(parent: Composite): void {

		this.itemPart = new Composite(parent);

		let element = this.itemPart.getElement();
		element.addClass("bekasi-workspace-task-manager-item-part");

		let layout = new AbsoluteLayout();
		this.itemPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.itemPart.setLayoutData(layoutData);

		this.createItemContainer(this.itemPart);

	}

	private createItemContainer(parent: Composite): void {

		this.itemContainer = new Composite(parent);

		let element = this.itemContainer.getElement();
		element.addClass("bekasi-workspace-task-manager-item-container");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.itemContainer.setLayout(layout);

		let layoutData = new AbsoluteData(0, 0, 0, WorkspaceTaskItemPanel.HEIGHT);
		this.itemContainer.setLayoutData(layoutData);

	}

	private createListPart(parent: Composite): void {

		this.listPart = new Composite(parent);
		this.listPart.setVisible(false);

		let element = this.listPart.getElement();
		element.addClass("bekasi-workspace-task-manager-list-part");
		element.css("background", "#ffa021");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.listPart.setLayout(layout);

		let layoutData = new GridData(WorkspaceTaskManager.LIST_WIDTH, WorkspaceTaskItemPanel.HEIGHT);
		this.listPart.setLayoutData(layoutData);

		this.createListIcon(this.listPart);
	}

	private createListIcon(parent: Composite): void {

		this.listIcon = new WebFontIcon(parent);
		this.listIcon.addClasses("mdi", "mdi-dots-horizontal");

		let element = this.listIcon.getElement();
		element.addClass("bekasi-workspace-task-manager-list-icon");
		element.css("line-height", WorkspaceTaskItemPanel.HEIGHT + "px");
		element.css("color", "#FFF");
		element.css("font-size", "24px");

		let layoutData = new GridData(true, true);
		this.listIcon.setLayoutData(layoutData);

		this.listIcon.onSelection(() => {

			let dialog = new ListSelectionDialog();
			dialog.setWindowTitle("File Dialog");
			dialog.setPrompt("Please select file");
			dialog.setLabelProvider(new TaskItemPanelLabelProvider());
			dialog.setInput(this.itemPanels);
			dialog.open((result: string) => {
				if (result === ListSelectionDialog.OK) {
					let panel = <WorkspaceTaskItemPanel>dialog.getFirstSelection();
					this.doSelect(panel, true, true, () => { });
				}
			});
		});

	}

	private createMenuPart(parent: Composite): void {

		this.menuPart = new Composite(parent);
		this.menuPart.setVisible(false);

		let element = this.menuPart.getElement();
		element.addClass("bekasi-workspace-task-manager-menu-part");
		element.css("background", "#4d5e6d");
		element.css("border-left", "2px solid #FFF");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.menuPart.setLayout(layout);

		let layoutData = new GridData(WorkspaceTaskManager.MENU_WIDTH, WorkspaceTaskItemPanel.HEIGHT);
		this.menuPart.setLayoutData(layoutData);

		this.createMenuIcon(this.menuPart);
	}

	private createMenuIcon(parent: Composite): void {

		this.menuIcon = new WebFontIcon(parent);
		this.menuIcon.addClasses("mdi", "mdi-menu-down");

		let element = this.menuIcon.getElement();
		element.addClass("bekasi-workspace-task-manager-menu-icon");
		element.css("line-height", WorkspaceTaskItemPanel.HEIGHT + "px");
		element.css("color", "#FFF");
		element.css("font-size", "24px");

		let layoutData = new GridData(true, true);
		this.menuIcon.setLayoutData(layoutData);

		this.menuIcon.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				let action = new TaskManagerPopupAction(this);
				action.open(event);
			}
		});

	}

	private doSelect(panel: WorkspaceTaskItemPanel, preference: boolean,
		content: boolean, callback: () => void): void {

		if (this.selectedItemPanel !== panel) {

			// De-select current selected item
			if (this.selectedItemPanel !== null) {
				this.selectedItemPanel.setSelected(false);
				let selectedItem = this.selectedItemPanel.getItem();
				let selectedContent = selectedItem.getContent();
				this.showContent(selectedContent, false, callback);
			}

			// Select new item
			panel.setSelected(true);
			this.selectedItemPanel = panel;

			if (preference === true) {
				let item = this.selectedItemPanel.getItem();
				let key = item.getKey();
				this.site.setSelectedTask(key);
			}
		}

		if (content === true) {
			let item = panel.getItem();
			let content = item.getContent();
			this.setSelectedContent(content, callback);
		} else {
			callback();
		}

		let children = this.itemContainer.getChildren();
		let containerData = <AbsoluteData>this.itemContainer.getLayoutData();
		let size = this.itemPart.computeSize();
		let available = size.x;
		this.menuPart.setVisible(children.length > 0);
		if (panel !== this.homePanel) {

			// Atur posisi left item container
			let required = children.length * WorkspaceTaskManager.ITEM_WIDTH;
			this.listPart.setVisible(available < required);
			if (available > required) {
				containerData.left = 0;
			} else {
				let control = panel.getControl();
				let index = children.indexOf(control);
				let viewportLeft = Math.abs(<number>containerData.left);
				let viewportRight = viewportLeft + available;
				let selectLeft = index * WorkspaceTaskManager.ITEM_WIDTH;
				let selectRight = selectLeft + WorkspaceTaskManager.ITEM_WIDTH;
				if (viewportLeft > selectLeft) {
					containerData.left = -selectLeft;
				} else if (viewportRight < selectRight) {
					containerData.left = available - selectRight;
				} else {
					let lastLeft = (children.length - 1) * WorkspaceTaskManager.ITEM_WIDTH;
					let lastRight = lastLeft + WorkspaceTaskManager.ITEM_WIDTH;
					let rightSpace = lastRight < viewportRight ? viewportRight - lastRight : 0;
					containerData.left = <number>containerData.left + rightSpace;
				}
			}
		}
		this.itemPart.relayout();
		this.composite.relayout();
	}

	private showContent(content: TaskContent, state: boolean, callback: () => void): void {
		let control = content.getControl();
		let layoutData = <GridData>control.getLayoutData();
		if (state === true) {
			layoutData.applyFillVertical();
		} else {
			layoutData.applyZeroHeight();
		}
		content.activated(state, callback);
		this.contentContainer.relayout();
	}

	public selectDefault(): void {
		this.doSelect(this.homePanel, true, true, () => { });
	}

	public setDefault(item: TaskItem): void {

		this.homePanel = new WorkspaceTaskItemPanel(item);
		this.homePanel.createControl(this.homePart);

		let control = this.homePanel.getControl();
		let element = control.getElement();
		element.css("text-indent", "3px");

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

		this.homePanel.setSelectCallback(() => {
			this.selectDefault();
		});
	}

	public setContentContainer(container: Composite): void {
		this.contentContainer = container;
	}

	public addItem(item: TaskItem): void {

		let panel = new WorkspaceTaskItemPanel(item);
		panel.createControl(this.itemContainer);
		this.itemPanels.push(panel);

		// Handling select
		panel.setSelectCallback(() => {

			for (let i = 0; i < this.itemPanels.length; i++) {
				let element = this.itemPanels[i];
				if (element === panel) {
					if (this.selectedItemPanel !== element) {
						this.doSelect(element, true, true, () => { });
						break;
					}
				}
			}

		});

		// Handling close panel
		panel.setCloseCallback(() => {

			for (let i = 0; i < this.itemPanels.length; i++) {
				let element = this.itemPanels[i];
				if (element === panel) {

					// Hapus panel dari dalam array
					this.itemPanels.splice(i, 1);

					// Setelah hapus otomatis select item lain
					if (this.itemPanels.length === 0) {
						this.selectDefault();
					} else {
						if (i === this.itemPanels.length) {
							i = this.itemPanels.length - 1;
						}
						let panel = this.itemPanels[i];
						this.doSelect(panel, true, true, () => { });
					}
					break;
				}
			}

			this.site.setTaskListChanged();

		});

		let containerLayout = <GridLayout>this.itemContainer.getLayout();
		containerLayout.numColumns = this.itemPanels.length;

		let control = panel.getControl();
		let itemData = new GridData(WorkspaceTaskManager.ITEM_WIDTH, WorkspaceTaskItemPanel.HEIGHT);
		control.setLayoutData(itemData);

		let containerData = <AbsoluteData>this.itemContainer.getLayoutData();
		containerData.width = WorkspaceTaskManager.ITEM_WIDTH * this.itemPanels.length;

		this.itemPart.relayout();

	}

	private seekPanel(key: TaskKey, callback: (panel: WorkspaceTaskItemPanel) => void): void {
		for (let panel of this.itemPanels) {
			if (panel.isMatch(key)) {
				callback(panel);
			}
		}
	}

	public setItemName(key: TaskKey, name: string): void {
		this.seekPanel(key, (panel: WorkspaceTaskItemPanel) => {
			panel.setText(name);
		});
	}

	public getItem(key: TaskKey): TaskItem {
		for (let i = 0; i < this.itemPanels.length; i++) {
			let panel = this.itemPanels[i];
			if (panel.isMatch(key)) {
				let item = panel.getItem();
				return item;
			}
		}
		return null;
	}

	public isItemExists(key: TaskKey): boolean {
		for (let i = 0; i < this.itemPanels.length; i++) {
			let panel = this.itemPanels[i];
			if (panel.isMatch(key)) {
				return true;
			}
		}
		return false;
	}

	public selectItem(key: TaskKey, preference: boolean, content: boolean, callback: () => void): void {
		let homeItem = this.homePanel.getItem();
		let homeKey = homeItem.getKey();
		if (homeKey.getIdentity() === key.getIdentity()) {
			this.selectDefault();
			callback();
		} else {
			this.seekPanel(key, (panel: WorkspaceTaskItemPanel) => {
				this.doSelect(panel, preference, content, callback);
			});
		}
	}

	public removeItem(key: TaskKey): void {
		this.seekPanel(key, (panel: WorkspaceTaskItemPanel) => {
			let index = this.itemPanels.indexOf(panel);
			this.itemPanels.splice(index, 1);
			panel.remove();
		});
	}

	public refreshItem(key: TaskKey): void {
		this.seekPanel(key, (panel: WorkspaceTaskItemPanel) => {
			panel.refresh();
		});
	}

	public getItemKeys(): TaskKey[] {
		let keys: TaskKey[] = [];
		for (let panel of this.itemPanels) {
			let item = panel.getItem();
			let key = item.getKey();
			keys.push(key);
		}
		return keys;
	}

	public getSelectedContent(): TaskContent {
		let item = this.selectedItemPanel.getItem();
		return item.getContent();
	}

	public setSelectedContent(content: TaskContent, callback?: () => void): void {
		this.showContent(content, true, callback);
	}

	public reset(): void {
		this.itemPanels.splice(0, this.itemPanels.length);
	}

	public getControl(): Control {
		return this.composite;
	}

}

class TaskItemPanelLabelProvider implements LabelProvider {

	public getText(element: WorkspaceTaskItemPanel): string {
		let item = element.getItem();
		return item.getText();
	}

}

class TaskManagerPopupAction extends PopupAction {

	private manager: TaskManager = null;

	constructor(manager: TaskManager) {
		super();
		this.manager = manager;
	}

	public getActions(): Action[] {
		let actions: Action[] = [];
		actions.push(new TaskManagerSaveAllAction(this.manager));
		actions.push(new TaskManagerCloseAllAction(this.manager));
		actions.push(new TaskManagerCloseAllInactiveAction(this.manager));
		return actions;
	}

}
