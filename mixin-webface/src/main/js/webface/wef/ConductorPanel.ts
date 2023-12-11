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
import Conductor from "webface/wef/Conductor";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

export abstract class ConductorPanel implements Panel {

    protected conductor: Conductor = null;

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public abstract createControl(parent: Composite, index?: number): void;

    public abstract getControl(): Control;

}

export default ConductorPanel;