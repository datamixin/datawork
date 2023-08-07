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
import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import EObjectController from "webface/wef/base/EObjectController";

import XAlgorithm from "malang/model/XAlgorithm";
import MalangCreator from "malang/model/MalangCreator";

import AlgorithmListRequest from "malang/requests/AlgorithmListRequest";
import AlgorithmDetailRequest from "malang/requests/AlgorithmDetailRequest";

import AlgorithmListHandler from "malang/handlers/AlgorithmListHandler";
import AlgorithmDetailHandler from "malang/handlers/AlgorithmDetailHandler";

import AlgorithmDesignView from "malang/view/design/AlgorithmDesignView";

import AlgorithmNameSetRequest from "malang/requests/design/AlgorithmNameSetRequest";

export default class AlgorithmDesignController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(AlgorithmListRequest.REQUEST_NAME, new AlgorithmListHandler(this));
		this.installRequestHandler(AlgorithmDetailRequest.REQUEST_NAME, new AlgorithmDetailHandler(this));
		this.installRequestHandler(AlgorithmNameSetRequest.REQUEST_NAME, new AlgorithmNameSetHandler(this));
	}

	public createView(): AlgorithmDesignView {
		return new AlgorithmDesignView(this);
	}

	public getView(): AlgorithmDesignView {
		return <AlgorithmDesignView>super.getView();
	}

	public getModel(): XAlgorithm {
		return <XAlgorithm>super.getModel();
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

class AlgorithmNameSetHandler extends BaseHandler {

	public handle(request: AlgorithmNameSetRequest, _callback: (data?: any) => void): void {
		let name = request.getStringData(AlgorithmNameSetRequest.NAME);
		let model = <XAlgorithm>this.controller.getModel();
		if (model.getName() !== name) {
			let creator = MalangCreator.eINSTANCE;
			let algorithm = creator.createAlgorithm(this.controller, name);
			let command = new ReplaceCommand();
			let model = this.controller.getModel();
			command.setModel(model);
			command.setReplacement(algorithm);
			this.controller.execute(command);
		}
	}

}