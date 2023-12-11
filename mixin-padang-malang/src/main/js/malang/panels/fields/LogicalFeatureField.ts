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
import Switch from "webface/widgets/Switch";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import VisageType from "bekasi/visage/VisageType";
import VisageLogical from "bekasi/visage/VisageLogical";

import FeatureField from "malang/panels/fields/FeatureField";
import FeatureFieldFactory from "malang/panels/fields/FeatureFieldFactory";

export default class LogicalFeatureField extends FeatureField {

	private control: Switch = null;

	public createControl(parent: Composite, index?: number): void {
		this.control = new Switch(parent, index);
	}

	public populate(_formula: string): void {

	}

	public getExampleText(value: VisageLogical): boolean {
		return value.getValue();
	}

	public getValue(): any {
		return this.control.getSelection();
	}

	public setValue(value: VisageLogical): void {
		let state = value.getValue();
		this.control.setSelection(<any>state);
	}

	public getControl(): Control {
		return this.control;
	}

}


let factory = FeatureFieldFactory.getInstance();
factory.register(VisageType.BOOL, LogicalFeatureField);
factory.register(VisageType.BOOL_, LogicalFeatureField);
factory.register(VisageType.BOOLEAN, LogicalFeatureField);
