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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XBaseDef from "vegazoo/model/XBaseDef";

export default class XSequenceParams extends XBaseDef {

	public static XCLASSNAME: string = model.getEClassName("XSequenceParams");

	public static FEATURE_START = new EAttribute("start", EAttribute.NUMBER);
	public static FEATURE_STOP = new EAttribute("stop", EAttribute.NUMBER);
	public static FEATURE_STEP = new EAttribute("step", EAttribute.NUMBER);
	public static FEATURE_AS = new EAttribute("as", EAttribute.STRING);

	private start: number = null;
	private stop: number = null;
	private step: number = null;
	private as: string = null;

	constructor() {
		super(model.createEClass(XSequenceParams.XCLASSNAME), [
			XSequenceParams.FEATURE_START,
			XSequenceParams.FEATURE_STOP,
			XSequenceParams.FEATURE_STEP,
			XSequenceParams.FEATURE_AS,
		]);
	}

	public getStart(): number {
		return this.start;
	}

	public setStart(newStart: number): void {
		let oldStart = this.start;
		this.start = newStart;
		this.eSetNotify(XSequenceParams.FEATURE_START, oldStart, newStart);
	}

	public getStop(): number {
		return this.stop;
	}

	public setStop(newStop: number): void {
		let oldStop = this.stop;
		this.stop = newStop;
		this.eSetNotify(XSequenceParams.FEATURE_STOP, oldStop, newStop);
	}

	public getStep(): number {
		return this.step;
	}

	public setStep(newStep: number): void {
		let oldStep = this.step;
		this.step = newStep;
		this.eSetNotify(XSequenceParams.FEATURE_STEP, oldStep, newStep);
	}

	public getAs(): string {
		return this.as;
	}

	public setAs(newAs: string): void {
		let oldAs = this.as;
		this.as = newAs;
		this.eSetNotify(XSequenceParams.FEATURE_AS, oldAs, newAs);
	}

}