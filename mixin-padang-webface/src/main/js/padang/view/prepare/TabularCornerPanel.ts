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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";

import GridControlStyle from "padang/grid/GridControlStyle";

import TabularCornerMenuAction from "padang/view/prepare/TabularCornerMenuAction";

export default class TabularCornerPanel extends ConductorPanel {

	private composite: Composite = null;
	private menuPanel = new MenuPanel();

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		view.setGridLayout(this.composite, 1, 0, 0);
		this.createMenuPanel(this.composite);
	}

	private createMenuPanel(parent: Composite): void {
		this.menuPanel.createControl(parent);
		this.menuPanel.setIcon("mdi-table-cog");
		this.menuPanel.setActions(new TabularCornerMenuAction(this.conductor));
		view.setGridData(this.menuPanel, true, GridControlStyle.HEADER_HEIGHT);
	}

	public getControl(): Control {
		return this.composite;
	}

}