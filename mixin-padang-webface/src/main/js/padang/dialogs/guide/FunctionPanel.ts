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
import ConductorPanel from "webface/wef/ConductorPanel";

import XCall from "sleman/model/XCall";
import XText from "sleman/model/XText";
import XList from "sleman/model/XList";
import XNumber from "sleman/model/XNumber";
import XLogical from "sleman/model/XLogical";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

import ParameterDefaultValueRequest from "padang/requests/ParameterDefaultValueRequest";

abstract class FunctionPanel extends ConductorPanel {

	protected plan: FunctionPlan = null;
	protected call: XCall = null;

	constructor(dialog: GuideDialog, plan: FunctionPlan, call: XCall, reset: boolean) {
		super(dialog.getConductor());
		this.plan = plan;
		this.call = call;
		if (reset === true) {
			this.populateDefaults();
		}
	}

	private populateDefaults(): void {
		this.requestDefaultValue(0);
	}

	private requestDefaultValue(index: number): void {
		let args = this.call.getArguments();
		if (index === 0) {
			args.clear();
		}
		let parameters = this.plan.getParameters();
		let parameter = parameters[index];
		let request = new ParameterDefaultValueRequest(parameter);
		this.conductor.submit(request, (value: XExpression) => {
			let factory = SlemanFactory.eINSTANCE;
			let argument = factory.createXArgument(value);
			args.add(argument);
			if (index < parameters.length - 1) {
				this.requestDefaultValue(index + 1);
			}
		});
	}

	private getPlanName(plan: string | ParameterPlan): string {
		if (plan instanceof ParameterPlan) {
			return plan.getName();
		} else {
			return plan;
		}
	}

	public getArgument(plan: string | ParameterPlan): XExpression {
		let name = this.getPlanName(plan);
		let model: XExpression = null;
		let args = this.call.getArguments();
		let parameters = this.plan.getParameters();
		for (let i = 0; i < args.size; i++) {
			let argument = args.get(i);
			let expression = argument.getExpression();
			if (argument instanceof XAssignment) {
				let identifier = argument.getName();
				if (identifier.getName() === name) {
					return expression;
				}
			} else {
				let parameter = parameters[i];
				if (parameter.getName() === name) {
					return expression;
				}

			}
		}
		return model;
	}

	public getText(plan: ParameterPlan): XText {
		return <XText>this.getArgument(plan);
	}

	public getList(plan: ParameterPlan): XList {
		return <XList>this.getArgument(plan);
	}

	public getNumber(plan: ParameterPlan): XNumber {
		return <XNumber>this.getArgument(plan);
	}

	public getLogical(plan: ParameterPlan): XLogical {
		return <XLogical>this.getArgument(plan);
	}

	public abstract validate(): string;

}

export default FunctionPanel;