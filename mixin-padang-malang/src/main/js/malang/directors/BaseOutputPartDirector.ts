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
import * as util from "webface/model/util";

import Command from "webface/wef/Command";
import CommandGroup from "webface/wef/CommandGroup";

import * as webface from "webface/webface";

import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import * as padang from "padang/padang";

import BuilderPremise from "padang/ui/BuilderPremise";

import XModeler from "malang/model/XModeler";
import XParameter from "malang/model/XParameter";
import MalangCreator from "malang/model/MalangCreator";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";

import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import OutputPartSupport from "malang/directors/OutputPartSupport";
import OutputPartDirector from "malang/directors/OutputPartDirector";
import BuilderPremiseEvaluator from "malang/directors/BuilderPremiseEvaluator";

import ModelConverter from "malang/directors/converters/ModelConverter";

import ExecutorRegistry from "malang/directors/executors/ExecutorRegistry";

import ReadinessFactory from "malang/directors/readiness/ReadinessFactory";

import ModelerOutputController from "malang/controller/output/ModelerOutputController";

import CascadeResultLayoutSetCommand from "malang/commands/CascadeResultLayoutSetCommand";

export default class BaseOutputPartDirector implements OutputPartDirector {

	private viewer: BuilderPartViewer = null;
	private premise: BuilderPremise = null;
	private support: OutputPartSupport = null;
	private evaluator: BuilderPremiseEvaluator = null;

	constructor(viewer: BuilderPartViewer, premise: BuilderPremise) {
		this.viewer = viewer;
		this.premise = premise;
		this.support = new OutputPartSupport(premise);
		this.evaluator = new BuilderPremiseEvaluator(premise);
	}

	public modelChanged(model: XModeler): void {
		let mapping = this.premise.getMapping();
		let converter = new ModelConverter();
		let value = converter.convertModelToValue(model);
		mapping.setValue(padang.EXPLANATION, value);
		mapping.setValueAsFormula(padang.EXPLANATION);
	}

	public executeModeler(model: XModeler, callback: () => void): void {
		let learning = model.getLearning();
		let registry = ExecutorRegistry.getInstance();
		let executor = registry.get(learning);
		executor.execute(this.support, model, () => {
			executor.populateResult(model);
			callback();
		});
	}

	public readyExecute(model: XModeler, callback: (message: string) => void): void {
		let learning = model.getLearning();
		let factory = ReadinessFactory.getInstance();
		let readiness = factory.create(learning, this.viewer, this.premise);
		readiness.ready(learning, callback);
	}

	public getBuilderResultBriefType(formula: string, callback: (type: string) => void): void {
		this.evaluator.getResultBriefType(formula, callback);
	}

	public getResultBriefListTypes(formula: string, callback: (types: Map<string, string>) => void): void {
		this.evaluator.getResultBriefListTypes(formula, callback);
	}

	public buildParameters(list: EList<XParameter>, callback: (options: Map<string, any>) => void): void {
		this.support.buildParameters(list, callback);
	}

	public removeInstantCommand(instant: XInstantResult): Command {

		// Command utama remove instant
		let removeCommand = new RemoveCommand();
		removeCommand.setModel(instant);

		let cascade = <XCascadeResult>instant.eContainer();
		let results = cascade.getResults();
		let position = results.indexOf(instant);
		if (results.size === 1) {

			// Remove cascade dengan anak yang sendiri
			let removeCommand = this.removeCascadeResultCommand(cascade);
			let group = new CommandGroup([removeCommand]);
			return group;

		} else if (results.size === 2) {

			// Jika nanti instant tunggal naik sekali replace source
			let soleIndex = position === 0 ? 1 : 0;
			let solePresent = results.get(soleIndex);
			let container = cascade.eContainer();
			if (container instanceof XCascadeResult) {

				// Pertama: remove instant
				let group = new CommandGroup();
				group.add(removeCommand);

				// Kedua: replace cascade dengan present di bawahnya
				let replaceCommand = new ReplaceCommand();
				replaceCommand.setModel(cascade);
				replaceCommand.setReplacement(solePresent);
				group.add(replaceCommand)
				return group;

			}

		}

		// Default remove command
		let group = new CommandGroup();
		group.add(removeCommand);

		return group;
	}

	public removeCascadeResultCommand(cascade: XCascadeResult): Command {
		let command = new RemoveCommand();
		let container = cascade.eContainer();
		if (container instanceof XModeler) {
			let parent = container.eContainer();
			command.setModel(parent);
		} else {
			command.setModel(cascade);
		}
		return command;
	}

	public createInstantAddCommand(cascade: XCascadeResult, instant: XInstantResult, position?: number): Command {
		let results = cascade.getResults();
		let command = new ListAddCommand();
		command.setList(results);
		command.setElement(instant);
		command.setPosition(position === undefined ? -1 : position);
		return command;

	}

	private getModel(): XModeler {
		let contents = this.getModelerController();
		return contents.getModel();
	}

	private getModelerController(): ModelerOutputController {
		let rootController = this.viewer.getRootController();
		return <ModelerOutputController>rootController.getContents();
	}

	public enrollPreload(name: string): void {

		let model = this.getModel();
		let result = model.getResult();
		if (result instanceof XCascadeResult) {

			let creator = MalangCreator.eINSTANCE;
			let layout = result.getLayout();
			let controller = this.getModelerController();
			let enrolled = creator.createInstantResult(name);
			if (layout === webface.VERTICAL) {

				// Just append
				let command = this.createInstantAddCommand(result, enrolled);
				controller.execute(command);

			} else {

				// Create vertical cascade
				let creator = MalangCreator.eINSTANCE;
				let cascade = creator.createCascadeResult();
				cascade.setLayout(webface.VERTICAL);
				let results = cascade.getResults();

				// First cascade from current cascade
				let firstCascade = <XCascadeResult>util.copy(result);
				results.add(firstCascade);

				// Second result is enrolled
				results.add(enrolled);

				// Replace cascade
				let replaceCommand = new ReplaceCommand();
				replaceCommand.setModel(result);
				replaceCommand.setReplacement(cascade);
				controller.execute(replaceCommand);

			}
		}
	}

	public createCascadeSetLayoutCommand(cascade: XCascadeResult, layout?: string): Command {
		let command = new CascadeResultLayoutSetCommand();
		let oldLayout = cascade.getLayout();
		let setLayout = oldLayout === webface.HORIZONTAL ? webface.VERTICAL : webface.HORIZONTAL;
		let newLayout = layout === undefined ? setLayout : layout;
		command.setCascadeResult(cascade);
		command.setLayout(newLayout);
		return command;
	}

}