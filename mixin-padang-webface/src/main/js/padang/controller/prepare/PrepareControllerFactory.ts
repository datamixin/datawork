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
import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import XTabular from "padang/model/XTabular";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";

import TabularPrepareController from "padang/controller/prepare/TabularPrepareController";
import MutationPrepareController from "padang/controller/prepare/MutationPrepareController";
import PreparationPrepareController from "padang/controller/prepare/PreparationPrepareController";
import MutationListPrepareController from "padang/controller/prepare/MutationListPrepareController";

export default class PrepareControllerFactory extends LeanControllerFactory {

    constructor() {
        super();
        super.register(XTabular.XCLASSNAME, TabularPrepareController);
        super.register(XMutation.XCLASSNAME, MutationPrepareController);
        super.register(XPreparation.XCLASSNAME, PreparationPrepareController);

        super.registerList(XPreparation.XCLASSNAME, XPreparation.FEATURE_MUTATIONS, MutationListPrepareController);

    }

}