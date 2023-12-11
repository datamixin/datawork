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
import Panel from "webface/wef/Panel";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import HeightAdjustablePanel from "webface/wef/HeightAdjustablePanel";

import XText from "sleman/model/XText";
import XList from "sleman/model/XList";
import XObject from "sleman/model/XObject";
import XReference from "sleman/model/XReference";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as widgets from "padang/widgets/widgets";

export let createText = (text?: string): XText => {
	let factory = SlemanFactory.eINSTANCE;
	return factory.createXText(text);
}

export let createReference = (text?: string): XReference => {
	let factory = SlemanFactory.eINSTANCE;
	return factory.createXReference(text);
}

export let createObjectField = (name: string, expression: XExpression, object: XObject): XAssignment => {
	let factory = SlemanFactory.eINSTANCE;
	let field = factory.createXAssignment(name, expression);
	let fields = object.getFields();
	fields.add(field)
	return field;
}

export let createListText = (text: string, list: XList): XText => {
	let element = createText(text);
	let elements = list.getElements();
	elements.add(element)
	return element;
}

export let createListReference = (text: string, list: XList): XReference => {
	let element = createReference(text);
	let elements = list.getElements();
	elements.add(element)
	return element;
}

export let remove = (model: EObject): void => {
	util.remove(model);
}

export let getChildrenByData = (composite: Composite, data: any): Control => {
	let children = composite.getChildren();
	for (let child of children) {
		if (child.getData() === data) {
			return child;
		}
	}
	return null;
}

export let relayoutPanel = (composite: Composite, instance: any): Panel => {
	let children = composite.getChildren();
	for (let child of children) {
		let data = child.getData();
		if (data instanceof instance) {
			let panel = <HeightAdjustablePanel>data;
			let height = panel.adjustHeight();
			let control = panel.getControl();
			widgets.setGridData(control, true, height);
			composite.relayout();
		}
	}
	return null;
}