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
export abstract class Interaction {

    constructor(
        public interactionName: string) {
    }

    public getOptionNames(): string[] {
        let keys = Object.keys(this);
        let names: string[] = [];
        for (let key of keys) {
            if (key === "interactionName") {
                continue;
            }
            names.push(key);
        }
        return names;
    }

}

export default Interaction;