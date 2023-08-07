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
import SecurityProvider from "bekasi/ui/SecurityProvider";

export default class SecurityProviderRegistry {

	private static instance = new SecurityProviderRegistry();

	private defaultProvider: SecurityProvider = null;
	private customProvider: SecurityProvider = null;

	constructor() {
		if (SecurityProviderRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use SecurityProviderRegistry.getInstance() instead of new");
		}
		SecurityProviderRegistry.instance = this;
	}

	public static getInstance(): SecurityProviderRegistry {
		return SecurityProviderRegistry.instance;
	}

	public register(provider: SecurityProvider, forDefault?: boolean): void {
		if (forDefault === true) {
			this.defaultProvider = provider;
		} else {
			this.customProvider = provider;
		}
	}

	public getProvider(): SecurityProvider {
		if (this.customProvider !== null) {
			return this.customProvider;
		} else {
			return this.defaultProvider;
		}
	}

}