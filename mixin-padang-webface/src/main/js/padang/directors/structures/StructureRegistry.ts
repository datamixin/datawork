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
import Structure from "padang/directors/structures/Structure";

export default class StructureRegistry {

    private static instance = new StructureRegistry();

    private structures = new Map<string, Structure>();

    constructor() {
        if (StructureRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use StructureRegistry.getInstance() instead of new");
        }
        StructureRegistry.instance = this;
    }

    public static getInstance(): StructureRegistry {
        return StructureRegistry.instance;
    }

    public register(name: string, structure: Structure): void {
        this.structures.set(name, structure);
    }

    public get(name: string): Structure {
        return this.structures.get(name);
    }

}