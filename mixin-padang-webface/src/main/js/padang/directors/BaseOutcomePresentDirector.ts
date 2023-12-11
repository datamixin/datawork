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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import VisageBrief from "bekasi/visage/VisageBrief";
import VisageValue from "bekasi/visage/VisageValue";

import SlemanFactory from "sleman/model/SlemanFactory";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XDataset from "padang/model/XDataset";
import XOutcome from "padang/model/XOutcome";
import XProject from "padang/model/XProject";
import XVariable from "padang/model/XVariable";

import Frontage from "padang/directors/frontages/Frontage";
import FrontageRegistry from "padang/directors/frontages/FrontageRegistry";

import Example from "padang/functions/system/Example";
import BriefValue from "padang/functions/system/BriefValue";

import FrontagePanel from "padang/view/present/FrontagePanel";

import DefaultFrontage from "padang/directors/frontages/DefaultFrontage";

import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import OutcomePresentDirector from "padang/directors/OutcomePresentDirector";

import OutcomePresentController from "padang/controller/present/OutcomePresentController";

export default class BaseOutcomePresentDirector implements OutcomePresentDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	public computeResult(controller: OutcomePresentController, callback: () => void): void {
		let outcome = controller.getModel();
		let variable = outcome.getVariable();
		this.inspectValue(variable, padang.INSPECT_COMPUTE, [], callback);
	}

	public createPresentPanel(source: OutcomePresentController,
		callback: (type: string, panel: FrontagePanel) => void): void {

		let outcome = source.getModel();
		let variable = outcome.getVariable();
		this.getBrief(variable, (value: VisageValue) => {

			if (value instanceof VisageBrief) {

				let type = value.getType();
				let outcome = source.getModel();
				let frontageName = outcome.getFrontage();
				let registry = FrontageRegistry.getInstance();
				if (registry.has(type)) {

					// Gunakan frontage berdasarkan brief type
					let frontage = this.getFrontage(type, frontageName);
					this.getValue(variable, (value: VisageValue) => {
						let panel = frontage.createPresentPanel(source, value);
						callback(type, panel);
					});

				} else {

					// Gunakan frontage berdasarkan visage value
					this.getValue(variable, (value: VisageValue) => {

						let leanName = value.xLeanName();
						let panel = this.getDefaultPanel(source, value)
						callback(leanName, panel);

					});
				}

			} else {

				let leanName = value.xLeanName();
				let panel = this.getDefaultPanel(source, value)
				callback(leanName, panel);

			}
		});
	}

	private getDefaultPanel(source: OutcomePresentController, value: VisageValue): FrontagePanel {
		let leanName = value.xLeanName();
		let frontage = this.getDefaultFrontage(leanName);
		let panel = frontage.createPresentPanel(source, value);
		return panel;
	}

	private getDefaultFrontage(leanName: string): Frontage {
		let registry = SurfaceRegistry.getInstance();
		let surface = registry.getByLeanName(leanName);
		let frontage = new DefaultFrontage(surface);
		return frontage;
	}

	public getFrontage(leanName: string, frontageName: string): Frontage {
		let registry = FrontageRegistry.getInstance();
		if (registry.has(leanName)) {
			return registry.get(leanName, frontageName);
		} else {
			return this.getDefaultFrontage(leanName);
		}
	}

	private getValue(model: XVariable, callback: (value: VisageValue) => void): void {
		let name = model.getName();
		let factory = SlemanFactory.eINSTANCE;
		let variable = factory.createXReference(name);
		this.inspectValue(model, padang.INSPECT_EVALUATE, [variable], callback);
	}

	private getBrief(model: XVariable, callback: (brief: VisageBrief) => void): void {
		let name = model.getName();
		let factory = SlemanFactory.eINSTANCE;
		let variable = factory.createXReference(name);
		let call = factory.createXCall(BriefValue.FUNCTION_NAME, variable);
		this.inspectValue(model, padang.INSPECT_EVALUATE, [call], callback);
	}

	private inspectValue(model: EObject, inspect: string, args: any[], callback: (data: any) => void): void {
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(model, inspect, args, callback);
	}

	public getValueFrontage(outcome: XOutcome, callback: (frontage: Frontage) => void): void {
		let variable = outcome.getVariable();
		this.getValue(variable, (value: VisageValue) => {
			let leanName = value.xLeanName();
			let frontageName = outcome.getFrontage();
			let frontage = this.getFrontage(leanName, frontageName);
			callback(frontage);
		});
	}

	public getPromotedFormulas(current: Controller, callback: (formulas: Map<string, string>) => void): void {
		let formulas = new Map<string, string>();
		let eObject = <EObject>current.getModel();
		let project = <XProject>util.getAncestor(eObject, XProject);
		let sheets = project.getSheets();
		for (let sheet of sheets) {
			let foresee = sheet.getForesee();
			if (foresee instanceof XDataset) {
				let name = sheet.getName();
				formulas.set(name + "_Outcome", "=" + name);
			}
		}
		callback(formulas);
	}

	public computeExample(current: Controller, formula: string, callback: (result: any) => void): void {
		let eObject = <EObject>current.getModel();
		let viewset = <EObject>util.getAncestor(eObject, XProject);
		let container = <EObject>viewset.eContainer();
		let factory = SlemanFactory.eINSTANCE;
		let director = directors.getExpressionFormulaDirector(this.viewer);
		let expression = director.parseFormula(formula);
		let call = factory.createXCall(Example.FUNCTION_NAME, expression);
		this.inspectValue(container, padang.INSPECT_EVALUATE, [call], callback);
	}

}
