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

import XForesee from "padang/model/XForesee";

import ForeseeToolsetView from "padang/view/toolset/ForeseeToolsetView";

export abstract class ForeseeToolsetController extends EObjectController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public getModel(): XForesee {
        return <XForesee>super.getModel();
    }

    public getView(): ForeseeToolsetView {
        return <ForeseeToolsetView>super.getView();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

}

export default ForeseeToolsetController;