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
import EFeature from "webface/model/EFeature";

import XSource from "padang/model/XSource";
import * as model from "padang/model/model";

export default class XIngestion extends XSource {

	public static XCLASSNAME = model.getEClassName("XIngestion");

	constructor() {
		super(model.createEClass(XIngestion.XCLASSNAME), <EFeature[]>[
		]);
	}

}