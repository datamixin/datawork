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
import EObject from "webface/model/EObject";

import BaseHandler from "webface/wef/base/BaseHandler";

import SlemanFactory from "sleman/model/SlemanFactory";

import VisageList from "bekasi/visage/VisageList";
import VisageBrief from "bekasi/visage/VisageBrief";

import * as directors from "padang/directors";

import BriefValueList from "padang/functions/system/BriefValueList";

import PointerFeatureMapRequest from "padang/requests/toolbox/PointerFeatureMapRequest";

export default class PointerFeatureMapHandler extends BaseHandler {

	public handle(request: PointerFeatureMapRequest, callback: (data: any) => void): void {
		let model = <EObject>this.controller.getModel();
		let source = request.getStringData(PointerFeatureMapRequest.POINTER);
		let director = directors.getExpressionFormulaDirector(this.controller);
		let factory = SlemanFactory.eINSTANCE;
		let pointer = factory.createXPointer(source);
		let call = factory.createXCall(BriefValueList.FUNCTION_NAME, pointer);
		let formula = "=" + call.toLiteral();
		director.evaluateFormula(model, formula, (value: VisageList) => {
			let elements = value.getValues();
			let map = new Map<string, string>();
			for (let element of elements) {
				let brief = <VisageBrief>element;
				let key = brief.getKey();
				let type = brief.getType();
				map.set(key, type);
			}
			callback(map);
		});
	}

}
