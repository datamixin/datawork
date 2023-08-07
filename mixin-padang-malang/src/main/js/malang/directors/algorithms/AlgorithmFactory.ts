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
import GraphicPremise from "padang/ui/GraphicPremise";

import Algorithm from "malang/directors/algorithms/Algorithm";

export default class AlgorithmFactory {

	private static instance = new AlgorithmFactory();

	private types = new Map<string, any>();

	constructor() {
		if (AlgorithmFactory.instance) {
			throw new Error("Error: Instantiation failed: Use AlgorithmFactory.getInstance() instead of new");
		}
		AlgorithmFactory.instance = this;
	}

	public static getInstance(): AlgorithmFactory {
		return AlgorithmFactory.instance;
	}

	public create(name: string, premise: GraphicPremise, parameters: Map<string, any>): Algorithm {
		return <Algorithm>(new (this.types.get(name))(premise, parameters));
	}

	public register(name: string, type: any): void {
		this.types.set(name, type);
	}

}
