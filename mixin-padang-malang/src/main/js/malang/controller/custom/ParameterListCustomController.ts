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
import EList from "webface/model/EList";

import EListController from "webface/wef/base/EListController";

import XParameter from "malang/model/XParameter";

import ParameterListCustomView from "malang/view/custom/ParameterListCustomView";

export default class ParameterListCustomController extends EListController {

	public createView(): ParameterListCustomView {
		return new ParameterListCustomView(this);
	}

	public getView(): ParameterListCustomView {
		return <ParameterListCustomView>super.getView();
	}

	public getModel(): EList<XParameter> {
		return <EList<XParameter>>super.getModel();
	}

}