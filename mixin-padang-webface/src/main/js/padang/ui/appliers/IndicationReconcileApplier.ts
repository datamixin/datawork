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
import FeatureKey from "webface/model/FeatureKey";
import Indication from "webface/model/Indication";
import ListFeatureKey from "webface/model/ListFeatureKey";
import EObjectVisitor from "webface/model/EObjectVisitor";

import * as functions from "webface/wef/functions";

import BasePartViewer from "webface/wef/base/BasePartViewer";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import IndicationReconcile from "bekasi/reconciles/IndicationReconcile";

import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";

import ProjectComposer from "padang/ui/ProjectComposer";

export default class IndicationReconcileApplier implements FileReconcileApplier {

    private composer: ProjectComposer = null;

    constructor(composer: ProjectComposer) {
        this.composer = composer;
    }

    public getFileId(): string {
        let file = this.composer.getFile();
        return file.getFileId();
    }

    public apply(reconcile: IndicationReconcile): void {

        let indication = reconcile.getIndication();
        let modifier = new IndicationVisitor(indication, this.composer);
        modifier.indicate();

    }

}

class IndicationVisitor extends EObjectVisitor {

    private indication: Indication = null;
    private composer: ProjectComposer = null;

    constructor(indication: Indication, composer: ProjectComposer) {
        super();
        this.indication = indication;
        this.composer = composer;
    }

    public indicate(): void {
        let path = this.indication.getPath();
        let keys = path.getKeys();
        let project = this.composer.getProject();
        this.traverse(project, keys, 0);
    }

    protected complete(eObject: EObject, featureKey: FeatureKey, feature: EFeature, value: any): void {
        let object = eObject.eGet(feature);
        if (object instanceof EList) {
            let key = <ListFeatureKey>featureKey;
            let position = key.getPosition();
            object = object.get(position);
        }
        if (object instanceof EObject) {
            this.process(object, this.composer);
        } else {
            throw Error("Expected final visited object to be an EObject");
        }
    }

    private process(eObject: EObject, viewer: BasePartViewer): void {
        let children = viewer.getChildren();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child instanceof BaseControllerViewer) {
                this.invokeIndicate(eObject, child);
            } else if (child instanceof BasePartViewer) {
                this.process(eObject, child);
            }
        }
    }

    private invokeIndicate(model: EObject, child: BaseControllerViewer): void {
        let controller = child.getRootController();
        let contents = controller.getContents();
        if (contents !== null) {
            let target = functions.getFirstDescendantByModel(contents, model);
            if (target !== null) {
                let indicate = "indicate";
                if (target[indicate] !== undefined) {
                    let key = this.indication.getKey();
                    let value = this.indication.getValues();
                    target[indicate](key, value);
                }
            }
        }

    }

}
