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

import XParameter from "malang/model/XParameter";

export default class ParameterValueSetCommand extends Command {

	private parameter: XParameter = null;
	private oldValue: string = null;
	private newValue: string = null;

	public setParameter(parameter: XParameter): void {
		this.parameter = parameter;
	}

	public setValue(feature: string): void {
		this.newValue = feature;
	}

	public execute(): void {
		this.oldValue = this.parameter.getValue();
		this.parameter.setValue(this.newValue);
	}

	public undo(): void {
		this.parameter.setValue(this.oldValue);
	}

	public redo(): void {
		this.parameter.setValue(this.newValue);
	}

}