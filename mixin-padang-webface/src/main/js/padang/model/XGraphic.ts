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
import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import BasicEMap from "webface/model/BasicEMap";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import XVariable from "padang/model/XVariable";

export default class XGraphic extends BasicEObject {

    public static XCLASSNAME: string = model.getEClassName("XGraphic");

    public static FEATURE_RENDERER = new EAttribute("renderer", EAttribute.STRING);
    public static FEATURE_EVALUATES = new EAttribute("evaluates", EAttribute.STRING);
    public static FEATURE_FORMATION = new EAttribute("formation", EAttribute.STRING);
    public static FEATURE_VARIABLES = new EReference("variables", XVariable);

    private renderer: string = null;
    private evaluates: EMap<string> = new BasicEMap<string>(this, XGraphic.FEATURE_EVALUATES);
    private formation: string = null;
    private variables: EList<XVariable> = new BasicEList<XVariable>(this, XGraphic.FEATURE_VARIABLES);

    constructor() {
        super(model.createEClass(XGraphic.XCLASSNAME), [
            XGraphic.FEATURE_RENDERER,
            XGraphic.FEATURE_EVALUATES,
            XGraphic.FEATURE_FORMATION,
            XGraphic.FEATURE_VARIABLES,
        ]);
    }

    public getRenderer(): string {
        return this.renderer;
    }

    public setRenderer(newRenderer: string) {
        let oldRenderer = this.renderer;
        this.renderer = newRenderer;
        this.eSetNotify(XGraphic.FEATURE_RENDERER, oldRenderer, newRenderer);
    }

    public getEvaluates(): EMap<string> {
        return this.evaluates;
    }

    public getFormation(): string {
        return this.formation;
    }

    public setFormation(newFormation: string) {
        let oldFormation = this.formation;
        this.formation = newFormation;
        this.eSetNotify(XGraphic.FEATURE_FORMATION, oldFormation, newFormation);
    }

    public getVariables(): EList<XVariable> {
        return this.variables;
    }

}