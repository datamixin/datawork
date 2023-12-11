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
import DatasetPreparationRequest from "padang/requests/toolbox/DatasetPreparationRequest";

export default class DatasetPreparationSampleModelRequest extends DatasetPreparationRequest {

	public static REQUEST_NAME = "dataset-preparation-sample-model-select";

	public static FILE_PATH = "filePath";
	public static OPTIONS = "options";

	constructor(source: string, filePath: string, options: string) {
		super(DatasetPreparationSampleModelRequest.REQUEST_NAME, source);
		super.setData(DatasetPreparationSampleModelRequest.FILE_PATH, filePath);
		super.setData(DatasetPreparationSampleModelRequest.OPTIONS, options);
	}

}
