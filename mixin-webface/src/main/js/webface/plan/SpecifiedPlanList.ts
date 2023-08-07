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

import AnyPlan from "webface/plan/AnyPlan";
import TextPlan from "webface/plan/TextPlan";
import AssignedPlan from "webface/plan/AssignedPlan";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import { jsonLeanFactory } from "webface/constants";

/**
 * Daftar plan yang sudah fix dan tidak di ganti
 */
export default class SpecifiedPlanList extends Lean {

    public static LEAN_NAME = "SpecifiedPlanList";

    private plans: SpecifiedPlan[] = [];

    public constructor() {
        super(SpecifiedPlanList.LEAN_NAME);
    }

    public set(indexOrName: number | string, plan: SpecifiedPlan): void {
        if (typeof (indexOrName) === "number") {
            this.plans[<number>indexOrName] = plan;
        } else {
            let name = <string>indexOrName;
            let match = false;
            for (var i = 0; i < this.plans.length; i++) {
                let plan = this.plans[i];
                if (plan.getName() === name) {
                    this.plans[i] = plan;
                    match = true;
                    break;
                }
            }
            if (match === false) {
                this.plans.push(plan);
            }
        }
        return null;
    }

    public get(indexOrName: number | string): SpecifiedPlan {
        if (typeof (indexOrName) === "number") {
            return this.plans[<number>indexOrName];
        } else {
            let name = <string>indexOrName;
            for (var i = 0; i < this.plans.length; i++) {
                let plan = this.plans[i];
                if (plan.getName() === name) {
                    return plan;
                }
            }
        }
        return null;
    }

    public get size(): number {
        return this.plans.length;
    }

    public has(name: string): boolean {
        for (var i = 0; i < this.plans.length; i++) {
            let plan = this.plans[i];
            if (plan.getName() === name) {
                return true;
            }
        }
        return false;
    }

    public get names(): string[] {
        let names: string[] = [];
        for (var i = 0; i < this.plans.length; i++) {
            let plan = this.plans[i];
            let name = plan.getName();
            names.push(name);
        }
        return names;
    }

    public [Symbol.iterator](): Iterator<SpecifiedPlan> {
        return new SpecifiedPlanListIterator(this.plans);
    }

    public add(name: string, label: string, plan: AssignedPlan): SpecifiedPlan {
        let specified = new SpecifiedPlan(name, plan).setLabel(label);
        this.set(name, specified);
        return specified;
    }

    public addPlan(plan: SpecifiedPlan): SpecifiedPlan {
        this.set(name, plan);
        return plan;
    }

    public addType(name: string, label: string, type?: string): AnyPlan {
        let plan = new AnyPlan(type);
        this.add(name, label, plan);
        return plan;
    }

    public addText(name: string, label: string, defaultValue?: string): TextPlan {
        let plan = new TextPlan(defaultValue);
        this.add(name, label, plan);
        return plan;
    }

}

class SpecifiedPlanListIterator implements Iterator<SpecifiedPlan> {

    private index = 0;
    private elements: SpecifiedPlan[] = null;

    constructor(elements: SpecifiedPlan[]) {
        this.elements = elements;
    }

    public next(): IteratorResult<SpecifiedPlan> {
        let done = this.index === this.elements.length;
        return <IteratorResult<SpecifiedPlan>>{
            done: done,
            value: this.elements[this.index++]
        };
    }

}

jsonLeanFactory.register(SpecifiedPlanList.LEAN_NAME, SpecifiedPlanList);
