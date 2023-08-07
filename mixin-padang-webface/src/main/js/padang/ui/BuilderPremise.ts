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
import XExpression from "sleman/model/XExpression";

import VisageValue from "bekasi/visage/VisageValue";

import GraphicPremise from "padang/ui/GraphicPremise";
import PreparationFormulator from "padang/ui/PreparationFormulator";

export default interface BuilderPremise extends GraphicPremise {

	isVariableExists(name: string): boolean;

	getVariableExpression(name: string): XExpression;

	getVariableResult(name: string, callback: (value: VisageValue) => void): void;

	setVariableExpression(name: string, expression: XExpression | string, callback: () => void): void;

	addVariable(name: string, expression: XExpression | string, callback: () => void): void;

	prepareVariable(name: string, formulator: PreparationFormulator, callback: (formula: string) => void): void;

}