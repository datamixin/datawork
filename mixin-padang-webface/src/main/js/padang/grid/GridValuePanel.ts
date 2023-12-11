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

export interface GridValuePanel extends Panel {

    setValue(rowPos: any, columnPos: number, value?: any): void;

    setOnPreEdit?(callback: () => void): void;

    setOnPostCommit?(callback: () => void): void;

    setSelected?(selected: boolean): void;

    delayValue(): void;

    setProperty?(name: string, value: any): void;

    setEditMode?(edit: boolean, position: number | boolean, value?: string): void;

    commit?(): void;

}

export default GridValuePanel;
