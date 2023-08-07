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
import XList from "sleman/model/XList";
import XCall from "sleman/model/XCall";
import XText from "sleman/model/XText";
import XMember from "sleman/model/XMember";
import XPointer from "sleman/model/XPointer";
import SlemanCreator from "sleman/model/SlemanInspector";
import SlemanInpector from "sleman/model/SlemanInspector";

import FormulaParser from "bekasi/FormulaParser";

import BuilderPremise from "padang/ui/BuilderPremise";

import XPreprocessing from "malang/model/XPreprocessing";

import TransmapperRegistry from "malang/directors/transmappers/TransmapperRegistry";

export default class PreprocessingReader {

	public static PREPROCESSED = "Preprocessed";
	public static ENCODERS = "Encoders";
	public static RESULT = "Result";

	private premise: BuilderPremise = null;
	private model: XPreprocessing = null;

	constructor(premise: BuilderPremise, model: XPreprocessing) {
		this.premise = premise;
		this.model = model;
	}

	public getPreprocessedNames(formula: string): string[] {
		let inspector = SlemanInpector.eINSTANCE;
		let parser = new FormulaParser();
		let valueMember = <XMember>parser.parse(formula);
		let nameText = <XText>valueMember.getProperty();
		let name = nameText.getValue();
		let columns = [name];
		let recipe = this.model.getRecipe();
		let preprocessing = <XCall>parser.parse(recipe);
		let mutations = <XList>inspector.getArgumentExpression(preprocessing, 0);
		for (let mutation of mutations.getElements()) {
			let call = <XCall>mutation;
			let registry = TransmapperRegistry.getInstance();
			let transmapper = registry.getTransmapper(call);
			columns = transmapper.track(call, columns);
		}
		return columns;
	}

	public isPreparationResultExists(): boolean {
		return this.premise.isVariableExists(PreprocessingReader.PREPROCESSED);
	}

	public getPreprocessedPointer(): XPointer {
		let creator = SlemanCreator.eINSTANCE;
		return creator.createReference(PreprocessingReader.PREPROCESSED);
	}

	public getPreprocessedResultPointer(): XPointer {
		let creator = SlemanCreator.eINSTANCE;
		return creator.createMember(PreprocessingReader.PREPROCESSED, PreprocessingReader.RESULT);
	}

	public getPreprocessedResultPointerLiteral(): string {
		let literal = this.getPreprocessedResultPointer()
		return "=" + literal;
	}

}
