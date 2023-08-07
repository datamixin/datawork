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
import Controller from "webface/wef/Controller";

import * as padang from "padang/padang";

import TabularPart from "padang/view/TabularPart";

import ControllerProperties from "padang/util/ControllerProperties";

import TabularPropertyHandler from "padang/handlers/TabularPropertyHandler";

export default class TabularActuator {

	private controller: Controller;

	constructor(controller: Controller) {
		this.controller = controller;
	}

	private getProperties(): ControllerProperties {
		let model = this.controller.getModel();
		let properties = model.getProperties();
		return new ControllerProperties(this.controller, properties);
	}

	public refreshProperties(): void {
		let model = this.controller.getModel();
		let map = model.getProperties();
		let keySet = map.keySet();
		for (let key of keySet) {
			let keys = ControllerProperties.createKeys(key);
			this.refreshProperty(keys);
		}
	}

	public refreshProperty(keys: string[]) {
		let key = keys[0];
		let view = <TabularPart><any>this.controller.getView();
		let properties = this.getProperties()
		let value = properties.getProperty(keys);
		if (key === TabularPropertyHandler.LEFT_ORIGIN) {
			view.setLeftOrigin(value);
		} else if (key === TabularPropertyHandler.TOP_ORIGIN) {
			view.setTopOrigin(value);
		} else if (key === TabularPropertyHandler.SELECTED_PART) {
			let row = <number>properties.getProperty(TabularPropertyHandler.SELECTED_ROW, -1);
			let column = <number>properties.getProperty(TabularPropertyHandler.SELECTED_COLUMN, -1);
			if (value === TabularPropertyHandler.SELECTED_PART_ROW) {
				view.setSelectedRow(row);
			} else if (value === TabularPropertyHandler.SELECTED_PART_CELL) {
				view.setSelectedCell(row, column);
			} else if (value === TabularPropertyHandler.SELECTED_PART_COLUMN) {
				view.setSelectedColumn(column);
			}
		} else if (key === padang.COLUMN) {
			let column = keys[1];
			let part = keys[2];
			if (part === padang.WIDTH) {
				view.setColumnWidth(column, <number>value);
			} else if (part === padang.FORMAT) {
				view.setColumnFormat(column, <string>value);
			}
		}
	}

}