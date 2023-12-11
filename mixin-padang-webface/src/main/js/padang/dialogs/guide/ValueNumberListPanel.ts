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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import XList from "sleman/model/XList";
import XNumber from "sleman/model/XNumber";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as widgets from "padang/widgets/widgets";

export default class ValueNumberListPanel implements Panel {

	private list: XList = null;
	private panel = new LabelTextPanel();

	constructor(list: XList) {
		this.list = list;
	}

	public createControl(parent: Composite, index?: number): void {
		this.panel.createControl(parent, index);
		this.panel.setEditOnFocus(true);
		widgets.css(this.panel, "border", "1px solid #D8D8D8");
		widgets.css(this.panel, "line-height", "22px");
		this.update();
		this.panel.onCommit((newText: string) => {
			let elements = this.list.getElements();
			elements.clear();
			let strings = newText.split(",");
			for (let str of strings) {
				let literal = str.trim();
				let value = parseInt(literal);
				let factory = SlemanFactory.eINSTANCE;
				let element = factory.createXNumber(value);
				elements.add(element);
			}
		});
	}

	public setNumberList(list: XList): void {
		this.list = list;
		this.update();
	}

	private update(): void {
		let value = this.list.toLiteral();
		if (value !== null) {
			value = value.substring(1, value.length - 1);
			this.panel.setText(value);
		}
	}

	public getValue(): number[] {
		let elements = this.list.getElements();
		let values: number[] = [];
		for (let element of elements) {
			let model = <XNumber>element;
			let value = model.getValue();
			values.push(value);
		}
		return values;
	}

	public getControl(): Control {
		return this.panel.getControl();
	}

}