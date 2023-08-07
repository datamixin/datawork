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

import BaseAction from "webface/wef/base/BaseAction";

import { AggregateOp } from "vegazoo/constants";
import { StandardType } from "vegazoo/constants";

import ObjectDefCustomView from "vegazoo/view/custom/ObjectDefCustomView";
import CustomNameTextPanel from "vegazoo/view/custom/CustomNameTextPanel";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import CustomNamePopupPanel from "vegazoo/view/custom/CustomNamePopupPanel";

import FieldDefTitleSetRequest from "vegazoo/requests/custom/FieldDefTitleSetRequest";
import FieldDefAggregateSetRequest from "vegazoo/requests/custom/FieldDefAggregateSetRequest";

export default class FieldDefCustomView extends ObjectDefCustomView {

	private type: string = null;
	private titlePanel = new CustomNameTextPanel("Title");
	private aggregate: AggregateOp = null;
	private aggregatePanel = new CustomNamePopupPanel("Aggregate");

	protected addContentPanels(panel: CustomCompositePanel): void {
		this.createTitlePanel(panel);
		this.createAggregatePanel(panel);
	}

	private createTitlePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.titlePanel);
		this.titlePanel.onCommit((newText: string) => {
			let request = new FieldDefTitleSetRequest(newText);
			this.conductor.submit(request);
		});
	}

	private createAggregatePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.aggregatePanel);
		this.aggregatePanel.setActions((): BaseAction[] => {
			let actions: BaseAction[] = [];
			if (this.type === StandardType.QUANTITATIVE) {
				let keys = Object.keys(AggregateOp);
				for (let key of keys) {
					let aggregate = AggregateOp[key];
					if (this.aggregate !== aggregate) {
						let action = new FieldDefAggregateSetAction(this.conductor, aggregate);
						actions.push(action);
					}
				}
			}
			return actions;
		});
	}

	public setTitle(title: string): void {
		this.titlePanel.setValue(title);
	}

	public setType(type: string): void {
		this.type = type;
		this.aggregatePanel.setVisible(this.type === StandardType.QUANTITATIVE);
	}

	public setAggregate(aggregate: AggregateOp): void {
		this.aggregate = aggregate;
		this.aggregatePanel.setVisible(this.aggregate !== AggregateOp.COUNT);
		if (this.type === StandardType.QUANTITATIVE) {
			this.aggregatePanel.setValue(aggregate);
		} else {
			this.aggregatePanel.setVisible(false);
		}
	}

}

class FieldDefAggregateSetAction extends BaseAction {

	private aggregate: AggregateOp = null;

	constructor(conductor: Conductor, aggregate: AggregateOp) {
		super(conductor);
		this.aggregate = aggregate;
	}

	public getText(): string {
		let first = this.aggregate[0].toUpperCase();
		return first + this.aggregate.slice(1);
	}

	public run(): void {
		let request = new FieldDefAggregateSetRequest(this.aggregate);
		this.conductor.submit(request);
	}

}
