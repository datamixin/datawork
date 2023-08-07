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
export let LET_AUXILIARY_DIRECTOR = "let-auxiliary-director";

import Controller from "webface/wef/Controller";

export interface LetAuxiliaryDirector {

    augmentFormulaWithField(formula: string, key: string): string;

    enhanceFormulaWithFormula(formula: string, addition: string): string;

}

export function getLetAuxiliaryDirector(controller: Controller): LetAuxiliaryDirector {
    let viewer = controller.getViewer();
    return <LetAuxiliaryDirector>viewer.getDirector(LET_AUXILIARY_DIRECTOR);
}

export default LetAuxiliaryDirector;

