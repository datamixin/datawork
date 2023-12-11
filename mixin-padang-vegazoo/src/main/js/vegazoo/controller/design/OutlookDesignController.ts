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
import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XOutlook from "vegazoo/model/XOutlook";

import OutlookDesignView from "vegazoo/view/design/OutlookDesignView";

export default class OutlookDesignController extends EObjectController {

    constructor() {
        super();
        this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
    }

    public createView(): OutlookDesignView {
        return new OutlookDesignView(this);
    }

    public getView(): OutlookDesignView {
        return <OutlookDesignView>super.getView();
    }

    public getModel(): XOutlook {
        return <XOutlook>super.getModel();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let viewlet = model.getViewlet();
        return [viewlet];
    }

}
