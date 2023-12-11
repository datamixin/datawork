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
import Map from "webface/util/Map";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";
import DragParticipantPart from "webface/wef/DragParticipantPart";

import * as view from "padang/view/view";
import ReplaceDropSpaceGuide from "padang/view/ReplaceDropSpaceGuide";

import InputFieldDesignView from "rinjani/view/design/InputFieldDesignView";
import InputMappingDesignView from "rinjani/view/design/InputMappingDesignView";

import SingleMappingDropObjectRequest from "rinjani/requests/design/SingleMappingDropObjectRequest";

export default class SingleMappingDesignView extends InputMappingDesignView implements DragParticipantPart {

	private composite: Composite = null;

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index)
		this.composite.setData(this);
		view.addClass(this.composite, "rinjani-single-mapping-design-view");
		view.setGridLayout(this.composite, 1, 0, 0);
		this.createDropSpacePart(this.composite);
		this.createEmptyDropGuide(this.composite)
	}

	protected createDropSpacePart(parent: Composite): void {
		this.dropSpaceGuide = new ReplaceDropSpaceGuide(parent, this);
	}

	public dropObject(data: Map<any>): void {
		let request = new SingleMappingDropObjectRequest(data);
		this.conductor.submit(request);
	}

	public adjustHeight(): number {
		this.composite.relayout();
		return InputFieldDesignView.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, _index: number): void {
		child.createControl(this.composite, 0);
		view.setGridData(child, true, InputFieldDesignView.HEIGHT);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}