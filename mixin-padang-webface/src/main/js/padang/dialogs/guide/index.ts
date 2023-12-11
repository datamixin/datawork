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
import * as guide from "padang/dialogs/guide/guide";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import FunctionPanel from "padang/dialogs/guide/FunctionPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import GuideSupport from "padang/dialogs/guide/GuideSupport";
import NameListSupport from "padang/dialogs/guide/NameListSupport";

import ValueTextPanel from "padang/dialogs/guide/ValueTextPanel";
import ValueNumberPanel from "padang/dialogs/guide/ValueNumberPanel";
import ValueLogicalPanel from "padang/dialogs/guide/ValueLogicalPanel";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import ItemListComboPanel from "padang/dialogs/guide/ItemListComboPanel";
import FormulaEditorPanel from "padang/dialogs/guide/FormulaEditorPanel";
import ForeachEditorPanel from "padang/dialogs/guide/ForeachEditorPanel";
import TextListViewerPanel from "padang/dialogs/guide/TextListViewerPanel";
import PointerLiteralPanel from "padang/dialogs/guide/PointerLiteralPanel";
import CheckLabelTextPanel from "padang/dialogs/guide/CheckLabelTextPanel";
import ValueNumberListPanel from "padang/dialogs/guide/ValueNumberListPanel";
import CheckLabelValuePanel from "padang/dialogs/guide/CheckLabelValuePanel";
import NameElementListPanel from "padang/dialogs/guide/NameElementListPanel";
import CheckLabelNumberPanel from "padang/dialogs/guide/CheckLabelNumberPanel";
import CheckLabelLogicalPanel from "padang/dialogs/guide/CheckLabelLogicalPanel";
import LabelNameListComboPanel from "padang/dialogs/guide/LabelNameListComboPanel";
import LabelItemListComboPanel from "padang/dialogs/guide/LabelItemListComboPanel";
import LabelFormulaEditorPanel from "padang/dialogs/guide/LabelFormulaEditorPanel";
import NameListCheckViewerPanel from "padang/dialogs/guide/NameListCheckViewerPanel";
import LabelNameElementListPanel from "padang/dialogs/guide/LabelNameElementListPanel";

import JoinRowsDialog from "padang/dialogs/guide/JoinRowsDialog";
import SortRowsDialog from "padang/dialogs/guide/SortRowsDialog";
import GroupRowsDialog from "padang/dialogs/guide/GroupRowsDialog";
import UnionRowsDialog from "padang/dialogs/guide/UnionRowsDialog";
import PivotRowsDialog from "padang/dialogs/guide/PivotRowsDialog";
import UniqueRowsDialog from "padang/dialogs/guide/UniqueRowsDialog";
import SelectRowsDialog from "padang/dialogs/guide/SelectRowsDialog";
import DistinctRowsDialog from "padang/dialogs/guide/DistinctRowsDialog";

import ExpandListDialog from "padang/dialogs/guide/ExpandListDialog";
import ExpandTableDialog from "padang/dialogs/guide/ExpandTableDialog";
import ExpandObjectDialog from "padang/dialogs/guide/ExpandObjectDialog";

import ToDatetimeDialog from "padang/dialogs/guide/ToDatetimeDialog";
import FromDatasetDialog from "padang/dialogs/guide/FromDatasetDialog";
import ChangeTypesDialog from "padang/dialogs/guide/ChangeTypesDialog";
import SplitColumnDialog from "padang/dialogs/guide/SplitColumnDialog";
import ReplaceValueDialog from "padang/dialogs/guide/ReplaceValueDialog";
import TransformColumnDialog from "padang/dialogs/guide/TransformColumnDialog";

import AddColumnDialog from "padang/dialogs/guide/AddColumnDialog";
import SelectColumnsDialog from "padang/dialogs/guide/SelectColumnsDialog";
import RenameColumnsDialog from "padang/dialogs/guide/RenameColumnsDialog";
import RemoveColumnsDialog from "padang/dialogs/guide/RemoveColumnsDialog";
import EncodeColumnDialog from "padang/dialogs/guide/EncodeColumnDialog";

export {

	guide,

	GuideDialog,
	FunctionPanel,
	GuideDialogFactory,

	ValueTextPanel,
	ValueNumberPanel,
	ValueLogicalPanel,
	NameListComboPanel,
	ItemListComboPanel,
	ForeachEditorPanel,
	FormulaEditorPanel,
	TextListViewerPanel,
	PointerLiteralPanel,
	CheckLabelTextPanel,
	CheckLabelValuePanel,
	ValueNumberListPanel,
	NameElementListPanel,
	CheckLabelNumberPanel,
	CheckLabelLogicalPanel,
	LabelNameListComboPanel,
	LabelItemListComboPanel,
	LabelFormulaEditorPanel,
	NameListCheckViewerPanel,
	LabelNameElementListPanel,

	JoinRowsDialog,
	SortRowsDialog,
	GroupRowsDialog,
	UnionRowsDialog,
	PivotRowsDialog,
	UniqueRowsDialog,
	SelectRowsDialog,
	DistinctRowsDialog,

	ExpandListDialog,
	ExpandTableDialog,
	ExpandObjectDialog,

	ToDatetimeDialog,
	FromDatasetDialog,
	ChangeTypesDialog,
	SplitColumnDialog,
	ReplaceValueDialog,
	TransformColumnDialog,

	AddColumnDialog,
	SelectColumnsDialog,
	RenameColumnsDialog,
	RemoveColumnsDialog,
	EncodeColumnDialog,

	GuideSupport,
	NameListSupport,

}