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

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";

import BaseAction from "webface/wef/base/BaseAction";

import LabelPopupPanel from "webface/ui/LabelPopupPanel";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import ValidationChangeRequest from "malang/requests/design/ValidationChangeRequest";

export abstract class ValidationDesignView extends ConductorView {

	private static SPACING = 5;
	private static LABEL_WIDTH = 80;
	private static LABEL_HEIGHT = 24;

	private composite: Composite = null;
	private namePart: Composite = null;
	private namePanel: LabelPopupPanel = null;
	private container: Composite = null;
	private names = new Map<string, string>();

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-validation-design-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, ValidationDesignView.SPACING);

		this.createNamePart(this.composite);
		this.createContainer(this.composite);
	}

	private createNamePart(parent: Composite): void {

		this.namePart = new Composite(parent);
		view.addClass(this.namePart, "malang-validation-design-name-part");
		view.setGridLayout(this.namePart, 2, 0, 0, 0, 0);
		view.setGridData(this.namePart, true, ValidationDesignView.LABEL_HEIGHT + 2)

		this.createLabel(this.namePart);
		this.createNameDialogPanel(this.namePart);
	}

	private createLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Validation:");
		view.css(label, "line-height", ValidationDesignView.LABEL_HEIGHT + "px");
		view.setGridData(label, ValidationDesignView.LABEL_WIDTH, ValidationDesignView.LABEL_HEIGHT);
	}

	private createNameDialogPanel(parent: Composite): void {
		this.namePanel = new LabelPopupPanel();
		this.namePanel.createControl(parent);
		view.css(this.namePanel, "line-height", ValidationDesignView.LABEL_HEIGHT + "px");
		view.setGridData(this.namePanel, true, true);
		this.namePanel.setPopupActions((callback: (actions: BaseAction[]) => void) => {
			let actions: BaseAction[] = [];
			for (let name of this.names.keys()) {
				let model = this.names.get(name);
				let action = new ValidationChangeAction(this.conductor, name, model);
				actions.push(action);
			}
			callback(actions);
		});
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "malang-validation-design-container");
		view.setGridLayout(this.container, 1, 0, 0, 0, ValidationDesignView.SPACING);
		view.setGridData(this.container, true, true);
	}

	public setName(name: string): void {
		this.namePanel.setText(name);
	}

	public setAvailableNames(names: Map<string, string>): void {
		this.names = names;
	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		let height = part.adjustHeight();
		return height + ValidationDesignView.LABEL_HEIGHT + ValidationDesignView.SPACING + 2;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		view.setGridData(child, true, 0);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}

export default ValidationDesignView;

class ValidationChangeAction extends BaseAction {

	private name: string = null;
	private model: string = null;

	constructor(conductor: Conductor, name: string, model: string) {
		super(conductor);
		this.name = name;
		this.model = model;
	}

	public getText(): string {
		return this.name;
	}

	public run(): void {
		let request = new ValidationChangeRequest(this.model);
		this.conductor.submit(request);
	}

}