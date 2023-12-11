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
import Action from "webface/action/Action";
import CascadeAction from "webface/action/CascadeAction";

import * as wef from "webface/wef/functions";
import Controller from "webface/wef/Controller";

import PointerField from "padang/model/PointerField";

import * as directors from "vegazoo/directors";

import XVegalite from "vegazoo/model/XVegalite";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import VegazooPartViewer from "vegazoo/ui/VegazooPartViewer";

import EncodePointerFieldAction from "vegazoo/actions/EncodePointerFieldAction";

export default class EncodeAsAction extends CascadeAction {

	private controller: Controller = null;
	private field: PointerField = null;

	constructor(controller: Controller, field: PointerField) {
		super("Encode As");
		this.controller = controller;
		this.field = field;
	}

	public getActions(): Action[] {
		let actions: Action[] = [];
		let controllerViewer = this.controller.getViewer();
		let graphicViewer = controllerViewer.getParent();
		let children = graphicViewer.getChildren();
		for (let child of children) {
			if (child instanceof VegazooPartViewer) {
				let director = directors.getDesignPartDirector(child);
				let ancestor = director.getViewerContents();
				let outlook = ancestor.getModel();
				let viewlet = outlook.getViewlet();
				if (viewlet instanceof XVegalite) {
					let spec = viewlet.getSpec();
					if (spec instanceof XTopLevelUnitSpec) {
						let encoding = spec.getEncoding();
						let map = director.getEncodingChannelMap(encoding);
						for (let name of map.keys()) {
							let channel = map.get(name);
							let controller = wef.getFirstDescendantByModel(ancestor, channel);
							let action = new EncodePointerFieldAction(controller, this.field, name);
							actions.push(action);
						}
					}
				}
			}
		}
		return actions;
	}
}
