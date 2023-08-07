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

export default class VisageMutation extends VisageValue {

    public static LEAN_NAME = "VisageMutation";

    private operation: string = null;
    private rowCount: number = null;
    private rowStart: number = null;
    private rowEnd: number = null;
    private columnCount: number = null;
    private columnStart: number = null;
    private columnEnd: number = null;

    constructor() {
        super(VisageMutation.LEAN_NAME);
    }

    public setOperation(operation: string): void {
        this.operation = operation;
    }

    public getType(): string {
        return this.operation;
    }

    public setRowCount(rowCount: number): void {
        this.rowCount = rowCount;
    }

    public getRowCount(): number {
        return this.rowCount;
    }

    public setRowStart(rowStart: number): void {
        this.rowStart = rowStart;
    }

    public getRowStart(): number {
        return this.rowStart;
    }

    public setRowEnd(rowEnd: number): void {
        this.rowEnd = rowEnd;
    }

    public getRowEnd(): number {
        return this.rowEnd;
    }

    public setColumnCount(columnCount: number): void {
        this.columnCount = columnCount;
    }

    public getColumnCount(): number {
        return this.columnCount;
    }

    public setColumnStart(columnStart: number): void {
        this.columnStart = columnStart;
    }

    public getColumnStart(): number {
        return this.columnStart;
    }

    public setColumnEnd(columnEnd: number): void {
        this.columnEnd = columnEnd;
    }

    public getColumnEnd(): number {
        return this.columnEnd;
    }

}

jsonLeanFactory.register(VisageMutation.LEAN_NAME, VisageMutation);