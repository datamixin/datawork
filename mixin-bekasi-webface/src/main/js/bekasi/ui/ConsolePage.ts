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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import HomeMenu from "bekasi/ui/HomeMenu";

export abstract class ConsolePage implements Panel {

	protected viewer: BasePartViewer = null;

	private name: string = null;
	private label: string = null;
	private icon: string = null;

	constructor(viewer: BasePartViewer, name: string, label: string, icon: string) {
		this.viewer = viewer;
		this.name = name;
		this.label = label;
		this.icon = icon;
	}

	public getIcon(): string {
		return this.icon;
	}

	public getName(): string {
		return this.name;
	}

	public getLabel(): string {
		return this.label;
	}

	public setSelected(state: boolean): void {
		let control = this.getControl();
		let element = control.getElement();
		if (state === true) {
			element.addClass("selected");
		} else {
			element.removeClass("selected");
		}
	}

	public abstract createControl(parent: Composite): void;

	public abstract getControl(): Control;

	public createHomeMenus(): HomeMenu[] {
		return [];
	}

	public configure(): void {

	}

}

export default ConsolePage;