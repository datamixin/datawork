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
import { jsonLeanFactory } from "webface/constants";

import AssignedPlan from "webface/plan/AssignedPlan";
import SpecifiedPlanList from "webface/plan/SpecifiedPlanList";

export default class QualifiedPlan extends AssignedPlan {

    public static LEAN_NAME = "QualifiedPlan";

    private name: string = null
    private label: string = null;
    private qualifiedName: string = null;
    private superClasses: string[] = [];
    private definedAnnotations: string[] = [];
    private implementedInterfaces: string[] = [];
    private parameters = new SpecifiedPlanList();
    private resultType: string = "MixinValue";

    public constructor() {
        super(QualifiedPlan.LEAN_NAME);
    }

    public getName(): string {
        return this.name;
    }

    public getLabel(): string {
        return this.label;
    }

    public getQualifiedName(): string {
        return this.qualifiedName;
    }

    public getSuperClasses(): string[] {
        return this.superClasses;
    }

    public getDefinedAnnotations(): string[] {
        return this.definedAnnotations;
    }

    public getImplementedInterfaces(): string[] {
        return this.implementedInterfaces;
    }

    public getParameters(): SpecifiedPlanList {
        return this.parameters;
    }

    public getResultType(): string {
        return this.resultType;
    }

}

jsonLeanFactory.register(QualifiedPlan.LEAN_NAME, QualifiedPlan);
