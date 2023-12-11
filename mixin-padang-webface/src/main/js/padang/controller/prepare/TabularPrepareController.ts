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

import BaseHandler from "webface/wef/base/BaseHandler";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";

import XExpression from "sleman/model/XExpression";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XTabular from "padang/model/XTabular";
import XPreparation from "padang/model/XPreparation";

import QuerySource from "padang/query/QuerySource";
import DisplayQuery from "padang/query/DisplayQuery";

import Provision from "padang/provisions/Provision";

import Interaction from "padang/interactions/Interaction";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import TabularActuator from "padang/controller/TabularActuator";

import ControllerProperties from "padang/util/ControllerProperties";

import FormulaParseRequest from "padang/requests/FormulaParseRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";

import FormulaParseHandler from "padang/handlers/FormulaParseHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import FormulaAssignableHandler from "padang/handlers/FormulaAssignableHandler";

import TabularPrepareView from "padang/view/prepare/TabularPrepareView";

import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";


import TabularRowSelectRequest from "padang/requests/TabularRowSelectRequest";
import TabularCellSelectRequest from "padang/requests/TabularCellSelectRequest";
import TabularColumnSelectRequest from "padang/requests/TabularColumnSelectRequest";
import TabularColumnFormatGetRequest from "padang/requests/TabularColumnFormatGetRequest";

import TabularRowSelectHandler from "padang/handlers/TabularRowSelectHandler";
import TabularCellSelectHandler from "padang/handlers/TabularCellSelectHandler";
import TabularColumnSelectHandler from "padang/handlers/TabularColumnSelectHandler";
import TabularColumnFormatGetHandler from "padang/handlers/TabularColumnFormatGetHandler";

import BufferedProvisionRequest from "padang/requests/BufferedProvisionRequest";

import TabularColumnProfileHandler from "padang/handlers/TabularColumnProfileHandler";
import TabularColumnWidthSetHandler from "padang/handlers/TabularColumnWidthSetHandler";
import TabularColumnWidthGetHandler from "padang/handlers/TabularColumnWidthGetHandler";
import TabularColumnInspectApplyHandler from "padang/handlers/TabularColumnInspectApplyHandler";
import TabularColumnInspectResetHandler from "padang/handlers/TabularColumnInspectResetHandler";
import TabularColumnFrequencySortHandler from "padang/handlers/TabularColumnFrequencySortHandler";

import TabularColumnProfileRequest from "padang/requests/TabularColumnProfileRequest";
import TabularColumnWidthSetRequest from "padang/requests/TabularColumnWidthSetRequest";
import TabularColumnWidthGetRequest from "padang/requests/TabularColumnWidthGetRequest";
import TabularColumnInspectResetRequest from "padang/requests/TabularColumnInspectResetRequest";
import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";
import TabularColumnFrequencySortRequest from "padang/requests/TabularColumnFrequencySortRequest";

import MutationInsertDecisionDialog from "padang/dialogs/MutationInsertDecisionDialog";

import ParameterDefaultValueRequest from "padang/requests/ParameterDefaultValueRequest";

import ParameterDefaultValueHandler from "padang/handlers/ParameterDefaultValueHandler";

import DisplayPrepareController from "padang/controller/prepare/DisplayPrepareController";

import TabularInteractionRequest from "padang/requests/prepare/TabularInteractionRequest";
import TabularGuideDialogRequest from "padang/requests/prepare/TabularGuideDialogRequest";
import TabularColumnRemoveRequest from "padang/requests/prepare/TabularColumnRemoveRequest";

export default class TabularPrepareController extends DisplayPrepareController implements QuerySource {

	private actuator = new TabularActuator(this);

	constructor() {
		super();
		super.addParticipant(wef.SELECTION_PARTICIPANT, new PreparationSelectionParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaParseRequest.REQUEST_NAME, new FormulaParseHandler(this));
		super.installRequestHandler(BufferedProvisionRequest.REQUEST_NAME, new TabularProvisionHandler(this));
		super.installRequestHandler(FormulaAssignableRequest.REQUEST_NAME, new TabularAssignableHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));

		super.installRequestHandler(TabularInteractionRequest.REQUEST_NAME, new TabularInteractionHandler(this));
		super.installRequestHandler(TabularGuideDialogRequest.REQUEST_NAME, new TabularGuideDialogHandler(this));
		super.installRequestHandler(TabularColumnRemoveRequest.REQUEST_NAME, new TabularColumnRemoveHandler(this));

		super.installRequestHandler(TabularRowSelectRequest.REQUEST_NAME, new TabularRowSelectHandler(this));
		super.installRequestHandler(TabularCellSelectRequest.REQUEST_NAME, new TabularCellSelectHandler(this));
		super.installRequestHandler(TabularColumnSelectRequest.REQUEST_NAME, new TabularColumnSelectHandler(this));

		super.installRequestHandler(TabularColumnProfileRequest.REQUEST_NAME, new TabularColumnProfileHandler(this));
		super.installRequestHandler(TabularColumnWidthSetRequest.REQUEST_NAME, new TabularColumnWidthSetHandler(this));
		super.installRequestHandler(TabularColumnWidthGetRequest.REQUEST_NAME, new TabularColumnWidthGetHandler(this));
		super.installRequestHandler(TabularColumnFormatGetRequest.REQUEST_NAME, new TabularColumnFormatGetHandler(this));
		super.installRequestHandler(TabularColumnInspectApplyRequest.REQUEST_NAME, new TabularColumnInspectApplyHandler(this));
		super.installRequestHandler(TabularColumnInspectResetRequest.REQUEST_NAME, new TabularColumnInspectResetHandler(this));
		super.installRequestHandler(TabularColumnFrequencySortRequest.REQUEST_NAME, new TabularColumnFrequencySortHandler(this));

		super.installRequestHandler(ParameterDefaultValueRequest.REQUEST_NAME, new ParameterDefaultValueHandler(this));
	}

	public createView(): TabularPrepareView {
		return new TabularPrepareView(this);
	}

	public getModel(): XTabular {
		return <XTabular>super.getModel();
	}

	public getView(): TabularPrepareView {
		return <TabularPrepareView>super.getView();
	}

	protected refreshInspection(): void {
		let view = this.getView();
		view.refreshInspection();
		view.refreshRows();
	}

	public applyFrom(query: DisplayQuery): void {
		let index = this.getSelectionIndex();
		query.fromPreparation(index);
	}

	public getInspectModel(): XPreparation {
		let parent = this.getParent();
		return <XPreparation>parent.getModel();
	}

	public getSelectionIndex(): number {
		let director = directors.getPreparationMutationDirector(this);
		return director.getSelectionIndex();
	}

	public refreshProperties(): void {
		this.actuator.refreshProperties();
	}

	protected refreshProperty(keys: string[]): void {
		this.actuator.refreshProperty(keys);
	}

}

class TabularColumnRemoveHandler extends BaseHandler {

	public handle(request: TabularColumnRemoveRequest): void {
		let name = <string>request.getData(TabularColumnRemoveRequest.NAME);
		let properties = new ControllerProperties(this.controller, XTabular.FEATURE_PROPERTIES);
		properties.executeRemoveCommandPrefix([padang.COLUMN, name]);
	}

}

class PreparationSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(_controller: Controller, selected: boolean): void {
		if (selected === true) {
			let target = <TabularPrepareController>this.controller;
			target.refreshContent();
		}
	}

}

class TabularProvisionHandler extends BaseHandler {

	public handle(request: BufferedProvisionRequest, callback: (data: any) => void): void {
		if (this.controller.isActive()) {

			let parent = this.controller.getParent();

			let controller = <TabularPrepareController>this.controller;
			let index = controller.getSelectionIndex();

			let provision = <Provision>request.getData(BufferedProvisionRequest.PROVISION);
			let director = directors.getProvisionResultDirector(this.controller);
			director.inspectPreparationResultAt(parent, index, provision, (result: any) => {
				callback(result);
			});
		}
	}

}

abstract class ControllerHandler extends BaseHandler {

	protected executeCommand(interaction: Interaction): void {
		let tabular = <XTabular>this.controller.getModel();
		let controller = <TabularPrepareController>this.controller;
		let preparation = <XPreparation>tabular.eContainer();
		let director = directors.getPreparationMutationDirector(this.controller);
		let index = controller.getSelectionIndex();
		let mutations = preparation.getMutations();
		if (index < mutations.size - 1) {
			let dialog = new MutationInsertDecisionDialog();
			dialog.open((result: string) => {
				if (result === MutationInsertDecisionDialog.JUST_INSERT) {
					let command = director.createMutationCommand(controller, preparation, interaction, false);
					this.controller.execute(command);
				} else if (result === MutationInsertDecisionDialog.WITH_CUTOFF) {
					let command = director.createMutationCommand(controller, preparation, interaction, true);
					this.controller.execute(command);
				}
			});
		} else {
			let command = director.createMutationCommand(controller, preparation, interaction, false);
			this.controller.execute(command);
		}
	}

}

class TabularInteractionHandler extends ControllerHandler {

	public handle(request: TabularInteractionRequest, _callback: (data: any) => void): void {
		let interaction = <Interaction>request.getData(TabularInteractionRequest.INTERACTION);
		this.executeCommand(interaction);
	}

}

class TabularGuideDialogHandler extends ControllerHandler {

	private options = new Map<string, XExpression>();

	public handle(request: TabularGuideDialogRequest, _callback: (data: any) => void): void {

		let interaction = <Interaction>request.getData(TabularGuideDialogRequest.INTERACTION);

		// Options
		this.options.clear();
		let director = directors.getExpressionFormulaDirector(this.controller);
		let names = interaction.getOptionNames();
		for (let name of names) {
			let value = interaction[name];
			let formula = director.getFormulaFromObjectOrString(value);
			let expression = director.parseFormula(formula);
			this.options.set(name, expression);
		}

		// Plan
		let registry = InteractionPlanRegistry.getInstance();
		let plan = registry.getPlan(interaction.interactionName);

		// Dialog
		let factory = GuideDialogFactory.getInstance();
		let dialog = factory.create(this.controller, plan, this.options);
		dialog.open((result: string) => {

			if (result === GuideDialog.OK) {

				// Replace interaction fields
				for (let name of this.options.keys()) {
					let value = <XExpression>this.options.get(name);
					interaction[name] = "=" + value.toLiteral();
				}

				this.executeCommand(interaction);

			}
		});
	}

	public getOptions(): Map<string, XExpression> {
		return this.options;
	}

}

class TabularAssignableHandler extends FormulaAssignableHandler {

	private getPreparation(): XPreparation {
		let controller = <TabularPrepareController>this.controller;
		let tabular = <XTabular>controller.getModel();
		return <XPreparation>tabular.eContainer();
	}

	public getPreparationIndex(): number {
		let preparation = this.getPreparation();
		let mutations = preparation.getMutations();
		return mutations.size - 1;
	}

	public getOperation(): string {
		let preparation = this.getPreparation();
		let mutations = preparation.getMutations();
		let mutation = mutations.get(mutations.size - 1);
		return mutation.getOperation();
	}

	private getOptions(): Map<string, XExpression> {
		let key = TabularGuideDialogRequest.REQUEST_NAME;
		let handler = <TabularGuideDialogHandler>this.controller.getRequestHandler(key);
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
