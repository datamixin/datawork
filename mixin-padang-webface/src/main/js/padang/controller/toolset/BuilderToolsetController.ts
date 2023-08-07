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
import Notification from "webface/model/Notification";

import XBuilder from "padang/model/XBuilder";

import BuilderToolsetView from "padang/view/toolset/BuilderToolsetView";

import ReceiptToolsetController from "padang/controller/toolset/ReceiptToolsetController";

export default class BuilderToolsetController extends ReceiptToolsetController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): BuilderToolsetView {
		return new BuilderToolsetView(this);
	}

	public getModel(): XBuilder {
		return <XBuilder>super.getModel();
	}

	public getView(): BuilderToolsetView {
		return <BuilderToolsetView>super.getView();
	}

	public getModelChildren(): any[] {
		return [];
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}
