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
import EList from "webface/model/EList";

import BaseHandler from "webface/wef/base/BaseHandler";

import XInput from "padang/model/XInput";

import MakeoverComposerDialog from "padang/dialogs/MakeoverComposerDialog";

import InputListComposerOpenRequest from "padang/requests/toolset/InputListComposerOpenRequest";

export abstract class InputListComposerOpenHandler extends BaseHandler {

	protected abstract getList(): EList<XInput>

	public handle(request: InputListComposerOpenRequest, callback?: (data: any) => void): void {
		let list = this.getList();
		let dialog = new MakeoverComposerDialog(this.controller, list);
		dialog.setTitle("Input List Dialog");
		dialog.setWindowTitle("Input List");
		dialog.setMessage("Please specify input list");
		dialog.open((result: string) => {
			if (result === MakeoverComposerDialog.OK) {
				this.applyList(list);
			}
		});
	}

	protected abstract applyList(list: EList<XInput>): void;

}

export default InputListComposerOpenHandler;