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
import Controller from "webface/wef/Controller";

import SelectionParticipant from "webface/wef/SelectionParticipant";

export class BaseSelectionParticipant implements SelectionParticipant {

	protected controller: Controller = null;

	constructor(controller: Controller) {
		this.controller = controller;
	}

	public getController(): Controller {
		return this.controller;
	}

	public setControllerSelected(_selected: boolean): void {

	}

	public setSelected(_controller: Controller, _selected: boolean): void {

	}

}

export default BaseSelectionParticipant; 