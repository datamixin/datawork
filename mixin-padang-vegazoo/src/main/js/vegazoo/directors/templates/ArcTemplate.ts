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
import EObject from "webface/model/EObject";

import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";

import { StandardType } from "vegazoo/constants";

import DesignTemplate from "vegazoo/directors/templates/DesignTemplate";
import DesignTemplateRegistry from "vegazoo/directors/templates/DesignTemplateRegistry";

import ChannelEncodingRemapper from "vegazoo/directors/templates/remappers/ChannelEncodingRemapper";

export default class ArcTemplate implements DesignTemplate {

	public static MARK_TYPE = "arc";
	public static ARC = "Arc";
	public static ENCODING = {
		theta: { label: "Value", field: "value", type: StandardType.QUANTITATIVE },
		color: { label: "Category", field: "category", type: "nominal" }
	}

	public getName(): string {
		return ArcTemplate.ARC;
	}

	public getPriority(): number {
		return 6;
	}

	public getIcon(): string {
		return "mdi-chart-pie";
	}

	public getEncodingRemapper(): ChannelEncodingRemapper {
		return new PieEncodingRemapper();
	}

	public getMarkType(): string {
		return ArcTemplate.MARK_TYPE;
	}

	public getEncodingLabel(key: string): string {
		return ArcTemplate.ENCODING[key].label;
	}

}

class PieEncodingRemapper extends ChannelEncodingRemapper {

	public remapFeature(oldMapping: { [name: string]: EObject }): { [name: string]: EObject } {
		let newMapping: { [name: string]: XPositionFieldDef } = {};
		this.mapField(oldMapping, "color", newMapping, [StandardType.ORDINAL, StandardType.NOMINAL]);
		this.mapField(oldMapping, "theta", newMapping, [StandardType.QUANTITATIVE]);
		return newMapping;
	}

}

let factory = DesignTemplateRegistry.getInstance();
factory.register(ArcTemplate.MARK_TYPE, new ArcTemplate());