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
import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import EObjectController from "webface/wef/base/EObjectController";

import XLibrary from "malang/model/XLibrary";
import MalangCreator from "malang/model/MalangCreator";

import LibraryListRequest from "malang/requests/LibraryListRequest";
import LibraryDetailRequest from "malang/requests/LibraryDetailRequest";

import LibraryListHandler from "malang/handlers/LibraryListHandler";
import LibraryDetailHandler from "malang/handlers/LibraryDetailHandler";

import LibraryDesignView from "malang/view/design/LibraryDesignView";

import LibraryNameSetRequest from "malang/requests/design/LibraryNameSetRequest";

export default class LibraryDesignController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(LibraryListRequest.REQUEST_NAME, new LibraryListHandler(this));
		this.installRequestHandler(LibraryDetailRequest.REQUEST_NAME, new LibraryDetailHandler(this));
		this.installRequestHandler(LibraryNameSetRequest.REQUEST_NAME, new LibraryNameSetHandler(this));
	}

	public createView(): LibraryDesignView {
		return new LibraryDesignView(this);
	}

	public getView(): LibraryDesignView {
		return <LibraryDesignView>super.getView();
	}

	public getModel(): XLibrary {
		return <XLibrary>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		view.setName(name);
	}

}

class LibraryNameSetHandler extends BaseHandler {

	public handle(request: LibraryNameSetRequest, _callback: (data?: any) => void): void {
		let name = request.getStringData(LibraryNameSetRequest.NAME);
		let model = <XLibrary>this.controller.getModel();
		if (model.getName() !== name) {
			let creator = MalangCreator.eINSTANCE;
			let algorithm = creator.createLibrary(this.controller, name);
			let command = new ReplaceCommand();
			let model = this.controller.getModel();
			command.setModel(model);
			command.setReplacement(algorithm);
			this.controller.execute(command);
		}
	}

}