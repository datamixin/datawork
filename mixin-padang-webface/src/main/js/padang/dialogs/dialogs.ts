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

import Check from "webface/widgets/Check";
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import IconPanel from "padang/view/IconPanel";
import IconLabelPanel from "padang/view/IconLabelPanel";

import * as widgets from "padang/widgets/widgets";

export let ICON_SIZE = 24;
export let ITEM_HEIGHT = 24;
export let SPACE_WIDTH = 24;
export let LABEL_WIDTH = 120;
export let BUTTON_HEIGHT = 30;
export let LIST_HEIGHT = ITEM_HEIGHT * 7;

export let createLabelGrid = (parent: Composite, text: string): Label => {
	let label = new Label(parent);
	label.setText(text);
	widgets.css(label, "line-height", ITEM_HEIGHT + "px");
	return label;
}

export let createSpaceGrid = (parent: Composite): Label => {
	let label = new Label(parent);
	return label;
}

export let createCheckGrid = (parent: Composite): Check => {
	let label = new Check(parent);
	return label;
}

export let createButtonGrid = (parent: Composite, text: string): Button => {
	let button = new Button(parent);
	button.setText(text);
	return button;
}

export let createLabelGridHorizontal = (parent: Composite, text: string): Label => {
	let label = createLabelGrid(parent, text);
	widgets.setGridData(label, true, ITEM_HEIGHT);
	return label;
}

export let createButtonGridWidth = (parent: Composite, text: string, width: number): Button => {
	let button = createButtonGrid(parent, text);
	widgets.setGridData(button, width, BUTTON_HEIGHT);
	return button;
}

export let createLabelGridWidth = (parent: Composite, text: string, width: number): Label => {
	let label = createLabelGrid(parent, text);
	widgets.setGridData(label, width, ITEM_HEIGHT);
	return label;
}

export let createSpaceGridWidth = (parent: Composite, width: number): Label => {
	let label = createSpaceGrid(parent);
	widgets.setGridData(label, width, ITEM_HEIGHT);
	return label;
}

export let createCheckGridWidth = (parent: Composite, width: number): Check => {
	let check = createCheckGrid(parent);
	widgets.setGridData(check, width, ITEM_HEIGHT);
	return check;
}

export let createLabelGridLabel = (parent: Composite, text: string): Label => {
	let label = createLabelGrid(parent, text);
	widgets.setGridData(label, LABEL_WIDTH, ITEM_HEIGHT);
	return label;
}

export let createCheckGridSpace = (parent: Composite): Check => {
	let check = createCheckGrid(parent);
	widgets.setGridData(check, SPACE_WIDTH, ITEM_HEIGHT);
	return check;
}

export let createSpaceGridSpace = (parent: Composite): Label => {
	let label = createSpaceGrid(parent);
	widgets.setGridData(label, SPACE_WIDTH, ITEM_HEIGHT);
	return label;
}

export let createIconGrid = (parent: Composite, icon: string, pointer?: string): IconPanel => {
	let panel = new IconPanel();
	panel.createControl(parent);
	panel.setIcon(icon);
	setIconStyle(panel, pointer);
	widgets.setGridData(panel, ICON_SIZE, ICON_SIZE);
	return panel;
}

export let createIconLabelGrid = (parent: Composite, icon: string, label: string, pointer?: string): IconLabelPanel => {
	let panel = new IconLabelPanel();
	panel.createControl(parent);
	panel.setIcon(icon);
	panel.setLabel(label);
	setIconStyle(panel, pointer);
	widgets.setGridData(panel, true, ICON_SIZE);
	return panel;
}

export let setIconStyle = (panel: Panel, pointer?: string): void => {
	widgets.css(panel, "font-style", "italic");
	widgets.css(panel, "line-height", ITEM_HEIGHT + "px");
	widgets.css(panel, "cursor", pointer === undefined ? "pointer" : pointer);
}

export let setEnabled = (target: Control | Panel, enabled: boolean): void => {
	let control: Control = null;
	if (target instanceof Control) {
		control = target;
	} else {
		control = target.getControl();
	}
	control.setEnabled(enabled);
}
