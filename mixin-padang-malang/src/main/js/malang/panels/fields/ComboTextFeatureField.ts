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
import Combo from "webface/widgets/Combo";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import SlemanCreator from "sleman/model/SlemanCreator";

import FormulaParser from "bekasi/FormulaParser";

import VisageText from "bekasi/visage/VisageText";
import VisageType from "bekasi/visage/VisageType";
import VisageList from "bekasi/visage/VisageList";

import Distinct from "padang/functions/list/Distinct";

import TextFeatureField from "malang/panels/fields/TextFeatureField";
import FeatureFieldFactory from "malang/panels/fields/FeatureFieldFactory";

export default class ComboTextFeatureField extends TextFeatureField {

	private control: Control = null;

	public createControl(parent: Composite, index?: number): void {
		if (this.target === true) {
			this.control = new Label(parent, index);
		} else {
			this.control = new Combo(parent, index);
		}
	}

	private getCombo(): Combo {
		return <Combo>this.control;
	}

	public populate(formula: string): void {
		if (this.target === false) {
			let creator = SlemanCreator.eINSTANCE;
			let parser = new FormulaParser();
			let list = parser.parse(formula);
			let call = creator.createCall(Distinct.FUNCTION_NAME, list);
			this.premise.evaluate(call, (list: VisageList) => {
				let values = list.toArray();
				let combo = this.getCombo();
				combo.setItems(values);
			});
		}
	}

	public getValue(): any {
		if (this.target === true) {
			return (<Label>this.control).getText();
		} else {
			return (<Combo>this.control).getSelectionText();
		}
	}

	public setValue(value: VisageText): void {
		let text = value.getValue();
		if (this.target === true) {
			(<Label>this.control).setText(text);
		} else {
			(<Combo>this.control).setSelectionText(text);
		}
	}

	public getControl(): Control {
		return this.control;
	}

}

let factory = FeatureFieldFactory.getInstance();
factory.register(VisageType.STR, ComboTextFeatureField);
factory.register(VisageType.STRING, ComboTextFeatureField);
