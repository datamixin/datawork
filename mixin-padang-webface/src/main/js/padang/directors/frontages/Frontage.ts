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
import Conductor from "webface/wef/Conductor";

import VisageValue from "bekasi/visage/VisageValue";
import FrontagePanel from "padang/view/present/FrontagePanel";

import ToolsetAction from "padang/view/toolbox/ToolboxAction";

import MultikeyProperties from "padang/util/MultikeyProperties";

export abstract class Frontage {

    public static DEFAULT = "default";

    public static CURRENT_SYMBOL = "_";

    public abstract createPresentPanel(conductor: Conductor, value: VisageValue): FrontagePanel;

    public createToolsetActions(conductor: Conductor, properties: MultikeyProperties): ToolsetAction[] {
        return [];
    }

}

export default Frontage;