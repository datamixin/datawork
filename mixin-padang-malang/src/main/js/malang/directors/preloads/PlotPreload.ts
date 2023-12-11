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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Point from "webface/graphics/Point";

import XAssignment from "sleman/model/XAssignment";

import BuilderPremise from "padang/ui/BuilderPremise";

import PlotPlan from "rinjani/plan/PlotPlan";

import Plot from "rinjani/directors/plots/Plot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import ParameterMaker from "rinjani/directors/plots/ParameterMaker";

import XModeler from "malang/model/XModeler";

import PreloadPanel from "malang/panels/PreloadPanel";

import Preload from "malang/directors/preloads/Preload";

import BasePreloadPanel from "malang/directors/preloads/BasePreloadPanel";

export abstract class PlotPreload extends Preload {

	protected presume: string = null;
	protected plan: PlotPlan = null;
	protected header: boolean = false;

	constructor(name: string, group: string, presume: string, plan: PlotPlan, header?: boolean) {
		super(name, group);
		this.presume = presume;
		this.plan = plan;
		this.header = header === undefined ? true : header;
	}

	public getPresume(): string {
		return this.presume;
	}

	public getPlan(): PlotPlan {
		return this.plan;
	}

	public getResult(premise: BuilderPremise, model: XModeler, size: Point,
		callback: (panel: PreloadPanel) => void): void {
		let name = this.plan.getName();
		let factory = PlotFactory.getInstance();
		let plans = this.plan.getParameters();
		let maker = new ParameterMaker(plans);
		let parameters = maker.createParameters();
		let plot = factory.create(name, this.plan, premise, parameters);
		let assignments = this.createAssignments(premise, model);
		let post = new Point(size.x, size.y);
		if (this.header === true) {
			post.y -= BasePreloadPanel.HEADER_HEIGHT;
		}
		plot.execute(assignments, post, (panel: Panel) => {
			if (this.header === true) {
				let caption = this.getCaption();
				let result = new CaptionedPlotPanel(caption, plot, size, panel);
				callback(result);
			} else {
				let result = new CaptionlessPlotPanel(plot, size, panel);
				callback(result);
			}
		});
	}

	protected abstract createAssignments(premise: BuilderPremise, model: XModeler): XAssignment[];

}

class CaptionlessPlotPanel implements PreloadPanel {

	private plot: Plot = null;
	private size: Point = null;
	private panel: Panel = null;

	constructor(plot: Plot, size: Point, panel: Panel) {
		this.plot = plot;
		this.size = size;
		this.panel = panel;
	}

	public createControl(parent: Composite, index?: number): void {
		this.panel.createControl(parent, index);
	}

	public getRequiredSize(): Point {
		return CaptionlessPlotPanel.getRequiredSize(this.plot, this.size, false);
	}

	public getControl(): Control {
		return this.panel.getControl();
	}

	public static getRequiredSize(plot: Plot, size: Point, caption: boolean): Point {
		let minimumWidth = plot.getMinimumWidth();
		let minimumHeight = plot.getMinimumHeight();
		let width = Math.max(size.x, minimumWidth);
		let height = Math.max(size.y, minimumHeight);
		height += caption === true ? BasePreloadPanel.HEADER_HEIGHT : 0;
		return new Point(width, height);
	}

}

class CaptionedPlotPanel extends BasePreloadPanel {

	private plot: Plot = null;
	private size: Point = null;
	private panel: Panel = null;

	constructor(caption: string, plot: Plot, size: Point, panel: Panel) {
		super(caption);
		this.plot = plot;
		this.size = size;
		this.panel = panel;
	}

	public createContentControl(parent: Composite, index?: number): void {
		this.panel.createControl(parent, index);
	}

	public getRequiredSize(): Point {
		return CaptionlessPlotPanel.getRequiredSize(this.plot, this.size, true);
	}

	public getContentControl(): Control {
		return this.panel.getControl();
	}

}

export default PlotPreload;