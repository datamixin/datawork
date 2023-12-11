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
import Renderer from "padang/directors/renderers/Renderer";

export default class RendererRegistry {

    private static instance = new RendererRegistry();

    private renderers = new Map<string, Renderer>();

    constructor() {
        if (RendererRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use RendererRegistry.getInstance() instead of new");
        }
        RendererRegistry.instance = this;
    }

    public static getInstance(): RendererRegistry {
        return RendererRegistry.instance;
    }

    public register(name: string, renderer: Renderer): void {
        this.renderers.set(name, renderer);
    }

    public get(name: string): Renderer {
        return this.renderers.get(name);
    }

}