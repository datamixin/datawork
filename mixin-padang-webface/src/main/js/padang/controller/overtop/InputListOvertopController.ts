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

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XInput from "padang/model/XInput";
import XReceipt from "padang/model/XReceipt";

import InputListOvertopView from "padang/view/overtop/InputListOvertopView";

import InputListAddRequest from "padang/requests/overtop/InputListAddRequest";

import InputListAddHandler from "padang/handlers/overtop/InputListAddHandler";

import InputOvertopController from "padang/controller/overtop/InputOvertopController";

export default class InputListOvertopController extends EListController {

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(InputListAddRequest.REQUEST_NAME, new InputListAddHandler(this));
	}

	public createView(): InputListOvertopView {
		return new InputListOvertopView(this);
	}

	public getModel(): EList<XInput> {
		return <EList<XInput>>super.getModel();
	}

	public getView(): InputListOvertopView {
		return <InputListOvertopView>super.getView();
	}

	public refreshVisuals(): void {
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
		if (feature === XReceipt.FEATURE_INPUTS) {
			if (eventType === Notification.SET ||
				eventType === Notification.ADD ||
				eventType === Notification.REMOVE ||
				eventType === Notification.MOVE) {

				this.refreshChildren();

				if (eventType === Notification.ADD || eventType === Notification.REMOVE) {

					// Kendalikan selection setelah perubahan
					let children = this.getChildren();
					let position = notification.getListPosition();
					if (eventType === Notification.ADD) {
						let position = notification.getListPosition();
						if (position === -1) {
							position = children.length - 1;
						}
					} else if (eventType === Notification.REMOVE) {
						if (position === children.length) {
							position -= 1;
						}
					}
					if (position !== -1) {
						let child = <InputOvertopController>children[position];
						let director = wef.getSelectionDirector(this);
						director.select(child);
					}
				}
			}
		}
	}

}

