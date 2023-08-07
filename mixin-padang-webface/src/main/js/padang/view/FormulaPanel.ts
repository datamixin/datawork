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
import * as webface from "webface/webface";

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

import MessageDialog from "webface/dialogs/MessageDialog";

import VisageList from "bekasi/visage/VisageList";
import VisageObject from "bekasi/visage/VisageObject";

import * as view from "padang/view/view";
import * as TypeDecoration from "padang/view/TypeDecoration";

import FormulaText from "padang/widgets/FormulaText";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import AssignableSelectionDialog from "padang/dialogs/AssignableSelectionDialog";

export default class FormulaPanel extends ConductorPanel {

	private static ICON_SIZE = 24;
	private static ICON_COLOR = "#AAA";
	private static BORDER_COLOR = "#D8D8D8";

	private height: number = 30;
	private border: number = 2;
	private composite: Composite = null;
	private container: Composite = null;
	private typeIcon: WebFontIcon = null;
	private formula: string = null;
	private formulaText: FormulaText = null;
	private commitIcon: WebFontIcon = null;
	private assignable: string = null;
	private assignableIcon: WebFontIcon = null;

	constructor(conductor: Conductor, height?: number, border?: number) {
		super(conductor);
		this.height = height === undefined ? this.height : height;
		this.border = border === undefined ? this.border : border;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		view.addClass(this.composite, "padang-formula-panel");
		view.css(this.composite, "line-height", this.height + "px");
		view.setGridLayout(this.composite, 3, 0, 0);

		this.createContainer(this.composite);

	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		view.setGridLayout(this.container, 4, 0, 0, 0, 0);

		let borderColor = FormulaPanel.BORDER_COLOR;
		let element = this.container.getElement();
		element.addClass("padang-formula-container");
		element.css("border", this.border + "px solid " + borderColor);
		element.css("line-height", (this.height - this.border * 2) + "px");
		element.data("data", this.container);

		this.createTypeIcon(this.container);
		this.createFormulaText(this.container);
		this.createCommitIcon(this.container);
		this.createAssignableIcon(this.container);

		view.setGridData(this.container, true, true);

	}

	private createTypeIcon(parent: Composite): void {
		this.typeIcon = this.createIcon(parent, "mdi-alert-circle-outline", FormulaPanel.ICON_SIZE + 1);
		let element = this.typeIcon.getElement();
		element.css("border-right", "1px solid " + FormulaPanel.BORDER_COLOR);
	}

	private createFormulaText(parent: Composite): void {

		this.formulaText = new FormulaText(parent);

		let element = this.formulaText.getElement();
		element.css("border", "0px");
		element.css("border-radius", "0px");

		view.setGridData(this.formulaText, true, true);

		this.formulaText.onCancel(() => {
			this.formulaText.setText(this.formula);
		});

		this.formulaText.onModify(() => {
			this.setShowIcon(this.commitIcon, true);
		});

		this.formulaText.onCommit((text: string, callback: (confirm: boolean) => void) => {
			let request = new FormulaValidationRequest(text);
			this.conductor.submit(request, (message: string) => {
				if (message !== null) {
					MessageDialog.openError("Formula Error", message, () => {
						callback(false);
					});
				} else {
					this.commit(() => {
						callback(true);
					});
				}
			});
		});

	}

	private createCommitIcon(parent: Composite): void {
		this.commitIcon = this.createIcon(parent, "mdi-check", FormulaPanel.ICON_SIZE);
		this.commitIcon.onSelection((event: Event) => {
			this.commit(() => { });
			let object = event.eventObject;
			object.stopPropagation();
		});
		let element = this.commitIcon.getElement();
		element.css("border-left", "1px solid " + FormulaPanel.BORDER_COLOR);
		element.css("color", "#4CAE4C");
		element.css("background", "#F8F8F8");
		this.setShowIcon(this.commitIcon, false);
	}

	private createAssignableIcon(parent: Composite): void {
		this.assignableIcon = this.createIcon(parent, "mdi-dots-horizontal", FormulaPanel.ICON_SIZE + 4);
		this.assignableIcon.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				if (this.assignable !== null) {
					let request = new FormulaAssignableRequest(this.assignable);
					this.conductor.submit(request, (assignable: any) => {
						if (assignable instanceof AssignableSelectionDialog) {
							assignable.open((result: string) => {
								if (result === AssignableSelectionDialog.OK) {
									let selection = assignable.getSelection();
									let request = new FormulaCommitRequest(selection);
									this.conductor.submit(request);
								}
							});
						} else {
							let action = new AcceptablePopupAction(this.conductor, assignable);
							action.open(event);
						}
					});
				}
			}
		});
		let element = this.assignableIcon.getElement();
		element.css("border-left", "1px solid " + FormulaPanel.BORDER_COLOR);
		this.setShowIcon(this.assignableIcon, false);
	}

	private createIcon(parent: Composite, image: string, width: number): WebFontIcon {

		let icon = new WebFontIcon(parent);
		icon.addClasses("mdi", image);

		view.css(icon, "font-size", FormulaPanel.ICON_SIZE + "px");
		view.css(icon, "color", FormulaPanel.ICON_COLOR);
		view.setGridData(icon, width, true);

		return icon;
	}

	private setShowIcon(icon: WebFontIcon, state: boolean): void {
		this.container.markLayout();
		view.css(icon, "display", state === true ? "unset" : "none");
		let layoutData = view.getGridData(icon);
		layoutData.widthHint = state === true ? FormulaPanel.ICON_SIZE + 1 : 0;
		this.container.relayout();
	}

	private commit(callback: () => void): void {
		let literal = this.formulaText.getText();
		if (literal !== this.formula) {
			let request = new FormulaCommitRequest(literal);
			this.conductor.submit(request);
			this.setShowIcon(this.commitIcon, false);
			callback();
		}
	}

	public setType(type: string): void {
		let icon = TypeDecoration.ICON_MAP[type] || "alert-circle-outline";
		this.typeIcon.removeClasses();
		this.typeIcon.addClasses("mdi", icon);
	}

	public setFormula(formula: string): void {
		this.formula = formula;
		this.formulaText.setText(formula);
	}

	public setAssignable(assignable: string): void {
		this.assignable = assignable;
		this.setShowIcon(this.assignableIcon, assignable !== null);
	}

	public adjustHeight(): number {
		return this.height;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class AcceptablePopupAction extends BasePopupAction {

	private assignable: any = null;

	constructor(conductor: Conductor, assignable: any) {
		super(conductor);
		this.assignable = assignable;
	}

	public getActions(): BaseAction[] {
		let actions: BaseAction[] = [];
		if (this.assignable instanceof Array) {
			this.populateArrays(actions, this.assignable);
		} else if (this.assignable instanceof Map) {
			this.populateMap(actions, this.assignable);
		} else if (this.assignable instanceof VisageList) {
			let values = this.assignable.toArray();
			this.populateArrays(actions, values);

		} else if (this.assignable instanceof VisageObject) {
			let values = this.assignable.getObjectMap();
			this.populateMap(actions, values);
		}
		return actions;
	}

	private populateArrays(actions: BaseAction[], values: any[]): void {
		for (let value of values) {
			actions.push(new FormulaCommitAction(this.conductor, value, value));
		}
	}

	private populateMap(actions: BaseAction[], map: Map<string, any>): void {
		for (let name of map.keys()) {
			let value = map.get(name);
			actions.push(new FormulaCommitAction(this.conductor, name, value));
		}
	}

}

class FormulaCommitAction extends BaseAction {

	private value: any = null;

	constructor(conductor: Conductor, label: string, value: any) {
		super(conductor, label);
		this.value = value;
	}

	public run(): void {
		let request = new FormulaCommitRequest(this.value);
		this.conductor.submit(request);
	}

}