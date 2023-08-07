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
import Plan from "webface/plan/Plan";

export abstract class AssignedPlan extends Plan {

    private assignable: string = null;

    constructor(leanName: string) {
        super(leanName);
    }

    public getAssignable(): string {
        return this.assignable;
    }

    public setAssignable(assignable: string): AssignedPlan {
        this.assignable = assignable;
        return this;
    }

}

export default AssignedPlan;