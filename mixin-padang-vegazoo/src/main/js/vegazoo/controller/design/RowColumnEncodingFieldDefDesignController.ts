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
import Notification from "webface/model/Notification";

import VegazooFactory from "vegazoo/model/VegazooFactory";
import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

import FieldDefDesignController from "vegazoo/controller/design/FieldDefDesignController";

import RowColumnEncodingFieldDefDesignView from "vegazoo/view/design/RowColumnEncodingFieldDefDesignView";

export default class RowColumnEncodingFieldDefDesignController extends FieldDefDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): RowColumnEncodingFieldDefDesignView {
		return new RowColumnEncodingFieldDefDesignView(this);
	}

	public getView(): RowColumnEncodingFieldDefDesignView {
		return <RowColumnEncodingFieldDefDesignView>super.getView();
	}

	public getModel(): XRowColumnEncodingFieldDef {
		return <XRowColumnEncodingFieldDef>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public createFieldDef(): XRowColumnEncodingFieldDef {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createRowColumnEncodingFieldDef();
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}

