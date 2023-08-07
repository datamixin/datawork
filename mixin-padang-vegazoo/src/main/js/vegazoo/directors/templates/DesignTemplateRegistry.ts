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

import DesignTemplate from "vegazoo/directors/templates/DesignTemplate";

export default class DesignTemplateRegistry {

    private static instance = new DesignTemplateRegistry();

    private templates = new ObjectMap<DesignTemplate>();

    constructor() {
        if (DesignTemplateRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use DesignTemplateRegistry.getInstance() instead of new");
        }
        DesignTemplateRegistry.instance = this;
    }

    public static getInstance(): DesignTemplateRegistry {
        return DesignTemplateRegistry.instance;
    }

    public register(name: string, template: DesignTemplate): void {
        this.templates.put(name, template);
    }

    public getTemplates(): DesignTemplate[] {
        let templates = this.templates.values();
        return templates.sort((a, b) => {
            let aPriority = a.getPriority();
            let bPriority = b.getPriority();
            return aPriority - bPriority;
        });
    }

    public get(name: string): DesignTemplate {
        return this.templates.get(name);
    }

}