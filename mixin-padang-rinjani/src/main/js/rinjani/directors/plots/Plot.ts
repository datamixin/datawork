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
import Panel from "webface/wef/Panel";

import Point from "webface/graphics/Point";

import ConstantPlan from "webface/plan/ConstantPlan";

import XList from "sleman/model/XList";
import XMember from "sleman/model/XMember";
import XPointer from "sleman/model/XPointer";
import XConstant from "sleman/model/XConstant";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";

import VisageError from "bekasi/visage/VisageError";
import VisageValue from "bekasi/visage/VisageValue";
import VisageObject from "bekasi/visage/VisageObject";
import VisageConstant from "bekasi/visage/VisageConstant";

import GraphicPremise from "padang/ui/GraphicPremise";

import ParameterPlan from "padang/plan/ParameterPlan";

import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import ModelConverter from "vegazoo/directors/converters/ModelConverter";

import PlotPlan from "rinjani/plan/PlotPlan";
import InputPlan from "rinjani/plan/InputPlan";

import PlotMaker from "rinjani/directors/plots/PlotMaker";
import MessagePanel from "rinjani/directors/plots/MessagePanel";

export abstract class Plot {

	protected plan: PlotPlan = null;
	protected maker = new PlotMaker();
	protected premise: GraphicPremise = null;
	protected parameters: Map<string, VisageValue> = null;

	private minimumWidth: number = PlotPlan.MINIMUM_WIDTH;
	private minimumHeight: number = PlotPlan.MINIMUM_HEIGHT;

	constructor(plan: PlotPlan, premise: GraphicPremise, parameters: Map<string, VisageValue>) {
		this.plan = plan;
		this.premise = premise;
		this.parameters = parameters;
	}

	public getParameter(plan: ParameterPlan): any {
		let name = plan.getName();
		let value: any = null;
		if (this.parameters.has(name)) {
			value = this.parameters.get(name);
		} else {
			let assignedPlan = plan.getAssignedPlan();
			if (assignedPlan instanceof ConstantPlan) {
				value = <VisageConstant>assignedPlan.getDefaultValue();
			}
		}
		if (value instanceof VisageConstant) {
			return value.getValue();
		}
		return value;
	}

	public setMinimumSize(width: number, height: number): Point {
		this.minimumWidth = width;
		this.minimumHeight = height;
		let size = new Point(this.minimumWidth, this.minimumHeight);
		size.x -= ModelConverter.PADDING_LEFT + ModelConverter.PADDING_RIGHT;
		size.y -= ModelConverter.PADDING_TOP + ModelConverter.PADDING_BOTTOM;
		return size;
	}

	protected adjustTopLevelSizeWithSpace(spec: XTopLevelUnitSpec | XTopLevelLayerSpec,
		size: Point, spaceWidth: number, spaceHeight: number): void {

		let dim = size.clone();
		dim.x = Math.max(dim.x, this.minimumWidth) - (spaceWidth);
		dim.x -= ModelConverter.PADDING_LEFT + ModelConverter.PADDING_RIGHT;

		dim.y = Math.max(dim.y, this.minimumHeight) - (spaceHeight);
		dim.y -= ModelConverter.PADDING_TOP + ModelConverter.PADDING_BOTTOM;
		this.maker.adjustSize(spec, dim);
	}

	public getMinimumWidth(): number {
		return this.minimumWidth;
	}

	public getMinimumHeight(): number {
		return this.minimumHeight;
	}

	protected getEncodedColumn(column: string): string {
		return btoa(column);
	}

	protected validateAssignments(assignments: XAssignment[], callback: (panel: Panel) => void): boolean {

		// Arguments
		let argPlans = this.getInputPlans(this.plan);
		for (let argPlan of argPlans) {
			let argName = argPlan.getName();
			let argLabel = argPlan.getLabel();
			let exists = false;
			for (let assignment of assignments) {
				let identifier = assignment.getName();
				if (identifier.getName() === argName) {

					let single = argPlan.isSingle();
					if (!single) {
						let list = <XList>assignment.getExpression();
						if (list.getElementCount() === 0) {
							let message = "Required at least one feature for '" + argLabel + "' argument";
							let panel = new MessagePanel(message);
							callback(panel);
							return false;
						}
					}

					exists = true;
					break;
				}
			}
			if (!exists) {
				let panel = new MessagePanel("Required '" + argLabel + "' argument");
				callback(panel);
				return false;
			}
		}

		// Parameters
		let message = this.validateParameterAssignments(assignments);
		if (message !== null) {
			let panel = new MessagePanel("Parameter validation: " + message);
			callback(panel);
		}

		return true;
	}

	protected evaluate(assignments: XAssignment[],
		callback: (panel: Panel) => void, evaluate: (model: VisageObject) => void): void {
		if (this.validateAssignments(assignments, callback)) {
			let model = assignments[0].getExpression();
			this.inspectEvaluate(model, callback, evaluate);
		}
	}

	protected evaluateFunction(name: string, assignments: XAssignment[],
		callback: (panel: Panel) => void, evaluate: (value: VisageValue) => void): void {
		if (this.validateAssignments(assignments, callback)) {
			let call = this.maker.createCall(name, assignments);
			this.inspectEvaluate(call, callback, evaluate);
		}
	}

	protected validateParameterAssignments(_assignments: XAssignment[]): string {
		return null;
	}

	protected getAssignmentExpression(assignments: XAssignment[], name: string): XExpression {
		for (let assignment of assignments) {
			let identifier = assignment.getName();
			if (identifier.getName() === name) {
				return assignment.getExpression();
			}
		}
		return null;
	}

	protected getConstantAssignment(assignments: XAssignment[], plan: ParameterPlan): any {
		let name = plan.getName();
		let expression = this.getAssignmentExpression(assignments, name);
		if (expression instanceof XConstant) {
			return expression.toValue();
		} else {
			throw new Error("'" + name + "' assignment is not a constant");
		}
	}

	protected inspectEvaluate(expression: XExpression, error: (panel: Panel) => void, success: (result: any) => void): void {
		this.premise.evaluate(expression, (result: any) => {
			if (result instanceof VisageError) {
				let message = result.getMessage();
				let panel = new MessagePanel(message);
				error(panel);
			} else {
				success(result);
			}
		});
	}

	protected getEncodedPointerAssignment(assignments: XAssignment[], plan: InputPlan): string {
		for (let assignment of assignments) {
			let identifier = assignment.getName();
			if (identifier.getName() === plan.getName()) {
				let expression = assignment.getExpression();
				if (expression instanceof XPointer) {
					let value = expression.toLiteral();
					return btoa("=" + value);
				}
			}
		}
		return btoa("");
	}

	public getFeatureNames(assignments: XAssignment[], plan: InputPlan): string[] {
		let names: string[] = [];
		for (let assignment of assignments) {
			let identifier = assignment.getName();
			if (identifier.getName() === plan.getName()) {
				let expression = assignment.getExpression();
				if (expression instanceof XPointer) {
					this.collectFeatureNames(names, expression);
				} else if (expression instanceof XList) {
					let elements = expression.getElements();
					for (let feature of elements) {
						this.collectFeatureNames(names, feature);
					}
				}
			}
		}
		return names;
	}

	private collectFeatureNames(names: string[], expression: XExpression): void {
		if (expression instanceof XMember) {
			expression = expression.getProperty();
		}
		let literal = expression.toLiteral();
		names.push(literal);
	}

	protected getInputPlans(plan: PlotPlan): InputPlan[] {
		return plan.getInputs();
	}

	public thumbnail(_size: Point, _callback: (panel: Panel) => void): void {

	}

	public abstract execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void;

}

export default Plot;