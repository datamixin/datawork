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
import Map from "webface/util/Map";

import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";
import DragParticipantPart from "webface/wef/DragParticipantPart";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import DropSpaceGuide from "padang/view/DropSpaceGuide";

import InputFeatureDesignView from "malang/view/design/InputFeatureDesignView";

export abstract class InputAssignmentDesignView extends ConductorView implements DragParticipantPart {

	protected emptyDropGuide = new LabelPanel(5);
	protected dropSpaceGuide: DropSpaceGuide = null;

	protected abstract createDropSpacePart(parent: Composite): void;

	protected createEmptyDropGuide(parent: Composite): void {
		this.emptyDropGuide.createControl(parent);
		this.emptyDropGuide.setText("Drop a column here!");
		this.emptyDropGuide.setTextColor("#CCC");
		this.emptyDropGuide.setFontStyle("italic");
		this.emptyDropGuide.setLineHeight(InputFeatureDesignView.HEIGHT - 2);
		view.css(this.emptyDropGuide, "background-color", "#FFF");
		view.setGridData(this.emptyDropGuide, true, InputFeatureDesignView.HEIGHT);
	}

	public dragStart(accept: boolean): void {
		this.dropSpaceGuide.dragStart(accept);
	}

	public isInRange(x: number, y: number): boolean {
		return this.dropSpaceGuide.isInRange(x, y);
	}

	public showFeedback(data: Map<any>, x: number, y: number): void {
		return this.dropSpaceGuide.showFeedback(data, x, y);
	}

	public clearFeedback(data: Map<any>): void {
		this.dropSpaceGuide.clearFeedback(data);
	}

	public dragStop(): void {
		this.dropSpaceGuide.dragStop();
	}


}

export default InputAssignmentDesignView;