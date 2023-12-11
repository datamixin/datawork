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
import * as webface from "webface/webface";

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import TypedListener from "webface/widgets/TypedListener";

import SelectionEvent from "webface/events/SelectionEvent";
import SelectionListener from "webface/events/SelectionListener";

export default class Combo extends Control {

    private items: string[] = [];

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<select>"), parent, index);
        this.element.addClass("widgets-combo");

        // On-Change
        this.element.on("change", (event: JQueryEventObject) => {
            if (this.isEnabled()) {
                this.sendEvent(webface.Selection, event);
            }
        });
    }

    // Tambah element combo (opsi berdasarkan index)
    public add(text: string): void {

        let item = jQuery("<option>");
        item.val(text);
        item.html(text);
        this.element.append(item);

        this.items.push(text);
    }

    // Tambah selection listener
    public addSelectionListener(listener: SelectionListener): void {
        let typedListener = new TypedListener(listener);
        this.addListener(webface.Selection, typedListener);
    }

    // Dapatkan item berdasarkan index
    public getItem(index: number): string {
        return this.items[index];
    }

    // Mendapatkan jumlah item
    public getItemCount(): number {
        return this.items.length;
    }

    // Mendapatkan item-item
    public getItems(): string[] {
        return this.items;
    }

    // Mendapatkan indeks dari item yang di-select
    public getSelection(): number {
        let value = this.element.val();
        return this.items.indexOf(value);
    }

    // Mendapatkan teks dari selection
    public getSelectionText(): string {
        return this.element.val();
    }

    // Pilih item berdasarkan indeks
    public setSelection(index: number): void {
        let value = this.items[index];
        this.element.val(value);
    }

    // Pilih item berdasarkan text yang harus ada di daftar
    public setSelectionText(text: string): void {
        let index = this.items.indexOf(text);
        this.setSelection(index);
    }

    // Tambahkan item-item untuk isi combo
    public setItems(items: string[]): void {
        this.element.children().remove();
        this.items = [];
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            this.add(item);
        }
        this.items = items;
    }

    protected applyEnabled(enabled: boolean): void {
        this.element.prop("disabled", !enabled);
    }

    public onSelection(listener: (event: Event) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                if (this.isEnabled()) {
                    listener(event);
                }
            }
        });
    }

    public onChanged(callback: (text: string, event: SelectionEvent) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                if (this.isEnabled()) {
                    let text = this.getSelectionText();
                    callback(text, event);
                }
            }
        });
    }

}
