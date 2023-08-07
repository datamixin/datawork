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
import XPointer from "sleman/model/XPointer";
import XReference from "sleman/model/XReference";

import Creator from "sleman/creator/Creator";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class ReferenceCreator extends Creator {

    public isProduce(expression: XExpression): boolean {
        return expression instanceof XPointer;
    }

    public createDefault(): XReference {
        let modelFactory = SlemanFactory.eINSTANCE;
        let pointer = modelFactory.createXReference("name");
        return pointer;
    }

}
