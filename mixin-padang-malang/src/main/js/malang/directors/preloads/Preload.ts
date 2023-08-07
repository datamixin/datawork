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
import Point from "webface/graphics/Point";

import GraphicPremise from "padang/ui/GraphicPremise";

import XModeler from "malang/model/XModeler";

import PreloadPanel from "malang/panels/PreloadPanel";

import InstantResultPlan from "malang/plan/InstantResultPlan";

import PreloadSupport from "malang/directors/preloads/PreloadSupport";

export abstract class Preload {

	private group: string = null;
	private name: string = null;

	constructor(group: string, name: string) {
		this.group = group;
		this.name = name;
	}

	public getGroup(): string {
		return this.group;
	}

	public getQualifiedName(): string {
		return InstantResultPlan.getQualifiedName(this.group, this.name);
	}

	public getCaption(): string {
		return this.name;
	}

	abstract getPresume(): string;

	abstract getSequence(): number;

	abstract isApplicable(support: PreloadSupport, model: XModeler): boolean;

	abstract getResult(premise: GraphicPremise, model: XModeler,
		size: Point, callback: (panel: PreloadPanel) => void): void;

}

export default Preload;