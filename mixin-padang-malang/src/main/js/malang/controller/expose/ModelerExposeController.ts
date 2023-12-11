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
import ContentAdapter from "webface/model/ContentAdapter";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import XModeler from "malang/model/XModeler";
import PreloadContent from "malang/model/PreloadContent";

import * as directors from "malang/directors";

import Preload from "malang/directors/preloads/Preload";

import ModelerExposeView from "malang/view/expose/ModelerExposeView";

import PreloadContentNameSetRequest from "malang/requests/expose/PreloadContentNameSetRequest";

export default class ModelerExposeController extends EObjectController {

	private adapter = new ModelAdapter(this);

	private preloadContent = new PreloadContent();

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(PreloadContentNameSetRequest.REQUEST_NAME, new PreloadContentNameSetHandler(this));
	}

	public createView(): ModelerExposeView {
		return new ModelerExposeView(this);
	}

	public getView(): ModelerExposeView {
		return <ModelerExposeView>super.getView();
	}

	public getModel(): XModeler {
		return <XModeler>super.getModel();
	}

	public getModelChildren(): any[] {
		return [this.preloadContent];
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

	public setPreloadName(name: string): void {
		this.preloadContent.setName(name);
		let view = this.getView();
		view.setSelectedPreload(name);
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshPreloadList();
	}

	private getPreloads(callback: (preloads: Preload[]) => void): void {
		let model = this.getModel();
		let director = directors.getExposePartDirector(this);
		director.listPreloads(model, callback);
	}

	private refreshPreloadList(): void {
		this.getPreloads((preloads: Preload[]) => {

			// Preload names
			let view = this.getView();
			let groups = new Map<string, Map<string, string>>();
			for (let preload of preloads) {
				let group = preload.getGroup();
				let name = preload.getQualifiedName();
				let presume = preload.getPresume();
				if (!groups.has(group)) {
					groups.set(group, new Map<string, string>());
				}
				let map = groups.get(group);
				map.set(name, presume);
			}
			view.setPreloadNames(groups);

			// Selection
			let currentName = this.preloadContent.getName();
			if (preloads.length > 0) {
				if (currentName === null) {
					let preload = preloads[0];
					let name = preload.getQualifiedName();
					this.preloadContent.setName(name);
					view.setSelectedPreload(name);
				} else {
					view.setSelectedPreload(currentName);
				}
			}
		});
	}

}

class ModelAdapter extends ContentAdapter {

	private controller: ModelerExposeController = null;

	constructor(controller: ModelerExposeController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		this.controller.refreshVisuals();
		let children = this.controller.getChildren();
		let child = children[0];
		child.refresh();
	}

}

class PreloadContentNameSetHandler extends BaseHandler {

	public handle(request: PreloadContentNameSetRequest, _callback: (data: any) => void): void {
		let name = request.getStringData(PreloadContentNameSetRequest.NAME);
		let controller = <ModelerExposeController>this.controller;
		controller.setPreloadName(name);
	}

}