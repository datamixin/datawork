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
import ObjectMap from "webface/util/ObjectMap";

import Projector from "vegazoo/directors/projectors/Projector";

export default class ProjectorRegistry {

    private static instance = new ProjectorRegistry();

    private viewporters = new ObjectMap<Projector>();

    constructor() {
        if (ProjectorRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use ProjectorRegistry.getInstance() instead of new");
        }
        ProjectorRegistry.instance = this;
    }

    public static getInstance(): ProjectorRegistry {
        return ProjectorRegistry.instance;
    }

    public register(name: string, viewporter: Projector): void {
        this.viewporters.put(name, viewporter);
    }

    public get(name: string): Projector {
        return this.viewporters.get(name);
    }

}