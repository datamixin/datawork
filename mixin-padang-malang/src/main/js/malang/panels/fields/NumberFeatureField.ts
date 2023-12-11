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
import Text from "webface/widgets/Text";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import VisageType from "bekasi/visage/VisageType";
import VisageNumber from "bekasi/visage/VisageNumber";

import FeatureField from "malang/panels/fields/FeatureField";
import FeatureFieldFactory from "malang/panels/fields/FeatureFieldFactory";

export default class NumberFeatureField extends FeatureField {

	private text: Text = null;

	public createControl(parent: Composite, index?: number): void {
		this.text = new Text(parent, index);
	}

	public getExampleText(value: VisageNumber): number {
		return value.getValue();
	}

	public getValue(): any {
		return this.text.getText();
	}

	public setValue(value: VisageNumber): void {
		let text = value.getValue();
		this.text.setText(<any>text);
	}

	public getControl(): Control {
		return this.text;
	}

}

let factory = FeatureFieldFactory.getInstance();
factory.register(VisageType.INT32, NumberFeatureField);
factory.register(VisageType.INT64, NumberFeatureField);
factory.register(VisageType.FLOAT32, NumberFeatureField);
factory.register(VisageType.FLOAT64, NumberFeatureField);
factory.register(VisageType.NUMBER, NumberFeatureField);
