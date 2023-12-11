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
import Panel from "webface/wef/Panel";

import GridLabelPanel from "padang/grid/GridLabelPanel";
import GridValuePanel from "padang/grid/GridValuePanel";
import GridColumnProperties from "padang/grid/GridColumnProperties";
import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";

export interface GridLabelExtender {

    getCornerSidePanel?(): Panel;

    getMarkerLabelPanel?(): GridLabelPanel;

    getMarkerExtraPanel?(): Panel;

    getColumnLabelPanel?(): GridColumnLabelPanel;

    getColumnExtraPanel?(): Panel;

    getColumnProperties?(): GridColumnProperties;

    getCellValuePanel?(): GridValuePanel;

}

export default GridLabelExtender;