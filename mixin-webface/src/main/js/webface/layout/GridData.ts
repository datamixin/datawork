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
import * as webface from "webface/webface";

export default class GridData {

    public widthHint: number = webface.DEFAULT;
    public heightHint: number = webface.DEFAULT;
    public verticalSpan: number = 1;
    public horizontalSpan: number = 1;
    public grabExcessVerticalSpace: boolean = false;
    public grabExcessHorizontalSpace: boolean = false;
    public horizontalAlignment: string = webface.BEGINNING;
    public verticalAlignment: string = webface.BEGINNING;
    public horizontalIndent: number = 0;
    public verticalIndent: number = 0;

    constructor(widthSpace?: number | boolean, heightSpace?: number | boolean) {
        if (typeof (widthSpace) === "number") {
            this.widthHint = <number>widthSpace;
        } else if (typeof (widthSpace) === "boolean") {
            this.grabExcessHorizontalSpace = <boolean>widthSpace;
        }
        if (typeof (heightSpace) === "number") {
            this.heightHint = <number>heightSpace;
        } else if (typeof (heightSpace) === "boolean") {
            this.grabExcessVerticalSpace = <boolean>heightSpace;
        }
    }

    public applyFillVertical(): void {
        this.grabExcessVerticalSpace = true;
        this.heightHint = webface.DEFAULT;
    }

    public applyZeroHeight(): void {
        this.grabExcessVerticalSpace = false;
        this.heightHint = 0;
    }

    public applyFillHorizontal(): void {
        this.grabExcessHorizontalSpace = true;
        this.widthHint = webface.DEFAULT;
    }

    public applyZeroWidth(): void {
        this.grabExcessHorizontalSpace = false;
        this.widthHint = 0;
    }

}
