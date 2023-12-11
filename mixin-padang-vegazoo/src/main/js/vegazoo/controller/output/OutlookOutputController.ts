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
import ContentAdapter from "webface/model/ContentAdapter";

import EObjectController from "webface/wef/base/EObjectController";

import XOutlook from "vegazoo/model/XOutlook";

import * as directors from "vegazoo/directors";

import OutlookOutputView from "vegazoo/view/output/OutlookOutputView";

export default class OutlookOutputController extends EObjectController {

	private adapter = new OutlookAdapter(this);

	public createView(): OutlookOutputView {
		return new OutlookOutputView(this);
	}

	public getView(): OutlookOutputView {
		return <OutlookOutputView>super.getView();
	}

	public getModel(): XOutlook {
		return <XOutlook>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let viewlet = model.getViewlet();
		return [viewlet];
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

}

class OutlookAdapter extends ContentAdapter {

	private controller: OutlookOutputController = null;

	constructor(controller: OutlookOutputController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		let director = directors.getOutputPartDirector(this.controller);
		let model = this.controller.getModel();
		director.outlookChanged(model);
	}

}
