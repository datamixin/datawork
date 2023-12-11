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
import TextArea from "webface/widgets/TextArea";
import Composite from "webface/widgets/Composite";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import * as widgets from "padang/widgets/widgets";

export default class JsonSpecDialog extends TitleAreaDialog {

    private static INIT_WIDTH = 640;
    private static INIT_HEIGHT = 480;

    private spec: any = null;
    private composite: Composite = null;

    constructor(spec: any) {
        super();
        this.spec = spec;
        this.setDialogSize(JsonSpecDialog.INIT_WIDTH, JsonSpecDialog.INIT_HEIGHT);
        this.setWindowTitle("Json Spec Dialog");
        this.setTitle("Json Specification");
        this.setMessage("Please review specification");
    }

    protected createControl(parent: Composite): void {
        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 1);
        this.createTextArea(this.composite);
    }

    private createTextArea(parent: Composite): void {
        let textArea = new TextArea(parent);
        widgets.setGridData(textArea, true, true);
        let text = JSON.stringify(this.spec, null, 2);
        textArea.setText(text);
    }

}