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
import { jsonLeanFactory } from "webface/constants";

import VisageValue from "bekasi/visage/VisageValue";

export default class VisageState extends VisageValue {

    public static LEAN_NAME = "VisageState";

    private type: string = null;
    private value: any = null;

    constructor(type?: string, value?: string) {
        super(VisageState.LEAN_NAME);
        this.type = type ? type : null;
        this.value = value ? value : null;
    }

    public getType(): string {
        return this.type;
    }

    public getValue(): any {
        return this.value;
    }

}

jsonLeanFactory.register(VisageState.LEAN_NAME, VisageState);