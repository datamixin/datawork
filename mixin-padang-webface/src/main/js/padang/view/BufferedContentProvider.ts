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
import Conductor from "webface/wef/Conductor";

import VisageError from "bekasi/visage/VisageError";

import ProvisionFactory from "padang/provisions/ProvisionFactory";
import RowRangeProvision from "padang/provisions/RowRangeProvision";

import DefaultColumnLabel from "padang/view/DefaultColumnLabel";

import GridContentProvider from "padang/grid/GridContentProvider";

import BufferedProvisionRequest from "padang/requests/BufferedProvisionRequest";

export default class BufferedContentProvider implements GridContentProvider {

    private static BUFFER_SIZE = 1000;
    private static REQUEST_SIZE = 100;
    private conductor: Conductor = null;
    private factory = ProvisionFactory.getInstance();
    private buffers = new Map<any, any[]>();
    private rowCount = 0;
    private columnCount = 0;
    private prevRowStart = -1;
    private onErrorRaised = (error: VisageError) => { };
    private onCountChanged = (row: number, column: number) => { };
    private runningTimeout: number = null;
    private nextTask: ProvisionTask = null;

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public getColumnLabels(callback: (labels: DefaultColumnLabel[]) => void): void {

        let provision = this.factory.createColumnKeys();
        let request = new BufferedProvisionRequest(provision);
        this.conductor.submit(request, (value: any) => {

            if (value instanceof VisageError) {

                this.errorRaised(value);
                callback([]);

            } else {

                let columns: string[] = <string[]>value;
                this.columnCount = value.length;

                let provision = this.factory.createColumnTypes(0, -1);
                let request = new BufferedProvisionRequest(provision);
                this.conductor.submit(request, (types: string[]) => {
                    let labels: DefaultColumnLabel[] = [];
                    for (let i = 0; i < columns.length; i++) {
                        let label = new DefaultColumnLabel(columns[i], types[i]);
                        labels.push(label);
                    }
                    callback(labels);
                });

            }
        });
    }

    public getRowCount(callback: (count: number) => void): void {
        let provision = this.factory.createRowCount();
        let request = new BufferedProvisionRequest(provision);
        this.conductor.submit(request, (result: any) => {
            if (result instanceof VisageError) {
                this.errorRaised(result);
                this.rowCount = 0;
            } else {
                this.rowCount = <number>result;
                this.countChanged();
            }
            callback(this.rowCount);
        });
    }

    private errorRaised(error: VisageError): void {
        this.runningTimeout = null;
        this.onErrorRaised(error);
    }

    private countChanged(): void {
        this.onCountChanged(this.rowCount, this.columnCount);
    }

    public getRowRange(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number,
        callback: (map: Map<any, any[]>) => void): void {

        let original = this.factory.createRowRange(rowStart, rowEnd, columnStart, columnEnd);

        // Extent request
        let reqCount = BufferedContentProvider.REQUEST_SIZE;
        if (rowStart >= this.prevRowStart) {

            // Jika permintaan ke maju maka maximize rowEnd
            this.prevRowStart = rowStart;
            rowEnd = Math.ceil(rowEnd / reqCount) * reqCount + reqCount;
            rowEnd = Math.min(rowEnd, this.rowCount);

        } else {

            // Jika permintaan ke mundur maka minimize rowStart
            this.prevRowStart = rowStart;
            rowStart = Math.floor(rowStart / reqCount) * reqCount - reqCount;
            rowStart = Math.max(rowStart, 0);
        }


        // Kumpulkan semua pos yang ada ke buffered dan catat yang missings 
        let buffered = new Map<any, any[]>();
        let missings: number[] = [];
        for (let pos = rowStart; pos < rowEnd; pos++) {
            if (this.buffers.has(pos)) {
                let row = this.buffers.get(pos);
                buffered.set(pos, row);
            } else {
                missings.push(pos);
            }
        }

        if (buffered.size > 0) {

            callback(buffered);

            if (missings.length > 0) {

                // Request rentang missing
                let min = this.rowCount;
                let max = 0;
                for (let pos of missings) {
                    if (pos < min) min = pos;
                    if (max < pos + 1) max = pos + 1;
                }
                let rowRange = this.factory.createRowRange(min, max, columnStart, columnEnd);
                this.requestRowRange(original, rowRange, callback);
            }

        } else {

            // Request semua
            let rowRange = this.factory.createRowRange(rowStart, rowEnd, columnStart, columnEnd);
            this.requestRowRange(original, rowRange, callback);
        }
    }

    private requestRowRange(original: RowRangeProvision, missings: RowRangeProvision, callback: (map: Map<any, any[]>) => void): void {
        this.nextTask = new ProvisionTask(original, missings, callback);
        this.runRequest();
    }

    private runRequest(): void {
        if (this.runningTimeout !== null) {
            return;
        }
        this.runningTimeout = setTimeout(() => {

            // Ambil provision terakhir dan hapus daftar antiran
            let task = this.nextTask;
            this.nextTask = null;

            let request = new BufferedProvisionRequest(task.extended);
            this.conductor.submit(request, (value: any) => {

                if (value instanceof VisageError) {

                    task.callback(new Map<any, any[]>());

                } else {

                    let results = <Map<any, any[]>>value;
                    let original = task.original;

                    let map = new Map<any, any[]>();
                    let keys = results.keys();
                    for (let key of keys) {
                        let row = results.get(key);
                        this.buffers.set(key, row);
                        this.maintain(key);
                        if (key >= original.rowStart && key < original.rowEnd) {
                            map.set(key, row);
                        }
                    }

                    this.runningTimeout = null;
                    if (this.nextTask !== null) {
                        this.runRequest();
                    }

                    if (map.size > 0) {
                        task.callback(map);
                    }
                }
            });
        }, 0);

    }

    private maintain(current: number): void {

        if (this.buffers.size > BufferedContentProvider.BUFFER_SIZE) {

            // Cari key dengan posisi terjauh dari sekarang
            let maxDistance = Number.MIN_VALUE;
            let maxKey: number = null;
            let keys = this.buffers.keys();
            for (let key of keys) {
                let distance = Math.abs(current - key);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    maxKey = key;
                }
            }
            this.buffers.delete(maxKey);
        }
    }

    public setOnErrorRaised(callback: (error: VisageError) => void): void {
        this.onErrorRaised = callback;
    }

    public setOnCountChanged(callback: (row: number, column: number) => void): void {
        this.onCountChanged = callback;
    }

    public setRowColumnCount(rowCount: number, columnCount: number): void {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
    }

    public clearRowBuffer(start: number, end: number): void {
        for (let i = start; i < end; i++) {
            this.buffers.delete(i);
        }
    }

    public clearBuffer(): void {
        this.rowCount = 0;
        this.prevRowStart = -1;
        this.buffers.clear();
    }

}

class ProvisionTask {

    constructor(
        public original: RowRangeProvision,
        public extended: RowRangeProvision,
        public callback: (map: Map<any, any[]>) => void) {
    }
}