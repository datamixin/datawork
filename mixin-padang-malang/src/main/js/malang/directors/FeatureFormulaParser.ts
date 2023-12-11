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
import XMember from "sleman/model/XMember";

import XText from "sleman/model/XText";
import XReference from "sleman/model/XReference";
import SlemanFactory from "sleman/model/SlemanFactory";

import FormulaParser from "bekasi/FormulaParser";

export default class FeatureFormulaParser {

	private parser = new FormulaParser();

	public getDatasetReference(formula: string): XReference {
		let datasetColumn = <XMember>this.parser.parse(formula);
		return <XReference>datasetColumn.getObject();
	}

	public getColumnText(formula: string): XText {
		let member = <XMember>this.parser.parse(formula);
		return <XText>member.getProperty();
	}

	public getColumnName(formula: string): string {
		let text = this.getColumnText(formula);
		return text.getValue();
	}

	public createColumnText(formula: string): XText {
		let factory = SlemanFactory.eINSTANCE;
		let name = this.getColumnName(formula);
		return <XText>factory.createXText(name);
	}

}