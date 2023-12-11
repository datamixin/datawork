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
import * as view from "padang/view/view";

import * as findout from "padang/view/findout";
import * as instore from "padang/view/instore";
import * as outline from "padang/view/outline";
import * as toolset from "padang/view/toolset";
import * as toolbox from "padang/view/toolbox";
import * as present from "padang/view/present";
import * as prepare from "padang/view/prepare";
import * as anatomy from "padang/view/anatomy";
import * as explain from "padang/view/explain";
import * as overtop from "padang/view/overtop";

import IconPanel from "padang/view/IconPanel";
import TextPanel from "padang/view/TextPanel";
import NamePanel from "padang/view/NamePanel";
import MenuPanel from "padang/view/MenuPanel";
import LabelPanel from "padang/view/LabelPanel";
import ElementPanel from "padang/view/ElementPanel";
import FormulaPanel from "padang/view/FormulaPanel";
import IconNamePanel from "padang/view/IconNamePanel";
import NameMenuPanel from "padang/view/NameMenuPanel";
import LabelIconPanel from "padang/view/LabelIconPanel";
import IconLabelPanel from "padang/view/IconLabelPanel";
import GuideListPanel from "padang/view/GuideListPanel";
import TabItemListPanel from "padang/view/TabItemListPanel";
import ElementListPanel from "padang/view/ElementListPanel";
import IconNameMenuPanel from "padang/view/IconNameMenuPanel";
import IconLabelMenuPanel from "padang/view/IconLabelMenuPanel";
import IconLabelIconPanel from "padang/view/IconLabelIconPanel";
import UpsideElementPanel from "padang/view/UpsideElementPanel";
import OnsideElementPanel from "padang/view/OnsideElementPanel";

import ViewAction from "padang/view/ViewAction";
import ViewPopupAction from "padang/view/ViewPopupAction";
import * as TypeDecoration from "padang/view/TypeDecoration";

import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import DefaultCornerPanel from "padang/view/DefaultCornerPanel";
import DefaultCellValuePanel from "padang/view/DefaultCellValuePanel";
import DefaultColumnProperties from "padang/view/DefaultColumnProperties";
import DefaultColumnTitlePanel from "padang/view/DefaultColumnTitlePanel";
import DefaultColumnLabelPanel from "padang/view/DefaultColumnLabelPanel";
import DefaultMarkerLabelPanel from "padang/view/DefaultMarkerLabelPanel";

import DropSpacePart from "padang/view/DropSpacePart";
import DropSpaceGuide from "padang/view/DropSpaceGuide";
import DropSpaceScope from "padang/view/DropSpaceScope";

import TableContentProvider from "padang/view/TableContentProvider";
import InsertDropSpaceGuide from "padang/view/InsertDropSpaceGuide";
import InsideDropSpaceGuide from "padang/view/InsideDropSpaceGuide";
import ReplaceDropSpaceGuide from "padang/view/ReplaceDropSpaceGuide";
import DropSpaceCompositeScope from "padang/view/DropSpaceCompositeScope";
import InsertDropSpaceFeedback from "padang/view/InsertDropSpaceFeedback";
import BufferedContentProvider from "padang/view/BufferedContentProvider";

import TabularPart from "padang/view/TabularPart";
import TabularEventAdapter from "padang/view/TabularEventAdapter";

export {

	view,

	findout,
	instore,
	outline,
	toolset,
	toolbox,
	present,
	prepare,
	anatomy,
	explain,
	overtop,

	MenuPanel,
	IconPanel,
	NamePanel,
	TextPanel,
	LabelPanel,
	FormulaPanel,
	ElementPanel,
	NameMenuPanel,
	IconNamePanel,
	LabelIconPanel,
	IconLabelPanel,
	GuideListPanel,
	ElementListPanel,
	TabItemListPanel,
	IconNameMenuPanel,
	IconLabelMenuPanel,
	IconLabelIconPanel,
	UpsideElementPanel,
	OnsideElementPanel,

	ViewAction,
	TypeDecoration,
	ViewPopupAction,

	DefaultColumnLabel,
	DefaultCornerPanel,
	DefaultCellValuePanel,
	DefaultColumnProperties,
	DefaultColumnTitlePanel,
	DefaultColumnLabelPanel,
	DefaultMarkerLabelPanel,

	DropSpacePart,
	DropSpaceGuide,
	DropSpaceScope,
	DropSpaceCompositeScope,

	TableContentProvider,
	InsertDropSpaceGuide,
	InsideDropSpaceGuide,
	ReplaceDropSpaceGuide,
	BufferedContentProvider,
	InsertDropSpaceFeedback,

	TabularPart,
	TabularEventAdapter,

}