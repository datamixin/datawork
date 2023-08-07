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
import EObjectModifier from "webface/model/EObjectModifier";

import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";

import RectificationReconcile from "bekasi/reconciles/RectificationReconcile";

import ProjectComposer from "padang/ui/ProjectComposer";

export default class RectificationReconcileApplier implements FileReconcileApplier {

    private composer: ProjectComposer = null;

    constructor(composer: ProjectComposer) {
        this.composer = composer;
    }

    public getFileId(): string {
        let file = this.composer.getFile();
        return file.getFileId();
    }

    public apply(reconcile: RectificationReconcile): void {
        let project = this.composer.getProject();
        let modification = reconcile.getRectification();
        let modifier = new EObjectModifier(modification);
        modifier.modify(project);
    }

}
