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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

export default class ReplaceCommand extends Command {

    private model: EObject;
    private replacement: EObject;

    public setModel(model: EObject): void {
        this.model = model;
    }

    public getModel(): EObject {
        return this.model;
    }

    public setReplacement(replacement: EObject): void {
        this.replacement = replacement;
    }

    public getReplacement(): EObject {
        return this.replacement;
    }

    public execute(): void {
        util.replace(this.model, this.replacement);
    }

    public undo(): void {
        util.replace(this.replacement, this.model);
    }

    public redo(): void {
        util.replace(this.model, this.replacement);
    }

}
