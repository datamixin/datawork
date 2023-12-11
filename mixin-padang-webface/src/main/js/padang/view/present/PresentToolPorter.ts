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

import Event from "webface/widgets/Event";

import Action from "webface/action/Action";

import BootButton from "padang/widgets/BootButton";

import PresentToolManager from "padang/view/present/PresentToolManager";

export default class PresentToolPorter implements PresentToolManager {

    private manager: PresentToolManager;

    public setManager(manager: PresentToolManager): void {
        this.manager = manager;
    }

    public setTypeIcon(icon: string): void {
        this.manager.setTypeIcon(icon);
    }

    public setCaptionPanel(panel: Panel, style: any): void {
        this.manager.setCaptionPanel(panel, style);
    }

    public addBarIcon(action: Action): void {
        this.manager.addBarIcon(action);
    }

    public setPrimaryCallback(text: string, icon: string, callback: (event: Event) => void): BootButton {
        return this.manager.setPrimaryCallback(text, icon, callback);
    }

    public addMenuItem(action: Action): void {
        this.manager.addMenuItem(action);
    }

    public refreshTools(): void {
        this.manager.refreshTools();
    }

    public removeTool(tool: any): void {
        this.manager.removeTool(tool);
    }

}