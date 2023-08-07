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

import XOption from "padang/model/XOption";

export default class OptoinFormulaSetCommand extends Command {

    private option: XOption = null;
    private oldFormula: string = null;
    private newFormula: string = null;

    public setOption(option: XOption): void {
        this.option = option;
    }

    public setFormula(formula: string): void {
        this.newFormula = formula;
    }

    public execute(): void {
        this.oldFormula = this.option.getFormula();
        this.option.setFormula(this.newFormula);
    }

    public undo(): void {
        this.option.setFormula(this.oldFormula);
    }

    public redo(): void {
        this.option.setFormula(this.newFormula);
    }

}