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

import VisageValue from "bekasi/visage/VisageValue";

import BuilderPremise from "padang/ui/BuilderPremise";

export abstract class FeatureField implements Panel {

	protected premise: BuilderPremise = null;
	protected target: boolean = false;

	constructor(premise: BuilderPremise, target: boolean) {
		this.premise = premise;
		this.target = target;
	}

	public abstract createControl(parent: Composite, index?: number): void;

	public populate(_formula: string): void {

	}

	public abstract getExampleText(value: VisageValue): any;

	public abstract getValue(): any;

	public abstract setValue(value: VisageValue): void;

	public abstract getControl(): Control;

}

export default FeatureField;