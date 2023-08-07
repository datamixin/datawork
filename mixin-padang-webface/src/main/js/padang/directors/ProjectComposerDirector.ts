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
export let PROJECT_COMPOSER_DIRECTOR = "project-composer-director";

import Lean from "webface/core/Lean";

import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XProject from "padang/model/XProject";

import RunstackFile from "bekasi/resources/RunstackFile";

export interface ProjectComposerDirector {

	getFile(): RunstackFile;

	getFileId(): string;

	getProject(): XProject;

	checkupState(model: EObject, inspect: string, args: any[], callback: (value: any) => void): void;

	inspectValue(model: EObject, inspect: string, args: any[], callback: (value: Lean) => void): void;

	inspectFormats(model: EObject, inspect: string, callback: (extensions: any) => void): void;

	inspectDownload(model: EObject, inspect: string, extension: string, filename: string, callback: () => void): void;

}

export function getProjectComposerDirector(host: Controller | PartViewer): ProjectComposerDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ProjectComposerDirector>viewer.getDirector(PROJECT_COMPOSER_DIRECTOR);
}

export default ProjectComposerDirector;

