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
import Request from "webface/wef/Request";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";

export default class VegaliteRootApplyRequest extends Request {

	public static REQUEST_NAME = "vegalite-root-apply";

	public static ROOT = "root";

	constructor(root: VegaliteNode) {
		super(VegaliteRootApplyRequest.REQUEST_NAME);
		super.setData(VegaliteRootApplyRequest.ROOT, root);
	}

}
