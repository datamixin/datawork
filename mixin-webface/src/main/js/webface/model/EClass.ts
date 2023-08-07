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
import EPackage from "webface/model/EPackage";
import ModelNamespace from "webface/model/ModelNamespace";

export default class EClass {

    private name: string;
    private ePackage: EPackage;

    constructor(ePackage: EPackage, name: string) {
        this.ePackage = ePackage;
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getFullName(): string {
        let modelNamespace = this.getNamespace();
        let name = modelNamespace.name;
        let uri = modelNamespace.uri;
        return uri + '#' + this.name.substring(name.length + 1);
    }

    public getEPackage(): EPackage {
        return this.ePackage;
    }

    public toString(): string {
        return this.name;
    }

    public getNameWithoutPackage(): string {
        let parts = this.name.split("/");
        return parts[parts.length - 1];
    }

    private getNamespace(): ModelNamespace {
        let modelNamespaces = this.ePackage.getNamespaces();
        let modelNamespace = modelNamespaces[0];
        return modelNamespace;
    }

    public getAliasName(): string {
        let modelNamespace = this.getNamespace();
        let prefix = modelNamespace.name;
        return prefix + ":" + this.getNameWithoutPackage();
    }

}
