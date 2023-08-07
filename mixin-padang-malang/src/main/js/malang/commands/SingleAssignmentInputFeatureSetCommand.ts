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

import XInputFeature from "malang/model/XInputFeature";
import XSingleAssignment from "malang/model/XSingleAssignment";

export default class SingleAssignmentInputFeatureSetCommand extends Command {

	private assignment: XSingleAssignment = null;
	private oldFeature: XInputFeature = null;
	private newFeature: XInputFeature = null;

	public setAssignment(assignment: XSingleAssignment): void {
		this.assignment = assignment;
	}

	public setFeature(feature: XInputFeature): void {
		this.newFeature = feature;
	}

	public execute(): void {
		this.oldFeature = this.assignment.getInputFeature();
		this.assignment.setInputFeature(this.newFeature);
	}

	public undo(): void {
		this.assignment.setInputFeature(this.oldFeature);
	}

	public redo(): void {
		this.assignment.setInputFeature(this.newFeature);
	}

}