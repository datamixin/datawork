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
import ModelNamespace from "webface/model/ModelNamespace";

import MalangPackage from "malang/model/MalangPackage";

export let NAMESPACE = <ModelNamespace>{
    name: "malang",
    uri: "http://www.andiasoft.com/model/mixin/malang"
};

export let URI = "malang://";

export function getEClassName(name: string): string {
    return URI + name;
}

export function createEClass(name: string): EClass {
    let ePackage = MalangPackage.eINSTANCE;
    return new EClass(ePackage, name);
}
