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
import EList from "webface/model/EList";
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";

import Command from "webface/wef/Command";

export default class RemoveCommand extends Command {

    private container: EObject = null;
    private feature: EFeature = null;
    private position: number = -1;
    private key: string = null;
    private model: EObject;

    public setModel(model: EObject): void {
        this.model = model;
    }

    public execute(): void {
        this.container = this.model.eContainer();
        this.feature = this.model.eContainingFeature();
        let object = this.container.eGet(this.feature);
        if (object instanceof EList) {
            let list = <EList<any>>object;
            this.position = list.indexOf(this.model);
        } else if (object instanceof EMap) {
            let map = <EMap<any>>object;
            let keys = map.keySet();
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if (map.get(key) === this.model) {
                    this.key = key;
                    break;
                }
            }
        }
        util.remove(this.model);
    }

    public undo(): void {
        let object = this.container.eGet(this.feature);
        if (this.position !== -1) {
            let list = <EList<any>>object;
            list.add(this.model, this.position);
        } else if (this.key !== null) {
            let map = <EMap<any>>object;
            map.put(this.key, this.model);
        } else {
            this.container.eSet(this.feature, this.model);
        }
    }

    public redo(): void {
        util.remove(this.model);
    }

}