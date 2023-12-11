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
import Panel from "webface/wef/Panel";

import * as webface from "webface/webface";

import Point from "webface/graphics/Point";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

export default class MessagePanel implements Panel {

	private static MESSAGE_HEIGHT = 30;

	private message: string = null;
	private error: boolean = true;
	private composite: Composite = null;
	private messagePanel = new LabelPanel(10);

	constructor(message: string, error?: boolean) {
		this.message = message;
		this.error = error === undefined ? true : error;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "rinjani-vegazoo-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createMessageLabel(this.composite);
	}

	private createMessageLabel(parent: Composite): void {
		this.messagePanel.createControl(parent);
		this.messagePanel.setText(this.message);
		this.messagePanel.setTextColor(this.error ? "#C44" : "#444");
		this.messagePanel.setLineHeight(MessagePanel.MESSAGE_HEIGHT);
		view.setGridData(this.messagePanel, true, MessagePanel.MESSAGE_HEIGHT);
	}

	public getRequiredSize(): Point {
		return new Point(webface.DEFAULT, webface.DEFAULT);
	}

	public getControl(): Control {
		return this.composite;
	}

}