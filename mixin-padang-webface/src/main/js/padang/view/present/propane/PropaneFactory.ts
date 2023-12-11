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
import Conductor from "webface/wef/Conductor";

import Propane from "padang/view/present/propane/Propane";

export default class PropaneFactory {

    private static instance = new PropaneFactory();

    private propanes = new Map<string, typeof Propane>();

    constructor() {
        if (PropaneFactory.instance) {
            throw new Error("Error: Instantiation failed: Use PropaneFactory.getInstance() instead of new");
        }
        PropaneFactory.instance = this;
    }

    public static getInstance(): PropaneFactory {
        return PropaneFactory.instance;
    }

    public register(visage: string, type: typeof Propane): void {
        let lower = visage.toLowerCase();
        this.propanes.set(lower, type);
    }

    public isExists(visage: string): boolean {
        let lower = visage.toLowerCase();
        return this.propanes.has(lower);
    }

    public create(conductor: Conductor, column: string, type: string): Propane {
        let lower = type.toLowerCase();
        let propaneType: any = this.propanes.get(lower);
        let propane = <Propane>new propaneType(conductor, column, lower);
        return propane;
    }

}