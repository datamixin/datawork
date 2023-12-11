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
import Lean from "webface/core/Lean";

import EObject from "webface/model/EObject";
import FeaturePath from "webface/model/FeaturePath";

export default class FeatureMark extends Lean {

    public static BEAN_NAME = "FeatureMark";

    protected path: FeaturePath = null;
    protected name: string = null;

    constructor(model: EObject | FeaturePath, name: string, beanName?: string) {
        super(beanName === undefined ? FeatureMark.BEAN_NAME : beanName);
        if (model instanceof EObject) {
            this.path = new FeaturePath(model);
        } else {
            this.path = model;
        }
        this.name = name;
    }

    public getPath(): FeaturePath {
        return this.path;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public newFeatureMark(): FeatureMark {
        let qualifier = new FeatureMark(this.path, this.name);
        return qualifier;
    }

}