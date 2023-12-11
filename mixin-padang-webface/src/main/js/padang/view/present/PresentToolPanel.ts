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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";
import * as functions from "webface/widgets/functions";

import * as webface from "webface/webface";

import RowData from "webface/layout/RowData";
import GridData from "webface/layout/GridData";
import RowLayout from "webface/layout/RowLayout";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";

import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import ObjectMap from "webface/util/ObjectMap";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

import WebFontImage from "webface/graphics/WebFontImage";

import BootButton from "padang/widgets/BootButton";

import PresentToolManager from "padang/view/present/PresentToolManager";

import CellDragAreaRequest from "padang/requests/present/CellDragAreaRequest";
import CellSelectionSetRequest from "padang/requests/present/CellSelectionSetRequest";
import CellDragSourceDragRequest from "padang/requests/present/CellDragSourceDragRequest";
import CellDragSourceStopRequest from "padang/requests/present/CellDragSourceStopRequest";
import CellDragSourceStartRequest from "padang/requests/present/CellDragSourceStartRequest";

export default class PresentToolPanel extends ConductorPanel implements PresentToolManager {

	public static MARGIN = 2;
	public static HEIGHT = 34;
	public static BUTTON_WIDTH = 160;
	public static BUTTON_HEIGHT = 30;

	private static ICON_SIZE = 24;
	private static ICON_WIDTH = 30;
	private static ICON_COLOR = "#888";
	private static BAR_ICON_CLASS = "padang-present-tool-panel-bar-icon";

	private composite: Composite = null;
	private typeIcon: WebFontIcon = null;
	private captionPart: Composite = null;
	private barIconPart: Composite = null;
	private primaryButtonPart: Composite = null;
	private menuPart: Composite = null;
	private menuIcon: WebFontIcon = null;

	private menuActions: BaseAction[] = [];

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-present-tool-panel");

		let layout = new GridLayout(5, 7, 0, 0, 0);
		this.composite.setLayout(layout);

		let layoutData = new GridData(true, PresentToolPanel.HEIGHT);
		this.composite.setLayoutData(layoutData);

		this.createTypeIcon(this.composite);
		this.createCaptionPart(this.composite);
		this.createBarIconPart(this.composite);
		this.createPrimaryButtonPart(this.composite);
		this.createMenuPart(this.composite);

		this.setIconPartVisible(false);

		this.composite.onSelection(() => {
			this.select();
		});

	}

	private select(): void {
		let request = new CellSelectionSetRequest();
		this.conductor.submit(request);
	}

	private createTypeIcon(parent: Composite): void {
		this.typeIcon = this.createIcon(parent, PresentToolPanel.ICON_SIZE, PresentToolPanel.ICON_SIZE);
	}

	private createCaptionPart(parent: Composite): void {

		this.captionPart = new Composite(parent);

		let element = this.captionPart.getElement();
		element.addClass("padang-present-tool-panel-caption-part");

		let layout = new FillLayout();
		this.captionPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.captionPart.setLayoutData(layoutData);

		this.createDragSource(this.composite);

	}

	private createDragSource(_control: Control): void {

		// Request drag area
		let request = new CellDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			source.setHandle(this.captionPart);

			let helper = new CloneDragHelper(this.composite, {});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any, ui: any) => {

				this.select();
				let request = new CellDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				});

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let request = new CellDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((_event: any, _ui: any) => {

				let request = new CellDragSourceStopRequest();
				this.conductor.submit(request);

			});

			source.applyTo(this.composite);

		});

	}

	private createBarIconPart(parent: Composite): void {

		this.barIconPart = new Composite(parent);

		let element = this.barIconPart.getElement();
		element.addClass("padang-present-tool-panel-bar-icon-part");

		let layout = new RowLayout(webface.ROW, PresentToolPanel.MARGIN, PresentToolPanel.MARGIN, PresentToolPanel.MARGIN);
		this.barIconPart.setLayout(layout);

		let layoutData = new GridData(0, true);
		this.barIconPart.setLayoutData(layoutData);

	}

	private createPrimaryButtonPart(parent: Composite): void {

		this.primaryButtonPart = new Composite(parent);

		let element = this.primaryButtonPart.getElement();
		element.addClass("padang-present-tool-panel-primary-part");

		let layout = new RowLayout(webface.ROW, PresentToolPanel.MARGIN, PresentToolPanel.MARGIN);
		this.primaryButtonPart.setLayout(layout);

		let layoutData = new GridData(0, true);
		this.primaryButtonPart.setLayoutData(layoutData);

	}

	private createMenuPart(parent: Composite): void {

		this.menuPart = new Composite(parent);

		let element = this.menuPart.getElement();
		element.addClass("padang-present-tool-panel-menu-part");

		let layout = new RowLayout(webface.ROW, 0, PresentToolPanel.MARGIN);
		this.menuPart.setLayout(layout);

		let layoutData = new GridData(0, true);
		this.menuPart.setLayoutData(layoutData);

		this.createMenuIcon(this.menuPart);

	}

	private createMenuIcon(parent: Composite): void {

		let lineHeight = PresentToolPanel.HEIGHT - 2 * PresentToolPanel.MARGIN;
		this.menuIcon = this.createIcon(parent, PresentToolPanel.ICON_SIZE, PresentToolPanel.ICON_WIDTH, lineHeight);
		this.menuIcon.addClasses("mdi", "mdi-menu");

		let element = this.menuIcon.getElement();
		element.attr("title", "Menu...");
		element.addClass("padang-present-tool-panel-menu-icon");

		let layoutData = new RowData(PresentToolPanel.ICON_WIDTH, PresentToolPanel.BUTTON_HEIGHT);
		this.menuIcon.setLayoutData(layoutData);

		this.menuIcon.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				let action = new PresentPopupAction(this.conductor, this.menuActions);
				action.open(event);
				this.select();
			}
		});

		this.resizeRawLayoutPart(this.menuPart, PresentToolPanel.ICON_WIDTH);
	}

	private createIcon(parent: Composite, size: number, width?: number, lineHeight?: number): WebFontIcon {

		let icon = new WebFontIcon(parent);

		let element = icon.getElement();
		element.css("line-height", (lineHeight === undefined ? PresentToolPanel.HEIGHT : lineHeight) + "px");
		element.css("font-size", size + "px");
		element.css("color", PresentToolPanel.ICON_COLOR);

		let layoutData = new GridData(width === undefined ? size : width, true);
		icon.setLayoutData(layoutData);
		return icon;

	}

	public setTypeIcon(icon: string): void {
		this.typeIcon.removeClasses();
		this.typeIcon.addClasses("mdi", icon);
	}

	public setIconPartVisible(state: boolean): void {
		this.barIconPart.setVisible(state);
		this.resizeRawLayoutPart(this.barIconPart, state === true ? PresentToolPanel.ICON_WIDTH : 0);
		this.menuIcon.setVisible(state);
	}

	public setCaptionPanel(panel: ConductorPanel, style: any): void {

		functions.removeChildren(this.captionPart);
		panel.createControl(this.captionPart);
		let control = panel.getControl();

		let element = control.getElement();
		element.css("line-height", (PresentToolPanel.HEIGHT) + "px");
		element.css(style);

		this.captionPart.relayout();
	}

	public addBarIcon(action: BaseAction): void {

		let text = action.getText();
		let image = <WebFontImage>action.getImage();
		let classes = image.getClasses();

		let icon = new WebFontIcon(this.barIconPart, 0);
		for (let className of classes) {
			icon.addClass(className);
		}
		icon.setData(action);

		let element = icon.getElement();
		element.addClass(PresentToolPanel.BAR_ICON_CLASS);
		element.attr("title", text);
		element.css("color", PresentToolPanel.ICON_COLOR);
		element.css("font-size", PresentToolPanel.ICON_SIZE + "px");
		element.css("line-height", PresentToolPanel.BUTTON_HEIGHT + "px");

		let layoutData = new RowData(PresentToolPanel.ICON_WIDTH, PresentToolPanel.BUTTON_HEIGHT);
		icon.setLayoutData(layoutData);

		if (action.isActive()) {
			element.addClass("active");
		} else {
			element.removeClass("active");
		}

		let enabled = action.isEnabled();
		icon.setEnabled(enabled);

		icon.onSelection(() => {
			action.run();
		});

		this.resizeBarIconPart();
	}

	private resizeBarIconPart(): void {
		this.resizeRawLayoutPart(this.barIconPart, PresentToolPanel.ICON_WIDTH);
	}

	private resizeRawLayoutPart(container: Composite, oneWidth: number): void {

		let visibles = 0;
		let children = container.getChildren();
		for (let child of children) {
			let action = <BaseAction>child.getData();
			if (action === null) {
				visibles++;
			} else {
				visibles += action.isVisible() ? 1 : 0;
			}
		}
		let layout = <RowLayout>container.getLayout();
		let width = layout.marginWidth * 2 + (layout.spacing * (children.length - 1));
		width += oneWidth * visibles;

		let layoutData = <GridData>container.getLayoutData();
		layoutData.widthHint = width;

		container.relayout();
		this.composite.relayout();

	}

	public setPrimaryCallback(text: string, icon: string, callback: (event: Event) => void): BootButton {

		functions.removeChildren(this.primaryButtonPart);
		let button = new BootButton(this.primaryButtonPart, text, icon, "btn-primary");

		let layoutData = new RowData(PresentToolPanel.BUTTON_WIDTH, PresentToolPanel.BUTTON_HEIGHT);
		button.setLayoutData(layoutData);

		button.onSelection((event: Event) => {
			callback(event);
		});

		this.resizePrimaryButtonPart();

		return button;
	}

	private resizePrimaryButtonPart(): void {
		this.resizeRawLayoutPart(this.primaryButtonPart, PresentToolPanel.BUTTON_WIDTH);
	}

	public addMenuItem(action: BaseAction): void {
		this.menuActions.push(action);
	}

	public removeTool(tool: any): void {
		if (tool instanceof BootButton) {
			tool.dispose();
			this.resizePrimaryButtonPart();
		}
		let icon = this.getBarIcon(tool);
		if (icon !== null) {
			icon.dispose();
			this.resizeBarIconPart();
		}
		let index = this.menuActions.indexOf(tool);
		if (index >= 0) {
			this.menuActions.splice(index, 1);
		}
	}

	private getBarIcon(tool: any): WebFontIcon {
		let children = this.barIconPart.getChildren();
		for (let child of children) {
			let action = <BaseAction>child.getData();
			if (action === tool) {
				return <WebFontIcon>child;
			}
		}
		return null;
	}

	public refreshTools(): void {
		this.refreshBarIcons();
		this.refreshMenuIcon();
	}

	private refreshBarIcons(): void {

		let children = this.barIconPart.getChildren();
		for (let child of children) {

			let icon = <WebFontIcon>child;
			icon.removeClasses();
			icon.addClass(PresentToolPanel.BAR_ICON_CLASS);

			let action = <BaseAction>icon.getData();
			let image = <WebFontImage>action.getImage();
			let classes = image.getClasses();
			for (let className of classes) {
				icon.addClass(className);
			}

			let element = child.getElement();
			if (action.isActive()) {
				element.addClass("active");
			} else {
				element.removeClass("active");
			}

			let enabled = action.isEnabled();
			icon.setEnabled(enabled);

			let visible = action.isVisible();
			let layoutData = <RowData>child.getLayoutData();
			layoutData.width = visible ? PresentToolPanel.ICON_WIDTH : 0;
			child.setVisible(visible);
			this.barIconPart.relayout();

		}

		this.resizeBarIconPart();
	}

	private refreshMenuIcon(): void {
		let visible = this.menuActions.length !== 0;
		this.menuPart.setVisible(visible);
		let layoutData = <GridData>this.menuPart.getLayoutData();
		layoutData.widthHint = visible ? PresentToolPanel.ICON_WIDTH : 0;
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class PresentPopupAction extends BasePopupAction {

	private actions: BaseAction[] = [];

	constructor(conductor: Conductor, actions: BaseAction[]) {
		super(conductor);
		this.actions = actions;
	}

	public getActions(): BaseAction[] {
		let actions = this.actions.sort((a: BaseAction, b: BaseAction) => {
			let aPriority = a.getPriority();
			let bPriority = b.getPriority();
			return aPriority - bPriority;
		})
		return actions;
	}

}