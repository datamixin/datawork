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
import EObject from "webface/model/EObject";

import { StandardType } from "vegazoo/constants";

import DesignTemplate from "vegazoo/directors/templates/DesignTemplate";
import DesignTemplateRegistry from "vegazoo/directors/templates/DesignTemplateRegistry";

import ChannelEncodingRemapper from "vegazoo/directors/templates/remappers/ChannelEncodingRemapper";

export default class BoxplotTemplate implements DesignTemplate {

	public static MARK_TYPE = "boxplot";
	public static BOXPLOT = "Boxplot";
	public static ENCODING = {
		x: { label: "X", field: "label", type: StandardType.ORDINAL },
		y: { label: "Y", field: "count", type: StandardType.QUANTITATIVE }
	}

	public getName(): string {
		return BoxplotTemplate.BOXPLOT;
	}

	public getPriority(): number {
		return 1;
	}

	public getIcon(): string {
		return "mdi-chart-box";
	}

	public getEncodingRemapper(): ChannelEncodingRemapper {
		return new ColumnEncodingRemapper();
	}

	public getMarkType(): string {
		return BoxplotTemplate.MARK_TYPE;
	}

	public getEncodingLabel(key: string): string {
		return BoxplotTemplate.ENCODING[key].label;
	}

}

class ColumnEncodingRemapper extends ChannelEncodingRemapper {

	public remapFeature(oldMapping: { [name: string]: EObject }): { [name: string]: EObject } {
		let newMapping: { [name: string]: EObject } = {};
		this.mapField(oldMapping, "x", newMapping, [StandardType.ORDINAL, StandardType.NOMINAL]);
		this.mapField(oldMapping, "y", newMapping, []);
		return newMapping;
	}

}

let factory = DesignTemplateRegistry.getInstance();
factory.register(BoxplotTemplate.MARK_TYPE, new BoxplotTemplate());