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
import Controller from "webface/wef/Controller";
import CommandStack from "webface/wef/CommandStack";
import ControllerViewer from "webface/wef/ControllerViewer";

export default class EditDomainMarker {

    private commandStack: CommandStack = null;

    constructor(target: Controller | ControllerViewer) {
        let viewer: ControllerViewer = null;
        if (target instanceof Controller) {
            viewer = target.getViewer();
        } else {
            viewer = <ControllerViewer>target;
        }
        let rootViewer = viewer.getRootViewer();
        let editDomain = rootViewer.getEditDomain();
        this.commandStack = editDomain.getCommandStack();
        this.commandStack.mark();
    }

    public reset(callback?: () => void): void {
        this.commandStack.reset(callback);
    }

}