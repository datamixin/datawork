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
import Request from "webface/wef/Request";

export default class TabularColumnInspectApplyRequest extends Request {

    public static REQUEST_NAME = "tabular-column-inspect-apply";

    public static NAME = "name";
    public static TYPE = "type";
    public static VALUES = "value";

    public static EQ = "==";
    public static LT = "<";
    public static LE = "<=";
    public static GT = ">";
    public static GE = ">=";

    constructor(name: string, type: string, values: Map<string, any>) {
        super(TabularColumnInspectApplyRequest.REQUEST_NAME);
        super.setData(TabularColumnInspectApplyRequest.NAME, name);
        super.setData(TabularColumnInspectApplyRequest.TYPE, type);
        super.setData(TabularColumnInspectApplyRequest.VALUES, values);
    }

}

