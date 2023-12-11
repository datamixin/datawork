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
import View from "webface/wef/View";
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import RowData from "webface/layout/RowData";
import GridData from "webface/layout/GridData";
import FillData from "webface/layout/FillData";
import RowLayout from "webface/layout/RowLayout";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";
import AbsoluteData from "webface/layout/AbsoluteData";
import AbsoluteLayout from "webface/layout/AbsoluteLayout";

import * as functions from "webface/functions";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as widgets from "padang/widgets/widgets";

import * as constants from "padang/view/constants";

export let addClass = (target: View | Panel | Control, name: string): void => {
	widgets.addClass(target, name);
}

export let css = (target: View | Panel | Control, name: string, value: string | number): JQuery => {
	return widgets.css(target, name, value);
}

export let attr = (target: View | Panel | Control, name: string, value: string | number): JQuery => {
	return widgets.attr(target, name, value);
}

export let setVisible = (target: View | Panel | Control, visible: boolean): void => {
	return widgets.setVisible(target, visible);
}

export let setEnabled = (target: View | Panel | Control, enabled: boolean): void => {
	return widgets.setEnabled(target, enabled);
}

export let setRowData = (target: View | Panel | Control, width: number, height: number): RowData => {
	return widgets.setRowData(target, width, height);
}

export let setGridData = (target: View | Panel | Control,
	width: number | boolean, height: number | boolean): GridData => {
	return widgets.setGridData(target, width, height);
}

export let setFillData = (target: Control | Panel, weight: number): FillData => {
	return widgets.setFillData(target, weight);
}

export let setAbsoluteData = (target: Control | Panel,
	left?: number | string, top?: number | string,
	width?: number | string, height?: number | string): AbsoluteData => {
	return widgets.setAbsoluteData(target, left, top, width, height);
}

export let getAbsoluteData = (target: Control | Panel): AbsoluteData => {
	return widgets.getAbsoluteData(target);
}

export let getGridData = (target: Control | Panel): GridData => {
	return widgets.getGridData(target);
}

export let setRowLayout = (composite: Composite, type?: string,
	marginWidth?: number, marginHeight?: number, spacing?: number, alignment?: string): RowLayout => {
	return widgets.setRowLayout(composite, type, marginWidth, marginHeight, spacing, alignment);
}

export let setGridLayout = (composite: Composite, numColumns?: number,
	marginWidth?: number, marginHeight?: number,
	horizontalSpacing?: number, verticalSpacing?: number): GridLayout => {
	return widgets.setGridLayout(composite, numColumns, marginWidth, marginHeight, horizontalSpacing, verticalSpacing);
}

export let setFillLayoutVertical = (composite: Composite,
	marginWidth?: number, marginHeight?: number, spacing?: number): FillLayout => {
	return widgets.setFillLayoutVertical(composite, marginWidth, marginHeight, spacing);
}

export let setFillLayoutHorizontal = (composite: Composite,
	marginWidth?: number, marginHeight?: number, spacing?: number): FillLayout => {
	return widgets.setFillLayoutHorizontal(composite, marginWidth, marginHeight, spacing);
}

export let setAbsoluteLayout = (composite: Composite): AbsoluteLayout => {
	return widgets.setAbsoluteLayout(composite);
}

export let setLayoutData = (target: View | Panel | Control, data: any): Control => {
	let control = widgets.getControl(target);
	control.setLayoutData(data);
	return control;
}

export let setControlData = (target: View | Panel | Control): Control => {
	let control = widgets.getControl(target);
	control.setData(target);
	return control;
}

export let getLayoutData = (target: View | Panel | Control): any => {
	let control = widgets.getControl(target);
	return control.getLayoutData();
}

export let dispose = (target: View | Panel | Control): void => {
	widgets.dispose(target);
}

export let disposeChildren = (target: View | Panel | Control): void => {
	widgets.disposeChildren(target);
}

export let setSelected = (target: View | Panel | Control, selected: boolean) => {
	if (target !== null) {
		let control = widgets.getControl(target);
		let element = control.getElement();
		if (selected === true) {
			element.addClass(constants.SELECTED);
		} else {
			element.removeClass(constants.SELECTED);
		}
	}
}

export let adjustGridDataHeight = (target: View | Panel | Control): number => {
	let control = widgets.getControl(target);
	let layoutData = <GridData>control.getLayoutData();
	layoutData.heightHint = (<HeightAdjustablePart><any>target).adjustHeight();
	relayoutParent(control);
	return layoutData.heightHint;
}

export let getGridLayoutHeight = (composite: Composite, childHeights: number[]): number => {
	let layout = <GridLayout>composite.getLayout();
	let height = layout.marginHeight * 2;
	for (let childHeight of childHeights) {
		height += childHeight;
	}
	let children = composite.getChildren();
	height += (children.length - 1) * layout.verticalSpacing;
	return height;
}

export let adjustWidthGridCompositeAdjuster = (composite: Composite): number => {
	let part = new GridCompositeAdjuster(composite);
	let width = part.adjustWidth();
	let layoutData = <GridData>composite.getLayoutData();
	layoutData.widthHint = width;
	relayoutParent(composite);
	return width;
}

export let adjustHeightGridCompositeAdjuster = (composite: Composite): number => {
	let part = new GridCompositeAdjuster(composite);
	let height = part.adjustHeight();
	let layoutData = <GridData>composite.getLayoutData();
	layoutData.heightHint = height;
	relayoutParent(composite);
	return height;
}

export let relayoutParent = (control: Control): void => {
	let parent = control.getParent();
	parent.relayout();
}

export let grabHorizontalExclusive = (target: View | Panel | Control): void => {
	let control = widgets.getControl(target);
	let composite = control.getParent();
	let layout = <GridLayout>composite.getLayout();
	layout.grabHorizontalExclusive(composite, control);
}

export let grabVerticalExclusive = (target: View | Panel | Control): void => {
	let control = widgets.getControl(target);
	let composite = control.getParent();
	let layout = <GridLayout>composite.getLayout();
	layout.grabVerticalExclusive(composite, control);
	composite.relayout();
}

export let setShow = (target: View | Panel | Control, show: boolean): void => {
	let control = widgets.getControl(target);
	let element = control.getElement();
	if (show === true) {
		element.show();
	} else {
		element.hide();
	}
}

export let measureTextWidth = (target: View | Panel | Control, text: string): number => {
	let control = widgets.getControl(target);
	let element = control.getElement();
	return functions.measureTextWidth(element, text);
}
