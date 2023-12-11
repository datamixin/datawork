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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as webface from "webface/webface";

import * as functions from "webface/functions";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import ToolboxToolPanel from "padang/view/toolbox/ToolboxToolPanel";

export default class ToolboxIconPanel extends ToolboxToolPanel {

	private static LABEL_HEIGHT = 15;
	private static MIN_WIDTH = 54;

	private composite: Composite = null;
	private container: Composite = null;
	private captionLabel: Label = null;
	private text: string = null;

	constructor(text: string) {
		super();
		this.text = text;
	}

	public getText(): string {
		return this.text;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-toolbox-group-panel");

		let layout = new GridLayout(1, 0, 0, 0, 2);
		this.composite.setLayout(layout);

		this.createContainer(this.composite);
		this.createCaptionLabel(this.composite);
	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let element = this.container.getElement();
		element.addClass("padang-toolbox-group-container");

		let layoutData = new GridData(9, true);
		this.container.setLayoutData(layoutData);

		let layout = new GridLayout(1, 0, 0);
		this.container.setLayout(layout);

	}

	private createCaptionLabel(parent: Composite): void {

		this.captionLabel = new Label(parent);
		this.captionLabel.setText(this.text);

		let element = this.captionLabel.getElement();
		element.css("color", "#B8B8B8");
		element.css("text-align", "center");
		element.css("border-top", "1px dotted #D8D8D8");
		element.css("line-height", ToolboxIconPanel.LABEL_HEIGHT + "px");

		let layoutData = new GridData(true, ToolboxIconPanel.LABEL_HEIGHT);
		this.captionLabel.setLayoutData(layoutData);

	}

	public adjustWidth(): number {

		let element = this.captionLabel.getElement();
		let captionWidth = functions.measureTextWidth(element, this.text);

		let part = new GridCompositeAdjuster(this.container);
		let containerWidth = part.adjustWidth();
		let layoutData = <GridData>this.container.getLayoutData();
		layoutData.widthHint = containerWidth;

		this.composite.relayout();

		let width = Math.max(captionWidth, containerWidth);
		if (width < ToolboxIconPanel.MIN_WIDTH) {
			layoutData.horizontalAlignment = webface.CENTER;
			return ToolboxIconPanel.MIN_WIDTH;
		} else {
			return width;
		}
	}

	public clear(): void {
		view.disposeChildren(this.container);
	}

	public getControl(): Control {
		return this.composite;
	}

	public addPanel(panel: ToolboxToolPanel): void {

		panel.createControl(this.container);
		let control = panel.getControl();
		control.setData(panel);

		let layoutData = new GridData(0, true);
		control.setLayoutData(layoutData);

		let children = this.container.getChildren();
		let layout = <GridLayout>this.container.getLayout();
		layout.numColumns = children.length;

	}

}