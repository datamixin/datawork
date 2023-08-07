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
import * as model from "vegazoo/model/model";
import XFieldDef from "vegazoo/model/XFieldDef";
import XPositionDef from "vegazoo/model/XPositionDef";

export default class XFieldDefWithoutScale extends XFieldDef implements XPositionDef {

	public static XCLASSNAME: string = model.getEClassName("XFieldDefWithoutScale");

	constructor() {
		super(model.createEClass(XFieldDefWithoutScale.XCLASSNAME), [
		]);
	}

}
