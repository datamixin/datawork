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
export default class StarterRegistry {

    private static instance = new StarterRegistry();

    private starters: ((callback: () => void) => void)[] = [];

    constructor() {
        if (StarterRegistry.instance) {
            throw new Error("Error: Instantiation failed: Use StarterRegistry.getInstance() instead of new");
        }
        StarterRegistry.instance = this;
    }

    public static getInstance(): StarterRegistry {
        return StarterRegistry.instance;
    }

    public register(starter: (callback: () => void) => void): void {
        this.starters.push(starter);
    }

    public starts(callback: () => void): void {
        let counter = 0;
        for (let starter of this.starters) {
            starter(() => {
                counter++;
                if (counter === this.starters.length) {
                    callback();
                }
            });
        }
    }

}