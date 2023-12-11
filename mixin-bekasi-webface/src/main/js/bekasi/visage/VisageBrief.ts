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
import { jsonLeanFactory } from "webface/constants";

import VisageValue from "bekasi/visage/VisageValue";

export default class VisageBrief extends VisageValue {

	public static LEAN_NAME = "VisageBrief";

	private type: string = null;
	private simple: boolean = null;
	private children: number = 0;
	private propose: string = null;
	private digest: string = null;
	private key: string = null;
	private value: VisageValue = null;

	constructor() {
		super(VisageBrief.LEAN_NAME);
	}

	public getType(): string {
		return this.type;
	}

	public isSimple(): boolean {
		return this.simple;
	}

	public getChildren(): number {
		return this.children;
	}

	public getPropose(): string {
		return this.propose;
	}

	public getDigest(): string {
		return this.digest;
	}

	public getKey(): string {
		return this.key;
	}

	public getValue(): any {
		return this.value;
	}


}

jsonLeanFactory.register(VisageBrief.LEAN_NAME, VisageBrief);