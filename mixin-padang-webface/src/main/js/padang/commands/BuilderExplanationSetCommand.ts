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
import Command from "webface/wef/Command";

import XBuilder from "padang/model/XBuilder";

export default class BuilderExplanationSetCommand extends Command {

	private builder: XBuilder = null;
	private oldExplanation: string = null;
	private newExplanation: string = null;

	public setBuilder(builder: XBuilder): void {
		this.builder = builder;
	}

	public setExplanation(formation: string): void {
		this.newExplanation = formation;
	}

	public execute(): void {
		this.oldExplanation = this.builder.getExplanation();
		this.builder.setExplanation(this.newExplanation);
	}

	public undo(): void {
		this.builder.setExplanation(this.oldExplanation);
	}

	public redo(): void {
		this.builder.setExplanation(this.newExplanation);
	}

}