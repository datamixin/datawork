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
import { expressionFactory } from "sleman/ExpressionFactory";

import VisageValue from "bekasi/visage/VisageValue";
import VisageConstant from "bekasi/visage/VisageConstant";
import VisageStructure from "bekasi/visage/VisageStructure";

export default class ValueMapping {

	private values = new Map<string, VisageValue>();
	private formulas = new Map<string, string>();

	public setValue(key: string, value: VisageValue): void {
		this.values.set(key, value);
	}

	public getValue(key: string): VisageValue {
		return this.values.get(key);
	}

	public setFormula(key: string, formula: string): void {
		this.formulas.set(key, formula);
	}

	public getFormula(key: string): string {
		return this.formulas.get(key);
	}

	public getValueAsFormula(key: string): string {
		let value = this.values.get(key);
		let object: any = null;
		if (value instanceof VisageConstant) {
			object = value.getValue();
		} else if (value instanceof VisageStructure) {
			object = value.toValue();
		} else if (value !== null) {
			throw new Error(value + " not instance of VisageConstant or VisageStructure");
		}
		let model = expressionFactory.createValue(object);
		return "=" + model.toLiteral();
	}

	public setValueAsFormula(key: string): void {
		let formula = this.getValueAsFormula(key);
		this.setFormula(key, formula);
	}

	public delete(key: string): void {
		this.values.delete(key);
		this.formulas.delete(key);
	}

	public containsValue(key: string): boolean {
		return this.values.has(key);
	}

	public getFormulaKeys(): string[] {
		let keys: string[] = [];
		let names = this.formulas.keys();
		for (let name of names) {
			keys.push(name);
		}
		return keys;
	}

	public get size(): number {
		return this.values.size;
	}

	public clear(): void {
		this.values.clear();
		this.formulas.clear();
	}

	public copy(): ValueMapping {
		let mapping = new ValueMapping();
		let keys = this.values.keys();
		for (let key of keys) {
			let value = this.getValue(key);
			let formula = this.getFormula(key);
			mapping.setValue(key, value);
			mapping.setFormula(key, formula);
		}
		return mapping;
	}

}