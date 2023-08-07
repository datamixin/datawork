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
import VisageType from "bekasi/visage/VisageType";

import ValuePlan from "padang/plan/ValuePlan";

export default class InputPlan extends ValuePlan {

	public static TYPE_MODEL = "model";
	public static TYPE_UNKNOWN = "unknown";
	public static TYPE_TEMPORAL = "temporal";
	public static TYPE_CONTINUOUS = "continuous";
	public static TYPE_DISCRETE = "discrete";

	private single: boolean = true;
	private types: string[] = [];
	private preferredFields: number = 1;

	constructor(name: string, label: string, description: string, single: boolean, types: string[], fields?: number) {
		super(name, label, description);
		this.single = single;
		this.types = types;
		this.preferredFields = fields === undefined ? 1 : fields;
	}

	public isSingle(): boolean {
		return this.single;
	}

	public getTypes(): string[] {
		return this.types;
	}

	public getPreferredFields(): number {
		return this.preferredFields;
	}

	public static convertType(type: string): string {
		if (VisageType.isNumeric(type)) {
			return InputPlan.TYPE_CONTINUOUS;
		} else if (VisageType.isCategory(type)) {
			return InputPlan.TYPE_DISCRETE;
		} else if (VisageType.isTemporal(type)) {
			return InputPlan.TYPE_TEMPORAL;
		} else {
			throw InputPlan.TYPE_UNKNOWN;
		}
	}

	public static isSeriesType(type: string): boolean {
		return type === InputPlan.TYPE_CONTINUOUS
			|| type === InputPlan.TYPE_DISCRETE
			|| type === InputPlan.TYPE_TEMPORAL;
	}

}