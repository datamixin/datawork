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
import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XExpression from "sleman/model/XExpression";
import SlemanInspector from "sleman/model/SlemanInspector";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";

export abstract class Transmapper {

	private plan: FunctionPlan = null;

	constructor(plan: FunctionPlan) {
		this.plan = plan;
	}

	public getPlan(): FunctionPlan {
		return this.plan;
	}

	public getOptionStarted(): number {
		return 1;
	}

	public isEncoder(): boolean {
		return false;
	}

	public abstract track(expression: XExpression, inputs: string[]): string[];

	private getExpression(call: XCall, plan: ParameterPlan): XExpression {
		let parameters = this.plan.getParameterList();
		let inspector = SlemanInspector.eINSTANCE;
		let index = parameters.getPlanIndex(plan);
		let list = <XList>inspector.getArgumentExpression(call, 1);
		let started = this.getOptionStarted();
		return list.getElementAt(index - started);
	}

	protected getListArg(call: XCall, plan: ParameterPlan): XList {
		return <XList>this.getExpression(call, plan);
	}

	protected getTextArg(call: XCall, plan: ParameterPlan): XText {
		return <XText>this.getExpression(call, plan);
	}

	protected getListColumnNames(call: XCall, plan: ParameterPlan): string[] {
		let outputs: string[] = [];
		let columns = this.getListArg(call, plan);
		for (let column of columns.getElements()) {
			let text = <XText>column;
			let value = text.getValue();
			outputs.push(value);
		}
		return outputs;

	}

}

export default Transmapper;