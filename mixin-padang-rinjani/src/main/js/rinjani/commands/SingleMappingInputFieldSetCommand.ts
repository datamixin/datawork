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

import XInputField from "rinjani/model/XInputField";
import XSingleMapping from "rinjani/model/XSingleMapping";

export default class SingleMappingInputFieldSetCommand extends Command {

	private assignment: XSingleMapping = null;
	private oldFeature: XInputField = null;
	private newFeature: XInputField = null;

	public setAssignment(assignment: XSingleMapping): void {
		this.assignment = assignment;
	}

	public setFeature(feature: XInputField): void {
		this.newFeature = feature;
	}

	public execute(): void {
		this.oldFeature = this.assignment.getInputField();
		this.assignment.setInputField(this.newFeature);
	}

	public undo(): void {
		this.assignment.setInputField(this.oldFeature);
	}

	public redo(): void {
		this.assignment.setInputField(this.newFeature);
	}

}