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
import Adapter from "webface/model/Adapter";
import Notification from "webface/model/Notification";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";

import GridLayout from "webface/layout/GridLayout";

import XText from "sleman/model/XText";
import XList from "sleman/model/XList";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";

export default class NameElementListPanel implements Adapter {

	private static VERTICAL_SPACING = 2;
	private static MAX_HEIGHT = (dialogs.ITEM_HEIGHT + NameElementListPanel.VERTICAL_SPACING) * 4;

	private support: NameListSupport = null;
	private list: XList = null;
	private scrollable: Scrollable = null;
	private composite: Composite = null;
	private container: Composite = null;

	constructor(support: NameListSupport, list: XList) {
		this.support = support;
		this.list = list;
		this.prepareAdapter();
	}

	private prepareAdapter(): void {
		let adapter = this.list.eAdapters();
		adapter.add(this);
	}

	public createControl(parent: Composite, index?: number): void {
		this.scrollable = new Scrollable(parent, index);
		this.scrollable.setData(this);
		this.scrollable.setExpandHorizontal(true);
		this.createComposite(this.scrollable);
	}

	private createComposite(parent: Scrollable): void {
		this.composite = new Composite(parent);
		this.composite.setData(this);
		parent.setContent(this.composite);
		widgets.setGridLayout(this.composite, 1, 0, 0, 0, NameElementListPanel.VERTICAL_SPACING);
		this.createContainer(this.composite);
		this.createAddIcon(this.composite);
	}

	private createContainer(parent: Composite, index?: number): void {
		this.container = new Composite(parent, index);
		widgets.setGridLayout(this.container, 1, 0, 0, 0, NameElementListPanel.VERTICAL_SPACING);
		widgets.setGridData(this.container, true, true);
		let elements = this.list.getElements();
		for (let element of elements) {
			this.createElementPart(this.container, <XText>element);
		}
	}

	private createElementPart(parent: Composite, text: XText): void {
		let panel = new NameElementPanel(this.support, text);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createAddIcon(parent: Composite): void {
		let icon = dialogs.createIconLabelGrid(parent, "mdi-plus-circle-outline", "Add Column");
		icon.setOnSelection(() => {
			this.support.load((names: string[]) => {
				guide.createListText(names[0], this.list);
			});
		});
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		if (eventType === Notification.ADD) {
			let element = <XText>notification.getNewValue();
			this.createElementPart(this.container, element);
		} else if (eventType === Notification.REMOVE) {
			let element = <XText>notification.getOldValue();
			let control = guide.getChildrenByData(this.container, element);
			control.dispose();
		}
		this.composite.relayout();
	}

	public adjustHeight(): number {
		let layout = <GridLayout>this.container.getLayout();
		let count = this.list.getElementCount();
		let height = dialogs.ITEM_HEIGHT;
		if (count > 0) {
			height += (layout.verticalSpacing + dialogs.ITEM_HEIGHT) * count;
		}
		this.scrollable.setMinHeight(height);
		if (height > NameElementListPanel.MAX_HEIGHT) {
			height = NameElementListPanel.MAX_HEIGHT;
		}
		this.composite.relayout();
		return height;
	}

	public getControl(): Control {
		return this.scrollable;
	}

}

class NameElementPanel {

	private support: NameListSupport = null;
	private text: XText = null;
	private composite: Composite = null;
	private namePanel: NameListComboPanel = null;

	constructor(support: NameListSupport, text: XText) {
		this.support = support;
		this.text = text;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this.text);
		widgets.setGridLayout(this.composite, 2, 0, 0);

		this.createColumnCombo(this.composite);
		this.createRemoveIcon(this.composite);

	}

	private createColumnCombo(parent: Composite): void {
		this.namePanel = new NameListComboPanel(this.support, this.text);
		this.namePanel.createControl(parent);
		widgets.setGridData(this.namePanel, true, true);
	}

	private createRemoveIcon(parent: Composite): void {
		let icon = dialogs.createIconGrid(this.composite, "mdi-close-circle-outline");
		icon.setOnSelection(() => {
			guide.remove(this.text);
		});
	}

	public getControl(): Control {
		return this.composite;
	}

}
