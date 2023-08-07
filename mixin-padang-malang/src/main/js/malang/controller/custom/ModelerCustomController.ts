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
import EObjectController from "webface/wef/base/EObjectController";

import XModeler from "malang/model/XModeler";

import ModelerCustomView from "malang/view/custom/ModelerCustomView";

export default class ModelerCustomController extends EObjectController {

	constructor() {
		super();
	}

	public createView(): ModelerCustomView {
		return new ModelerCustomView(this);
	}

	public getView(): ModelerCustomView {
		return <ModelerCustomView>super.getView();
	}

	public getModel(): XModeler {
		return <XModeler>super.getModel();
	}

}
