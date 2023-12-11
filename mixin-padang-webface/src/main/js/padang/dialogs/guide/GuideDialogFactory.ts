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
import Conductor from "webface/wef/Conductor";

import ObjectMap from "webface/util/ObjectMap";

import XExpression from "sleman/model/XExpression";

import InteractionPlan from "padang/plan/InteractionPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

export default class GuideDialogFactory {

    private static instance = new GuideDialogFactory();

    private dialogs = new ObjectMap<typeof GuideDialog>();

    constructor() {
        if (GuideDialogFactory.instance) {
            throw new Error("Error: Instantiation failed: Use GuideDialogFactory.getInstance() instead of new");
        }
        GuideDialogFactory.instance = this;
    }

    public static getInstance(): GuideDialogFactory {
        return GuideDialogFactory.instance;
    }

    public register(interactionName: string, dialog: typeof GuideDialog): void {
        this.dialogs.put(interactionName, dialog);
    }

    public isExists(interactionName: string): boolean {
        return this.dialogs.containsKey(interactionName);
    }

    public create(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>): GuideDialog {
        let name = plan.getName();
        let dialogType: any = this.dialogs.get(name);
        let dialog = <GuideDialog>new dialogType(conductor, plan, options);
        return dialog;
    }

}