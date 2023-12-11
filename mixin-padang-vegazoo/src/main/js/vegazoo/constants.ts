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
import * as padang from "padang/padang";

export let NULL: any = "null";
export let EMPTY: any = "[{}]";

export enum AggregateOp {
	NONE = "none",
	MAX = "max",
	AVERAGE = "average",
	COUNT = "count",
	SUM = "sum",
	MIN = "min"
}

export enum SortOrder {
	ASCENDING = "ascending",
	DESCENDING = "descending",
}

export enum StandardType {
	QUANTITATIVE = "quantitative",
	ORDINAL = "ordinal",
	TEMPORAL = "temporal",
	NOMINAL = "nominal"
}

export let FIELD_TYPE_MAP = {
	INT32: StandardType.QUANTITATIVE,
	INT64: StandardType.QUANTITATIVE,
	FLOAT32: StandardType.QUANTITATIVE,
	FLOAT64: StandardType.QUANTITATIVE,
	DATETIME: StandardType.TEMPORAL,
	TIMESTAMP: StandardType.TEMPORAL,
	STRING: StandardType.NOMINAL,
	BOOLEAN: StandardType.NOMINAL,
}

export let FIELD_ICON_MAP = {
	quantitative: "mdi-numeric",
	ordinal: "mdi-alphabetical",
	nominal: "mdi-shape",
	temporal: "mdi-calendar-clock",
}

export let FIELD_COLOR_MAP = {
	quantitative: padang.COLOR_NUMBER,
	nominal: "#888",
	ordinal: "#888",
	temporal: padang.COLOR_TIMESTAMP,
}

export enum TimeUnit {
	YEAR = "year",
	YEAR_QUARTER = "yearquarter",
	YEAR_QUARTER_MONTH = "yearquartermonth",
	YEAR_MONTH = "yearmonth",
	YEAR_MONTH_DATE = "yearmonthdate",
	YEAR_MONTH_DATE_HOURS = "yearmonthdatehours",
	YEAR_MONTH_DATE_HOURS_MINUTES = "yearmonthdatehoursminutes",
	YEAR_MONTH_DATE_HOURS_MINUTES_SECONDS = "yearmonthdatehoursminutesseconds",
	YEAR_WEEK = "yearweek",
	YEAR_WEEK_DAY = "yearweekday",
	YEAR_WEEK_DAY_HOURS = "yearweekdayhours",
	YEAR_WEEK_DAY_HOURS_MINUTES = "yearweekdayhoursminutes",
	YEAR_WEEK_DAY_HOURS_MINUTES_SECONDS = "yearweekdayhoursminutesseconds",
	YEAR_DAY = "yearday",
	YEAR_DAY_OF_YEAR = "yeardayofyear",
	QUARTER_MONTH = "quartermonth",
	MONTH = "month",
	MONTH_DATE = "monthdate",
	MONTH_DATE_HOURS = "monthdatehours",
	MONTH_DATE_HOURS_MINUTES = "monthdatehoursminutes",
	MONTH_DATE_HOURS_MINUTES_SECONDS = "monthdatehoursminutesseconds",
	WEEK_DAY = "weekday",
	WEEKS_DAY_HOURS = "weeksdayhours",
	WEEK_DAY_HOURS_MINUTES = "weekdayhoursminutes",
	WEEK_DAY_HOURS_MINUTES_SECONDS = "weekdayhoursminutesseconds",
	DAY_HOURS = "dayhours",
	DAY_HOURS_MINUTES = "dayhoursminutes",
	DAY_HOURS_MINUTES_SECONDS = "dayhoursminutesseconds",
	HOURS_MINUTES = "hoursminutes",
	HOURS_MINUTES_SECONDS = "hoursminutesseconds",
	MINUTES_SECONDS = "minutesseconds",
	SECONDS_MILLISECONDS = "secondsmilliseconds",
}

export enum Format {
	CSV = "csv",
	TSV = "tsv"
}

export enum Align {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right",
}

export enum DataType {
	BOOLEAN = "boolean",
	NUMBER = "number",
	STRING = "string"
}