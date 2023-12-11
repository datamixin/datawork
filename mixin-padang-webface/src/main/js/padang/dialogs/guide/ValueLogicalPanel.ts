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

import XLogical from "sleman/model/XLogical";

import SwitchPanel from "padang/panels/SwitchPanel";

export default class ValueLogicalPanel implements Panel {

	private logical: XLogical = null;
	private panel = new SwitchPanel();

	constructor(logical: XLogical) {
		this.logical = logical;
	}

	public createControl(parent: Composite, index?: number): void {
		this.panel.createControl(parent);
		this.update();
		this.panel.setOnSelection((state: boolean) => {
			this.logical.setValue(state);
		});
	}

	public setLogical(logical: XLogical): void {
		this.logical = logical;
		this.update();
	}

	private update(): void {
		let value = this.logical.getValue();
		this.panel.setState(value);
	}
	public getValue(): boolean {
		return this.logical.getValue();
	}

	public getControl(): Control {
		return this.panel.getControl();
	}

}