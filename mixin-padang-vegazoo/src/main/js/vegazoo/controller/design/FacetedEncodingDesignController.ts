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
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";

import FacetedEncodingDesignView from "vegazoo/view/design/FacetedEncodingDesignView";

import EncodingDesignController from "vegazoo/controller/design/EncodingDesignController";

export default class FacetedEncodingDesignController extends EncodingDesignController {

    public createView(): FacetedEncodingDesignView {
        return new FacetedEncodingDesignView(this);
    }

    public getView(): FacetedEncodingDesignView {
        return <FacetedEncodingDesignView>super.getView();
    }

    public getModel(): XFacetedEncoding {
        return <XFacetedEncoding>super.getModel();
    }

}
