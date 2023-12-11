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
import XOutlook from "padang/model/XOutlook";

import OutlookPresentView from "padang/view/present/OutlookPresentView";

import ForeseePresentController from "padang/controller/present/ForeseePresentController";

export default class OutlookPresentController extends ForeseePresentController {

    constructor() {
        super();
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): OutlookPresentView {
        return new OutlookPresentView(this);
    }

    public getModel(): XOutlook {
        return <XOutlook>super.getModel();
    }

    public getView(): OutlookPresentView {
        return <OutlookPresentView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let viewset = model.getViewset();
        return [viewset];
    }

}
