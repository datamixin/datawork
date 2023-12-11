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
import Conductor from "webface/wef/Conductor";
import PartViewer from "webface/wef/PartViewer";

import * as bekasi from "bekasi/bekasi";

import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";

import XMutation from "padang/model/XMutation";

import DatasetGuidePanel from "padang/panels/DatasetGuidePanel";

import UploadFileStarter from "padang/directors/UploadFileStarter";

import DatasetProjectHomeMenu from "padang/ui/DatasetProjectHomeMenu";

import UploadFileListRequest from "padang/requests/UploadFileListRequest";

import UploadFileSelectionDialog from "padang/dialogs/UploadFileSelectionDialog";

export default class UploadProjectHomeMenu extends DatasetProjectHomeMenu {

	constructor(viewer: PartViewer) {
		super(viewer);
	}

	public getLabel(): string {
		return DatasetGuidePanel.UPLOAD_LABEL;
	}

	public getIcon(): string {
		return DatasetGuidePanel.UPLOAD_ICON;
	}

	public getDescription(): string {
		return DatasetGuidePanel.UPLOAD_DESCRIPTION;
	}

	protected createMutation(callback: (mutation: XMutation) => void): void {
		let conductor = new UploadProjectHomeMenuConductor();
		let dialog = new UploadFileSelectionDialog(conductor);
		dialog.open((result: string) => {
			if (result === UploadFileSelectionDialog.OK) {
				let filePath = dialog.getFilePath();
				let starter = new UploadFileStarter();
				let mutation = starter.createMutation(filePath);
				callback(mutation);
			}
		});
	}

}

class UploadProjectHomeMenuConductor implements Conductor {

	public submit(_request: UploadFileListRequest, callback: (data: any) => void): void {
		let reader = new UploadFileStarter();
		reader.listFiles(callback);
	}

}

let registry = HomeMenuFactory.getInstance();
registry.register(bekasi.CATEGORY_PROJECTS, <any>UploadProjectHomeMenu);
