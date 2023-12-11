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
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";

import XFacet from "padang/model/XFacet";
import * as model from "padang/model/model";
import XGraphic from "padang/model/XGraphic";

export default class XFigure extends XFacet {

    public static XCLASSNAME: string = model.getEClassName("XFigure");

    public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
    public static FEATURE_GRAPHIC = new EReference("graphic", XGraphic);

    private name: string = null;
    private graphic: XGraphic = null;

    constructor() {
        super(model.createEClass(XFigure.XCLASSNAME), [
            XFigure.FEATURE_NAME,
            XFigure.FEATURE_GRAPHIC,
        ]);
    }

    public getName(): string {
        return this.name;
    }

    public setName(newName: string) {
        let oldName = this.name;
        this.name = newName;
        this.eSetNotify(XFigure.FEATURE_NAME, oldName, newName);
    }

    public getGraphic(): XGraphic {
        return this.graphic;
    }

    public setGraphic(newGraphic: XGraphic): void {
        let oldGraphic = this.graphic;
        this.graphic = newGraphic;
        this.eSetNotify(XFigure.FEATURE_GRAPHIC, oldGraphic, newGraphic);
    }

}