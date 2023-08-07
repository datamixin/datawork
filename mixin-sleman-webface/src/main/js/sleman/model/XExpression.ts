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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import Printer from "sleman/model/Printer";
import SExpression from "sleman/SExpression";

export abstract class XExpression extends BasicEObject implements SExpression {

    public static FEATURE_GROUP = new EAttribute("group", EAttribute.BOOLEAN);

    private group: boolean = false;

    constructor(xClass: EClass, features: EFeature[]) {
        super(xClass, (<EFeature[]>[
            XExpression.FEATURE_GROUP,
        ]).concat(features));
    }

    public isGroup(): boolean {
        return this.group;
    }

    public setGroup(newGroup: boolean): void {
        let oldGroup = this.group;
        this.group = newGroup;
        this.eSetNotify(XExpression.FEATURE_GROUP, oldGroup, newGroup);
    }

    public toLiteral(level?: number): string {
        let printer = new Printer(level);
        this.print(printer);
        let buffer = printer.getBuffer();
        return buffer;
    }

    public toString(): string {
        return this.toLiteral();
    }

    public abstract print(printer: Printer): void;

}

export default XExpression;