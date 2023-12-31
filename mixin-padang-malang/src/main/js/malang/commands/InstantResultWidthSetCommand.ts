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

import XInstantResult from "malang/model/XInstantResult";

export default class InstantResultWidthSetCommand extends Command {

	private instantResult: XInstantResult = null;
	private oldWidth: number = null;
	private newWidth: number = null;

	public setInstantResult(instantResult: XInstantResult): void {
		this.instantResult = instantResult;
	}

	public setWidth(width: number): void {
		this.newWidth = width;
	}

	public execute(): void {
		this.oldWidth = this.instantResult.getWidth();
		this.instantResult.setWidth(this.newWidth);
	}

	public undo(): void {
		this.instantResult.setWidth(this.oldWidth);
	}

	public redo(): void {
		this.instantResult.setWidth(this.newWidth);
	}

}