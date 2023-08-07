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
import Lean from "webface/core/Lean";

import Controller from "webface/wef/Controller";

import BaseControllerFactory from "webface/wef/base/BaseControllerFactory";

export abstract class LeanControllerFactory extends BaseControllerFactory {

    public createController(model: any): Controller {

        var controllerClass: any = null;

        if (model instanceof Lean) {
            let feature = <Lean>model;
            let key = feature.xLeanName();
            controllerClass = this.controllers[key] || null;
        }

        if (controllerClass !== null) {
            var controller = <Controller>new controllerClass();
            controller.setModel(model);
            return controller;
        }

        return super.createController(model);
    }

}

export default LeanControllerFactory;