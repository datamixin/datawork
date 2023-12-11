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
import EList from "webface/model/EList";

import VisageObject from "bekasi/visage/VisageObject";

import * as padang from "padang/padang";

import XGraphic from "padang/model/XGraphic";

import GraphicPremise from "padang/ui/GraphicPremise";

import GraphicPartViewer from "vegazoo/ui/GraphicPartViewer";

import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";

import * as directors from "rinjani/directors";

import RinjaniCreator from "rinjani/model/RinjaniCreator";

import DesignPartDirector from "rinjani/directors/DesignPartDirector";

import ModelConverter from "rinjani/directors/converters/ModelConverter";

export default class BaseDesignPartDirector implements DesignPartDirector {

	private viewer: GraphicPartViewer = null;
	private premise: GraphicPremise = null;

	constructor(viewer: GraphicPartViewer, premise: GraphicPremise) {
		this.viewer = viewer;
		this.premise = premise;
	}

	public createRoutine(callback: (routine: XRoutine, pristine: boolean) => void): void {

		let mapping = this.premise.getMapping();
		let formation = mapping.getValue(padang.FORMATION);
		if (formation instanceof VisageObject) {

			let converter = new ModelConverter();
			let value = <VisageObject>mapping.getValue(padang.FORMATION);
			let routine = <XRoutine>converter.convertValueToModel(value);
			callback(routine, false);

		} else {

			let creator = RinjaniCreator.eINSTANCE;
			let routine = creator.createRoutine();
			let converter = new ModelConverter();
			let value = converter.convertModelToValue(routine);
			mapping.setValue(padang.FORMATION, value);
			callback(routine, true);

		}
	}

	public getParameterType(model: XParameter): string {
		let director = directors.getPlotPlanDirector(this.viewer);
		return director.getParameterType(model);
	}

	public getParameterLabel(model: XParameter): string {
		let director = directors.getPlotPlanDirector(this.viewer);
		return director.getParameterLabel(model);
	}

	public getParameterAssignable(model: XParameter): string {
		let director = directors.getPlotPlanDirector(this.viewer);
		let plan = director.getParameterPlan(model);
		let assigned = plan.getAssignedPlan();
		return assigned.getAssignable();
	}

	public getOtherParameters(model: XParameter): EList<XParameter> {
		let container = <XRoutine>model.eContainer();
		return container.getParameters();
	}

	public getSourceName(): string {
		let model = <XGraphic>this.premise.getModel();
		let variables = model.getVariables();
		if (variables.size === 0) {
			return null;
		} else {
			let variable = variables.get(0);
			let name = variable.getName();
			return name;
		}
	}

}