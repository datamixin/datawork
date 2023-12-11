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
import PartViewer from "webface/wef/PartViewer";

import ConsolePage from "bekasi/ui/ConsolePage";

export default class ConsolePageFactory {

	private static instance = new ConsolePageFactory();
	private pages: (any[]) = [];

	constructor() {
		if (ConsolePageFactory.instance) {
			throw new Error("Error: Instantiation failed: Use ConsolePageFactory.getInstance() instead of new");
		}
		ConsolePageFactory.instance = this;
	}

	public static getInstance(): ConsolePageFactory {
		return ConsolePageFactory.instance;
	}

	public register(page: typeof ConsolePage): void {
		this.pages.push(page);
	}

	public createPages(partViewer: PartViewer): ConsolePage[] {
		let pages: ConsolePage[] = [];
		for (let type of this.pages) {
			let page = new type(partViewer);
			pages.push(page);
		}
		return pages;
	}

}