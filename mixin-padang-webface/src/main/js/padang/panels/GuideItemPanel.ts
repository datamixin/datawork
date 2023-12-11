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
import WebFontIcon from "webface/widgets/WebFontIcon";

import ConductorPanel from "webface/wef/ConductorPanel";

import * as widgets from "padang/widgets/widgets";

export default class GuideItemPanel extends ConductorPanel {

	public static HEIGHT = 48;

	private static ICON_WIDTH = 64;

	private composite: Composite = null;
	private imageIcon: WebFontIcon = null;
	private labelPart: Composite = null;
	private captionLabel: Label = null;
	private descriptionLabel: Label = null;
	private onSelection = () => { };

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		widgets.addClass(this.composite, "padang-guide-item-panel");
		widgets.setGridLayout(this.composite, 2, 0, 0, 0, 0);

		this.composite.onSelection(() => {
			this.onSelection();
		});

		this.createImageIcon(this.composite);
		this.createLabelPart(this.composite);
	}

	private createImageIcon(parent: Composite): void {
		this.imageIcon = new WebFontIcon(parent);
		widgets.css(this.imageIcon, "font-size", GuideItemPanel.HEIGHT + "px");
		widgets.css(this.imageIcon, "line-height", GuideItemPanel.HEIGHT + "px");
		widgets.setGridData(this.imageIcon, GuideItemPanel.ICON_WIDTH, true);
	}

	private createLabelPart(parent: Composite): void {
		this.labelPart = new Composite(parent);
		widgets.setGridLayout(this.labelPart, 1, 4, 4, 0, 0);
		widgets.setGridData(this.labelPart, true, true);
		this.createCaptionLabel(this.labelPart);
		this.createDescriptionLabel(this.labelPart);
	}

	private createCaptionLabel(parent: Composite): void {
		this.captionLabel = new Label(parent);
		widgets.css(this.captionLabel, "font-weight", "600");
		widgets.setGridData(this.captionLabel, true, true);
	}

	private createDescriptionLabel(parent: Composite): void {
		this.descriptionLabel = new Label(parent);
		widgets.css(this.descriptionLabel, "font-style", "italic");
		widgets.setGridData(this.descriptionLabel, true, true);
	}

	public setLabel(text: string): void {
		this.captionLabel.setText(text);
	}

	public setIcon(icon: string): void {
		this.imageIcon.addClasses("mdi", icon);
	}

	public setDescription(description: string): void {
		this.descriptionLabel.setText(description);
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
	}

	public adjustHeight(): number {
		return GuideItemPanel.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
