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
import VariableField from "padang/model/VariableField";

import VariableFieldExplainView from "padang/view/explain/VariableFieldExplainView";

import ValueFieldExplainController from "padang/controller/explain/ValueFieldExplainController";

export default class VariableFieldExplainController extends ValueFieldExplainController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): VariableFieldExplainView {
        return new VariableFieldExplainView(this);
    }

    public getModel(): VariableField {
        return <VariableField>super.getModel();
    }

    public getView(): VariableFieldExplainView {
        return <VariableFieldExplainView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let variable = model.getVariable();
        return [variable];
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

}
