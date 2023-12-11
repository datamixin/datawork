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
import * as wef from "webface/wef";

import Controller from "webface/wef/Controller";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import * as tools from "webface/util/functions";

import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";
import MapRepopulateCommand from "webface/wef/base/MapRepopulateCommand";
import ListRepopulateCommand from "webface/wef/base/ListRepopulateCommand";

import EditDomainMarker from "webface/wef/util/EditDomainMarker";

import SlemanFactory from "sleman/model/SlemanFactory";

import * as bekasi from "bekasi/directors";

import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XSheet from "padang/model/XSheet";
import XProject from "padang/model/XProject";
import XDataset from "padang/model/XDataset";
import XDisplay from "padang/model/XDisplay";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";
import PadangCreator from "padang/model/PadangCreator";

import SampleFileStarter from "padang/directors/SampleFileStarter";
import DatasetPresentDirector from "padang/directors/DatasetPresentDirector";

import InstoreComposerDialog from "padang/dialogs/InstoreComposerDialog";

import PreparationFullDeckComposer from "padang/ui/PreparationFullDeckComposer";

import DisplayPresentController from "padang/controller/present/DisplayPresentController";

export default class BaseDatasetPresentDirector implements DatasetPresentDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	public openInstoreComposer(controller: Controller, mutation: XMutation): void {

		// Mutation composer
		let preparation = <XPreparation>mutation.eContainer();
		let dialog = new InstoreComposerDialog(controller, mutation);
		dialog.open((result: string) => {

			if (result === InstoreComposerDialog.OK) {

				// Open preparation composer
				this.doOpenPreparationComposer(controller, false, preparation, true);

			} else {

				// Remove original
				let command = new RemoveCommand();
				command.setModel(preparation);
				controller.execute(command);

			}
		});
	}

	private refreshDisplay(display: XDisplay): void {
		let target = <DisplayPresentController>this.getController(display);
		target.refreshContent();
	}

	public getController(model: EObject): Controller {
		let controller = this.viewer.getRootController();
		let contents = controller.getContents();
		let target = functions.getFirstDescendantByModel(contents, model);
		return target;
	}

	public openPreparationComposer(controller: Controller,
		pristine: boolean, preparation: XPreparation, starter?: boolean): void {

		if (pristine === true) {

			this.doOpenPreparationComposer(controller, pristine, preparation, starter);

		} else {

			// Replace preparation display dengan dataset display
			let dataset = <XDataset>preparation.eContainer();
			let oldDisplay = preparation.getDisplay();
			let newDisplay = dataset.getDisplay();
			this.replaceDisplay(controller, oldDisplay, newDisplay, () => {
				this.doOpenPreparationComposer(controller, pristine, preparation, starter);
			});

		}

	}

	private doOpenPreparationComposer(controller: Controller,
		pristine: boolean, preparation: XPreparation, starter: boolean): void {

		// Original copy
		let original = <XPreparation>util.copy(preparation);

		// Preparation composer
		let composer = new PreparationFullDeckComposer(preparation);
		let viewer = this.viewer.getRootViewer();
		composer.setParent(viewer);

		// Open composer
		let marker = new EditDomainMarker(this.viewer);
		let director = bekasi.getConsoleDirector(this.viewer);

		director.openFullDeck(composer, (result: string) => {

			marker.reset();
			if (result === FullDeckPanel.OK) {

				// Tetap menggunakan model original, hanya perlu apply result
				let director = directors.getProjectComposerDirector(this.viewer);
				director.inspectValue(preparation, padang.INSPECT_APPLY_RESULT, [], (result: VisageValue) => {

					if (result instanceof VisageError) {

						let message = result.getMessage();
						throw new Error(message);

					} else {

						// Replace display di dataset dengan display dari preparation
						let dataset = <XDataset>preparation.eContainer();
						let target = this.getController(dataset);
						let newDisplay = preparation.getDisplay();
						let oldDisplay = dataset.getDisplay();
						this.replaceDisplay(target, oldDisplay, newDisplay, () => {
							this.refreshDisplay(oldDisplay);
						});

					}
				});

			} else {

				if (pristine === true) {

					// Hapus dataset yang telah dibuat
					let rootController = this.viewer.getRootController();
					let contents = rootController.getContents();
					let dataset = <XDataset>preparation.eContainer();
					let sheet = <XSheet>dataset.eContainer();
					let command = new RemoveCommand();
					command.setModel(sheet);
					contents.execute(command);

				} else {

					if (starter === true) {

						let director = directors.getProjectComposerDirector(this.viewer);
						director.inspectValue(preparation, padang.INSPECT_APPLY_RESULT, [], (_result: VisageValue) => {
							let dataset = <XDataset>preparation.eContainer();
							let oldDisplay = dataset.getDisplay();
							this.refreshDisplay(oldDisplay);
						});

					} else {

						// Kembalikan semua mutation dengan yang original
						if (!util.isEquals(original, preparation)) {

							let mutations = preparation.getMutations();
							let originals = original.getMutations();
							let elements = originals.toArray();

							let command = new ListRepopulateCommand();
							command.setElements(elements);
							command.setList(mutations);
							controller.execute(command);

						}
					}

				}
			}
		});
	}

	private replaceDisplay(controller: Controller, oldDisplay: XDisplay, newDisplay: XDisplay, callback: () => void): void {

		// Copy properties
		let mapDisplay = <XDisplay>util.copy(newDisplay);
		let oldMap = oldDisplay.getProperties();
		let newMap = mapDisplay.getProperties();
		let entries = newMap.valueMap();
		let propertiesCommand = new MapRepopulateCommand();
		propertiesCommand.setEntries(entries);
		propertiesCommand.setMap(oldMap);

		// Copy mutations
		let listDisplay = <XDisplay>util.copy(newDisplay);
		let oldList = oldDisplay.getMutations();
		let newList = listDisplay.getMutations();
		let elements = newList.toArray();
		let mutationsCommand = new ListRepopulateCommand();
		mutationsCommand.setElements(elements);
		mutationsCommand.setList(oldList);

		// Submit command
		let director = wef.getSynchronizationDirector(controller);
		director.onCommit(callback);

		let group = new CommandGroup([propertiesCommand, mutationsCommand]);
		controller.execute(group);
	}

	public addPreparation(controller: Controller, source: XDataset): void {

		let oldDisplay = source.getDisplay();

		let creator = PadangCreator.eINSTANCE;
		let project = <XProject>util.getRootContainer(source);
		let newSheet = creator.createDatasetSheet(project);
		let newDataset = <XDataset>newSheet.getForesee();
		let newDisplay = creator.createDisplay();
		newDataset.setDisplay(newDisplay);

		let oldSheet = <XSheet>source.eContainer();
		let name = oldSheet.getName();
		let preparation = creator.createPreparationFromDataset(name);
		preparation.setDisplay(<XDisplay>util.copy(oldDisplay));
		newDataset.setSource(preparation);

		let director = wef.getSynchronizationDirector(controller);
		director.onCommit(() => {
			this.openPreparationComposer(controller, true, preparation);
		});

		let sheets = project.getSheets();
		let command = new ListAddCommand();
		command.setList(sheets);
		command.setElement(newSheet);
		controller.execute(command);
	}

	public readSampleFile(path: string, callback: (text: string) => void): void {
		let starter = new SampleFileStarter();
		starter.readFile(path, callback);
	}

	public computeResult(model: XDataset, callback?: () => void): void {
		this.inspectValue(model, padang.INSPECT_COMPUTE, [], () => {
			let display = model.getDisplay();
			let controller = <DisplayPresentController>this.getController(display);
			controller.refreshContent();
			if (callback !== undefined) {
				callback();
			}
		});
	}

	private inspectValue(model: XDataset, inspect: string, args: any[], callback: (data: any) => void): void {
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(model, inspect, args, callback);
	}

	public generateFormula(model: XPreparation): string {

		let factory = SlemanFactory.eINSTANCE;
		let xlet = factory.createXLet();
		let variables = xlet.getVariables();

		let mutations = model.getMutations();
		let names: string[] = [];
		let prev: string = null;
		let director = directors.getExpressionFormulaDirector(this.viewer);
		for (let mutation of mutations) {

			let operation = mutation.getOperation();
			let call = factory.createXCall(operation);

			let name = tools.getIncrementedName(operation, names);
			names.push(name);

			let args = call.getArguments();
			if (prev !== null) {
				let dataset = factory.createXReference(prev);
				let arg = factory.createXArgument(dataset);
				args.add(arg);
			}
			prev = name;

			let options = mutation.getOptions();
			for (let option of options) {
				let name = option.getName();
				let literal = option.getFormula();
				let expression = director.parseFormula(literal);
				let assignment = factory.createXAssignment(name, expression);
				args.add(assignment);
			}

			let variable = factory.createXAssignment(name, call);
			variables.add(variable);

		}

		// Result
		let result = factory.createXReference(prev);
		xlet.setResult(result);

		return "=" + xlet.toLiteral();
	}

}