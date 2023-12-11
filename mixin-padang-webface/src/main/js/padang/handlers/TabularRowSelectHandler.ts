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
import TabularPropertyHandler from "padang/handlers/TabularPropertyHandler";

import TabularRowSelectRequest from "padang/requests/TabularRowSelectRequest";

export default class TabularRowSelectHandler extends TabularPropertyHandler {

	public handle(request: TabularRowSelectRequest): void {
		let properties = super.getProperties();
		let index = request.getData(TabularRowSelectRequest.INDEX);
		properties.executePutCommand(TabularPropertyHandler.SELECTED_ROW, index);
		properties.executePutCommand(TabularPropertyHandler.SELECTED_PART, TabularPropertyHandler.SELECTED_PART_ROW);
	}

}

