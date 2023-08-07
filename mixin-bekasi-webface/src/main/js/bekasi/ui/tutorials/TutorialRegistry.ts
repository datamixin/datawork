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
import Tutorial from "bekasi/ui/tutorials/Tutorial";

export default class TutorialRegistry {

    private static instance = new TutorialRegistry();
    private tutorials: Tutorial[] = [];

    constructor() {
        if (TutorialRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use TutorialRegistry.getInstance() instead of new");
        }
        TutorialRegistry.instance = this;
    }

    public static getInstance(): TutorialRegistry {
        return TutorialRegistry.instance;
    }

    public register(tutorial: Tutorial): void {
        this.tutorials.push(tutorial);
    }

    public getLabels(): string[] {
        let labels: string[] = [];
        for (let tutorial of this.tutorials) {
            let label = tutorial.getLabel();
            labels.push(label);
        }
        return labels;
    }

    public getByLabel(label: string): Tutorial {
        for (let tutorial of this.tutorials) {
            if (label === tutorial.getLabel()) {
                return tutorial;
            }
        }
        return null;
    }

}