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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import BasicEMap from "webface/model/BasicEMap";
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

export abstract class XFacet extends BasicEObject {

    public static FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

    private properties: EMap<string> = new BasicEMap<string>(this, XFacet.FEATURE_PROPERTIES);

    constructor(xClass: EClass, features: EFeature[]) {
        super(xClass, features.concat([
            XFacet.FEATURE_PROPERTIES
        ]));
    }

    public getProperties(): EMap<string> {
        return this.properties;
    }

}

export default XFacet;
