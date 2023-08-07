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
import Action from "webface/action/Action";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";
import * as functions from "webface/wef/functions";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import VisageList from "bekasi/visage/VisageList";
import VisageType from "bekasi/visage/VisageType";
import VisageBrief from "bekasi/visage/VisageBrief";
import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import XCall from "sleman/model/XCall";
import XPointer from "sleman/model/XPointer";
import SlemanCreator from "sleman/model/SlemanCreator";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XGraphic from "padang/model/XGraphic";
import XBuilder from "padang/model/XBuilder";
import XVariable from "padang/model/XVariable";
import ValueField from "padang/model/ValueField";
import PointerField from "padang/model/PointerField";
import PadangCreator from "padang/model/PadangCreator";
import VariableField from "padang/model/VariableField";

import BriefValue from "padang/functions/system/BriefValue";
import BriefValueList from "padang/functions/system/BriefValueList";

import Propose from "padang/directors/proposes/Propose";
import ProposeRegistry from "padang/directors/proposes/ProposeRegistry";
import VariableFieldDirector from "padang/directors/VariableFieldDirector";

import RendererRegistry from "padang/directors/renderers/RendererRegistry";

import StructureRegistry from "padang/directors/structures/StructureRegistry";

import VariableAnatomyController from "padang/controller/anatomy/VariableAnatomyController";
import PointerFieldAnatomyController from "padang/controller/anatomy/PointerFieldAnatomyController";

export default class BaseVariableFieldDirector implements VariableFieldDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	private createVariablePointer(variable: XVariable, furthers: string[]): XPointer {
		let name = variable.getName();
		let names: string[] = [name];
		let factory = SlemanFactory.eINSTANCE;
		let pointer: XPointer = null;
		for (let i = 0; i < names.length; i++) {
			let name = names[i];
			if (i === 0) {
				pointer = factory.createXReference(name);
			} else {
				pointer = factory.createXMember(pointer, name);
			}
		}
		for (let name of furthers) {
			pointer = factory.createXMember(pointer, name);
		}
		return pointer;
	}

	private createCall(callee: string, pointer: XPointer): XCall {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXCall(callee, pointer);
	}

	public loadVariableBrief(variable: VariableField, callback: () => void): void {

		let model = variable.getVariable();
		let pointer = this.createVariablePointer(model, []);
		let call = this.createCall(BriefValue.FUNCTION_NAME, pointer);
		this.inspectValue(model, call, (brief: VisageValue) => {

			if (brief instanceof VisageBrief) {

				// Load variable brief contents
				let type = brief.getType();
				let digest = brief.getDigest();
				let propose = brief.getPropose();
				variable.setType(type);
				variable.setPropose(propose);
				variable.setDigest(digest);

			} else if (brief instanceof VisageError) {

				let message = brief.getMessage();
				variable.setType(VisageType.UNKNOWN);
				variable.setDigest(message);

			} else {

				let leanName = brief.xLeanName();
				variable.setType(VisageType.UNKNOWN);
				variable.setDigest(leanName);
			}

			callback();

		});
	}

	public loadValueFieldList(value: ValueField, callback: () => void): void {

		let variable = this.getVariable(value);
		let pointer = this.createPointer(value);
		let call = this.createCall(BriefValueList.FUNCTION_NAME, pointer);

		this.inspectValue(variable, call, (result: VisageValue) => {

			if (result instanceof VisageList) {

				let list = value.getList();
				list.clear();
				let elements = (<VisageList>result).getValues();
				for (let element of elements) {
					let brief = <VisageBrief>element;
					let key = brief.getKey();
					let type = brief.getType();
					let digest = brief.getDigest();
					if (!digest) {
						digest = brief.getValue();
						if (!digest) {
							digest = type;
						}
					}
					let propose = brief.getPropose();
					let creator = PadangCreator.eINSTANCE;
					let child = creator.createPointerField(key, type, propose, digest);
					list.add(child);
				}
				callback();

			}
		});
	}

	private getVariable(value: ValueField): XVariable {
		let variable = <VariableField>util.getRootContainer(value);
		return variable.getVariable();
	}

	private inspectValue(variable: XVariable, call: XCall, callback: (value: VisageValue) => void): void {
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(variable, padang.INSPECT_EVALUATE, [call],
			(value: VisageValue) => {
				callback(value);
			}
		);
	}

	public createPointer(value: ValueField): XPointer {
		let current: EObject = value;
		let variable: XVariable = null;
		let names: string[] = [];
		while (current !== null) {
			let name: string = null;
			if (current instanceof PointerField) {
				name = current.getName();
			} else if (current instanceof VariableField) {
				variable = current.getVariable();
			}
			if (name !== null) {
				names.splice(0, 0, name);
			}
			current = current.eContainer();
		}
		return this.createVariablePointer(variable, names);
	}

	private getPropose(value: ValueField): Propose {
		let registry = ProposeRegistry.getInstance();
		let name = value.getPropose();
		let propose = registry.get(name);
		return propose;
	}

	public listPrefacePresumes(value: ValueField): Map<string, string> {
		let propose = this.getPropose(value);
		let names = new Map<string, string>();
		if (propose === null) {
			return names;
		}
		let type = value.getType();
		let prefaces = propose.getPrefaces(type);
		for (let key of prefaces.keys()) {
			let preface = prefaces.get(key);
			let presume = preface.getPresume();
			names.set(key, presume);
		}
		return names;
	}

	public loadPrefaceExample(value: ValueField, callback: (result: VisageValue) => void): void {
		let propose = this.getPropose(value);
		if (propose !== null) {
			let variable = this.getVariable(value);
			let pointer = this.createPointer(value);
			let preface = value.getPreface();
			let call = propose.createCall(preface, pointer);
			this.inspectValue(variable, call, (result: VisageValue) => {
				callback(result);
			});
		}
	}

	public getPrefaceFormula(value: ValueField, name: string): string {
		let propose = this.getPropose(value);
		if (propose === null) {
			return null;
		}
		let type = value.getType();
		let prefaces = propose.getPrefaces(type);
		let preface = prefaces.get(name);
		let pointer = this.createPointer(value);
		let call = preface.createCall(pointer);
		let literal = call.toLiteral();
		return "=" + literal;
	}

	public getPointerFieldActionList(field: PointerField, callback: (list: Action[]) => void): void {
		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		let model = contents.getModel();
		if (model instanceof XGraphic) {
			let name = model.getRenderer();
			let registry = RendererRegistry.getInstance();
			let renderer = registry.get(name);
			renderer.getPointerFieldActionList(contents, field, callback);
		} else if (model instanceof XBuilder) {
			let name = model.getStructure();
			let registry = StructureRegistry.getInstance();
			let structure = registry.get(name);
			structure.getPointerFieldActionList(contents, field, callback);
		}
	}

	public getFieldPointer(controller: Controller): string {
		let path: string[] = [];
		let current: Controller = controller;
		while (current instanceof PointerFieldAnatomyController) {
			let name = current.getName();
			path.splice(0, 0, name);
			current = current.getParent();
		}
		let top = functions.getAncestorByModelClass(controller, VariableField);
		if (top === null) top = controller;
		let field = <VariableField>top.getModel();
		let variable = field.getVariable();
		let name = variable.getName();
		let creator = SlemanCreator.eINSTANCE;
		let expression: XPointer = creator.createReference(name);
		for (let part of path) {
			expression = creator.createMember(expression, part);
		}
		return "=" + expression.toLiteral();
	}

	public refreshVariables(): void {
		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		let controllers = functions.getDescendantsByModelClass(contents, VariableField);
		for (let controller of controllers) {
			let children = controller.getChildren();
			for (let child of children) {
				if (child instanceof VariableAnatomyController) {
					child.refreshCompute(() => {
						controller.refresh();
					});
				}
			}
		}
	}

}
