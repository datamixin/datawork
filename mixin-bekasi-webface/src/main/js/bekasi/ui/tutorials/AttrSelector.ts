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
import BaseSelector from "bekasi/ui/tutorials/BaseSelector";

export default class AttrSelector extends BaseSelector {

	private name: string = null;
	private value: any = null;

	constructor(selectors: string, name: string, value: any) {
		super(selectors);
		this.name = name;
		this.value = value;
	}

	protected evaluate(current: number, element: JQuery,
		callback: (element: JQuery, message: string) => void): void {
		let match = false;
		for (let i = 0; i < element.length; i++) {
			let item = $(element[i]);
			if (item.attr(this.name) === this.value) {
				callback($(item), null);
				match = true;
				break;
			}
		}
		if (!match) {
			super.doSelect(current + this.interval, callback);
		}
	}

}
