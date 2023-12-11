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
import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

import ReadCsvInstruction from "padang/directors/instructions/ReadCsvInstruction";
import ParseXmlInstruction from "padang/directors/instructions/ParseXmlInstruction";
import DataFormInstruction from "padang/directors/instructions/DataFormInstruction";
import ReadLinesInstruction from "padang/directors/instructions/ReadLinesInstruction";
import ReadExcelInstruction from "padang/directors/instructions/ReadExcelInstruction";
import FromDatasetInstruction from "padang/directors/instructions/FromDatasetInstruction";
import CreateDatasetInstruction from "padang/directors/instructions/CreateDatasetInstruction";
import ImportDatabaseInstruction from "padang/directors/instructions/ImportDatabaseInstruction";

import JoinRowsInstruction from "padang/directors/instructions/JoinRowsInstruction";
import SortRowsInstruction from "padang/directors/instructions/SortRowsInstruction";
import GroupRowsInstruction from "padang/directors/instructions/GroupRowsInstruction";
import PivotRowsInstruction from "padang/directors/instructions/PivotRowsInstruction";
import UnionRowsInstruction from "padang/directors/instructions/UnionRowsInstruction";
import SelectRowsInstruction from "padang/directors/instructions/SelectRowsInstruction";
import DistinctRowsInstruction from "padang/directors/instructions/DistinctRowsInstruction";

import FirstRowHeaderInstruction from "padang/directors/instructions/FirstRowHeaderInstruction";

import ExpandListInstruction from "padang/directors/instructions/ExpandListInstruction";
import ExpandTableInstruction from "padang/directors/instructions/ExpandTableInstruction";
import ExpandObjectInstruction from "padang/directors/instructions/ExpandObjectInstruction";

import ToDatetimeInstruction from "padang/directors/instructions/ToDatetimeInstruction";
import ChangeTypesInstruction from "padang/directors/instructions/ChangeTypesInstruction";
import SplitColumnInstruction from "padang/directors/instructions/SplitColumnInstruction";
import ReplaceValueInstruction from "padang/directors/instructions/ReplaceValueInstruction";
import TransformColumnInstruction from "padang/directors/instructions/TransformColumnInstruction";

import AddColumnInstruction from "padang/directors/instructions/AddColumnInstruction";
import EncodeColumnInstruction from "padang/directors/instructions/EncodeColumnInstruction";
import SelectColumnsInstruction from "padang/directors/instructions/SelectColumnsInstruction";
import RenameColumnsInstruction from "padang/directors/instructions/RenameColumnsInstruction";
import RemoveColumnsInstruction from "padang/directors/instructions/RemoveColumnsInstruction";

export {

	Instruction,
	InstructionRegistry,

	ReadCsvInstruction,
	ParseXmlInstruction,
	DataFormInstruction,
	ReadExcelInstruction,
	ReadLinesInstruction,
	FromDatasetInstruction,
	CreateDatasetInstruction,
	ImportDatabaseInstruction,

	JoinRowsInstruction,
	SortRowsInstruction,
	GroupRowsInstruction,
	UnionRowsInstruction,
	PivotRowsInstruction,
	SelectRowsInstruction,
	DistinctRowsInstruction,

	FirstRowHeaderInstruction,

	ExpandListInstruction,
	ExpandTableInstruction,
	ExpandObjectInstruction,

	ToDatetimeInstruction,
	SplitColumnInstruction,
	ChangeTypesInstruction,
	ReplaceValueInstruction,
	TransformColumnInstruction,

	AddColumnInstruction,
	SelectColumnsInstruction,
	RenameColumnsInstruction,
	RemoveColumnsInstruction,
	EncodeColumnInstruction,

}