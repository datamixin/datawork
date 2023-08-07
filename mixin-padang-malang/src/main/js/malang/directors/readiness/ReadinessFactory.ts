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
import XLearning from "malang/model/XLearning";

import BuilderPremise from "padang/ui/BuilderPremise";
import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import Readiness from "malang/directors/readiness/Readiness";

export default class ReadinessFactory {

	private static instance = new ReadinessFactory();

	private readiness = new Map<string, typeof Readiness>();

	constructor() {
		if (ReadinessFactory.instance) {
			throw new Error("Error: Instantiation failed: Use ReadinessFactory.getInstance() instead of new");
		}
		ReadinessFactory.instance = this;
	}

	public static getInstance(): ReadinessFactory {
		return ReadinessFactory.instance;
	}

	public register(name: string, readiness: typeof Readiness): void {
		this.readiness.set(name, readiness);
	}

	public create(learning: XLearning, viewer: BuilderPartViewer, premise: BuilderPremise): Readiness {
		let eClass = learning.eClass();
		let name = eClass.getName();
		let type: any = this.readiness.get(name);
		return <Readiness>(new type(viewer, premise));
	}

}