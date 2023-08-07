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
import QueryBuilder from "padang/query/QueryBuilder";

import Histogram from "padang/functions/stat/Histogram";

export default class HistogramBuilder {

    public static HISTOGRAM = "histogram";

    private builder: QueryBuilder = null;

    constructor(builder: QueryBuilder) {
        this.builder = builder;
    }

    public prepareHistogram(): void {
        let call = this.builder.addCallVariable(HistogramBuilder.HISTOGRAM, Histogram.FUNCTION_NAME);
        this.builder.addPointerArgument(call, QueryBuilder.COLUMNS);
    }

    public setResult(name: string): void {
        this.builder.setResult(name);
    }

}