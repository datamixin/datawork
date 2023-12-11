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
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import XTabular from "padang/model/XTabular";
import PadangCreator from "padang/model/PadangCreator";

import * as directors from "padang/directors";

import SelectRows from "padang/functions/dataset/SelectRows";

import TabularColumnInspectHandler from "padang/handlers/TabularColumnInspectHandler";

import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";

export default class TabularColumnInspectApplyHandler extends TabularColumnInspectHandler {

	public handle(request: TabularColumnInspectApplyRequest, _callback: (width: number) => void): void {

		let column = request.getStringData(TabularColumnInspectApplyRequest.NAME);
		let type = request.getStringData(TabularColumnInspectApplyRequest.TYPE);
		let values = <Map<string, any>>request.getData(TabularColumnInspectApplyRequest.VALUES);

		let director = directors.getColumnProfileDirector(this.controller);
		let formula = director.createConditionFormula(column, type, values);

		let creator = PadangCreator.eINSTANCE;
		let mutation = creator.createMutation(SelectRows.FUNCTION_NAME);

		let condition = SelectRows.CONDITION_PLAN.getName();
		let parameter = creator.createOption(condition, formula);
		let parameters = mutation.getOptions();
		parameters.add(parameter);

		this.onCommit();

		let model = <XTabular>this.controller.getModel();
		let mutations = model.getMutations();
		if (mutations.size === 0) {

			let command = new ListAddCommand();
			command.setList(mutations);
			command.setElement(mutation);
			this.controller.execute(command);

		} else {

			let oldMutation = mutations.get(0);
			let command = new ReplaceCommand();
			command.setModel(oldMutation);
			command.setReplacement(mutation);
			this.controller.execute(command);

		}

	}

}