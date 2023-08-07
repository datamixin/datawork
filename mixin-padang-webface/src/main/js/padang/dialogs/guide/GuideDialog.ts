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
import Conductor from "webface/wef/Conductor";

import EObject from "webface/model/EObject";
import Adapter from "webface/model/Adapter";
import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XCall from "sleman/model/XCall";
import XObject from "sleman/model/XObject";
import XNumber from "sleman/model/XNumber";
import XLogical from "sleman/model/XLogical";
import XPointer from "sleman/model/XPointer";
import XForeach from "sleman/model/XForeach";
import XExpression from "sleman/model/XExpression";

import ParameterPlan from "padang/plan/ParameterPlan";
import InteractionPlan from "padang/plan/InteractionPlan";

/**
 * Guide Dialog dibuat untuk:<br>
 *  1. Memberikan interaksi yang lebih mudah kepada user karena input-nya yang kompleks.
 *  1. Isolasi formula karena konsekuensi evaluasi group yang berat dan lama.
 */
export abstract class GuideDialog extends TitleAreaDialog {

	protected conductor: Conductor = null;
	protected plan: InteractionPlan = null;
	protected options = new Map<string, XExpression>();

	constructor(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>) {
		super();
		this.conductor = conductor;
		this.plan = plan;
		this.options = options;
		this.prepareTitle();
	}

	private prepareTitle(): void {
		let label = this.plan.getLabel();
		let description = this.plan.getDescription();
		this.setWindowTitle("Instruction Guide Dialog");
		this.setTitle(label);
		this.setMessage(description);
	}

	public getConductor(): Conductor {
		return this.conductor;
	}

	private getPlanName(plan: string | ParameterPlan): string {
		if (plan instanceof ParameterPlan) {
			return plan.getName();
		} else {
			return plan;
		}
	}

	public hasOption(plan: string | ParameterPlan): boolean {
		let name = this.getPlanName(plan);
		return this.options.has(name);
	}

	public setOption(plan: string | ParameterPlan, value: any): void {
		let name = this.getPlanName(plan);
		this.options.set(name, value);
	}

	public getOption(plan: string | ParameterPlan, adapted?: boolean): XPointer {
		let name = this.getPlanName(plan);
		let model = this.options.get(name) || null;
		if (model !== null) {
			if (adapted === undefined || adapted === true) {
				this.addContentAdapter(model);
			}
		}
		return model;
	}

	public getPointer(plan: string | ParameterPlan, adapted?: boolean): XPointer {
		return <XPointer>this.getOption(plan, adapted);
	}

	public deleteOption(name: string): void {
		this.options.delete(name);
	}

	public getObject(plan: ParameterPlan, adapted?: boolean): XObject {
		return <XObject>this.getOption(plan, adapted);
	}

	public getList(plan: ParameterPlan, adapted?: boolean): XList {
		return <XList>this.getOption(plan, adapted);
	}

	public getForeach(plan: ParameterPlan, adapted?: boolean): XForeach {
		return <XForeach>this.getOption(plan, adapted);
	}

	public getText(plan: ParameterPlan, adapted?: boolean): XText {
		return <XText>this.getOption(plan, adapted);
	}

	public getCall(plan: ParameterPlan, adapted?: boolean): XCall {
		return <XCall>this.getOption(plan, adapted);
	}

	public getLogical(plan: ParameterPlan, adapted?: boolean): XLogical {
		return <XLogical>this.getOption(plan, adapted);
	}

	public getNumber(plan: ParameterPlan, adapted?: boolean): XNumber {
		return <XNumber>this.getOption(plan, adapted);
	}

	protected addContentAdapter(model: EObject): void {
		let adapters = model.eAdapters();
		adapters.add(new GuideAdapter(this));
	}

	protected addNotificationCallback(model: EObject, callback: (notification: Notification) => void): void {
		let adapters = model.eAdapters();
		adapters.add(<Adapter>{
			notifyChanged: (notification: Notification) => {
				callback(notification);
			}
		});
	}

	public setOKEnabled(enabled: boolean): void {
		this.okButton.setEnabled(enabled);
	}

	public updatePageComplete(): void {

	}

	public notifyChanged(notification: Notification): void {

	}

}

class GuideAdapter extends ContentAdapter {

	private dialog: GuideDialog = null;

	constructor(dialog: GuideDialog) {
		super();
		this.dialog = dialog;
	}

	public notifyChanged(notification: Notification): void {
		this.dialog.notifyChanged(notification);
	}

}

export default GuideDialog;