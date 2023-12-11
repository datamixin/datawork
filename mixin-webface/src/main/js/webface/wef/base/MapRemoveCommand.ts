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
import EMap from "webface/model/EMap";

import Command from "webface/wef/Command";

export default class MapRemoveCommand extends Command {

    private map: EMap<any> = null;
    private key: string = null;
    private oldValue: any = null;

    public setMap(map: EMap<any>): void {
        this.map = map;
    }

    public setKey(key: string): void {
        this.key = key;
    }

    public execute(): void {
        this.oldValue = this.map.get(this.key);
        this.map.remove(this.key);
    }

    public undo(): void {
        if (this.oldValue !== null) {
            this.map.put(this.key, this.oldValue);
        }
    }

    public redo(): void {
        this.map.remove(this.key);
    }

}
