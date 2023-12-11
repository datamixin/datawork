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

export default class ItemSelector extends BaseSelector {

	private index: number = null;

	constructor(selectors: string, index: number) {
		super(selectors);
		this.index = index;
	}

	protected evaluate(current: number, element: JQuery,
		callback: (element: JQuery, message: string) => void): void {
		let item = element[this.index];
		if (item !== undefined) {
			callback($(item), null);
		} else {
			this.doSelect(current + this.interval, callback);
		}
	}

}
