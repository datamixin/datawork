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
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import ResultMapping from "vegazoo/directors/converters/ResultMapping";

export abstract class Viewporter {

	public static WIDTH = "width";
	public static HEIGHT = "height";

	public adjust(mapping: ResultMapping, viewport: any, viewspec: XTopLevelSpec): void {
	}

}

export default Viewporter;
