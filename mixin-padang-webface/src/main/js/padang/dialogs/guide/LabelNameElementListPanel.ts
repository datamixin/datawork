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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import XList from "sleman/model/XList";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameElementListPanel from "padang/dialogs/guide/NameElementListPanel";

export default class LabelNameElementListPanel {

	private label: string = null;
	private composite: Composite = null;
	private panel: NameElementListPanel = null;

	constructor(label: string, support: NameListSupport, list: XList) {
		this.label = label;
		this.panel = new NameElementListPanel(support, list);
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		widgets.setGridLayout(this.composite, 2, 0, 0, 0, 0);
		dialogs.createLabelGridLabel(this.composite, this.label);
		this.createPanelPart(this.composite);
	}

	private createPanelPart(parent: Composite): void {
		this.panel.createControl(parent);
		widgets.setGridData(this.panel, true, true);
	}

	public adjustHeight(): number {
		return this.panel.adjustHeight();
	}

	public getControl(): Control {
		return this.composite;
	}

}