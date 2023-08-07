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
export default class BaseSelector {

	private selectors: string = null;
	private timeout: number = 5000;

	protected interval: number = 500;

	constructor(selectors: string) {
		this.selectors = selectors;
	}

	public select(callback: (element: JQuery, message: string) => void): void {
		this.doSelect(0, callback);
	}

	protected doSelect(current: number, callback: (element: JQuery, message: string) => void): void {
		setTimeout(() => {
			let element = $(this.selectors);
			if (current >= this.timeout) {
				callback(null, "Timeout while waiting for element '" + this.selectors + "' to select!");
			} else {
				if (element.length === 0) {
					this.doSelect(current + this.interval, callback);
				} else {
					this.evaluate(current, element, callback);
				}
			}
		}, this.interval);
	}

	protected evaluate(_current: number, element: JQuery,
		callback: (element: JQuery, message: string) => void): void {
		callback(element, null);
	}

}