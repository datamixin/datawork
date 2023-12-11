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

import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import ObjectMap from "webface/util/ObjectMap";

import ConductorView from "webface/wef/ConductorView";

import VisageType from "bekasi/visage/VisageType";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import MenuPanel from "padang/view/MenuPanel";
import ViewAction from "padang/view/ViewAction";
import LabelPanel from "padang/view/LabelPanel";
import * as TypeDecoration from "padang/view/TypeDecoration";

import * as anatomy from "padang/view/anatomy/anatomy";

import FieldDragAreaRequest from "padang/requests/anatomy/FieldDragAreaRequest";
import FieldDragSourceDragRequest from "padang/requests/anatomy/FieldDragSourceDragRequest";
import FieldDragSourceStopRequest from "padang/requests/anatomy/FieldDragSourceStopRequest";
import FieldDragSourceStartRequest from "padang/requests/anatomy/FieldDragSourceStartRequest";

import ObjectIntrospectionDialog from "padang/dialogs/ObjectIntrospectionDialog";

import ValueFieldSelectRequest from "padang/requests/anatomy/ValueFieldSelectRequest";

import PointerFieldListAnatomyView from "padang/view/anatomy/PointerFieldListAnatomyView";

export abstract class ValueFieldAnatomyView extends ConductorView {

	public static MIN_NAME_WIDTH = 48;

	private formula: string = null;
	private composite: Composite = null;
	private mainPart: Composite = null;
	private typePanel = new IconPanel();
	private digestPanel = new LabelPanel();
	private menuPanel = new MenuPanel();
	private listPart: Composite = null;

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-value-field-anatomy-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 2);
		this.adjustControl(this.composite);
		this.createMainPart(this.composite);
		this.createListPart(this.composite);
		this.createDragSource(this.composite);
	}

	protected abstract adjustControl(control: Control): void;

	private createMainPart(parent: Composite): void {
		this.mainPart = new Composite(parent);
		this.mainPart.onSelection(() => {
			let request = new ValueFieldSelectRequest();
			this.conductor.submit(request);
		});
		view.addClass(this.mainPart, "padang-value-field-anatomy-main-part");
		view.css(this.mainPart, "line-height", (anatomy.ITEM_HEIGHT - 2) + "px");
		view.setGridLayout(this.mainPart, 4, 0, 0, 0, 0);
		view.setGridData(this.mainPart, true, anatomy.ITEM_HEIGHT);
		this.createTypePanel(this.mainPart);
		this.createNamePart(this.mainPart);
		this.createDigestPanel(this.mainPart);
		this.createMenuPanel(this.mainPart);
	}

	private createTypePanel(parent: Composite): void {
		this.typePanel.createControl(parent);
		view.css(this.typePanel, "color", "#888");
		view.setGridData(this.typePanel, anatomy.ITEM_HEIGHT, true);
	}

	private createNamePart(parent: Composite): void {
		this.createNameControl(parent);
		let control = this.getNameControl();
		view.setGridData(control, ValueFieldAnatomyView.MIN_NAME_WIDTH, true);
	}

	protected abstract createNameControl(parent: Composite): void;

	protected abstract getNameControl(): Control;

	protected abstract adjustNameWidth(): number;

	private createDigestPanel(parent: Composite): void {
		this.digestPanel.createControl(parent);
		view.css(this.digestPanel, "color", "#888");
		view.css(this.digestPanel, "font-style", "italic");
		view.css(this.digestPanel, "text-overflow", "ellipsis");
		view.setGridData(this.digestPanel, true, true);
	}

	protected abstract getActions(callback: (actions: ViewAction[]) => void): void;

	private createMenuPanel(parent: Composite): void {
		this.menuPanel.createControl(parent);
		this.menuPanel.setVisible(false);
		view.setGridData(this.menuPanel, anatomy.ITEM_HEIGHT, true);
		this.getActions((actions: ViewAction[]) => {
			let action = new ViewAction("Instrospec...", () => {
				let dialog = new ObjectIntrospectionDialog(this.conductor, this.formula);
				dialog.open(() => { });
			}, "mdi-layers-search-outline");
			actions.splice(0, 0, action);
			this.menuPanel.setActions(actions);
		});
	}

	private createDragSource(control: Control): void {

		// Request drag area
		let request = new FieldDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			source.setHandle(this.mainPart);

			let helper = new CloneDragHelper(this.mainPart, {
				border: "1px solid transparent",
				width: 240,
				height: anatomy.ITEM_HEIGHT
			});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any) => {

				let request = new FieldDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let request = new FieldDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((_event: any) => {

				let request = new FieldDragSourceStopRequest();
				this.conductor.submit(request);

			});

			source.applyTo(control);

		});

	}

	private createListPart(parent: Composite): void {
		this.listPart = new Composite(parent);
		view.addClass(this.listPart, "padang-value-field-anatomy-list-part");
		view.setGridLayout(this.listPart, 1, 0, 0);
		let layoutData = view.setGridData(this.listPart, true, 0);
		layoutData.horizontalIndent = anatomy.ITEM_HEIGHT;
	}

	public setType(type: string): void {
		if (VisageType.isTemporal(type)) {
			type = VisageType.DATETIME;
		}
		let icon = TypeDecoration.getIconOrSymbol(type);
		this.typePanel.setIcon(icon);
	}

	public setInfo(brief: string): void {
		this.digestPanel.setText(brief);
		this.digestPanel.setTextHint(brief);
	}

	public setSelected(selected: boolean): void {
		view.setSelected(this.mainPart, selected);
		this.menuPanel.setVisible(selected);
	}

	public setFormula(formula: string): void {
		this.formula = formula;
	}

	public adjustHeight(): number {

		// Name width
		let width = this.adjustNameWidth();
		let control = this.getNameControl();
		view.setGridData(control, width + anatomy.ITEM_HEIGHT, true);

		// Child height
		let children = this.listPart.getChildren();
		let childHeight = 0;
		if (children.length === 1) {
			let child = <PointerFieldListAnatomyView>children[0].getData();
			childHeight = child.adjustHeight();
			let layoutData = view.getGridData(this.listPart);
			layoutData.heightHint = childHeight;
			this.composite.relayout();
		}

		let height = view.getGridLayoutHeight(this.composite, [anatomy.ITEM_HEIGHT]);
		return childHeight + height;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		if (child instanceof PointerFieldListAnatomyView) {
			child.createControl(this.listPart, index);
			view.setGridData(child, true, true);
			view.setControlData(child);
		}
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}

export default ValueFieldAnatomyView;
