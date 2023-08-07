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
import Initiator from "malang/directors/initiators/Initiator";

export default class InitiatorRegistry {

	private static instance = new InitiatorRegistry();

	private initiators = new Map<string, Initiator>();

	constructor() {
		if (InitiatorRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use InitiatorRegistry.getInstance() instead of new");
		}
		InitiatorRegistry.instance = this;
	}

	public static getInstance(): InitiatorRegistry {
		return InitiatorRegistry.instance;
	}

	public register(name: string, initiator: Initiator): void {
		this.initiators.set(name, initiator);
	}

	public list(): Iterable<Initiator> {
		return this.initiators.values();
	}

	public getInitiator(eClassName: string): Initiator {
		return this.initiators.get(eClassName) || null;
	}

}