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
import * as bekasi from "bekasi/directors";

import * as directors from "padang/directors";

import XMutation from "padang/model/XMutation";

import CredentialHandler from "padang/handlers/CredentialHandler";

import CredentialOptionsLoadRequest from "padang/requests/CredentialOptionsLoadRequest";

export default class CredentialOptionLoadHandler extends CredentialHandler {

	public handle(request: CredentialOptionsLoadRequest, callback: (values: Map<string, any>) => void): void {
		let name = request.getStringData(CredentialOptionsLoadRequest.NAME);
		let director = bekasi.getRunextraDirector(this.controller);
		let promise = director.load(CredentialHandler.CREDENTIAL, name);
		promise.then((mutation: XMutation) => {
			let options = mutation.getOptions();
			let values = new Map<string, any>();
			let director = directors.getOptionFormulaDirector(this.controller);
			for (let option of options) {
				let name = option.getName();
				let formula = option.getFormula();
				director.evaluateValue(formula, (value: any) => {
					values.set(name, value);
					if (values.size === options.size) {
						callback(values);
					}
				});
			}
		});

	}

}