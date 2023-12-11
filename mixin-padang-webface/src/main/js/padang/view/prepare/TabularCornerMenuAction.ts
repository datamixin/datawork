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
import ViewAction from "padang/view/ViewAction";

import JoinRows from "padang/functions/dataset/JoinRows";
import SortRows from "padang/functions/dataset/SortRows";
import GroupRows from "padang/functions/dataset/GroupRows";
import UnionRows from "padang/functions/dataset/UnionRows";
import PivotRows from "padang/functions/dataset/PivotRows";
import SelectRows from "padang/functions/dataset/SelectRows";
import DistinctRows from "padang/functions/dataset/DistinctRows";
import SelectColumns from "padang/functions/dataset/SelectColumns";
import FirstRowHeader from "padang/functions/dataset/FirstRowHeader";

import TabularMenuAction from "padang/view/prepare/TabularMenuAction";

import InteractionFactory from "padang/interactions/InteractionFactory";

export default class TabularCornerMenuAction extends TabularMenuAction {

	public getActions(): ViewAction[] {
		let actions: ViewAction[] = [];
		let factory = InteractionFactory.getInstance();
		let right = "=null";
		actions.push(
			this.instantAction("First Row Header", FirstRowHeader.getPlan(), factory.createFirstRowHeader()),
			this.dialogAction("Select Columns", SelectColumns.getPlan(), factory.createSelectColumns([])),
			this.dialogAction("Filter Rows", SelectRows.getPlan(), factory.createSelectRows("=foreach true")),
			this.dialogAction("Distinct", DistinctRows.getPlan(), factory.createDistinctRows([])),
			this.dialogAction("Group", GroupRows.getPlan(), factory.createGroupRows([], [])),
			this.dialogAction("Join", JoinRows.getPlan(), factory.createJoinRows([], right, [], JoinRows.TYPE_INNER)),
			this.dialogAction("Sort", SortRows.getPlan(), factory.createSortRows([])),
			this.dialogAction("Union", UnionRows.getPlan(), factory.createUnionRows([])),
			this.dialogAction("Pivot", PivotRows.getPlan(), factory.createPivotRows([], "", "", "")),
		);
		return actions;
	}

}