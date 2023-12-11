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
import ProjectComposer from "padang/ui/ProjectComposer";

import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";

import ProblemFileReconcile from "bekasi/reconciles/ProblemFileReconcile";

import * as directors from "padang/directors";

export default class ProblemReconcileApplier implements FileReconcileApplier {

    private composer: ProjectComposer = null;

    constructor(composer: ProjectComposer) {
        this.composer = composer;
    }

    public getFileId(): string {
        let file = this.composer.getFile();
        return file.getFileId();
    }

    public apply(reconcile: ProblemFileReconcile): void {
        let director = directors.getProblemCouncilDirector(this.composer);
        let counter = reconcile.getCounter();
        let project = this.composer.getProject();
        director.populate(project, counter);
    }

}