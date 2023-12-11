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
import Popup from "webface/popup/Popup";
import Event from "webface/widgets/Event";
import PopupStyle from "webface/popup/PopupStyle";

export abstract class FlexiblePopup extends Popup {

    // Element dimana popup ini di panggil yang nantinya akan di tunjuk.
    private reference: JQuery;

    constructor(style?: PopupStyle) {
        super(style);
    }

    /**
     * Kembalikan lebar isi popup yang akan di tampilkan
     */
    public abstract getWidth(): number;

    /**
     * Kembalikan tinggi isi popup yang akan di tampilkan
     */
    public abstract getHeight(): number;

    /**
     * Tampilkan popup dimana lokasi mengacu ke event yang diberikan.
     */
    public show(event: Event, callback?: (result?: any) => void): void {

        // Stop propagation agar click di body tidak dijalankan dan membatalkan popup.
        let eventObject = event.eventObject;
        eventObject.stopPropagation();

        // Ambil element yang memiliki popup ini.
        let widgets = event.widget;
        this.reference = widgets.getElement();

        super.open(callback);

        // Atur ukuran dan lokasi popup.
        this.layout();

    }

    public layout(): void {

        // Atur ukuran popup
        let margin = Popup.MARGIN;
        let width = this.getWidth();
        let height = this.getHeight();
        let popupWidth = width + 2 * margin;
        let popupHeight = height + 2 * margin;
        let body = jQuery("body");
        let bodyWidth = body.width();
        let bodyHeight = body.height();
        let halfPopupWidth = popupWidth / 2;
        let halfArrowWidth = Popup.ARROW_HEIGHT / 2;

        // Atur lokasi popup sesuai posisi control
        let referenceOffset = this.reference.offset();
        let referenceLeft = referenceOffset.left;
        let referenceWidth = this.reference.outerWidth();
        let referenceCenter = referenceLeft + referenceWidth / 2;
        let minPopupCenter = halfPopupWidth + margin;
        let maxPopupCenter = bodyWidth - halfPopupWidth - margin;
        let popupLeft = margin;
        let arrowLeft = halfPopupWidth;
        if (referenceCenter < minPopupCenter) {

            // Popup terlalu ke kiri arrow geser ke kiri
            popupLeft = margin;
            let delta = minPopupCenter - referenceCenter;
            arrowLeft = Math.max(halfArrowWidth, arrowLeft - delta);

        } else {

            if (referenceCenter > maxPopupCenter) {

                // Popup terlalu ke kanan arrow geser ke kanan
                popupLeft = bodyWidth - popupWidth - margin;
                let delta = referenceCenter - maxPopupCenter;
                arrowLeft = Math.min(popupWidth - halfArrowWidth, arrowLeft + delta);
            } else {

                // Popup tidak mepet arrow di tengan
                popupLeft = referenceCenter - halfPopupWidth;
            }
        }

        // Cari top untuk popup
        let top = referenceOffset.top + this.reference.outerHeight();
        if (this.style.type === webface.UP) {

            top = referenceOffset.top - popupHeight;

        } else {

            // Jika menu melewati body ganti ke atas
            if (top + popupHeight > bodyHeight) {
                this.style.type = webface.UP;
                top = referenceOffset.top - popupHeight;
            }

        }
        this.createArrow();
        this.setSize(popupWidth, popupHeight);
        this.setLocation(popupLeft, top);

        // Tempatkan posisi left arrow
        this.setArrowLeft(arrowLeft);
    }

}

export default FlexiblePopup;
