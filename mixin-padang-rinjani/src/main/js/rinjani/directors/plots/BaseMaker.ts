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
import XList from "sleman/model/XList";
import XCall from "sleman/model/XCall";
import XConstant from "sleman/model/XConstant";
import XArgument from "sleman/model/XArgument";
import XReference from "sleman/model/XReference";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import VisageTable from "bekasi/visage/VisageTable";
import VisageColumn from "bekasi/visage/VisageColumn";

import ParameterPlan from "padang/plan/ParameterPlan";

import * as constants from "vegazoo/constants";

export default class BaseMaker {

	public createList(): XList {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXList();
	}

	public createArgument(expression: XExpression): XArgument {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXArgument(expression);
	}

	public createReference(name: string): XReference {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXReference(name);
	}

	public createAssignment(name: string, expression: XExpression): XAssignment {
		let factory = SlemanFactory.eINSTANCE;
		let assignment = factory.createXAssignment();
		let identifier = factory.createXIdentifier(name);
		assignment.setName(identifier);
		assignment.setExpression(expression);
		return assignment;
	}

	public createCall(callee: string, args: (XArgument | XExpression)[]): XCall {
		let factory = SlemanFactory.eINSTANCE;
		let call = factory.createXCall(callee);
		let models = call.getArguments();
		for (let arg of args) {
			if (arg instanceof XArgument) {
				models.add(arg);
			} else if (arg instanceof XExpression) {
				let value = factory.createXArgument(arg);
				models.add(value);
			}
		}
		return call;
	}

	public getAssignmentExpression(assignments: XAssignment[], name: string): XExpression {
		for (let assignment of assignments) {
			let identifier = assignment.getName();
			if (identifier.getName() === name) {
				return assignment.getExpression();
			}
		}
		return null;
	}

	public getConstantAssignment(assignments: XAssignment[], plan: ParameterPlan): any {
		let name = plan.getName();
		let expression = this.getAssignmentExpression(assignments, name);
		if (expression instanceof XConstant) {
			return expression.toValue();
		} else {
			throw new Error("'" + name + "' assignment is not a constant");
		}
	}

	public createStringColumn(name: string): VisageColumn {
		return new VisageColumn(name, constants.DataType.STRING);
	}

	public createNumberColumn(name: string): VisageColumn {
		return new VisageColumn(name, constants.DataType.NUMBER);
	}

	public getTableColumnNames(table: VisageTable): string[] {
		let names: string[] = [];
		let columns = table.getColumns();
		for (let column of columns) {
			let name = column.getKey();
			names.push(name);
		}
		return names;
	}

}
