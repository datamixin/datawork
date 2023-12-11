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
import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import EFeature from "webface/model/EFeature";
import BasicEMap from "webface/model/BasicEMap";
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";
import BasicEList from "webface/model/BasicEList";
import BasicEObject from "webface/model/BasicEObject";

import XSheet from "padang/model/XSheet";
import * as model from "padang/model/model";

export default class XProject extends BasicEObject {

    public static XCLASSNAME = model.getEClassName("XProject");

    public static FEATURE_VERSION = new EAttribute("version", EAttribute.NUMBER);
    public static FEATURE_SHEETS = new EReference("sheets", XSheet);
    public static FEATURE_SELECTION = new EAttribute("selection", EAttribute.STRING);
    public static FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

    private version: number = 2;
    private sheets: EList<XSheet> = new BasicEList<XSheet>(this, XProject.FEATURE_SHEETS);
    private selection: string = null;
    private properties: EMap<string> = new BasicEMap<string>(this, XProject.FEATURE_PROPERTIES);

    constructor() {
        super(model.createEClass(XProject.XCLASSNAME), <EFeature[]>[
            XProject.FEATURE_VERSION,
            XProject.FEATURE_SHEETS,
            XProject.FEATURE_SELECTION,
            XProject.FEATURE_PROPERTIES
        ]);
    }

    public getVersion(): number {
        return this.version;
    }

    public setVersion(newVersion: number): void {
        let oldVersion = this.version;
        this.version = newVersion;
        this.eSetNotify(XProject.FEATURE_VERSION, oldVersion, newVersion);
    }

    public getSheets(): EList<XSheet> {
        return this.sheets;
    }

    public getSelection(): string {
        return this.selection;
    }

    public setSelection(newSelection: string): void {
        let oldSelection = this.selection;
        this.selection = newSelection;
        this.eSetNotify(XProject.FEATURE_SELECTION, oldSelection, newSelection);
    }

    public getProperties(): EMap<string> {
        return this.properties;
    }

}