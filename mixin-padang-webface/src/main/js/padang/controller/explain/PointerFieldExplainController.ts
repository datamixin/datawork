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
import Notification from "webface/model/Notification";

import * as directors from "padang/directors";

import PointerField from "padang/model/PointerField";

import PointerFieldExplainView from "padang/view/explain/PointerFieldExplainView";

import ValueFieldExplainController from "padang/controller/explain/ValueFieldExplainController";

export default class PointerFieldExplainController extends ValueFieldExplainController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): PointerFieldExplainView {
        return new PointerFieldExplainView(this);
    }

    public getModel(): PointerField {
        return <PointerField>super.getModel();
    }

    public getView(): PointerFieldExplainView {
        return <PointerFieldExplainView>super.getView();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshName();
    }

    private refreshName(): void {
        let model = this.getModel();
        let director = directors.getVariableFieldDirector(this);
        let pointer = director.createPointer(model);
        let view = this.getView();
        let literal = pointer.toLiteral();
        view.setLiteral(literal);
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (eventType === Notification.SET) {
            if (feature === PointerField.FEATURE_NAME) {
                this.refreshName();
            }
        }
    }
}
