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
import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XOutlook from "vegazoo/model/XOutlook";

import OutlookTopbarView from "vegazoo/view/topbar/OutlookTopbarView";

export default class OutlookTopbarController extends EObjectController {

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createView(): OutlookTopbarView {
		return new OutlookTopbarView(this);
	}

	public getView(): OutlookTopbarView {
		return <OutlookTopbarView>super.getView();
	}

	public getModel(): XOutlook {
		return <XOutlook>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let viewlet = model.getViewlet();
		return [viewlet];
	}

}
