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
import Assignable from "padang/directors/assignables/Assignable";

export default class AssignableRegistry {

    private static instance = new AssignableRegistry();

    private assignables = new Map<string, Assignable>();

    constructor() {
        if (AssignableRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use AssignableRegistry.getInstance() instead of new");
        }
        AssignableRegistry.instance = this;
    }

    public static getInstance(): AssignableRegistry {
        return AssignableRegistry.instance;
    }

    public register(name: string, examination: Assignable): void {
        this.assignables.set(name, examination);
    }

    public has(name: string): boolean {
        return this.assignables.has(name);
    }

    public get(name: string): Assignable {
        return this.assignables.get(name);
    }

}