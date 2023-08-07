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
import JoinRowsInteraction from "padang/interactions/JoinRowsInteraction";
import SortRowsInteraction from "padang/interactions/SortRowsInteraction";
import GroupRowsInteraction from "padang/interactions/GroupRowsInteraction";
import UnionRowsInteraction from "padang/interactions/UnionRowsInteraction";
import PivotRowsInteraction from "padang/interactions/PivotRowsInteraction";
import SelectRowsInteraction from "padang/interactions/SelectRowsInteraction";
import DistinctRowsInteraction from "padang/interactions/DistinctRowsInteraction";

import FirstRowHeaderInteraction from "padang/interactions/FirstRowHeaderInteraction";

import ToDatetimeInteraction from "padang/interactions/ToDatetimeInteraction";
import ChangeTypesInteraction from "padang/interactions/ChangeTypesInteraction";
import SplitColumnInteraction from "padang/interactions/SplitColumnInteraction";
import ReplaceValueInteraction from "padang/interactions/ReplaceValueInteraction";
import TransformColumnInteraction from "padang/interactions/TransformColumnInteraction";

import AddColumnInteraction from "padang/interactions/AddColumnInteraction";
import SelectColumnsInteraction from "padang/interactions/SelectColumnsInteraction";
import RemoveColumnsInteraction from "padang/interactions/RemoveColumnsInteraction";
import RenameColumnsInteraction from "padang/interactions/RenameColumnsInteraction";
import EncodeColumnInteraction from "padang/interactions/EncodeColumnInteraction";

import ExpandListInteraction from "padang/interactions/ExpandListInteraction";
import ExpandTableInteraction from "padang/interactions/ExpandTableInteraction";
import ExpandObjectInteraction from "padang/interactions/ExpandObjectInteraction";

export default class InteractionFactory {

	private static instance = new InteractionFactory();

	constructor() {
		if (InteractionFactory.instance) {
			throw new Error("Error: Instantiation failed: Use InteractionFactory.getInstance() instead of new");
		}
		InteractionFactory.instance = this;
	}

	public static getInstance(): InteractionFactory {
		return InteractionFactory.instance;
	}

	public createJoinRows(leftKeys: string[], rightDataset: string, rightKeys: string[], type: string): JoinRowsInteraction {
		return new JoinRowsInteraction(leftKeys, rightDataset, rightKeys, type);
	}

	public createGroupRows(keys: string[], values: any[]): GroupRowsInteraction {
		return new GroupRowsInteraction(keys, values);
	}

	public createDistinctRows(keys: string[]): DistinctRowsInteraction {
		return new DistinctRowsInteraction(keys);
	}

	public createSortRows(orders: string[]): SortRowsInteraction {
		return new SortRowsInteraction(orders);
	}

	public createUnionRows(others: string[]): UnionRowsInteraction {
		return new UnionRowsInteraction(others);
	}

	public createSelectRows(condition: string): SelectRowsInteraction {
		return new SelectRowsInteraction(condition);
	}

	public createSelectColumns(keys: string[]): SelectColumnsInteraction {
		return new SelectColumnsInteraction(keys);
	}

	public createRemoveColumns(keys: string[]): RemoveColumnsInteraction {
		return new RemoveColumnsInteraction(keys);
	}

	public createRenameColumns(nameMap: { [oldName: string]: string }): RenameColumnsInteraction {
		return new RenameColumnsInteraction(nameMap);
	}

	public createEncodeColumn(column: string, encoder: string): EncodeColumnInteraction {
		return new EncodeColumnInteraction(column, encoder);
	}

	public createToDatetime(column: string, format: string): ToDatetimeInteraction {
		return new ToDatetimeInteraction(column, format);
	}

	public createReplaceValue(column: string, target: string, replacement: string): ReplaceValueInteraction {
		return new ReplaceValueInteraction(column, target, replacement);
	}

	public createPivotRows(rows: string[], columns: string, values: string, aggregate: string): PivotRowsInteraction {
		return new PivotRowsInteraction(rows, columns, values, aggregate);
	}

	public createFirstRowHeader(): FirstRowHeaderInteraction {
		return new FirstRowHeaderInteraction();
	}

	public createTransformColumn(column: string, transformation: string): TransformColumnInteraction {
		return new TransformColumnInteraction(column, transformation);
	}

	public createChangeTypes(typeMap: { [column: string]: string }): ChangeTypesInteraction {
		return new ChangeTypesInteraction(typeMap);
	}

	public createSplitColumn(column: string, splitter: any): SplitColumnInteraction {
		return new SplitColumnInteraction(column, splitter);
	}

	public createAddColumn(name: string, expression: string): AddColumnInteraction {
		return new AddColumnInteraction(name, expression);
	}

	public createExpandList(column: string): ExpandListInteraction {
		return new ExpandListInteraction(column);
	}

	public createExpandTable(column: string, includes: string[]): ExpandTableInteraction {
		return new ExpandTableInteraction(column, includes);
	}

	public createExpandObject(column: string, includes: string[]): ExpandObjectInteraction {
		return new ExpandObjectInteraction(column, includes);
	}

}
