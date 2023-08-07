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
import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";

import VisageValue from "bekasi/visage/VisageValue";
import VisageObject from "bekasi/visage/VisageObject";

import * as padang from "padang/padang";

import GraphicPremise from "padang/ui/GraphicPremise";

import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import XOutlook from "vegazoo/model/XOutlook";
import XVegalite from "vegazoo/model/XVegalite";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import VegaliteChart from "vegazoo/widgets/VegaliteChart";

import ModelConverter from "vegazoo/directors/converters/ModelConverter";
import ReadoutResultMapping from "vegazoo/directors/converters/ReadoutResultMapping";

export default class VisualizationPanel extends ConductorPanel {

	private composite: Composite = null;
	private premise: GraphicPremise = null;
	private valuePart: Composite = null;
	private chart: VegaliteChart = null;

	constructor(conductor: Conductor, premise: GraphicPremise) {
		super(conductor);
		this.premise = premise;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("vegazoo-visualization-panel");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createValuePart(this.composite);
		this.createChartPart(this.composite);
		this.createOutlook();

	}

	private createValuePart(parent: Composite): void {

		this.valuePart = new Composite(parent);

		let element = this.valuePart.getElement();
		element.addClass("vegazoo-visualization-value-part");

		let layout = new FillLayout();
		this.valuePart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.valuePart.setLayoutData(layoutData);

	}

	private createChartPart(parent: Composite): void {

		this.chart = new VegaliteChart(parent);

		let layoutData = new GridData(true, 0);
		this.chart.setLayoutData(layoutData);

	}

	private createOutlook(): void {

		let converter = new ModelConverter();
		let mapping = this.premise.getMapping();
		let object = mapping.getValue(padang.FORMATION);
		if (object instanceof VisageObject) {
			let outlook = <XOutlook>converter.convertValueToModel(object);
			let viewlet = outlook.getViewlet();
			if (viewlet instanceof XVegalite) {
				let model = viewlet.getSpec();
				if (model instanceof XTopLevelSpec) {
					let mapping = new ReadoutResultMapping(this.premise, model);
					let views = mapping.getViewCount();
					let cautions = mapping.getCautions();
					if (views > 0 && cautions.length === 0) {
						let spec = converter.convertModelToSpec(model, mapping);
						this.setShowChart(true);
						this.setChartSpec(spec);
					} else {
						this.setShowChart(false);
						if (cautions.length > 0) {
							this.setSurfaceValue(cautions[0]);
						}
					}
				}
			}
		}

	}

	private setShowChart(state: boolean): void {
		let layout = <GridLayout>this.composite.getLayout();
		if (state === true) {
			layout.grabVerticalExclusive(this.composite, this.chart);
		} else {
			layout.grabVerticalExclusive(this.composite, this.valuePart);
		}
		this.composite.relayout();
	}

	private setChartSpec(spec: any): void {
		this.chart.setSpec(spec);
	}

	private setSurfaceValue(value: VisageValue): void {
		let registry = SurfaceRegistry.getInstance();
		let surface = registry.get(value);
		let panel = surface.createPanel(this.conductor);
		panel.createControl(this.valuePart);
	}

	public getControl(): Control {
		return this.composite;
	}

}