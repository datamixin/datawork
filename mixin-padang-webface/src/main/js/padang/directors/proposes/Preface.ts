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
import XCall from "sleman/model/XCall";
import XPointer from "sleman/model/XPointer";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class Preface {

    public static EXAMPLE = "Example";

    private name: string = null;
    private example: boolean = null;
    private presume: string = null;

    constructor(name: string, example: boolean, presume: string) {
        this.name = name;
        this.example = example;
        this.presume = presume;
    }

    public getPresume(): string {
        return this.presume;
    }

    public createCall(pointer: XPointer): XCall {
        let factory = SlemanFactory.eINSTANCE;
        let call = factory.createXCall(this.name, pointer);
        if (this.example === true) {
            call = factory.createXCall(Preface.EXAMPLE, call);
        }
        return call;
    }

}