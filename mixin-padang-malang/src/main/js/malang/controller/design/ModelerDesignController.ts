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
import Notification from "webface/model/Notification";

import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XModeler from "malang/model/XModeler";

import ModelerDesignView from "malang/view/design/ModelerDesignView";

export default class ModelerDesignController extends EObjectController {

	public static CHILDREN = "children";
	public static DEFAULT_CHILDREN = [XModeler.FEATURE_INPUTS, XModeler.FEATURE_LEARNING];

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createView(): ModelerDesignView {
		return new ModelerDesignView(this);
	}

	public getView(): ModelerDesignView {
		return <ModelerDesignView>super.getView();
	}

	public getModel(): XModeler {
		return <XModeler>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let viewer = this.getViewer();
		let children = viewer.getProperty(ModelerDesignController.CHILDREN);
		children = children === undefined ? ModelerDesignController.DEFAULT_CHILDREN : children;
		let models: any[] = [];
		for (let child of children) {
			let feature = model.eGet(child);
			models.push(feature);
		}
		return models;
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XModeler.FEATURE_LEARNING) {
				this.refreshChildren();
				this.relayout();
			}
		}
	}

}
