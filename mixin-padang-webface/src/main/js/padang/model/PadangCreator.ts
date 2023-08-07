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
import EList from "webface/model/EList";

import * as util from "webface/model/util";

import * as functions from "webface/util/functions";

import XCell from "padang/model/XCell";
import XInput from "padang/model/XInput";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XOption from "padang/model/XOption";
import XOutlook from "padang/model/XOutlook";
import XOutcome from "padang/model/XOutcome";
import XMixture from "padang/model/XMixture";
import XViewset from "padang/model/XViewset";
import XDisplay from "padang/model/XDisplay";
import XProject from "padang/model/XProject";
import XVariable from "padang/model/XVariable";
import XMutation from "padang/model/XMutation";
import XIngestion from "padang/model/XIngestion";
import XPreparation from "padang/model/XPreparation";

import PointerField from "padang/model/PointerField";
import PadangFactory from "padang/model/PadangFactory";
import PadangInspector from "padang/model/PadangInspector";

import OptionFormula from "padang/directors/OptionFormula";

import Frontage from "padang/directors/frontages/Frontage";

import FirstRows from "padang/functions/dataset/FirstRows";

import FromDataset from "padang/functions/source/FromDataset";

import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";

import FromDatasetInteraction from "padang/interactions/FromDatasetInteraction";

export default class PadangCreator {

	public static eINSTANCE: PadangCreator = null;

	public createProject(): XProject {

		let factory = PadangFactory.eINSTANCE;
		let project = factory.createXProject();

		let sheets = project.getSheets();
		let sheet = this.createDatasetSheet(project);
		sheets.add(sheet);

		let name = sheet.getName();
		project.setSelection(name);

		return project;
	}

	public createDatasetSheet(project: XProject): XSheet {

		let factory = PadangFactory.eINSTANCE;
		let dataset = factory.createXDataset();

		let display = this.createDisplay();
		dataset.setDisplay(display);

		let sheet = this.createSheet("Dataset", project);
		sheet.setForesee(dataset);

		return sheet;
	}

	private createSheet(type: string, project: XProject): XSheet {

		let sheets = project.getSheets();
		let inspector = PadangInspector.eINSTANCE;
		let names = inspector.getSheetNames(sheets);
		let name = functions.getIncrementedName(type, names);

		let factory = PadangFactory.eINSTANCE;
		let sheet = factory.createXSheet();
		sheet.setName(name);

		return sheet;

	}

	public createDisplay(): XDisplay {
		let factory = PadangFactory.eINSTANCE;
		let display = factory.createXTabular();
		return display;
	}

	public createPreparation(): XPreparation {

		let factory = PadangFactory.eINSTANCE;
		let preparation = factory.createXPreparation();

		let display = this.createDisplay();
		preparation.setDisplay(display);

		return preparation;
	}

	public createPreparationFromDataset(dataset: string): XPreparation {

		let preparation = this.createPreparation();

		let interaction = new FromDatasetInteraction(dataset);
		let mutation = this.createMutation(interaction.interactionName);
		let mutations = preparation.getMutations();
		mutations.add(mutation);

		let name = FromDataset.DATASET_PLAN.getName();
		let option = this.createOption(name, "=`" + dataset + "`");
		let options = mutation.getOptions();
		options.add(option);

		return preparation;
	}

	public createIngestion(): XIngestion {
		let factory = PadangFactory.eINSTANCE;
		let ingestion = factory.createXIngestion();
		return ingestion;
	}


	public createStarterMutation(planName: string): XMutation {

		// Default options
		let creator = PadangCreator.eINSTANCE;
		let mutation = creator.createMutation(planName);
		let registry = InteractionPlanRegistry.getInstance();
		let parameters = mutation.getOptions();
		let parameterPlan = registry.getPlan(planName);
		let parameterPlans = parameterPlan.getParameters();
		let formula = new OptionFormula();
		for (let plan of parameterPlans) {
			let name = plan.getName();
			let literal = formula.getDefaultLiteral(plan);
			let parameter = creator.createOption(name, literal);
			parameters.add(parameter)
		}
		return mutation;
	}

	public createMutation(operation: string): XMutation {
		let factory = PadangFactory.eINSTANCE;
		let mutation = factory.createXMutation();
		mutation.setOperation(operation);
		return mutation;
	}

	public createOption(name: string, formula: string): XOption {
		let factory = PadangFactory.eINSTANCE;
		let option = factory.createXOption();
		option.setName(name);
		option.setFormula(formula);
		return option;
	}

	public createMixture(): XMixture {
		let factory = PadangFactory.eINSTANCE;
		return factory.createXMixture();
	}

	private createViewsetSheet(project: XProject): XSheet {

		let factory = PadangFactory.eINSTANCE;
		let viewset = factory.createXViewset();

		let outlook = factory.createXOutlook();
		outlook.setViewset(viewset);

		let sheet = this.createSheet("Outlook", project);
		sheet.setForesee(outlook);
		return sheet;
	}

	public createMixtureViewsetSheet(project: XProject, cell: boolean): XSheet {
		let sheet = this.createViewsetSheet(project);
		let outlook = <XOutlook>sheet.getForesee();
		let viewset = outlook.getViewset();
		if (cell === true) {
			let mixture = this.createCellMixture();
			viewset.setMixture(mixture);
		} else {
			let mixture = this.createMixture();
			viewset.setMixture(mixture);
		}
		return sheet;
	}

	private createCellMixture(): XMixture {
		let mixture = this.createMixture();
		let cell = this.createCell();
		let parts = mixture.getParts();
		parts.add(cell);
		return mixture;
	}

	public createCell(): XCell {
		let factory = PadangFactory.eINSTANCE;
		let cell = factory.createXCell();
		return cell;
	}

	public createOutlook(): XOutlook {
		let factory = PadangFactory.eINSTANCE;
		let outlook = factory.createXOutlook();
		return outlook;
	}

	public createBuilderSheet(project: XProject, structure: string): XSheet {
		let factory = PadangFactory.eINSTANCE;
		let builder = factory.createXBuilder();
		builder.setStructure(structure);
		let sheet = this.createSheet("Builder", project);
		sheet.setForesee(builder);
		return sheet;
	}

	public createFigureCell(viewset: XViewset, renderer: string): XCell {

		let cell = this.createCell();
		let figure = this.createFigure(viewset, renderer);
		cell.setFacet(figure);

		return cell;
	}

	public createFigure(viewset: XViewset, renderer: string): XFigure {

		let inspector = PadangInspector.eINSTANCE;
		let names = inspector.getPartNames(viewset);
		let partName = functions.getIncrementedName("Figure", names);

		let factory = PadangFactory.eINSTANCE;
		let figure = factory.createXFigure();
		figure.setName(partName);

		let graphic = factory.createXGraphic();
		figure.setGraphic(graphic);
		graphic.setRenderer(renderer);

		return figure;
	}

	public createOutcome(viewset: XViewset, formula: string, name?: string): XOutcome {

		let inspector = PadangInspector.eINSTANCE;
		let names = inspector.getPartNames(viewset);
		let partName = functions.getIncrementedName(name === undefined ? "Outcome" : name, names);

		let factory = PadangFactory.eINSTANCE;
		let outcome = factory.createXOutcome();
		outcome.setFrontage(Frontage.DEFAULT);

		let variable = this.createVariable(partName, formula);
		outcome.setVariable(variable)

		return outcome;
	}

	public createOutcomeCell(viewset: XViewset, formula: string, name?: string): XCell {
		let outcome = this.createOutcome(viewset, formula, name);
		let cell = this.createCell();
		cell.setFacet(outcome);
		return cell;
	}

	public createVariableFigureCell(viewset: XViewset, renderer: string, name: string, formula: string): XCell {
		let figure = this.createFigure(viewset, renderer);
		let graphic = figure.getGraphic();
		let variables = graphic.getVariables();
		let variable = this.createVariable(name, formula);
		variables.add(variable);
		let cell = this.createCell();
		cell.setFacet(figure);
		return cell;
	}

	public createVariableUnder(list: EList<XVariable>, formula: string, name?: string): XVariable {
		let inspector = PadangInspector.eINSTANCE;
		let names = inspector.getVariableNames(list);
		let newName = functions.getIncrementedName(name === undefined ? "Variable" : name, names);
		let variable = this.createVariable(newName, formula)
		return variable;
	}

	public createVariable(name: string, formula: string): XVariable {
		let factory = PadangFactory.eINSTANCE;
		let variable = factory.createXVariable();
		variable.setName(name);
		variable.setFormula(formula);
		return variable;
	}

	public createPointerField(name: string, type?: string, propose?: string, info?: string): PointerField {
		let factory = PadangFactory.eINSTANCE;
		let value = factory.createPointerField();
		value.setName(name);
		value.setType(type);
		value.setPropose(propose);
		value.setDigest(info);
		return value;
	}

	public createInput(list: EList<XInput>): XInput {

		let inspector = PadangInspector.eINSTANCE;
		let names = inspector.getInputNames(list);
		let name = functions.getIncrementedName("Input", names);

		let factory = PadangFactory.eINSTANCE;
		let input = factory.createXInput();
		input.setName(name);

		return input;
	}

	public copyPreparationAddLimit(preparation: XPreparation, limit: number): XPreparation {
		let limited = <XPreparation>util.copy(preparation);
		let mutation = this.createMutation(FirstRows.FUNCTION_NAME);
		let options = mutation.getOptions();
		let option = this.createOption(FirstRows.COUNT_PLAN.getName(), "=" + limit);
		options.add(option);
		let mutations = limited.getMutations();
		mutations.add(mutation);
		return limited;
	}

}

PadangCreator.eINSTANCE = new PadangCreator();
