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
import SlemanCreator from "sleman/model/SlemanCreator";

import ChartPreload from "malang/directors/preloads/ChartPreload";
import ModelExpressionMaker from "malang/directors/preloads/ModelExpressionMaker";

export abstract class ModelChartPreload extends ChartPreload {

	private sequence: number = 1;
	private caption: string = null;

	protected creator: SlemanCreator = null;
	protected maker = new ModelExpressionMaker();

	constructor(group: string, name: string, sequence: number, presume: string) {
		super(group, name, presume);
		this.caption = name;
		this.sequence = sequence
		this.creator = SlemanCreator.eINSTANCE;
	}

	public getSequence(): number {
		return this.sequence;
	}

	public getCaption(): string {
		return this.caption;
	}

}

export default ModelChartPreload;