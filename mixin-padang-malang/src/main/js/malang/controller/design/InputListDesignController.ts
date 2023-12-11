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
import EList from "webface/model/EList";

import EListController from "webface/wef/base/EListController";

import XInput from "malang/model/XInput";

import InputListDesignView from "malang/view/design/InputListDesignView";

export default class InputListDesignController extends EListController {

	public createView(): InputListDesignView {
		return new InputListDesignView(this);
	}

	public getView(): InputListDesignView {
		return <InputListDesignView>super.getView();
	}

	public getModel(): EList<XInput> {
		return <EList<XInput>>super.getModel();
	}

}