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
import { jsonLeanFactory } from "webface/constants";

import Modification from "webface/model/Modification";

import FileReconcile from "bekasi/reconciles/FileReconcile";

export default class RectificationReconcile extends FileReconcile {

    public static LEAN_NAME = "RectificationReconcile";

    private rectification: Modification;

    constructor() {
        super(RectificationReconcile.LEAN_NAME);
    }

    public getRectification(): Modification {
        return this.rectification;
    }

}

jsonLeanFactory.register(RectificationReconcile.LEAN_NAME, RectificationReconcile);