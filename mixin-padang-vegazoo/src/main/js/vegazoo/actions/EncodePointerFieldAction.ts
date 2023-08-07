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
import ObjectMap from "webface/util/ObjectMap";

import Action from "webface/action/Action";

import Controller from "webface/wef/Controller";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import CountField from "padang/model/CountField";
import PointerField from "padang/model/PointerField";

import FieldDefDropObjectRequest from "vegazoo/requests/design/FieldDefDropObjectRequest";

export default class EncodePointerFieldAction extends Action {

    private controller: Controller = null;
    private field: PointerField = null;

    constructor(controller: Controller, field: PointerField, name: string) {
        super(name);
        this.controller = controller;
        this.field = field;
    }

    public run(): void {

        let director = directors.getVariableFieldDirector(this.controller);
        let pointer = director.createPointer(this.field);
        let formula = "=" + pointer;
        let fieldType = this.field.getType();
        let fieldKind = this.field instanceof CountField ? padang.FIELD_KIND_COUNT : padang.FIELD_KIND_VALUE;
        let fieldPresume = this.field.getPropose();

        let data = new ObjectMap<any>();
        data.put(padang.FIELD_FORMULA, formula);
        data.put(padang.FIELD_TYPE, fieldType);
        data.put(padang.FIELD_KIND, fieldKind);
        data.put(padang.FIELD_PRESUME, fieldPresume);
        data.put(padang.DRAG_SOURCE, this.field);

        let request = new FieldDefDropObjectRequest(data);
        this.controller.submit(request);

    }
}
