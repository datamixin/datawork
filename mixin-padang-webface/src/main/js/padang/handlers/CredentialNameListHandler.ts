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

import CredentialHandler from "padang/handlers/CredentialHandler";

import CredentialNameListRequest from "padang/requests/CredentialNameListRequest";

export default class CredentialNameListHandler extends CredentialHandler {

	public handle(_request: CredentialNameListRequest, callback: (list: string[]) => void): void {
		let director = bekasi.getRunextraDirector(this.controller);
		director.getNames(CredentialHandler.CREDENTIAL, callback);
	}

}
