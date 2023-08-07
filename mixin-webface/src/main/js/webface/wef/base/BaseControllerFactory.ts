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
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";

import Controller from "webface/wef/Controller";
import ControllerFactory from "webface/wef/ControllerFactory";

export default class BaseControllerFactory implements ControllerFactory {

    protected controllers: { [typeName: string]: typeof Controller } = {};

    protected register(typeName: string, controllerClass: typeof Controller): void {
        this.controllers[typeName] = controllerClass;
    }

    protected registerList(className: string, feature: EFeature, controllerClass: typeof Controller): void {
        let key = this.asKey(className, feature);
        this.controllers[key] = controllerClass;
    }

    private asKey(className: string, feature: EFeature): string {
        return className + "." + feature.getName();
    }

    public createController(model: any): Controller {

        let controllerClass: any = null;

        if (model instanceof EList) {

            let list = <EList<any>>model;
            let owner = model.eOwner();
            let feature = list.eFeature();

            let eClass = owner.eClass();
            let className = eClass.getName();

            let key = this.asKey(className, feature);
            controllerClass = this.controllers[key] || null;
        }

        if (model instanceof EObject) {

            let eClass = (<EObject>model).eClass();
            let key = eClass.getName();
            controllerClass = this.controllers[key] || null;
        }

        if (controllerClass !== null) {
            let controller = <Controller>new controllerClass();
            controller.setModel(model);
            return controller;
        } else {
            throw new Error("Missing controller for " + model.constructor.name);
        }
    }
}
