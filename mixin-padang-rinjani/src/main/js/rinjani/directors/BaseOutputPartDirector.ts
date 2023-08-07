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

import Point from "webface/graphics/Point";

import ConductorPanel from "webface/wef/ConductorPanel";

import XCall from "sleman/model/XCall";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import VisageList from "bekasi/visage/VisageList";
import VisageBrief from "bekasi/visage/VisageBrief";

import * as padang from "padang/padang";

import GraphicPremise from "padang/ui/GraphicPremise";

import BriefValue from "padang/functions/system/BriefValue";
import BriefValueList from "padang/functions/system/BriefValueList";

import GraphicPartViewer from "vegazoo/ui/GraphicPartViewer";

import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";

import InputPlan from "rinjani/plan/InputPlan";

import OutputPartSupport from "rinjani/directors/OutputPartSupport";
import OutputPartDirector from "rinjani/directors/OutputPartDirector";

import ModelConverter from "rinjani/directors/converters/ModelConverter";

export default class BaseOutputPartDirector implements OutputPartDirector {

	private premise: GraphicPremise = null;
	private support: OutputPartSupport = null;

	constructor(_viewer: GraphicPartViewer, premise: GraphicPremise) {
		this.premise = premise;
		this.support = new OutputPartSupport(premise);
	}

	public getResultSpec(callback: (spec: any) => void): void {
		let spec = this.support.getLastSpec();
		callback(spec);
	}

	public createResult(model: XRoutine, size: Point, callback: (panel: ConductorPanel) => void): void {
		this.support.getPlotResult(model, size, callback);
	}

	public routineChanged(routine: XRoutine): void {
		let mapping = this.premise.getMapping();
		let converter = new ModelConverter();
		let value = converter.convertModelToValue(routine);
		mapping.setValue(padang.FORMATION, value);
		mapping.setValueAsFormula(padang.FORMATION);
	}

	public buildParameters(list: EList<XParameter>, callback: (options: Map<string, any>) => void): void {
		this.support.buildParameters(list, callback);
	}

	public getResultBriefType(formula: string, callback: (type: string) => void): void {
		let expression = this.premise.parse(formula);
		let call = this.createCall(BriefValue.FUNCTION_NAME, expression);
		this.premise.evaluate(call, (brief: VisageBrief) => {
			let type = this.getInputType(brief);
			callback(type);
		});
	}

	public getResultBriefListTypes(formula: string, callback: (types: Map<string, string>) => void): void {
		let expression = this.premise.parse(formula);
		let call = this.createCall(BriefValueList.FUNCTION_NAME, expression);
		this.premise.evaluate(call, (list: VisageList) => {
			let values = list.getValues();
			let types = new Map<string, string>();
			for (let value of values) {
				let brief = <VisageBrief>value;
				let name = brief.getKey();
				let type = this.getInputType(brief);
				types.set(name, type);
			}
			callback(types);
		});
	}

	private getInputType(brief: VisageBrief): string {
		let dataType = brief.getType();
		return InputPlan.convertType(dataType);
	}

	private createCall(callee: string, expression: XExpression): XCall {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXCall(callee, expression);
	}

}