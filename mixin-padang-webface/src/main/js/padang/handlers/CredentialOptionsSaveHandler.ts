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
import * as bekasi from "bekasi/directors";

import * as directors from "padang/directors";

import PadangCreator from "padang/model/PadangCreator";

import CredentialHandler from "padang/handlers/CredentialHandler";

import CredentialOptionsSaveRequest from "padang/requests/CredentialOptionsSaveRequest";

export default class CredentialOptionSaveHandler extends CredentialHandler {

	public handle(request: CredentialOptionsSaveRequest, callback: () => void): void {

		let name = request.getStringData(CredentialOptionsSaveRequest.NAME);
		let values = <Map<string, any>>request.getData(CredentialOptionsSaveRequest.OPTIONS);
		let creator = PadangCreator.eINSTANCE;
		let mutation = creator.createMutation(name);
		let options = mutation.getOptions();
		for (let key of values.keys()) {
			let value = values.get(key);
			let director = directors.getExpressionFormulaDirector(this.controller);
			let formula = director.getFormulaFromObject(value);
			let option = creator.createOption(key, formula);
			options.add(option);
		}

		let director = bekasi.getRunextraDirector(this.controller);
		director.save(CredentialHandler.CREDENTIAL, name, mutation, callback);
	}

}