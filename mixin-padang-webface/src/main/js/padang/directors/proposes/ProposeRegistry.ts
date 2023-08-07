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
import Propose from "padang/directors/proposes/Propose";

export default class ProposeRegistry {

    private static instance = new ProposeRegistry();

    private proposes = new Map<string, Propose>();

    constructor() {
        if (ProposeRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use ProposeRegistry.getInstance() instead of new");
        }
        ProposeRegistry.instance = this;
    }

    public static getInstance(): ProposeRegistry {
        return ProposeRegistry.instance;
    }

    public register(name: string, propose: Propose): void {
        this.proposes.set(name, propose);
    }

    public get(name: string): Propose {
        return this.proposes.get(name) || null;
    }

}