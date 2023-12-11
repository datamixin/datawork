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
import PlotPlan from "rinjani/plan/PlotPlan";

import ResultPlan from "malang/plan/ResultPlan";

export default class InstantResultPlan extends ResultPlan {

	public static LEAN_NAME = "InstantResultPlan";

	private preload: string = null
	private requiredWidth = PlotPlan.MINIMUM_WIDTH;
	private requiredHeight = PlotPlan.MINIMUM_HEIGHT;

	constructor(group: string, name: string, requiredWidth?: number, requiredHeight?: number) {
		super(InstantResultPlan.LEAN_NAME);
		this.preload = InstantResultPlan.getQualifiedName(group, name);
		this.requiredWidth = requiredWidth === undefined ? PlotPlan.MINIMUM_WIDTH : requiredWidth;
		this.requiredHeight = requiredHeight === undefined ? PlotPlan.MINIMUM_HEIGHT : requiredHeight;
	}

	public getPreload(): string {
		return this.preload;
	}

	public getRequiredWidth(): number {
		return this.requiredWidth;
	}

	public getRequiredHeight(): number {
		return this.requiredHeight;
	}

	public static getQualifiedName(group: string, name: string): string {
		return group + ":" + name;
	}

}
