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
import XTabular from "vegazoo/model/XTabular";

import TabularOutputView from "vegazoo/view/output/TabularOutputView";

import ViewletOutputController from "vegazoo/controller/output/ViewletOutputController";

export default class TabularOutputController extends ViewletOutputController {

    public createView(): TabularOutputView {
        return new TabularOutputView(this);
    }

    public getView(): TabularOutputView {
        return <TabularOutputView>super.getView();
    }

    public getModel(): XTabular {
        return <XTabular>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

}
