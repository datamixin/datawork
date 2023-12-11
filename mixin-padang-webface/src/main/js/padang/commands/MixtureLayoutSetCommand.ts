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

import XMixture from "padang/model/XMixture";

export default class MixtureLayoutSetCommand extends Command {

    private mixture: XMixture = null;
    private oldLayout: string = null;
    private newLayout: string = null;

    public setMixture(mixture: XMixture): void {
        this.mixture = mixture;
    }

    public setLayout(layout: string): void {
        this.newLayout = layout;
    }

    public execute(): void {
        this.oldLayout = this.mixture.getLayout();
        this.mixture.setLayout(this.newLayout);
    }

    public undo(): void {
        this.mixture.setLayout(this.oldLayout);
    }

    public redo(): void {
        this.mixture.setLayout(this.newLayout);
    }

}