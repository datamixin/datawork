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
import EList from "webface/model/EList";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as model from "vegazoo/model/model";
import XTransform from "vegazoo/model/XTransform";
import XFieldName from "vegazoo/model/XFieldName";
import XJoinAggregateFieldDef from "vegazoo/model/XJoinAggregateFieldDef";

export default class XJoinAggregateTransform extends XTransform {

	public static XCLASSNAME: string = model.getEClassName("XJoinAggregateTransform");

	public static FEATURE_GROUPBY = new EReference("groupby", XJoinAggregateFieldDef);
	public static FEATURE_JOINAGGREGATE = new EReference("joinaggregate", XJoinAggregateFieldDef);

	private groupby: EList<XFieldName> = new BasicEList<XFieldName>(this, XJoinAggregateTransform.FEATURE_GROUPBY);
	private joinaggregate: EList<XJoinAggregateFieldDef> = new BasicEList<XJoinAggregateFieldDef>(this, XJoinAggregateTransform.FEATURE_JOINAGGREGATE);

	constructor() {
		super(model.createEClass(XJoinAggregateTransform.XCLASSNAME), [
			XJoinAggregateTransform.FEATURE_GROUPBY,
			XJoinAggregateTransform.FEATURE_JOINAGGREGATE,
		]);
	}

	public getGroupby(): EList<XFieldName> {
		return this.groupby;
	}

	public getJoinaggregate(): EList<XJoinAggregateFieldDef> {
		return this.joinaggregate;
	}

}