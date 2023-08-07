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
import EMap from "webface/model/EMap";

import Command from "webface/wef/Command";

export default class MapRepopulateCommand extends Command {

    private map: EMap<any>;
    private entries: { [key: string]: any } = {};
    private copy: { [key: string]: any } = {};

    public setMap(map: EMap<any>): void {
        this.map = map;
    }

    public setEntries(entries: { [key: string]: any }): void {
        this.entries = entries;
    }

    public execute(): void {
        this.repopulate();
    }

    private repopulate(): void {
        for (let key of this.map.keySet()) {
            let value = this.map.get(key);
            this.copy[key] = value;
        }
        this.map.repopulate(this.entries);
    }

    public undo(): void {
        this.map.repopulate(this.copy);
        this.copy = {};
    }

    public redo(): void {
        this.repopulate();
    }

}
