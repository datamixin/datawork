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
import TaskKey from "bekasi/ui/TaskKey";
import BaseTaskItem from "bekasi/ui/BaseTaskItem";
import WorkspaceSite from "bekasi/ui/WorkspaceSite";
import TaskItemFactory from "bekasi/ui/TaskItemFactory";

import RunstackFile from "bekasi/resources/RunstackFile";

import * as padang from "padang/padang";

import ProjectComposer from "padang/ui/ProjectComposer";
import ProjectTaskContent from "padang/ui/ProjectTaskContent";

import ProjectSaveAction from "padang/actions/ProjectSaveAction";
import ProjectCancelAction from "padang/actions/ProjectCancelAction";
import ProjectRevertAction from "padang/actions/ProjectRevertAction";
import ProjectSaveAsAction from "padang/actions/ProjectSaveAsAction";

import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";

export default class ProjectTaskItem extends BaseTaskItem {

    constructor(key: TaskKey, content: ProjectTaskContent, image: string, site: WorkspaceSite) {
        super(key, content, image, site);
    }

    public isCloseable(): boolean {
        return true;
    }

    public getText(): string {
        let key = this.getKey();
        let file = <RunstackFile>key.getReference()
        let nameOnly = file.getNameOnly();
        if (file.isCommitted()) {
            return nameOnly;
        } else {
            return "*" + nameOnly;
        }
    }

    private getComposer(): ProjectComposer {
        let content = <ProjectTaskContent>this.getContent();
        return content.getComposer();
    }

    public save(callback: () => void): void {

        let composer = this.getComposer();
        let file = composer.getFile();
        let dirty = composer.isDirty();
        if (dirty === true) {

            // Lihat apakah file untitled atau tidak
            if (file.isUntitled() === true) {

                let action = new ProjectSaveAsAction(composer, file);
                action.setPostOK(() => {
                    callback();
                });
                action.setPostCancel(() => {
                    callback();
                });
                action.run();

            } else {

                // Use jadi save maka jalankan save action
                let action = new ProjectSaveAction(composer, file);
                action.setOnSave(() => {
                    callback();
                });
                action.run();

            }
        } else {

            // Tidak perlu save
            callback();
        }
    }

    public close(callback: (confirm: boolean) => void): void {

        let composer = this.getComposer();
        let file = composer.getFile();
        let dirty = composer.isDirty();
        if (dirty === true) {

            // Model sudah dalam keadaan ter-edit
            let dialog = new ConfirmationDialog();
            dialog.setShowNoButton(true);
            dialog.setPrompt("Project is modified, do you want to save?");
            dialog.open((result: string) => {

                let file = composer.getFile();
                if (result === ConfirmationDialog.OK) {

                    // User save maka lihat apakah untitled
                    if (file.isUntitled() === true) {

                        let action = new ProjectSaveAsAction(composer, file);
                        action.setPostOK(() => {
                            callback(true);
                        });
                        action.setPostCancel(() => {
                            callback(false);
                        });
                        action.run();

                    } else {

                        // Use jadi save maka jalankan save action
                        let action = new ProjectSaveAction(composer, file);
                        action.setOnSave(() => {
                            callback(true);
                        });
                        action.run();

                    }

                } else if (result === ConfirmationDialog.NO) {

                    // User tidak jadi maka lihat apakah untitled
                    if (file.isUntitled() === true) {

                        // Model tidak ada di repository maka remove
                        let action = new ProjectCancelAction(composer, file);
                        action.setOnCancel(() => {
                            callback(true);
                        });
                        action.run();

                    } else {

                        // Model ada di repository maka revert
                        let action = new ProjectRevertAction(composer, file);
                        action.setOnRevert(() => {
                            callback(true);
                        });
                        action.run();

                    }

                } else if (result === ConfirmationDialog.CANCEL) {

                    // Tidak jadi close
                    callback(false);
                }

            });

        } else {

            // Model belum dalam keadaan ter-edit
            if (file.isUntitled() === true) {

                // Model adalah untitled
                let action = new ProjectCancelAction(composer, file);
                action.setOnCancel(() => {
                    callback(true);
                });
                action.run();

            } else {

                // Model sudah ada direpository maka langsung close
                callback(true);
            }
        }
    }

}

let factory = TaskItemFactory.getInstance();
factory.register(padang.PROJECT, <any>ProjectTaskItem);