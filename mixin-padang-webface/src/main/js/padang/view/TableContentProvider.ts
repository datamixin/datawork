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
import VisageTable from "bekasi/visage/VisageTable";
import VisageNumber from "bekasi/visage/VisageNumber";

import GridColumnLabel from "padang/grid/GridColumnLabel";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import GridContentProvider from "padang/grid/GridContentProvider";

export default class TableContentProvider implements GridContentProvider {

    private table: VisageTable = null;

    constructor(table: VisageTable) {
        this.table = table;
    }

    public getColumnLabels(callback: (labels: GridColumnLabel[]) => void): void {
        let columns = this.table.getColumns();
        let labels: DefaultColumnLabel[] = [];
        for (let i = 1; i < columns.length; i++) {
            let column = columns[i];
            let label = column.getKey();
            let type = column.getType();
            labels.push(new DefaultColumnLabel(label, type))
        }
        callback(labels);
    }

    public getRowCount(callback: (count: number) => void): void {
        let count = this.table.recordCount();
        callback(count);
    }

    public getRowRange(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number,
        callback: (map: Map<any, any[]>) => void): void {
        let map = new Map<any, any[]>();
        for (let i = rowStart; i < rowEnd; i++) {
            let record = this.table.getRecord(i);
            let values = record.getValues();
            let id = (<VisageNumber>values[0]).getValue();
            let rest = values.slice(1);
            map.set(id, rest);
        }
        callback(map);
    }

}