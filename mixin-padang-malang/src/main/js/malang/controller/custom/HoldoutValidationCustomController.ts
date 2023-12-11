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
import XHoldoutValidation from "malang/model/XHoldoutValidation";

import HoldoutValidationCustomView from "malang/view/custom/HoldoutValidationCustomView";

import ValidationCustomController from "malang/controller/custom/ValidationCustomController";

export default class HoldoutValidationCustomController extends ValidationCustomController {

	constructor() {
		super();
	}

	public createView(): HoldoutValidationCustomView {
		return new HoldoutValidationCustomView(this);
	}

	public getView(): HoldoutValidationCustomView {
		return <HoldoutValidationCustomView>super.getView();
	}

	public getModel(): XHoldoutValidation {
		return <XHoldoutValidation>super.getModel();
	}

}
