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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import OvertopPartViewer from "padang/ui/OvertopPartViewer";

import OvertopControllerFactory from "padang/controller/overtop/OvertopControllerFactory";

export default class MakeoverComposer extends BasePartViewer {

	private model: any = null;
	private composite: Composite = null;

	private overtopPartViewer = new OvertopPartViewer();

	constructor(model: any) {
		super();
		this.model = model;
		this.overtopPartViewer.setParent(this);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-makeover-composer");
		element.css("background", "#F8F8F8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createOvertopPartViewer(this.composite);

	}

	private createOvertopPartViewer(parent: Composite): void {

		this.overtopPartViewer.createControl(parent);
		let control = this.overtopPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.overtopPartViewer.setControllerFactory(new OvertopControllerFactory());
		this.overtopPartViewer.setContents(this.model);
	}

	public getControl(): Control {
		return this.composite;
	}

}