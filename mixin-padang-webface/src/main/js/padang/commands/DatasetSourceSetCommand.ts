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
import Command from "webface/wef/Command";

import XSource from "padang/model/XSource";
import XDataset from "padang/model/XDataset";

export default class DatasetSourceSetCommand extends Command {

    private dataset: XDataset = null;
    private oldSource: XSource = null;
    private newSource: XSource = null;

    public setDataset(dataset: XDataset): void {
        this.dataset = dataset;
    }

    public setSource(source: XSource): void {
        this.newSource = source;
    }

    public execute(): void {
        this.oldSource = this.dataset.getSource();
        this.dataset.setSource(this.newSource);
    }

    public undo(): void {
        this.dataset.setSource(this.oldSource);
    }

    public redo(): void {
        this.dataset.setSource(this.newSource);
    }

}