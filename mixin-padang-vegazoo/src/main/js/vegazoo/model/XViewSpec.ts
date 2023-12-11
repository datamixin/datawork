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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";

import XData from "vegazoo/model/XData";
import XObjectDef from "vegazoo/model/XObjectDef";

export abstract class XViewSpec extends XObjectDef {

    public static FEATURE_DATA = new EReference("data", XData);
    public static FEATURE_TITLE = new EAttribute("title", EAttribute.STRING);

    private data: XData = null;
    private title: string = null;

    constructor(xClass: EClass, features: EFeature[]) {
        super(xClass, new Array<EFeature>(
            XViewSpec.FEATURE_DATA,
            XViewSpec.FEATURE_TITLE,
        ).concat(features));
    }

    public getData(): XData {
        return this.data;
    }

    public setData(newData: XData): void {
        let oldData = this.data;
        this.data = newData;
        this.eSetNotify(XViewSpec.FEATURE_DATA, oldData, newData);
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(newTitle: string): void {
        let oldTitle = this.title;
        this.title = newTitle;
        this.eSetNotify(XViewSpec.FEATURE_TITLE, oldTitle, newTitle);
    }

}

export default XViewSpec;