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
export let VARIABLE_FIELD_DIRECTOR = "field-variable-director";

import Action from "webface/action/Action";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XPointer from "sleman/model/XPointer";

import VisageValue from "bekasi/visage/VisageValue";

import ValueField from "padang/model/ValueField";
import PointerField from "padang/model/PointerField";
import VariableField from "padang/model/VariableField";

export interface VariableFieldDirector {

	loadVariableBrief(field: VariableField, callback: () => void): void;

	loadValueFieldList(value: ValueField, callback: () => void): void;

	createPointer(value: ValueField): XPointer;

	listPrefacePresumes(value: ValueField): Map<string, string>;

	loadPrefaceExample(value: ValueField, callback: (result: VisageValue) => void): void;

	getPrefaceFormula(value: ValueField, name: string): string;

	getPointerFieldActionList(field: PointerField, callback: (list: Action[]) => void): void;

	getFieldPointer(controller: Controller): string;

}

export function getVariableFieldDirector(host: Controller | PartViewer): VariableFieldDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <VariableFieldDirector>viewer.getDirector(VARIABLE_FIELD_DIRECTOR);
}

export default VariableFieldDirector;
