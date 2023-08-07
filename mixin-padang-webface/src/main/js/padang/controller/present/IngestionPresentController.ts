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
import XIngestion from "padang/model/XIngestion";

import IngestionPresentView from "padang/view/present/IngestionPresentView";

import SourcePresentController from "padang/controller/present/SourcePresentController";

export default class IngestionPresentController extends SourcePresentController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): IngestionPresentView {
		return new IngestionPresentView(this);
	}

	public getModel(): XIngestion {
		return <XIngestion>super.getModel();
	}

	public getView(): IngestionPresentView {
		return <IngestionPresentView>super.getView();
	}

}
