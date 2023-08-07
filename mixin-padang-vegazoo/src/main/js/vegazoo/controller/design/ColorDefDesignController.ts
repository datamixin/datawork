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
import Notification from "webface/model/Notification";

import VegazooFactory from "vegazoo/model/VegazooFactory";
import XColorDef from "vegazoo/model/XColorDef";

import ColorDefDesignView from "vegazoo/view/design/ColorDefDesignView";

import FieldDefDesignController from "vegazoo/controller/design/FieldDefDesignController";

export default class ColorDefDesignController extends FieldDefDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): ColorDefDesignView {
		return new ColorDefDesignView(this);
	}

	public getView(): ColorDefDesignView {
		return <ColorDefDesignView>super.getView();
	}

	public getModel(): XColorDef {
		return <XColorDef>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public createFieldDef(): XColorDef {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createColorDef();
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}

