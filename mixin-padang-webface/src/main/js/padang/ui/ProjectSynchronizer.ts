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
import EObject from "webface/model/EObject";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import Modification from "webface/model/Modification";
import BaseModelSynchronizer from "webface/model/BaseModelSynchronizer";

import * as bekasi from "bekasi/directors";

import RunstackDirector from "bekasi/directors/RunstackDirector";
import ProjectComposerDirector from "padang/directors/ProjectComposerDirector";

import * as directors from "padang/directors";

export default class ProjectSynchronizer extends BaseModelSynchronizer {

    private partViewer: BasePartViewer = null;
    private submitCallback = () => { };

    constructor(partViewer: BasePartViewer, model: EObject, submitCallback: () => void) {
        super(model);
        this.partViewer = partViewer;
        this.submitCallback = submitCallback;
    }

    private getFileId(): string {
        let key = directors.PROJECT_COMPOSER_DIRECTOR;
        let director = <ProjectComposerDirector>this.partViewer.getDirector(key);
        let file = director.getFile();
        let fileId = file.getFileId();
        return fileId;
    }

    public submit(modification: Modification, callback: () => void): void {
        let fileId = this.getFileId();
        let key = bekasi.RUNSTACK_DIRECTOR;
        let director = <RunstackDirector>this.partViewer.getDirector(key);
        director.postModification(fileId, modification, () => {
            callback();
            this.submitCallback();
        });
    }

}
