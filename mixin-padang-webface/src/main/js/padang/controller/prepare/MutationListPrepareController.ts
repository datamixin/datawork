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

import EList from "webface/model/EList";
import Notification from "webface/model/Notification";

import EListController from "webface/wef/base/EListController";

import * as bekasi from "bekasi/directors";

import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";

import MutationListPrepareView from "padang/view/prepare/MutationListPrepareView";

export default class MutationListPrepareController extends EListController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): MutationListPrepareView {
		return new MutationListPrepareView(this);
	}

	public getModel(): EList<XMutation> {
		return <EList<XMutation>>super.getModel();
	}

	public getView(): MutationListPrepareView {
		return <MutationListPrepareView>super.getView();
	}

	public activate(): void {
		super.activate();
		this.refreshSelection();
	}

	private refreshSelection(): void {
		let director = wef.getSelectionDirector(this);
		let selection = director.getSelection();
		if (selection.isEmpty()) {
			let children = this.getChildren();
			if (children.length > 0) {
				let lastChild = children[children.length - 1];
				director.select(lastChild);
			}
		}
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

		let feature = notification.getFeature();
		if (feature === XPreparation.FEATURE_MUTATIONS) {

			let eventType = notification.getEventType();
			if (eventType === Notification.SET ||
				eventType === Notification.ADD ||
				eventType === Notification.ADD_MANY ||
				eventType === Notification.REMOVE ||
				eventType === Notification.REMOVE_MANY ||
				eventType === Notification.MOVE) {

				this.refreshChildren();

				// Kendalikan selection setelah perubahan
				let children = this.getChildren();
				let position = notification.getListPosition();
				if (eventType === Notification.ADD
					|| eventType === Notification.ADD_MANY) {
					let position = notification.getListPosition();
					if (position === -1) {
						position = children.length - 1;
					}
				} else if (eventType === Notification.REMOVE
					|| eventType === Notification.REMOVE_MANY) {
					if (position === children.length) {
						position -= 1;
					}
				}
				let director = wef.getSelectionDirector(this);
				director.select(children[position]);

			}
		}

	}

}
