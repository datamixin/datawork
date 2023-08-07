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
import * as functions from "webface/wef/functions";

import XCall from "sleman/model/XCall";
import XReference from "sleman/model/XReference";

import XTabular from "padang/model/XTabular";
import XPreparation from "padang/model/XPreparation";

import ColumnKeys from "padang/functions/dataset/ColumnKeys";

import Assignable from "padang/directors/assignables/Assignable";
import AssignableRegistry from "padang/directors/assignables/AssignableRegistry";

import ProvisionFactory from "padang/provisions/ProvisionFactory";

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";
import { getProvisionResultDirector } from "padang/directors/ProvisionResultDirector";

import TabularPrepareController from "padang/controller/prepare/TabularPrepareController";

export default class ColumnKeysAssignable extends Assignable {

    public evaluate(context: OptionFormulaContext, call: XCall, assignable: (result: any) => void): boolean {
        let args = call.getArguments();
        let arg = args.get(0);
        let expression = arg.getExpression();
        if (expression instanceof XReference) {
            let name = expression.getName();

            if (name === null) {

                assignable([]);
                return true;

            } else if (name === DatasetFunction.DATASET_PLAN.getName()) {

                let controller = context.getController();
                let preparation = functions.getAncestorByModelClass(controller, XPreparation);
                let tabular = <TabularPrepareController>functions.getFirstDescendantByModelClass(preparation, XTabular);
                let parent = tabular.getParent();
                let index = context.getPreparationIndex();

                let factory = ProvisionFactory.getInstance();
                let provision = factory.createColumnKeys();

                let director = getProvisionResultDirector(controller);
                director.inspectPreparationResultAt(parent, index, provision, assignable);
                return true;
            }
        }
        return false;
    }

}

let registry = AssignableRegistry.getInstance();
registry.register(ColumnKeys.FUNCTION_NAME, new ColumnKeysAssignable());
