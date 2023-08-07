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
import * as wef from "webface/wef";

import RootView from "webface/wef/RootView";
import Controller from "webface/wef/Controller";
import RootController from "webface/wef/RootController";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import BaseSelectionDirector from "webface/wef/base/BaseSelectionDirector";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutDirector from "bekasi/directors/BaseContentLayoutDirector";

import GraphicPremise from "padang/ui/GraphicPremise";

import GraphicPartViewer from "vegazoo/ui/GraphicPartViewer";

import OutlookDesignView from "vegazoo/view/design/OutlookDesignView";

export default class DesignPartViewer extends GraphicPartViewer {

	private rootController: RootController;
	private rootView: RootView = new RootView();

	constructor(premise: GraphicPremise) {
		super(premise);
		this.registerSelectionDirector();
		this.registerContentLayoutDirector();
	}

	private registerSelectionDirector(): void {
		this.registerDirector(wef.SELECTION_DIRECTOR, new BaseSelectionDirector(this))
	}

	private registerContentLayoutDirector(): void {
		let director = new BaseContentLayoutDirector(this);
		this.registerDirector(bekasi.CONTENT_LAYOUT_DIRECTOR, director);
	}

	public createControl(parent: Composite) {

		this.rootView.createControl(parent)
		let control = this.rootView.getControl();

		let element = control.getElement();
		element.addClass("vegazoo-design-part-viewer");

		this.rootController = new RootController(this.rootView);
		this.rootController.setViewer(this);
	}

	public getControl(): Control {
		return this.rootView.getControl();
	}

	public getRootController(): RootController {
		return this.rootController;
	}

	private relayout(controller: Controller): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(controller);
	}

	public setContents(model: any): void {

		let contents = this.rootController.getContents();
		if (contents !== null) {
			let current = contents.getModel();
			if (current === model) {
				return;
			}
		}

		let factory = this.getControllerFactory();
		let controller = factory.createController(model);
		this.rootController.setContents(controller);

		let composite = <Composite>this.rootView.getControl();
		composite.relayout();

		let view = <OutlookDesignView>controller.getView();
		view.relayout();

		this.relayout(controller);

	}
}