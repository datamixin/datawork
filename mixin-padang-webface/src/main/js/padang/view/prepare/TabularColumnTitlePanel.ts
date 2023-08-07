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

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import VisageType from "bekasi/visage/VisageType";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import ViewAction from "padang/view/ViewAction";
import NameMenuPanel from "padang/view/NameMenuPanel";
import * as TypeDecoration from "padang/view/TypeDecoration";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import DefaultColumnProperties from "padang/view/DefaultColumnProperties";

import InteractionFactory from "padang/interactions/InteractionFactory";

import GridControlStyle from "padang/grid/GridControlStyle";
import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";

import TabularColumnMenuAction from "padang/view/prepare/TabularColumnMenuAction";

import TabularInteractionRequest from "padang/requests/prepare/TabularInteractionRequest";
import TabularGuideDialogRequest from "padang/requests/prepare/TabularGuideDialogRequest";
import TabularColumnInspectResetRequest from "padang/requests/TabularColumnInspectResetRequest";

export default class TabularColumnTitlePanel extends ConductorPanel implements GridColumnLabelPanel {

	private static TYPE_WIDTH = 24;

	private label: DefaultColumnLabel = null;
	private properties: DefaultColumnProperties = null;
	private composite: Composite = null;
	private typePanel = new MenuPanel();
	private nameMenuPanel = new NameMenuPanel();
	private selected: boolean = false;
	private action: TabularColumnMenuAction = null;;

	constructor(conductor: Conductor, properties: DefaultColumnProperties) {
		super(conductor);
		this.properties = properties;
		this.action = new TabularColumnMenuAction(this.conductor);
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-preparation-column-label-panel");

		this.composite.onSelection(() => {
			let request = new TabularColumnInspectResetRequest();
			this.conductor.submit(request);
		});

		view.setGridLayout(this.composite, 2, 3, 0, 0, 0);
		this.createTypePanel(this.composite);
		this.createNameMenuPanel(this.composite);
	}

	private createTypePanel(parent: Composite): void {
		this.typePanel.createControl(parent);
		this.typePanel.setColor("#BBB");
		let actions = this.createTypeActions();
		this.typePanel.setActions(actions);
		view.css(this.typePanel, "line-height", GridControlStyle.HEADER_HEIGHT + "px");
		view.setGridData(this.typePanel, TabularColumnTitlePanel.TYPE_WIDTH, true);
	}

	private createTypeActions(): ViewAction[] {
		let actions: ViewAction[] = [];
		let labels = Object.keys(VisageType.LABEL_TYPE_MAP);
		for (let label of labels) {
			let name = VisageType.LABEL_TYPE_MAP[label];
			let callback = () => {
				let column = this.nameMenuPanel.getName();
				let factory = InteractionFactory.getInstance();
				let typeMap: { [column: string]: string } = {};
				typeMap[column] = name;
				let interaction = factory.createChangeTypes(typeMap);
				let request = new TabularInteractionRequest(interaction);
				this.conductor.submit(request);
			}
			let action = new ViewAction(label, callback, TypeDecoration.ICON_MAP[name]);
			actions.push(action);
		}

		// To Datetime
		let callback = () => {
			let factory = InteractionFactory.getInstance();
			let name = this.label.getLabel();
			let interaction = factory.createToDatetime(name, "");
			let request = new TabularGuideDialogRequest(interaction);
			this.conductor.submit(request);
		}
		let action = new ViewAction("Datetime", callback, TypeDecoration.ICON_MAP.DATETIME);
		actions.push(action);

		return actions;
	}

	private createNameMenuPanel(parent: Composite): void {

		this.nameMenuPanel.createControl(parent);
		this.nameMenuPanel.setOnNameChanged((newName: string, oldName: string,
			callback: (success: boolean) => void) => {

			let names = this.properties.getColumns();
			if (names.indexOf(newName) === -1) {

				let nameMap: { [oldName: string]: string } = {};
				nameMap[oldName] = newName;

				let factory = InteractionFactory.getInstance();
				let interaction = factory.createRenameColumns(nameMap);
				let request = new TabularInteractionRequest(interaction);
				this.conductor.submit(request);
				callback(true);

			} else {
				callback(false);
			}
		});

		this.nameMenuPanel.setMenuActions(this.action);

		view.css(this.nameMenuPanel, "line-height", GridControlStyle.HEADER_HEIGHT + "px");
		view.setGridData(this.nameMenuPanel, true, true);
	}

	public setLabel(label: DefaultColumnLabel): void {

		this.label = label;
		let name = this.label.getLabel();
		this.action.setName(name);
		this.nameMenuPanel.setName(name);

		let type = this.label.getType();
		if (VisageType.isTemporal(type)) {
			type = VisageType.DATETIME;
		}
		this.action.setType(type);
		let icon = TypeDecoration.ICON_MAP[type];
		this.typePanel.setIcon(icon);
	}

	public setProperty(_name: string, _value: any): void {

	}

	public setSelected(selected: boolean): void {
		this.selected = selected;
		view.setSelected(this.composite, this.selected);
	}

	public adjustWidth(): number {
		return GridControlStyle.MIN_COLUMN_WIDTH;
	}

	public getControl(): Control {
		return this.composite;
	}

}
