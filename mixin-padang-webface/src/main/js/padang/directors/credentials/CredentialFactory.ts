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
import Credential from "padang/directors/credentials/Credential";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";

export default class CredentialFactory {

	private static instance = new CredentialFactory();

	private credentials = new Map<string, typeof Credential>();

	constructor() {
		if (CredentialFactory.instance) {
			throw new Error("Error: Instantiation failed: Use CredentialFactory.getInstance() instead of new");
		}
		CredentialFactory.instance = this;
	}

	public static getInstance(): CredentialFactory {
		return CredentialFactory.instance;
	}

	public register(name: string, credential: typeof Credential): void {
		this.credentials.set(name, credential);
	}

	public create(context: OptionFormulaContext): Credential {
		let operation = context.getOperation();
		let type: any = this.credentials.get(operation);
		return <Credential>new type(context);
	}

}