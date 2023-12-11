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
import XReceipt from "padang/model/XReceipt";

import ReceiptOutlineView from "padang/view/outline/ReceiptOutlineView";

import ForeseeOutlineController from "padang/controller/outline/ForeseeOutlineController";

export abstract class ReceiptOutlineController extends ForeseeOutlineController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public getModel(): XReceipt {
        return <XReceipt>super.getModel();
    }

    public getView(): ReceiptOutlineView {
        return <ReceiptOutlineView>super.getView();
    }

}

export default ReceiptOutlineController;

