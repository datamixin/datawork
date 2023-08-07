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
import Conductor from "webface/wef/Conductor";
import PartViewer from "webface/wef/PartViewer";

import * as bekasi from "bekasi/bekasi";

import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";

import XMutation from "padang/model/XMutation";

import DatasetGuidePanel from "padang/panels/DatasetGuidePanel";

import SampleFileStarter from "padang/directors/SampleFileStarter";

import DatasetProjectHomeMenu from "padang/ui/DatasetProjectHomeMenu";

import SampleFileContentRequest from "padang/requests/SampleFileContentRequest";

import SampleFileSelectionDialog from "padang/dialogs/SampleFileSelectionDialog";

export default class SampleProjectHomeMenu extends DatasetProjectHomeMenu {

	constructor(viewer: PartViewer) {
		super(viewer);
	}

	public getLabel(): string {
		return DatasetGuidePanel.SAMPLE_LABEL;
	}

	public getIcon(): string {
		return DatasetGuidePanel.SAMPLE_ICON;
	}

	public getDescription(): string {
		return DatasetGuidePanel.SAMPLE_DESCRIPTION;
	}

	protected createMutation(callback: (mutation: XMutation) => void): void {
		let conductor = new SampleProjectHomeMenuConductor();
		let dialog = new SampleFileSelectionDialog(conductor);
		dialog.open((result: string) => {
			if (result === SampleFileSelectionDialog.OK) {
				let filePath = dialog.getFilePath();
				let options = dialog.getOptions();
				let starter = new SampleFileStarter();
				let mutation = starter.createMutation(filePath, options);
				callback(mutation);
			}
		});
	}

}

class SampleProjectHomeMenuConductor implements Conductor {

	public submit(request: SampleFileContentRequest, callback: (data: any) => void): void {
		let path = <string>request.getData(SampleFileContentRequest.PATH);
		let reader = new SampleFileStarter();
		reader.readFile(path, callback);
	}

}

let registry = HomeMenuFactory.getInstance();
registry.register(bekasi.CATEGORY_PROJECTS, <any>SampleProjectHomeMenu);
