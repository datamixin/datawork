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
import Lean from "webface/core/Lean";

import { jsonLeanFactory } from "webface/constants";

export default class RunspaceHome extends Lean {

    public static LEAN_NAME = "RunspaceHome";

    private id: string = null;
    private name: string = null;

    constructor(leanName?: string) {
        super(leanName === undefined ? RunspaceHome.LEAN_NAME : leanName);
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public setId(id: string): void {
        this.id = id;
    }

}

jsonLeanFactory.register(RunspaceHome.LEAN_NAME, RunspaceHome);