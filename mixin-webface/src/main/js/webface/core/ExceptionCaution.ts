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
import * as webface from "webface/webface";
import StringBuffer from "webface/util/StringBuffer";

import Caution from "webface/core/Caution";

export default class ExceptionCaution extends Caution {

    public static CLASS = "class";
    public static CAUSE = "cause";
    public static MESSAGE = "message";
    public static METHOD = "method";
    public static FILENAME = "filename";
    public static LINE = "line";
    public static STACKTRACE = "stackTrace";

    private json: any = null;

    constructor(json: any) {
        super();
        let responseJSON = json.responseJSON;
        if (responseJSON !== undefined) {
            this.json = responseJSON;
        }
    }

    public getMessage(): string {
        return this.doGetMessage(this.json);
    }

    private doGetMessage(json: any): string {
        let cause = json[ExceptionCaution.CAUSE];
        if (cause !== undefined) {
            return this.doGetMessage(cause);
        } else {
            return this.getCauseMessage(json);
        }
    }

    public getDetailMessage(): string {
        let buffer: StringBuffer = new StringBuffer();
        this.doGetDetailMessage(this.json, buffer);
        return buffer.toString();
    }

    private doGetDetailMessage(json: any, buffer: StringBuffer): void {
        let className = json[ExceptionCaution.CLASS];
        if (className !== undefined) {
            buffer.append(className);
        }

        let message = this.getCauseMessage(json);
        if (message !== undefined) {
            if (className !== undefined) {
                buffer.append(": ");
            }
            buffer.appendLine(message);
        }

        let stackTraces = json[ExceptionCaution.STACKTRACE];
        if (stackTraces !== undefined) {
            for (var i = 0; i < stackTraces.length; i++) {
                let stackTrace = stackTraces[i];
                buffer.append("  at ");
                let stackClass = stackTrace[ExceptionCaution.CLASS];
                let method = stackTrace[ExceptionCaution.METHOD];
                buffer.append(stackClass);
                buffer.append(webface.PERIOD);
                buffer.append(method);

                let filename = stackTrace[ExceptionCaution.FILENAME];
                let line = stackTrace[ExceptionCaution.LINE];
                buffer.append("(");
                if (filename) {
                    buffer.append(filename);
                    buffer.append(webface.COLON);
                    buffer.append(line);
                } else {
                    buffer.append("Unknown source");
                }
                buffer.appendLine(")");
            }
            let cause = json[ExceptionCaution.CAUSE];
            if (cause) {
                buffer.append("Cause by: ");
                this.doGetDetailMessage(cause, buffer);
            }
        } else {
            buffer.append(JSON.stringify(json, null, 4));
        }

    }

    private getCauseMessage(json: any): string {
        let message = json[ExceptionCaution.MESSAGE];
        if (message !== undefined) {
            return message;
        } else {
            let className = json[ExceptionCaution.CLASS];
            if (className !== undefined) {
                return className;
            } else {
                return JSON.stringify(json);
            }
        }
    }
}
