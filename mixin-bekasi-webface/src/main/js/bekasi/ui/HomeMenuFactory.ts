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

import HomeMenu from "bekasi/ui/HomeMenu";

export default class HomeMenuFactory {

	private static instance = new HomeMenuFactory();

	private types = new Map<string, HomeMenuType[]>();

	constructor() {
		if (HomeMenuFactory.instance) {
			throw new Error("Error: Instantiation failed: Use HomeMenuFactory.getInstance() instead of new");
		}
		HomeMenuFactory.instance = this;
	}

	public static getInstance(): HomeMenuFactory {
		return HomeMenuFactory.instance;
	}

	public register(category: string, menu: typeof HomeMenu, args?: any[]): void {
		if (!this.types.has(category)) {
			this.types.set(category, []);
		}
		let menus = this.types.get(category);
		let type = new HomeMenuType(menu, args === undefined ? [] : args);
		menus.push(type);
	}

	public createMenus(category: string, partViewer: PartViewer): HomeMenu[] {
		let types = this.types.get(category);
		let menus: HomeMenu[] = [];
		for (let type of types) {
			let cls: any = type.type;
			let menu = new cls(partViewer, type.args.length === 0 ? undefined : type.args);
			menus.push(menu);
		}
		return menus;
	}

}

class HomeMenuType {

	constructor(
		public type: typeof HomeMenu,
		public args: any[]) {
	}

}
