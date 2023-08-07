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
import Controller from "webface/wef/Controller";

export function getFirstDescendantByModel(controller: Controller, model: any): Controller {
    return getFirstDescendant(controller, (controller: Controller) => {
        if (controller === null) {
            throw new Error("Cannot find descendant by model from null controller");
        }
        let target = controller.getModel();
        return target === model;
    });
}

export function getFirstDescendantByModelClass(controller: Controller, type: any): Controller {
    return getFirstDescendant(controller, (controller: Controller) => {
        if (controller === null) {
            throw new Error("Cannot find descendant by model class from null controller");
        }
        let target = controller.getModel();
        return target instanceof type;
    });
}

export function getFirstDescendant(controller: Controller, evaluate: (controller: Controller) => boolean): Controller {
    if (evaluate(controller) === true) {
        return controller;
    }
    let children = controller.getChildren();
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let descendant = getFirstDescendant(child, evaluate);
        if (descendant !== null) {
            return descendant;
        }
    }
    return null;
}


export function getAncestorByModel(controller: Controller, model: any): Controller {
    return getAncestor(controller, (target: any) => {
        return target === model;
    });
}

export function getAncestorByModelClass(controller: Controller, type: any): Controller {
    return getAncestor(controller, (target: any) => {
        return target instanceof type;
    });
}

export function getAncestor(controller: Controller, evaluate: (model: any) => boolean): Controller {
    let parent = controller.getParent();
    while (parent !== null) {
        let model = parent.getModel();
        if (evaluate(model) === true) {
            return parent;
        }
        parent = parent.getParent();
    }
    return null;
}

export function getDescendantsByModelClass(controller: Controller, type: any): Controller[] {
    return getDescendants(controller, (target: any) => {
        return target instanceof type;
    });
}

export function getDescendants(controller: Controller, evaluate: (model: any) => boolean): Controller[] {
    let controllers: Controller[] = [];
    discoverDescendants(controller, evaluate, controllers);
    return controllers;
}

export function discoverDescendants(controller: Controller, evaluate: (model: any) => boolean, controllers: Controller[]): void {
    let model = controller.getModel();
    if (evaluate(model) === true) {
        controllers.push(controller);
    } else {
        let children = controller.getChildren();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            discoverDescendants(child, evaluate, controllers);
        }
    }
}