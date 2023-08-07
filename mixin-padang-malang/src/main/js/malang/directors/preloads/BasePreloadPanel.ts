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
import Point from "webface/graphics/Point";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import PreloadPanel from "malang/panels/PreloadPanel";

export abstract class BasePreloadPanel implements PreloadPanel {

	public static HEADER_HEIGHT = 24;

	private caption: string = null;
	private composite: Composite = null;

	constructor(caption: string) {
		this.caption = caption;
	}

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index);
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createHeaderPanel(this.composite);
		this.createContentPart(this.composite);
	}

	private createHeaderPanel(parent: Composite): void {
		let headerPanel = new LabelPanel();
		headerPanel.createControl(parent);
		headerPanel.setText(this.caption);
		view.css(headerPanel, "text-align", "center");
		view.css(headerPanel, "font-weight", "bold");
		view.css(headerPanel, "line-height", BasePreloadPanel.HEADER_HEIGHT + "px");
		view.setGridData(headerPanel, true, BasePreloadPanel.HEADER_HEIGHT);
	}

	private createContentPart(parent: Composite): void {
		this.createContentControl(parent);
		let control = this.getContentControl();
		view.setGridData(control, true, true);
	}

	protected abstract createContentControl(parent: Composite): void;

	protected abstract getContentControl(): Control;

	public abstract getRequiredSize(): Point;

	public getControl(): Control {
		return this.composite;
	}

}

export default BasePreloadPanel;