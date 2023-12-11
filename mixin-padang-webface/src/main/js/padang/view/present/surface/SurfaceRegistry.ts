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
import VisageValue from "bekasi/visage/VisageValue";

import Surface from "padang/view/present/surface/Surface";

export default class SurfaceRegistry {

    private static instance = new SurfaceRegistry();

    private surfaces = new Map<string, Surface>();

    constructor() {
        if (SurfaceRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use SurfaceRegistry.getInstance() instead of new");
        }
        SurfaceRegistry.instance = this;
    }

    public static getInstance(): SurfaceRegistry {
        return SurfaceRegistry.instance;
    }

    public register(visage: string, surface: Surface): void {
        this.surfaces.set(visage, surface);
    }

    public getNames(): Iterator<string> {
        return this.surfaces.keys();
    }

    public get(value: VisageValue): Surface {
        let leanName = value.xLeanName();
        return this.getByLeanName(leanName);
    }

    public getByLeanName(leanName: string): Surface {
        let surface = this.surfaces.get(leanName);
        return surface;
    }

    public getText(value: any): string {
        if (value instanceof VisageValue) {
            let leanName = value.xLeanName();
            let surface = this.surfaces.get(leanName);
            return surface.getText(value);
        } else {
            if (value === null) {
                return "null";
            } else if (value === undefined) {
                return "?";
            } else {
                return value.toString();
            }
        }
    }

}