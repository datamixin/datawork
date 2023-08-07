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
import StarterGuidePanel from "padang/panels/StarterGuidePanel";

import DatasetPreparationUploadSelectRequest from "padang/requests/DatasetPreparationUploadSelectRequest";
import DatasetPreparationSampleSelectRequest from "padang/requests/DatasetPreparationSampleSelectRequest";
import DatasetPreparationStarterSelectRequest from "padang/requests/DatasetPreparationStarterSelectRequest";

export default class DatasetGuidePanel extends StarterGuidePanel {

	public onStarter(name: string): void {
		let request = new DatasetPreparationStarterSelectRequest(name);
		this.conductor.submit(request);
	}

	public onSample(filePath: string, options: string): void {
		let request = new DatasetPreparationSampleSelectRequest(filePath, options);
		this.conductor.submit(request);
	}

	public onUpload(filePath: string): void {
		let request = new DatasetPreparationUploadSelectRequest(filePath);
		this.conductor.submit(request);
	}

}
