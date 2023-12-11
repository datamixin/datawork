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
import Action from "webface/action/Action";

import VisageType from "bekasi/visage/VisageType";

import Trim from "padang/functions/text/Trim";
import Length from "padang/functions/text/Length";
import ToLowercase from "padang/functions/text/ToLowercase";
import ToUppercase from "padang/functions/text/ToUppercase";

import Day from "padang/functions/datetime/Day";
import Date from "padang/functions/datetime/Date";
import Year from "padang/functions/datetime/Year";
import Month from "padang/functions/datetime/Month";
import DayOfWeek from "padang/functions/datetime/DayOfWeek";
import DayOfYear from "padang/functions/datetime/DayOfYear";

import AddColumn from "padang/functions/dataset/AddColumn";
import SelectRows from "padang/functions/dataset/SelectRows";
import SplitColumn from "padang/functions/dataset/SplitColumn";
import EncodeColumn from "padang/functions/dataset/EncodeColumn";
import ReplaceValue from "padang/functions/dataset/ReplaceValue";
import RemoveColumns from "padang/functions/dataset/RemoveColumns";

import ExpandList from "padang/functions/dataset/ExpandList";
import ExpandTable from "padang/functions/dataset/ExpandTable";
import ExpandObject from "padang/functions/dataset/ExpandObject";

import LabelEncoder from "padang/functions/encoder/LabelEncoder";

import IsNull from "padang/functions/logical/IsNull";
import IsError from "padang/functions/logical/IsError";

import SplitByDelimiter from "padang/functions/splitter/SplitByDelimiter";

import TabularMenuAction from "padang/view/prepare/TabularMenuAction";

import InteractionFactory from "padang/interactions/InteractionFactory";

export default class TabularColumnMenuAction extends TabularMenuAction {

	private name: string = null;
	private type: string = null;

	public setName(name: string) {
		this.name = name;
	}

	public setType(type: string) {
		this.type = type;
	}

	public getActions(): Action[] {

		let actions: Action[] = [];
		let factory = InteractionFactory.getInstance();

		// Column actions
		actions.push(
			this.instantAction("Remove Nulls", SelectRows.getPlan(), factory.createSelectRows("=foreach Not(" + IsNull.FUNCTION_NAME + "($" + this.name + "))")),
			this.instantAction("Remove Errors", SelectRows.getPlan(), factory.createSelectRows("=foreach Not(" + IsError.FUNCTION_NAME + "($" + this.name + "))")),
			this.dialogAction("Add Column", AddColumn.getPlan(), factory.createAddColumn("Column", "=foreach 0")),
			this.instantAction("Remove Column", RemoveColumns.getPlan(), factory.createRemoveColumns([this.name])),
		);

		// Text actions
		if (VisageType.isCategory(this.type)) {
			actions.push(
				this.cascadeAction("Filter", [
					this.dialogAction("Equals", "mdi-equal", factory.createSelectRows("=foreach $" + this.name + " == ''")),
					this.dialogAction("Contains", "mdi-contain", factory.createSelectRows("=foreach Contains($" + this.name + ", '')")),
					this.dialogAction("Starts With", "mdi-contain-start", factory.createSelectRows("=foreach StartsWith($" + this.name + ", '')")),
					this.dialogAction("Ends With", "mdi-contain-end", factory.createSelectRows("=foreach EndsWith($" + this.name + ", '')")),
				], "mdi-filter-outline"),
				this.dialogAction("Split", SplitColumn.getPlan(), factory.createSplitColumn(this.name, "=" + SplitByDelimiter.FUNCTION_NAME + "(' ', false, -1)")),
				this.dialogAction("Replace Values", ReplaceValue.getPlan(), factory.createReplaceValue(this.name, "", "")),
				this.cascadeAction("Transform", [
					this.instantAction("Trim", Trim.getPlan(), factory.createTransformColumn(this.name, "=" + Trim.FUNCTION_NAME)),
					this.instantAction("Length", Length.getPlan(), factory.createTransformColumn(this.name, "=" + Length.FUNCTION_NAME)),
					this.instantAction("To Lowercase", ToLowercase.getPlan(), factory.createTransformColumn(this.name, "=" + ToLowercase.FUNCTION_NAME)),
					this.instantAction("To Uppercase", ToUppercase.getPlan(), factory.createTransformColumn(this.name, "=" + ToUppercase.FUNCTION_NAME)),
				], "mdi-transfer-right"),
				this.dialogAction("Encode", EncodeColumn.getPlan(), factory.createEncodeColumn(this.name, "=" + LabelEncoder.FUNCTION_NAME + "()")),
			);
		}

		// Datetime actions
		if (VisageType.isDatetime(this.type)) {
			actions.push(
				this.dialogAction("Replace Values", ReplaceValue.getPlan(), factory.createReplaceValue(this.name, "", "")),
				this.cascadeAction("Transform", [
					this.instantAction("Date", Date.getPlan(), factory.createTransformColumn(this.name, "=" + Date.FUNCTION_NAME)),
					this.instantAction("Year", Year.getPlan(), factory.createTransformColumn(this.name, "=" + Year.FUNCTION_NAME)),
					this.instantAction("Month", Month.getPlan(), factory.createTransformColumn(this.name, "=" + Month.FUNCTION_NAME)),
					this.instantAction("Day", Day.getPlan(), factory.createTransformColumn(this.name, "=" + Day.FUNCTION_NAME)),
					this.instantAction("Day of Week", DayOfWeek.getPlan(), factory.createTransformColumn(this.name, "=" + DayOfWeek.FUNCTION_NAME)),
					this.instantAction("Day of Year", DayOfYear.getPlan(), factory.createTransformColumn(this.name, "=" + DayOfYear.FUNCTION_NAME)),
				], "mdi-transfer-right"),
			);
		}

		// List actions
		if (VisageType.isList(this.type)) {
			actions.push(
				this.instantAction("Expand List", ExpandList.getPlan(), factory.createExpandList(this.name)),
			);
		}

		// Table actions
		if (VisageType.isTable(this.type)) {
			actions.push(
				this.dialogAction("Expand Table", ExpandTable.getPlan(), factory.createExpandTable(this.name, [])),
			);
		}

		// Object actions
		if (VisageType.isObject(this.type)) {
			actions.push(
				this.dialogAction("Expand Object", ExpandObject.getPlan(), factory.createExpandObject(this.name, [])),
			);
		}

		return actions;
	}

}