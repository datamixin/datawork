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
import Command from "webface/wef/Command";

import XResult from "rinjani/model/XResult";

export default class ResultHeightSetCommand extends Command {

	private instantResult: XResult = null;
	private oldHeight: number = null;
	private newHeight: number = null;

	public setResult(instantResult: XResult): void {
		this.instantResult = instantResult;
	}

	public setHeight(height: number): void {
		this.newHeight = height;
	}

	public execute(): void {
		this.oldHeight = this.instantResult.getHeight();
		this.instantResult.setHeight(this.newHeight);
	}

	public undo(): void {
		this.instantResult.setHeight(this.oldHeight);
	}

	public redo(): void {
		this.instantResult.setHeight(this.newHeight);
	}

}