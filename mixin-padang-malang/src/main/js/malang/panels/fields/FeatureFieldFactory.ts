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
import BuilderPremise from "padang/ui/BuilderPremise";

import FeatureField from "malang/panels/fields/FeatureField";

export default class FeatureFieldFactory {

	private static instance = new FeatureFieldFactory();

	private fields = new Map<string, any>();

	constructor() {
		if (FeatureFieldFactory.instance) {
			throw new Error("Error: Instantiation failed: Use FeatureFieldFactory.getInstance() instead of new");
		}
		FeatureFieldFactory.instance = this;
	}

	public static getInstance(): FeatureFieldFactory {
		return FeatureFieldFactory.instance;
	}

	public register(name: string, field: any): void {
		this.fields.set(name, field);
	}

	public create(name: string, premise: BuilderPremise, target: boolean): FeatureField {
		let lowercase = name.toLowerCase();
		let field = this.fields.get(lowercase);
		return new field(premise, target);
	}

}