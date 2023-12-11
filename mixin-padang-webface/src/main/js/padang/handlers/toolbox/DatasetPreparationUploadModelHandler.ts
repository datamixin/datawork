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
import XMutation from "padang/model/XMutation";

import UploadFileStarter from "padang/directors/UploadFileStarter";

import DatasetPreparationMutationHandler from "padang/handlers/toolbox/DatasetPreparationMutationHandler";

import DatasetPreparationUploadModelRequest from "padang/requests/toolbox/DatasetPreparationUploadModelRequest";

export default class DatasetPreparationUploadModelHandler extends DatasetPreparationMutationHandler {

	protected createMutation(request: DatasetPreparationUploadModelRequest): XMutation {
		let filePath = request.getStringData(DatasetPreparationUploadModelRequest.FILE_PATH);
		let starter = new UploadFileStarter();
		let mutation = starter.createMutation(filePath);
		return mutation;
	}

}
