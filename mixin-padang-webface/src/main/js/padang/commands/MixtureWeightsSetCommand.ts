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
import Command from "webface/wef/Command";

import XMixture from "padang/model/XMixture";

export default class MixtureWeightsSetCommand extends Command {

    private mixture: XMixture = null;
    private oldWeights: string = null;
    private newWeights: string = null;

    public setMixture(mixture: XMixture): void {
        this.mixture = mixture;
    }

    public setWeights(weights: string): void {
        this.newWeights = weights;
    }

    public execute(): void {
        this.oldWeights = this.mixture.getWeights();
        this.mixture.setWeights(this.newWeights);
    }

    public undo(): void {
        this.mixture.setWeights(this.oldWeights);
    }

    public redo(): void {
        this.mixture.setWeights(this.newWeights);
    }

}