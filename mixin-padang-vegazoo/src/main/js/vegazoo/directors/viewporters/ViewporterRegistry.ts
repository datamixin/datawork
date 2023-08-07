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
import ObjectMap from "webface/util/ObjectMap";

import Viewporter from "vegazoo/directors/viewporters/Viewporter";

export default class ViewporterRegistry {

    private static instance = new ViewporterRegistry();

    private viewporters = new ObjectMap<Viewporter>();

    constructor() {
        if (ViewporterRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use ViewporterRegistry.getInstance() instead of new");
        }
        ViewporterRegistry.instance = this;
    }

    public static getInstance(): ViewporterRegistry {
        return ViewporterRegistry.instance;
    }

    public register(name: string, viewporter: Viewporter): void {
        this.viewporters.put(name, viewporter);
    }

    public get(name: string): Viewporter {
        return this.viewporters.get(name);
    }

}