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
import XCall from "sleman/model/XCall";
import XPointer from "sleman/model/XPointer";

import VisageType from "bekasi/visage/VisageType";

import Day from "padang/functions/datetime/Day";
import Hour from "padang/functions/datetime/Hour";
import Week from "padang/functions/datetime/Week";
import Year from "padang/functions/datetime/Year";
import Month from "padang/functions/datetime/Month";
import DayOfWeek from "padang/functions/datetime/DayOfWeek";
import DayOfYear from "padang/functions/datetime/DayOfYear";

import Distinct from "padang/functions/list/Distinct";

import Sum from "padang/functions/aggregate/Sum";
import Min from "padang/functions/aggregate/Min";
import Max from "padang/functions/aggregate/Max";
import Median from "padang/functions/aggregate/Median";
import Average from "padang/functions/aggregate/Average";

import Preface from "padang/directors/proposes/Preface";
import Propose from "padang/directors/proposes/Propose";
import ProposeRegistry from "padang/directors/proposes/ProposeRegistry";

export default class ColumnPropose extends Propose {

	private static DISTINCT = "Distinct";
	private static SUM = "Sum";
	private static MINIMUM = "Minimum";
	private static MAXIMUM = "Maximum";
	private static MEDIAN = "Median";
	private static AVERAGE = "Average";
	private static YEAR = "Year";
	private static WEEK = "Week";
	private static MONTH = "Month";
	private static DAY = "Day";
	private static HOUR = "Hour";
	private static DAY_OF_WEEK = "Day of Week";
	private static DAY_OF_YEAR = "Day of Year";
	private prefaces = new Map<string, Preface>();

	constructor() {
		super();
		this.prefaces.set(Preface.EXAMPLE, new Preface(Preface.EXAMPLE, false, VisageType.LIST));
		this.prefaces.set(ColumnPropose.DISTINCT, new Preface(Distinct.FUNCTION_NAME, true, VisageType.LIST));
		this.prefaces.set(ColumnPropose.SUM, new Preface(Sum.FUNCTION_NAME, false, VisageType.FLOAT64));
		this.prefaces.set(ColumnPropose.MINIMUM, new Preface(Min.FUNCTION_NAME, false, VisageType.FLOAT64));
		this.prefaces.set(ColumnPropose.MAXIMUM, new Preface(Max.FUNCTION_NAME, false, VisageType.FLOAT64));
		this.prefaces.set(ColumnPropose.MEDIAN, new Preface(Median.FUNCTION_NAME, false, VisageType.FLOAT64));
		this.prefaces.set(ColumnPropose.AVERAGE, new Preface(Average.FUNCTION_NAME, false, VisageType.FLOAT64));
		this.prefaces.set(ColumnPropose.YEAR, new Preface(Year.FUNCTION_NAME, false, VisageType.COLUMN));
		this.prefaces.set(ColumnPropose.MONTH, new Preface(Month.FUNCTION_NAME, false, VisageType.COLUMN));
		this.prefaces.set(ColumnPropose.WEEK, new Preface(Week.FUNCTION_NAME, false, VisageType.COLUMN));
		this.prefaces.set(ColumnPropose.DAY, new Preface(Day.FUNCTION_NAME, false, VisageType.COLUMN));
		this.prefaces.set(ColumnPropose.DAY_OF_WEEK, new Preface(DayOfWeek.FUNCTION_NAME, false, VisageType.COLUMN));
		this.prefaces.set(ColumnPropose.DAY_OF_YEAR, new Preface(DayOfYear.FUNCTION_NAME, false, VisageType.COLUMN));
		this.prefaces.set(ColumnPropose.HOUR, new Preface(Hour.FUNCTION_NAME, false, VisageType.COLUMN));
	}

	public getPrefaces(type: string): Map<string, Preface> {
		let prefaces = new Map<string, Preface>();
		this.applyPreface(prefaces, Preface.EXAMPLE);
		if (VisageType.isTemporal(type)) {
			this.applyPreface(prefaces, ColumnPropose.MINIMUM);
			this.applyPreface(prefaces, ColumnPropose.MAXIMUM);
			this.applyPreface(prefaces, ColumnPropose.YEAR);
			this.applyPreface(prefaces, ColumnPropose.MONTH);
			this.applyPreface(prefaces, ColumnPropose.WEEK);
			this.applyPreface(prefaces, ColumnPropose.DAY);
			this.applyPreface(prefaces, ColumnPropose.DAY_OF_WEEK);
			this.applyPreface(prefaces, ColumnPropose.DAY_OF_YEAR);
			this.applyPreface(prefaces, ColumnPropose.HOUR);
		} else if (VisageType.isNumeric(type)) {
			this.applyPreface(prefaces, ColumnPropose.SUM);
			this.applyPreface(prefaces, ColumnPropose.MINIMUM);
			this.applyPreface(prefaces, ColumnPropose.MAXIMUM);
			this.applyPreface(prefaces, ColumnPropose.MEDIAN);
			this.applyPreface(prefaces, ColumnPropose.AVERAGE);
		} else if (VisageType.isCategory(type)) {
			this.applyPreface(prefaces, ColumnPropose.DISTINCT);
		}
		return prefaces;
	}

	private applyPreface(prefaces: Map<string, Preface>, key: string): void {
		let preface = this.prefaces.get(key);
		prefaces.set(key, preface);
	}

	public createCall(name: string, pointer: XPointer): XCall {
		let preface = this.prefaces.get(name);
		return preface.createCall(pointer);
	}

}

let registry = ProposeRegistry.getInstance();
registry.register("column", new ColumnPropose());
