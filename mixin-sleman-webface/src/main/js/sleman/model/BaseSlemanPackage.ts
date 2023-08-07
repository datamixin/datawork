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
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";
import ModelNamespace from "webface/model/ModelNamespace";

import XLet from "sleman/model/XLet";
import XCall from "sleman/model/XCall";
import XNull from "sleman/model/XNull";
import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XUnary from "sleman/model/XUnary";
import XAlias from "sleman/model/XAlias";
import XMember from "sleman/model/XMember";
import XObject from "sleman/model/XObject";
import XBinary from "sleman/model/XBinary";
import XNumber from "sleman/model/XNumber";
import XLambda from "sleman/model/XLambda";
import XLogical from "sleman/model/XLogical";
import XForeach from "sleman/model/XForeach";
import XArgument from "sleman/model/XArgument";
import XReference from "sleman/model/XReference";
import XIdentifier from "sleman/model/XIdentifier";
import XAssignment from "sleman/model/XAssignment";

import { NAMESPACE } from "sleman/model/model";
import SlemanPackage from "sleman/model/SlemanPackage";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class BasicSlemanPackage implements SlemanPackage {

    private map: { [xClass: string]: typeof EObject } = {};

    constructor() {
        this.map[XLet.XCLASSNAME] = XLet;
        this.map[XText.XCLASSNAME] = XText;
        this.map[XNull.XCLASSNAME] = XNull;
        this.map[XCall.XCLASSNAME] = XCall;
        this.map[XList.XCLASSNAME] = XList;
        this.map[XAlias.XCLASSNAME] = XAlias;
        this.map[XUnary.XCLASSNAME] = XUnary;
        this.map[XObject.XCLASSNAME] = XObject;
        this.map[XBinary.XCLASSNAME] = XBinary;
        this.map[XNumber.XCLASSNAME] = XNumber;
        this.map[XMember.XCLASSNAME] = XMember;
        this.map[XLambda.XCLASSNAME] = XLambda;
        this.map[XLogical.XCLASSNAME] = XLogical;
        this.map[XForeach.XCLASSNAME] = XForeach;
        this.map[XArgument.XCLASSNAME] = XArgument;
        this.map[XReference.XCLASSNAME] = XReference;
        this.map[XAssignment.XCLASSNAME] = XAssignment;
        this.map[XIdentifier.XCLASSNAME] = XIdentifier;
    }

    public getNamespaces(): ModelNamespace[] {
        return [NAMESPACE];
    }

    public getDefinedEClass(eClassName: string): typeof EObject {
        return this.map[eClassName] || null;
    }

    public getEClass(eClassName: string): typeof EObject {
        return this.getDefinedEClass(eClassName);
    }

    public getEFactoryInstance(): EFactory {
        return SlemanFactory.eINSTANCE;
    }

}

SlemanPackage.eINSTANCE = new BasicSlemanPackage();

