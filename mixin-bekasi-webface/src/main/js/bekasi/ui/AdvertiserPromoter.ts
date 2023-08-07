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
import AdvertiserPart from "bekasi/ui/AdvertiserPart";
import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";

export default class AdvertiserPromoter {

	private parts: AdvertiserPart[] = [];

	constructor(agents: AdvertiserAgent[], title: string) {
		for (let i = 0; i < agents.length; i++) {
			let agent = agents[i];
			let part = agent.createAdvertiserPart(title);
			this.parts.push(part);
		}
	}

	public exhibit(): void {
		for (let i = 0; i < this.parts.length; i++) {
			let part = this.parts[i];
			part.exhibit();
		}
	}

	public progress(message: string): void {
		for (let i = 0; i < this.parts.length; i++) {
			let part = this.parts[i];
			part.message(message);
		}
	}

	public raise(caution: any): void {
		for (let i = 0; i < this.parts.length; i++) {
			let part = this.parts[i];
			part.error(caution);
		}
	}

	public complete(): void {
		for (let i = 0; i < this.parts.length; i++) {
			let part = this.parts[i];
			part.close();
		}
	}

}