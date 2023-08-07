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
import EPackage from "webface/model/EPackage";
import ModelNamespace from "webface/model/ModelNamespace";

export abstract class SlemanPackage implements EPackage {

    public static eINSTANCE: SlemanPackage = null;

    abstract getNamespaces(): ModelNamespace[];

    abstract getDefinedEClass(eClassName: string): typeof EObject;

    abstract getEClass(eClassName: string): typeof EObject;

    abstract getEFactoryInstance(): EFactory;

}

export default SlemanPackage;
