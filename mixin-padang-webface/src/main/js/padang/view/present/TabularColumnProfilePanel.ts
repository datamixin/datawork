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

import VisageValue from "bekasi/visage/VisageValue";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import Propane from "padang/view/present/propane/Propane";
import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";
import PropaneFactory from "padang/view/present/propane/PropaneFactory";
import GenericPropane from "padang/view/present/propane/GenericPropane";

export default class TabularColumnProfilePanel extends ConductorPanel {

	private composite: Composite = null;

	private column: string = null;
	private type: string = null;
	private propane: Propane = null;

	constructor(conductor: Conductor, column: string, type: string) {
		super(conductor);
		this.column = column;
		this.type = type;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		view.setGridLayout(this.composite, 1, 0, 0);
		this.createPropaneControl(this.composite);
	}

	public createPropaneControl(parent: Composite): void {

		let factory = PropaneFactory.getInstance();
		if (factory.isExists(this.type)) {
			this.propane = factory.create(this.conductor, this.column, this.type);
		} else {
			this.propane = new GenericPropane(this.conductor, this.column, this.type);
		}
		this.propane.createControl(parent);
		let control = this.propane.getControl();
		view.setGridData(control, true, true);

	}

	public setInitialProfile(value: VisageValue): void {
		this.propane.setInitialProfile(value);
	}

	public setFormat(value: any): void {
		this.propane.setFormat(value);
	}

	public populateFigure(): void {
		this.propane.populateFigure();
	}

	public inspectProfile(value: VisageValue): void {
		this.propane.setInspectProfile(value);
	}

	public selectValues(values: Map<string, any>): void {
		this.propane.setSelectionValues(values);
	}

	public setMenuSet(menuSet: PropaneMenuSet): void {
		if (this.propane !== null) {
			this.propane.setMenuSet(menuSet);
		}
	}

	public relayout(): void {
		this.propane.adjustHeight();
	}

	public getControl(): Control {
		return this.composite;
	}

}