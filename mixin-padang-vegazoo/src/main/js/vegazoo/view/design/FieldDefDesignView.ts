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
import Map from "webface/util/Map";

import * as webface from "webface/webface";

import Label from "webface/widgets/Label";
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import * as functions from "webface/functions";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Action from "webface/action/Action";

import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";
import DragParticipantPart from "webface/wef/DragParticipantPart";

import ObjectMap from "webface/util/ObjectMap";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

import DropSpacePart from "padang/view/DropSpacePart";
import ReplaceDropSpaceGuide from "padang/view/ReplaceDropSpaceGuide";

import * as constants from "vegazoo/constants";
import { AggregateOp } from "vegazoo/constants";
import { StandardType } from "vegazoo/constants";

import FieldDefClearRequest from "vegazoo/requests/design/FieldDefClearRequest";
import FieldDefRemoveRequest from "vegazoo/requests/design/FieldDefRemoveRequest";
import FieldDefTypeSetRequest from "vegazoo/requests/design/FieldDefTypeSetRequest";
import FieldDefDragAreaRequest from "vegazoo/requests/design/FieldDefDragAreaRequest";
import FieldDefSelectionRequest from "vegazoo/requests/design/FieldDefSelectionRequest";
import FieldDefDropObjectRequest from "vegazoo/requests/design/FieldDefDropObjectRequest";
import FieldDefDropVerifyRequest from "vegazoo/requests/design/FieldDefDropVerifyRequest";
import FieldDefDragSourceDragRequest from "vegazoo/requests/design/FieldDefDragSourceDragRequest";
import FieldDefDragSourceStopRequest from "vegazoo/requests/design/FieldDefDragSourceStopRequest";
import FieldDefDragSourceStartRequest from "vegazoo/requests/design/FieldDefDragSourceStartRequest";

export default class FieldDefDesignView extends ConductorView implements DragParticipantPart, DropSpacePart {

	private static NAME_WIDTH = 54;
	private static BORDER_WIDTH = 2;

	private static HEIGHT = 24;
	private static ICON_WIDTH = 24;

	private composite: Composite = null;
	private nameLabel: Label = null;
	private container: Composite = null;
	private field: string = null;
	private typeIcon: WebFontIcon = null;
	private fieldLabel: Label = null;
	private menuIcon: WebFontIcon = null;
	private aggregate: AggregateOp = null;
	private actions: BaseAction[] = [];
	private dropSpaceGuide: ReplaceDropSpaceGuide = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-field-def-design-view");
		element.css("background-color", "#E0E0E0");
		element.css("border", FieldDefDesignView.BORDER_WIDTH + "px solid transparent");

		let layout = new GridLayout(3, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createNameLabel(this.composite);
		this.createContainer(this.composite);

		this.composite.onSelection((event: Event) => {
			event.eventObject.stopPropagation();
			let request = new FieldDefSelectionRequest();
			this.conductor.submit(request);
		});

	}

	private createNameLabel(parent: Composite): void {

		this.nameLabel = new Label(parent);
		this.nameLabel.setText("Encoding Name");

		let element = this.nameLabel.getElement();
		element.css("line-height", FieldDefDesignView.HEIGHT + "px");

		let layoutData = new GridData(FieldDefDesignView.NAME_WIDTH, true);
		layoutData.horizontalIndent = 6;
		this.nameLabel.setLayoutData(layoutData);
	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let element = this.container.getElement();
		element.css("background-color", "#FFF");

		let layout = new GridLayout(3, 0, 0, 0, 10);
		this.container.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.container.setLayoutData(layoutData);

		this.createTypeIcon(this.container);
		this.createFieldLabel(this.container);
		this.createMenuIcon(this.container);
		this.createDragSource(this.container);

		this.createDropSpacePart(this.container);
	}

	private createDropSpacePart(composite: Composite): void {
		this.dropSpaceGuide = new ReplaceDropSpaceGuide(composite, this);
		this.dropSpaceGuide.setDeltaXY(-2, -2);
	}

	private createTypeIcon(parent: Composite): void {
		this.typeIcon = this.createIcon(parent);
	}

	private createFieldLabel(parent: Composite): void {

		this.fieldLabel = new Label(parent);

		let element = this.fieldLabel.getElement();
		element.css("line-height", FieldDefDesignView.HEIGHT + "px");

		let layoutData = new GridData(true, true);
		this.fieldLabel.setLayoutData(layoutData);
	}

	private createIcon(parent: Composite): WebFontIcon {

		let icon = new WebFontIcon(parent);
		icon.addClass("mdi");

		let element = icon.getElement();
		element.css("color", "#888");
		element.css("font-size", "24px");
		element.css("text-align", "center");
		element.css("line-height", FieldDefDesignView.HEIGHT + "px");

		let layoutData = new GridData(FieldDefDesignView.ICON_WIDTH, true);
		icon.setLayoutData(layoutData);

		return icon;
	}

	private createMenuIcon(parent: Composite): void {

		this.menuIcon = this.createIcon(parent);
		this.menuIcon.addClass("mdi-menu-down");

		this.menuIcon.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				let action = new PositionFieldDefPopupAction(this.conductor, this.actions);
				action.open(event);
			}
		});
	}

	private createDragSource(control: Control): void {

		// Request drag area
		let request = new FieldDefDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			source.setHandle(this.fieldLabel);

			let helper = new CloneDragHelper(control, {});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any) => {

				let request = new FieldDefDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let request = new FieldDefDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((event: any) => {

				let x = event.clientX;
				let y = event.clientY;
				let parent = this.composite.getParent();
				let element = parent.getElement();
				let request = new FieldDefDragSourceStopRequest();
				this.conductor.submit(request);
				if (!functions.isInRange(element, x, y)) {
					let request = new FieldDefClearRequest();
					this.conductor.submit(request);
				}

			});

			source.applyTo(this.composite);

		});

	}

	public setSelected(selected: boolean): void {
		let element = this.composite.getElement();
		element.css("border-color", selected === true ? "#80bdff" : "transparent");
	}

	public dragStart(accept: boolean): void {
		this.dropSpaceGuide.dragStart(accept);
	}

	public isInRange(x: number, y: number): boolean {
		return this.dropSpaceGuide.isInRange(x, y);
	}

	public showFeedback(data: Map<any>, x: number, y: number): void {
		return this.dropSpaceGuide.showFeedback(data, x, y);
	}

	public clearFeedback(data: Map<any>): void {
		this.dropSpaceGuide.clearFeedback(data);
	}

	public dragStop(): void {
		this.dropSpaceGuide.dragStop();
	}

	public verifyAccept(data: Map<any>, callback: (message: string) => void): void {
		let request = new FieldDefDropVerifyRequest(data);
		this.conductor.submit(request, callback);
	}

	public dropObject(data: Map<any>): void {
		let request = new FieldDefDropObjectRequest(data);
		this.conductor.submit(request);
	}

	public setName(name: string): void {
		this.nameLabel.setText(name);
	}

	public setField(field: string): void {
		this.field = field;
		this.updateField();
	}

	public setType(type: string): void {

		let icon = constants.FIELD_ICON_MAP[type];
		this.typeIcon.removeClasses();
		this.typeIcon.addClasses("mdi", icon);

		let color = constants.FIELD_COLOR_MAP[type];
		let element = this.typeIcon.getElement();
		element.css("color", color);

		this.populateTypeSetActions(type);
	}

	private populateTypeSetActions(type: string): void {
		this.actions = [];
		if (type === StandardType.QUANTITATIVE) {
			this.actions.push(new FieldDefTypeSetAction(this.conductor, StandardType.NOMINAL));
			this.actions.push(new FieldDefTypeSetAction(this.conductor, StandardType.ORDINAL));
		} else if (type === StandardType.TEMPORAL) {
			this.actions.push(new FieldDefTypeSetAction(this.conductor, StandardType.ORDINAL));
			this.actions.push(new FieldDefTypeSetAction(this.conductor, StandardType.QUANTITATIVE));
		} else if (type === StandardType.NOMINAL || type === StandardType.ORDINAL) {
			this.actions.push(new FieldDefTypeSetAction(this.conductor, StandardType.QUANTITATIVE));
		}
		this.actions.push(new FieldDefRemoveAction(this.conductor));
		this.menuIcon.setVisible(this.actions.length > 0);

	}

	public setAggregate(aggregate: AggregateOp): void {
		this.aggregate = aggregate;
		this.updateField();
	}

	private updateField(): void {
		let label = null;
		if (this.aggregate === AggregateOp.NONE || this.aggregate === null) {
			label = this.field;
		} else if (this.aggregate === AggregateOp.COUNT) {
			label = AggregateOp.COUNT.toLowerCase() + "()";
		} else {
			let aggregate = this.aggregate.toUpperCase();
			label = aggregate + "(" + this.field + ")";
		}
		this.fieldLabel.setText(label);
		let element = this.fieldLabel.getElement();
		element.attr("title", label);
	}

	public adjustHeight(): number {
		return FieldDefDesignView.HEIGHT + 2 * FieldDefDesignView.BORDER_WIDTH;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class PositionFieldDefPopupAction extends BasePopupAction {

	private typeSetActions: BaseAction[] = [];

	constructor(conductor: Conductor, typeSetActions: BaseAction[]) {
		super(conductor);
		this.typeSetActions = typeSetActions;
	}

	public getActions(): Action[] {
		return this.typeSetActions;
	}

}

class FieldDefTypeSetAction extends BaseAction {

	private type: string = null;

	constructor(conductor: Conductor, type: string) {
		super(conductor);
		this.type = type;
	}

	public getText(): string {
		let first = this.type[0].toUpperCase();
		return first + this.type.slice(1);
	}

	public run(): void {
		let request = new FieldDefTypeSetRequest(this.type);
		this.conductor.submit(request);
	}

}

class FieldDefRemoveAction extends BaseAction {

	public getText(): string {
		return "Remove";
	}

	public run(): void {
		let request = new FieldDefRemoveRequest();
		this.conductor.submit(request);
	}

}
