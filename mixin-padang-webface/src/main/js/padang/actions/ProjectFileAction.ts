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
import Action from "webface/action/Action";

import * as bekasi from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

import ProgressQueueEntry from "bekasi/directors/ProgressQueueEntry";

export abstract class ProjectFileAction extends Action {

	protected host: any = null;
	protected file: RunstackFile = null;

	constructor(host: any, file: RunstackFile) {
		super();
		this.host = host;
		this.file = file;
	}

	protected createQueueEntry(title: string): ProgressQueueEntry {
		let director = bekasi.getProgressQueueDirector(this.host);
		return director.createQueueEntry(title);
	}

}

export default ProjectFileAction;