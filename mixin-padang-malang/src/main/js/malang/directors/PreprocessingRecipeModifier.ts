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

import Controller from "webface/wef/Controller";
import CommandGroup from "webface/wef/CommandGroup";

import XCall from "sleman/model/XCall";
import XText from "sleman/model/XText";
import XList from "sleman/model/XList";
import XObject from "sleman/model/XObject";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import SlemanCreator from "sleman/model/SlemanCreator";

import FormulaParser from "bekasi/FormulaParser";

import Transmute from "padang/functions/model/Transmute";
import Preprocessing from "padang/functions/model/Preprocessing";

import FromDataset from "padang/functions/source/FromDataset";
import CreateDataset from "padang/functions/source/CreateDataset";

import SelectColumns from "padang/functions/dataset/SelectColumns";

import XModeler from "malang/model/XModeler";
import XPreprocessing from "malang/model/XPreprocessing";

import RecipeModifier from "malang/directors/RecipeModifier";
import InputFeatureReader from "malang/directors/InputFeatureReader";
import PreprocessingReader from "malang/directors/PreprocessingReader";
import FeatureFormulaParser from "malang/directors/FeatureFormulaParser";

import TransmapperRegistry from "malang/directors/transmappers/TransmapperRegistry";

import PreprocessingRecipeSetCommand from "malang/commands/PreprocessingRecipeSetCommand";
import Learning from "padang/functions/model/Learning";

export default class PreprocessingRecipeModifier extends RecipeModifier {

	private parser = new FeatureFormulaParser();
	private model: XPreprocessing = null;
	private recipe: string = null;
	private preprocessing: XCall = null;

	constructor(model: XPreprocessing) {
		super();
		this.model = model;
		this.recipe = model.getRecipe();
		this.prepare();
	}

	public getModel(): XPreprocessing {
		return this.model;
	}

	private prepare(): void {
		if (this.recipe !== null) {
			let parser = new FormulaParser();
			this.preprocessing = <XCall>parser.parse(this.recipe);
		}
	}

	private getTransmutes(): EList<XCall> {
		let args = this.preprocessing.getArguments();
		let arg = args.get(0);
		let list = <XList>arg.getExpression();
		let elements = list.getElements();
		return <EList<XCall>>elements;
	}

	private getTransmuteOperation(operation: string): XReference {
		let transmute = this.getTransmute(operation);
		let args = transmute.getArguments();
		let arg = args.get(0);
		return <XReference>arg.getExpression();
	}

	private getTransmuteOptions(operation: string): EList<XExpression> {
		let transmute = this.getTransmute(operation);
		let args = transmute.getArguments();
		let arg = args.get(1);
		let reference = <XList>arg.getExpression();
		return reference.getElements();
	}

	private getTransmute(operation: string): XCall {
		let transmutes = this.getTransmutes();
		for (let transmute of transmutes) {
			let args = transmute.getArguments();
			let arg = args.get(0);
			let reference = <XReference>arg.getExpression();
			if (reference.getName() === operation) {
				return transmute;
			}
		}
		throw new Error("Missing transmute " + operation);
	}

	private getSelectColumnTexts(): EList<XText> {
		let options = this.getTransmuteOptions(SelectColumns.FUNCTION_NAME);
		let columnsNameList = <XList>options.get(0);
		return <EList<XText>>columnsNameList.getElements();
	}

	public addFeature(formula: string, index: number, _type: string): void {

		let creator = SlemanCreator.eINSTANCE;
		let columnNameText = this.parser.createColumnText(formula);

		if (this.preprocessing === null) {

			this.preprocessing = creator.createCall(Preprocessing.FUNCTION_NAME);
			let mutations = creator.createList();
			creator.addArgument(this.preprocessing, mutations);

			let sourceReference = this.parser.getDatasetReference(formula);
			this.addTransmute(FromDataset.FUNCTION_NAME, sourceReference);

			let selectOptions = creator.createList(columnNameText);
			this.addTransmute(SelectColumns.FUNCTION_NAME, selectOptions);

		} else {

			let columnNames = this.getSelectColumnTexts();
			columnNames.add(columnNameText, index);

		}
	}

	private addTransmute(operation: string, ...options: XExpression[]): void {
		let creator = SlemanCreator.eINSTANCE;
		let reference = creator.createReference(operation);
		let list = creator.createList();
		for (let option of options) {
			list.addElement(option);
		}
		let transmute = creator.createCall(Transmute.FUNCTION_NAME, reference, list);
		let transmutes = this.getTransmutes();
		transmutes.add(transmute);
	}

	private removeTransmute(name: string): void {
		let transmutes = this.getTransmutes();
		let transmute = this.getTransmute(name);
		transmutes.remove(transmute);
	}

	public moveFeature(_formula: string, _position: number): void {

	}

	public removeFeature(formula: string): void {
		let removeName = this.parser.getColumnName(formula);
		let columnNames = this.getSelectColumnTexts();
		for (let columnName of columnNames) {
			if (columnName.getValue() === removeName) {
				columnNames.remove(columnName);
				break;
			}
		}
		if (columnNames.size === 0) {
			this.removeTransmute(SelectColumns.FUNCTION_NAME);
			this.preprocessing = null;
		}
	}

	public getMutationSteps(): string[] {
		if (this.preprocessing !== null) {
			let labels: string[] = [];
			let transmutes = this.getTransmutes();
			let encoders = 0;
			for (let transmute of transmutes) {
				let registry = TransmapperRegistry.getInstance();
				let transmapper = registry.getTransmapper(transmute);
				if (transmapper.isEncoder()) {
					encoders++;
				}
			}
			if (encoders > 0) {
				labels.push("Encoders " + encoders);
			} else {
				labels.push("No encoders");
			}
			return labels;
		} else {
			return [];
		}
	}

	public applyForPrediction(features: XExpression): void {
		this.applyCreateDataset(<XList>features);
		this.applyLearningFalse();
		this.applyEncoders();
	}

	private applyCreateDataset(features: XList): void {

		let model = <XModeler>util.getAncestor(this.model, XModeler);
		let reader = new InputFeatureReader(model);
		let names = reader.getInputFeatureNames(Learning.FEATURES);
		let creator = SlemanCreator.eINSTANCE;
		let object = creator.createObject();
		for (let i = 0; i < names.length; i++) {
			let name = names[i];
			let series = features.getElementAt(i);
			creator.addField(object, name, series);
		}

		// Create Dataset
		let operation = this.getTransmuteOperation(FromDataset.FUNCTION_NAME);
		operation.setName(CreateDataset.FUNCTION_NAME);

		// Set Option
		let options = this.getTransmuteOptions(CreateDataset.FUNCTION_NAME);
		options.set(0, object);

		this.removeTargets(object);
	}

	private removeTargets(features: XObject): void {

		let targets: string[] = [];
		let options = this.getTransmuteOptions(SelectColumns.FUNCTION_NAME);
		let list = <XList>options.get(0);
		for (let element of list.getElements()) {
			let text = <XText>element;
			let name = text.getValue();
			let exists = false;
			let fields = features.getFields();
			for (let field of fields) {
				let identifier = field.getName();
				if (identifier.getName() === name) {
					exists = true;
					break;
				}
			}
			if (exists === false) {
				targets.push(name);
			}
		}
		for (let target of targets) {
			for (let element of list.getElements()) {
				let text = <XText>element;
				if (text.getValue() === target) {
					list.removeElement(element);
					break;
				}
			}
		}
	}

	private applyLearningFalse(): void {
		let creator = SlemanCreator.eINSTANCE;
		creator.addLogicalArgument(this.preprocessing, false);
	}

	private applyEncoders(): void {
		let creator = SlemanCreator.eINSTANCE;
		let encoders = creator.createMember(PreprocessingReader.PREPROCESSED, PreprocessingReader.ENCODERS);
		creator.addArgument(this.preprocessing, encoders);
	}

	public getRecipeLiteral(): string {
		if (this.preprocessing === null) {
			return null;
		} else {
			let literal = this.preprocessing.toLiteral();
			return "=" + literal;
		}
	}

	public getPreprocessing(): XCall {
		return this.preprocessing;
	}

	public getCommand(): PreprocessingRecipeSetCommand {
		let literal = this.getRecipeLiteral();
		let command = new PreprocessingRecipeSetCommand();
		command.setPreprocessing(this.model);
		command.setRecipe(literal);
		return command;
	}

	public addCommand(group: CommandGroup): void {
		let command = this.getCommand();
		group.add(command);
	}

	public executeCommand(controller: Controller): void {
		let command = this.getCommand();
		controller.execute(command);
	}

}