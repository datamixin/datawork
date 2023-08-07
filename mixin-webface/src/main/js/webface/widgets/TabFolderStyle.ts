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
import TabItem from "webface/widgets/TabItem";
import Composite from "webface/widgets/Composite";

export interface TabFolderStyle {

    // webface.TOP | webface.BOTTOM
    type: string;

    // webface.LEFT | webface.RIGHT
    align?: string;

    // TabFolder.PRESENT_CLASSIC | TabFolder.PRESENT_SIMPLE
    present?: string;

    itemMenu?: (parent: Composite, item: TabItem) => void;

    lastControl?: (parent: Composite) => void;

    navigationLeftMargin?: number;

    navigationRightMargin?: number;
}

export default TabFolderStyle;