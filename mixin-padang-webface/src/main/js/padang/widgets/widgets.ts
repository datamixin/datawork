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
import View from "webface/wef/View";
import Panel from "webface/wef/Panel";

import * as webface from "webface/webface";

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

export let getControl = (target: Control | Panel): Control => {
	if (target instanceof Control) {
		return target;
	} else {
		return (<Panel><any>target).getControl();
	}
}

export let getComposite = (target: Composite | Panel): Composite => {
	if (target instanceof Composite) {
		return target;
	} else {
		return <Composite>(<Panel><any>target).getControl();
	}
}

export let addClass = (target: Control | Panel, name: string): void => {
	let control = getControl(target);
	let element = control.getElement();
	element.addClass(name);
}

export let removeClass = (target: Control | Panel, name: string): void => {
	let control = getControl(target);
	let element = control.getElement();
	element.removeClass(name);
}

export let css = (target: Control | Panel, name: string, value: string | number): JQuery => {
	let control = getControl(target);
	let element = control.getElement();
	element.css(name, value);
	return element;
}

export let attr = (target: Control | Panel, name: string, value: string | number): JQuery => {
	let control = getControl(target);
	let element = control.getElement();
	element.attr(name, value);
	return element;
}

export let setVisible = (target: Control | Panel, visible: boolean): void => {
	let control = getControl(target);
	control.setVisible(visible);
}

export let setEnabled = (target: Control | Panel, enabled: boolean): void => {
	let control = getControl(target);
	control.setEnabled(enabled);
}

export let setRowData = (target: Control | Panel, width: number, height: number): RowData => {
	let control = getControl(target);
	let layoutData = new RowData(width, height);
	control.setLayoutData(layoutData);
	return layoutData;
}

export let setGridData = (target: Control | Panel, width: number | boolean, height: number | boolean): GridData => {
	let control = getControl(target);
	let layoutData = new GridData(width, height);
	control.setLayoutData(layoutData);
	return layoutData;
}

export let setFillData = (target: Control | Panel, weight: number): FillData => {
	let control = getControl(target);
	let layoutData = new FillData(weight);
	control.setLayoutData(layoutData);
	return layoutData;
}

export let setAbsoluteData = (target: Control | Panel,
	left?: number | string, top?: number | string,
	width?: number | string, height?: number | string): AbsoluteData => {
	let control = getControl(target);
	let layoutData = new AbsoluteData(left, top, width, height);
	control.setLayoutData(layoutData);
	return layoutData;
}

export let getAbsoluteData = (target: Control | Panel): AbsoluteData => {
	let control = getControl(target);
	let layoutData = <AbsoluteData>control.getLayoutData();
	return layoutData;
}

export let getGridData = (target: Control | Panel): GridData => {
	let control = getControl(target);
	let layoutData = <GridData>control.getLayoutData();
	return layoutData;
}

export let getGridLayout = (target: Composite | Panel): GridLayout => {
	let composite = getComposite(target);
	let layout = <GridLayout>composite.getLayout();
	return layout;
}

export let setRowLayout = (composite: Composite, type?: string,
	marginWidth?: number, marginHeight?: number, spacing?: number, alignment?: string): RowLayout => {
	let layout = new RowLayout(type, marginWidth, marginHeight, spacing, alignment);
	composite.setLayout(layout);
	return layout;
}

export let setGridLayout = (composite: Composite, numColumns?: number,
	marginWidth?: number, marginHeight?: number,
	horizontalSpacing?: number, verticalSpacing?: number): GridLayout => {
	let layout = new GridLayout(numColumns, marginWidth, marginHeight, horizontalSpacing, verticalSpacing);
	composite.setLayout(layout);
	return layout;
}

export let setFillLayoutVertical = (composite: Composite,
	marginWidth?: number, marginHeight?: number, spacing?: number): FillLayout => {
	let layout = new FillLayout(webface.VERTICAL, marginWidth, marginHeight, spacing);
	composite.setLayout(layout);
	return layout;
}

export let setFillLayoutHorizontal = (composite: Composite,
	marginWidth?: number, marginHeight?: number, spacing?: number): FillLayout => {
	let layout = new FillLayout(webface.HORIZONTAL, marginWidth, marginHeight, spacing);
	composite.setLayout(layout);
	return layout;
}

export let setAbsoluteLayout = (composite: Composite): AbsoluteLayout => {
	let layout = new AbsoluteLayout();
	composite.setLayout(layout);
	return layout;
}

export let dispose = (target: View | Panel | Control): void => {
	if (target !== null) {
		let control = getControl(target);
		control.dispose();
	}
}

export let disposeChildren = (target: View | Panel | Control): void => {
	let control = getControl(target);
	if (control instanceof Composite) {
		let children = control.getChildren();
		for (let child of children) {
			dispose(child);
		}
		control.relayout();
	}
}
