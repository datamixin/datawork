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

import * as view from "padang/view/view";
import IconLabelPanel from "padang/view/IconLabelPanel";
import * as TypeDecoration from "padang/view/TypeDecoration";

import * as anatomy from "padang/view/explain/explain";
import ValueFieldExplainView from "padang/view/explain/ValueFieldExplainView";

export default class PointerFieldExplainView extends ValueFieldExplainView {

	private headerPart: Composite = null;
	private iconLiteralPanel = new IconLabelPanel();

	public createHeaderControl(parent: Composite): void {
		this.headerPart = new Composite(parent);
		view.setFillLayoutHorizontal(this.headerPart, 5);
		this.createIconLiteralPanel(this.headerPart);
	}

	private createIconLiteralPanel(parent: Composite): void {
		this.iconLiteralPanel.createControl(parent);
		this.iconLiteralPanel.setIconColor("#888");
		view.css(this.iconLiteralPanel, "line-height", (anatomy.ITEM_HEIGHT) + "px");
	}

	public adjustHeaderHeight(): number {
		return anatomy.ITEM_HEIGHT;
	}

	public getHeaderControl(): Control {
		return this.headerPart;
	}

	public setLiteral(literal: string): void {
		this.iconLiteralPanel.setLabel(literal);
	}

	public setType(type: string): void {
		let icon = TypeDecoration.getIconOrSymbol(type);
		this.iconLiteralPanel.setIcon(icon);
	}

}
