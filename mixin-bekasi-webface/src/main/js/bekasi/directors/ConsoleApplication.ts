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
import PartViewer from "webface/wef/PartViewer";

import * as directors from "bekasi/directors";

import RunstackFile from "bekasi/resources/RunstackFile";

export abstract class ConsoleApplication {

	private partViewer: PartViewer = null;

	constructor(partViewer: PartViewer) {
		this.partViewer = partViewer;
	}

	public getPartViewer(): PartViewer {
		return this.partViewer;
	}

	public getFile(fileId: string, callback: (file: RunstackFile, pass: boolean) => void): void {
		let director = directors.getRunstackDirector(this.partViewer);
		director.open(fileId, (file: RunstackFile, pass: boolean) => {
			callback(file, pass);
		});
	}

	public abstract getExtension(): string;

}

export default ConsoleApplication;