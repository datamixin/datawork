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
import XExpression from "sleman/model/XExpression";
import ExpressionParser from "sleman/base/ExpressionParser";

// https://github.com/prettier/prettier
// https://github.com/microsoft/monaco-editor
// https://github.com/codemirror/CodeMirror
export default class Printer {

    private buffer = "";
    private level: number = -1;

    constructor(level?: number) {
        this.level = level === undefined ? -1 : level;
    }

    public term(object: any): void {
        this.buffer += object;
    }

    public space(): void {
        this.buffer += " ";
    }

    public newLineIndent(indent: boolean): void {
        if (this.level !== -1) {
            this.buffer += "\n" + "  ".repeat(this.level + (indent === true ? 1 : 0));
        } else {
            this.buffer += " ";
        }
    }

    public newLine(object?: any): void {
        this.newLineIndent(false);
        if (object !== undefined) {
            this.buffer += object;
        }
    }

    public newLineIndentPart(expression: XExpression): void {
        this.newLineIndent(true);
        this.part(expression);
    }

    private print(expression: XExpression): void {
        let printer = new Printer(this.level);
        expression.print(printer);
        let buffer = printer.getBuffer();
        this.buffer += buffer;
    }

    public part(expression: XExpression): void {
        this.print(expression);
    }

    public open(char: any): void {
        this.buffer += char;
    }

    public comma(last: number): void {
        if (last > 1) {
            this.buffer += ", ";
        }
    }

    public element(index: number, last: number, expression: XExpression): void {
        this.print(expression);
        this.comma(last);
        if ((index + 1) % 10 === 0) {
            this.level++;
            this.newLineIndent(true);
            this.level--;
        }
    }

    private key(key: string): void {
        let name = ExpressionParser.promoteBacktick(key);
        this.buffer += name;
    }

    public entry(last: number, key: string, assign: string, expression: XExpression): void {
        this.key(key);
        this.buffer += assign + " ";
        this.print(expression);
        this.comma(last);
    }

    public newLineIndentEntry(last: number, key: string, assign: string, expression: XExpression): void {
        if (this.level !== -1) {
            this.buffer += "\n" + "  ".repeat(this.level + 1);
        } else {
            this.buffer += " ";
        }
        this.key(key);
        this.buffer += assign;
        this.print(expression);
        this.comma(last);
    }

    public close(char: any): void {
        this.buffer += char;
    }

    public getBuffer(): string {
        return this.buffer;
    }

}