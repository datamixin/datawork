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
import * as wef from "webface/wef";

import EList from "webface/model/EList";
import * as util from "webface/model/util";
import ContentAdapter from "webface/model/ContentAdapter";

import Command from "webface/wef/Command";
import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import EObjectController from "webface/wef/base/EObjectController";
import ListRemoveRangeCommand from "webface/wef/base/ListRemoveRangeCommand";

import XExpression from "sleman/model/XExpression";

import * as directors from "padang/directors";

import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";
import PadangCreator from "padang/model/PadangCreator";

import InteractionPlan from "padang/plan/InteractionPlan";
import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

import MutationPrepareView from "padang/view/prepare/MutationPrepareView";

import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import FormulaParseRequest from "padang/requests/FormulaParseRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import FormulaParseHandler from "padang/handlers/FormulaParseHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import FormulaAssignableHandler from "padang/handlers/FormulaAssignableHandler";

import MutationIndexRequest from "padang/requests/prepare/MutationIndexRequest";
import MutationCountRequest from "padang/requests/prepare/MutationCountRequest";
import MutationSelectRequest from "padang/requests/prepare/MutationSelectRequest";
import MutationRemoveRequest from "padang/requests/prepare/MutationRemoveRequest";
import MutationDialogOpenRequest from "padang/requests/prepare/MutationDialogOpenRequest";

import ParameterDefaultValueRequest from "padang/requests/ParameterDefaultValueRequest";

import ParameterDefaultValueHandler from "padang/handlers/ParameterDefaultValueHandler";

export default class MutationPrepareController extends EObjectController {

	private adapter = new MutationContentAdapter(this);

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(MutationIndexRequest.REQUEST_NAME, new MutationIndexHandler(this));
		super.installRequestHandler(MutationCountRequest.REQUEST_NAME, new MutationCountHandler(this));
		super.installRequestHandler(MutationSelectRequest.REQUEST_NAME, new MutationSelectHandler(this));
		super.installRequestHandler(MutationRemoveRequest.REQUEST_NAME, new MutationRemoveHandler(this));
		super.installRequestHandler(MutationDialogOpenRequest.REQUEST_NAME, new MutationDialogOpenHandler(this));

		super.installRequestHandler(FormulaParseRequest.REQUEST_NAME, new FormulaParseHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
		super.installRequestHandler(FormulaAssignableRequest.REQUEST_NAME, new MutationAssignableHandler(this));

		super.installRequestHandler(ParameterDefaultValueRequest.REQUEST_NAME, new ParameterDefaultValueHandler(this));
	}

	public getModel(): XMutation {
		return <XMutation>super.getModel();
	}

	public getView(): MutationPrepareView {
		return <MutationPrepareView>super.getView();
	}

	public createView(): MutationPrepareView {
		return new MutationPrepareView(this);
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshImage();
		this.refreshCaption();
		this.refreshDialog();
	}

	private getInteractionPlan(): InteractionPlan {
		let model = this.getModel();
		let operation = model.getOperation();
		let registry = InteractionPlanRegistry.getInstance();
		return registry.getPlan(operation);
	}

	private refreshImage(): void {
		let plan = this.getInteractionPlan();
		let image = plan.getImage();
		let view = this.getView();
		view.setImage(image);
	}

	private refreshCaption(): void {
		let model = this.getModel();
		let director = directors.getPreparationMutationDirector(this);
		let view = this.getView();
		try {
			let label = director.getInteractionCaption(model);
			view.setCaption(label);
		} catch (error) {
			view.setError(error.message);
		}
	}

	private refreshDialog(): void {
		let model = this.getModel();
		let registry = InteractionPlanRegistry.getInstance();
		let operation = model.getOperation();
		let view = this.getView();
		if (registry.isStarter(operation)) {
			view.setDialogExists(true);
		} else {
			let factory = GuideDialogFactory.getInstance();
			let exists = factory.isExists(operation);
			view.setDialogExists(exists);
		}
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

}

class MutationContentAdapter extends ContentAdapter {

	private controller: MutationPrepareController = null;

	constructor(controller: MutationPrepareController) {
		super();
		this.controller = controller;
	}

	public notifyChanged() {
		this.controller.refreshVisuals();
	}

}

class MutationSelectHandler extends BaseHandler {

	public handle(): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

abstract class ResetHandler extends BaseHandler {

	public executeWithDisplayReset(mainCommand: Command): void {

		// Reset display mutations
		let model = <XMutation>this.controller.getModel();
		let preparation = <XPreparation>util.getAncestor(model, XPreparation);
		let display = preparation.getDisplay();
		let director = directors.getPreparationMutationDirector(this.controller);
		let resetCommand = director.createResetDisplayCommand(display);

		let group = new CommandGroup([mainCommand, resetCommand]);
		this.controller.execute(group);

	}

}

class MutationRemoveHandler extends ResetHandler {

	public handle(request: MutationRemoveRequest): void {
		let cutoff = request.getBooleanData(MutationRemoveRequest.CUTOFF);
		let model = <XMutation>this.controller.getModel()
		let parent = this.controller.getParent();
		if (cutoff === true) {
			let list = <EList<XMutation>>parent.getModel();
			let start = list.indexOf(model);
			let command = new ListRemoveRangeCommand();
			command.setStart(start);
			command.setList(list);
			this.executeWithDisplayReset(command);
		} else {
			let command = new RemoveCommand();
			command.setModel(model);
			this.executeWithDisplayReset(command);
		}
	}

}

class MutationIndexHandler extends BaseHandler {

	public handle(request: MutationIndexRequest, callback: (data: any) => void): void {
		let model = <XMutation>this.controller.getModel()
		let feature = model.eContainingFeature();
		let container = model.eContainer();
		let value = container.eGet(feature);
		if (value instanceof EList) {
			let index = value.indexOf(model);
			callback(index);
		}
	}

}

class MutationCountHandler extends BaseHandler {

	public handle(request: MutationIndexRequest, callback: (data: any) => void): void {
		let model = <XMutation>this.controller.getModel()
		let feature = model.eContainingFeature();
		let container = model.eContainer();
		let value = container.eGet(feature);
		if (value instanceof EList) {
			callback(value.size);
		}
	}

}

class MutationDialogOpenHandler extends ResetHandler {

	private options = new Map<string, XExpression>();

	public handle(): void {

		let oldMutation = <XMutation>this.controller.getModel()

		// Get registry
		let registry = InteractionPlanRegistry.getInstance();
		let operation = oldMutation.getOperation();
		let plan = registry.getPlan(operation);

		if (registry.isStarter(operation)) {

			// Open instore
			let director = directors.getPreparationMutationDirector(this.controller);
			director.openInstoreComposer(this.controller, oldMutation);

		} else {

			// Options for dialogs
			this.options.clear();
			let parameters = oldMutation.getOptions();
			let director = directors.getExpressionFormulaDirector(this.controller);
			for (let parameter of parameters) {
				let name = parameter.getName();
				let formula = parameter.getFormula();
				try {
					let expression = director.parseFormula(formula);
					this.options.set(name, expression);
				} catch (error) {

					// Fallback to default
					let literal = this.getDefaultLiteral(plan, name);
					if (literal !== null) {
						let expression = director.parseFormula(literal);
						this.options.set(name, expression);
					}
				}
			}

			// Open dialog
			let factory = GuideDialogFactory.getInstance();
			let dialog = factory.create(this.controller, plan, this.options);
			dialog.open((result: string) => {
				if (result === GuideDialog.OK) {

					// Create new mutation
					let creator = PadangCreator.eINSTANCE;
					let newMutation = creator.createMutation(operation);
					let parameters = newMutation.getOptions();
					for (let name of this.options.keys()) {
						let expression = this.options.get(name);
						let formula = director.getFormula(expression);
						let parameter = creator.createOption(name, formula);
						parameters.add(parameter);
					}

					// Replace only if modified
					if (!util.isEquals(oldMutation, newMutation)) {

						// Replace mutation
						let replaceCommand = new ReplaceCommand();
						replaceCommand.setModel(oldMutation);
						replaceCommand.setReplacement(newMutation);

						this.executeWithDisplayReset(replaceCommand);
					}
				}
			});
		}

	}

	private getDefaultLiteral(plan: InteractionPlan, name: string) {
		let list = plan.getParameters();
		for (let element of list) {
			if (name === element.getName()) {
				let director = directors.getOptionFormulaDirector(this.controller);
				return director.getDefaultLiteral(element);
			}
		}
		return null;
	}

	public getOptions(): Map<string, XExpression> {
		return this.options;
	}

}

class MutationAssignableHandler extends FormulaAssignableHandler {

	public getPreparationIndex(): number {
		let controller = <MutationPrepareController>this.controller;
		let parent = controller.getParent();
		let children = parent.getChildren();
		return children.indexOf(controller) - 1;
	}

	public getOperation(): string {
		let controller = <MutationPrepareController>this.controller;
		let mutation = controller.getModel();
		return mutation.getOperation();
	}

	private getOptions(): Map<string, XExpression> {
		let key = MutationDialogOpenRequest.REQUEST_NAME;
		let handler = <MutationDialogOpenHandler>this.controller.getRequestHandler(key);
		return handler.getOptions();
	}

	public hasOption(name: string): boolean {
		let options = this.getOptions();
		return options.has(name);
	}

	public getOption(name: string): XExpression {
		let options = this.getOptions();
		return options.get(name);
	}

}
