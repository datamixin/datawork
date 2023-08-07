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

import XMutation from "padang/model/XMutation";

import InstorePartViewer from "padang/ui/InstorePartViewer";

import InstoreControllerFactory from "padang/controller/instore/InstoreControllerFactory";
import MutationInstoreController from "padang/controller/instore/MutationInstoreController";

export default class InstoreComposer extends BasePartViewer {

	private mutation: XMutation = null;
	private composite: Composite = null;

	private instorePartViewer = new InstorePartViewer();

	constructor(mutation: XMutation) {
		super();
		this.mutation = mutation;
		this.instorePartViewer.setParent(this);
		this.setupProperties();
	}

	private setupProperties(): void {
		this.instorePartViewer.setProperty(MutationInstoreController.RESULT_BORDER, true);
		this.instorePartViewer.setProperty(MutationInstoreController.OPTION_LIST_MARGIN, 0);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-instore-composer");
		element.css("background", "#F8F8F8");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createInstorePartViewer(this.composite);
	}

	private createInstorePartViewer(parent: Composite): void {

		this.instorePartViewer.createControl(parent);
		let control = this.instorePartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.instorePartViewer.setControllerFactory(new InstoreControllerFactory());
		this.instorePartViewer.setContents(this.mutation);
	}

	public getControl(): Control {
		return this.composite;
	}

}