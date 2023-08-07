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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";

import VegaliteChart from "vegazoo/widgets/VegaliteChart";

import BasePreloadPanel from "malang/directors/preloads/BasePreloadPanel";

export default class ChartPreloadPanel extends BasePreloadPanel {

	private static DEFAULT_WIDTH = 180;
	private static DEFAULT_HEIGHT = 240;

	private spec: any = null;
	private size: Point = null;
	private control: Control = null;

	constructor(caption: string, spec: any, size: Point) {
		super(caption);
		this.spec = spec;
		this.size = size;
	}

	protected createContentControl(parent: Composite): void {
		let widget = new VegaliteChart(parent);
		widget.setSpec(this.spec);
		this.control = widget;
		view.addClass(this.control, "malang-chart-preload-panel");
	}

	public getRequiredSize(): Point {
		let width = this.size.x;
		let height = this.size.y;
		width = width === null || width === 0 ? ChartPreloadPanel.DEFAULT_WIDTH : width;
		height = height === null || height === 0 ? ChartPreloadPanel.DEFAULT_HEIGHT : height;
		return new Point(width, height);
	}

	public getContentControl(): Control {
		return this.control;
	}

}
