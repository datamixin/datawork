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
import Caution from "webface/core/Caution";
import ExceptionCaution from "webface/core/ExceptionCaution";

export default class Response {

    private message: string = null;
    private text: any;
    private detailMessage: string = null;
    private exception: Caution = null;

    constructor(json: any) {
        this.message = "Status " + json.status + ": " + json.statusText;
        this.text = json.responseText;
        if (json.responseJSON !== undefined) {
            this.exception = new ExceptionCaution(json.responseJSON);
        }
        this.detailMessage = JSON.stringify(json, null, 4);
    }

    public getMessage(): string {
        return this.message;
    }

    public getText(): string {
        return this.text;
    }

    public getDetailMessage(): string {
        return this.detailMessage;
    }

    public getException(): Caution {
        return this.exception;
    }
}
