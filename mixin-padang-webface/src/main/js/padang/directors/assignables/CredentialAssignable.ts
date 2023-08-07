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
import XCall from "sleman/model/XCall";

import Function from "padang/functions/Function";

import Assignable from "padang/directors/assignables/Assignable";
import AssignableRegistry from "padang/directors/assignables/AssignableRegistry";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";

import CredentialManagerDialog from "padang/dialogs/CredentialManagerDialog";

import CredentialFactory from "padang/directors/credentials/CredentialFactory";

export default class CredentialAssignable extends Assignable {

	public evaluate(context: OptionFormulaContext, _call: XCall, callback: (result: any) => void): boolean {
		let controller = context.getController();
		let registry = CredentialFactory.getInstance();
		let credential = registry.create(context);
		let dialog = new CredentialManagerDialog(controller, credential);
		callback(dialog);
		return true;
	}

}

let registry = AssignableRegistry.getInstance();
registry.register(Function.CREDENTIAL, new CredentialAssignable());
