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

import XCascadeResult from "malang/model/XCascadeResult";

export default class CascadeResultLayoutSetCommand extends Command {

	private cascadeResult: XCascadeResult = null;
	private oldLayout: string = null;
	private newLayout: string = null;

	public setCascadeResult(cascadeResult: XCascadeResult): void {
		this.cascadeResult = cascadeResult;
	}

	public setLayout(layout: string): void {
		this.newLayout = layout;
	}

	public execute(): void {
		this.oldLayout = this.cascadeResult.getLayout();
		this.cascadeResult.setLayout(this.newLayout);
	}

	public undo(): void {
		this.cascadeResult.setLayout(this.oldLayout);
	}

	public redo(): void {
		this.cascadeResult.setLayout(this.newLayout);
	}

}