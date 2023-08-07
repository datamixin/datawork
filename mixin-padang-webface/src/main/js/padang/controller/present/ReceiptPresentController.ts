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
import XReceipt from "padang/model/XReceipt";

import ReceiptPresentView from "padang/view/present/ReceiptPresentView";

import ForeseePresentController from "padang/controller/present/ForeseePresentController";

export abstract class ReceiptPresentController extends ForeseePresentController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public getModel(): XReceipt {
        return <XReceipt>super.getModel();
    }

    public getView(): ReceiptPresentView {
        return <ReceiptPresentView>super.getView();
    }

    public refreshVisuals(): void {

    }

}

export default ReceiptPresentController;
