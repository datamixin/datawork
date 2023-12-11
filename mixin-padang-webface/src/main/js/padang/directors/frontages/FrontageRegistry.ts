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
import Frontage from "padang/directors/frontages/Frontage";

export default class FrontageRegistry {

    private static instance = new FrontageRegistry();

    private frontages = new Map<string, Map<string, Frontage>>();

    constructor() {
        if (FrontageRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use FrontageRegistry.getInstance() instead of new");
        }
        FrontageRegistry.instance = this;
    }

    public static getInstance(): FrontageRegistry {
        return FrontageRegistry.instance;
    }

    public register(typeName: string, frontageName: string, frontage: Frontage): void {
        if (!this.frontages.has(typeName)) {
            this.frontages.set(typeName, new Map<string, Frontage>());
        }
        let frontages = this.frontages.get(typeName);
        frontages.set(frontageName, frontage);
    }

    public has(leanName: string): boolean {
        return this.frontages.has(leanName);
    }

    public get(leanName: string, frontageName: string): Frontage {
        let frontages = this.frontages.get(leanName);
        return frontages.get(frontageName);
    }

}