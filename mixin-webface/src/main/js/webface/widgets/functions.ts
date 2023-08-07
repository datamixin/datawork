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
import Composite from "webface/widgets/Composite";

import Image from "webface/graphics/Image";
import FileImage from "webface/graphics/FileImage";
import WebFontImage from "webface/graphics/WebFontImage";

export function removeChildren(parent: Composite) {
    let children = parent.getChildren();
    for (var i = 0; i < children.length; i++) {
        children[i].dispose();
    }
}

export function repopulateSlide(parent: Composite, close: boolean, repopulate: () => void): void {

    // Clone semua element sebelumnya
    let parentElement = parent.getElement();
    let children = parent.getChildren();
    let clones: JQuery[] = [];
    for (var i = 0; i < children.length; i++) {
        let child = children[i];
        let element = child.getElement();
        let clone = element.clone();
        clones.push(clone);
    }

    // Hapus semua element yang dimiliki control
    removeChildren(parent);

    // Buat semua control baru
    repopulate();

    // Tambahkan semua clone ke parent element
    for (var i = 0; i < clones.length; i++) {
        let clone = clones[i];
        if (close === true) {
            parentElement.prepend(clone);
        } else {
            parentElement.append(clone);
        }
    }

    // Ambil target properties untuk setiap moved element dan posisikan di kanan
    let movedElements: JQuery[] = [];
    let lefts: any[] = [];
    if (close === true) {

        // New elements yang di gerakkan dari kanan ke kiri
        let children = parent.getChildren();
        for (var i = 0; i < children.length; i++) {
            let child = children[i];
            let element = child.getElement();
            let position = element.position();
            lefts.push(position.left);
            element.css("left", element.width());
            movedElements.push(element);
        }
    } else {

        // Clone yang di gerakkan dari kiri ke kanan 
        for (var i = 0; i < clones.length; i++) {
            let element = clones[i];
            let position = element.position();
            lefts.push(position.left + element.width());
            movedElements.push(element);
        }
    }


    // Lakukan animasi close next ke target lefts dan remove clone
    for (var i = 0; i < movedElements.length; i++) {
        let element = movedElements[i];
        element.animate(
            {
                left: lefts[i]
            }, {
                done: () => {

                    // Hapus semua clones jika semua animasi selesai
                    if (i === movedElements.length) {
                        for (var n = 0; n < clones.length; n++) {
                            clones[n].remove();
                        }
                    }
                }
            }
        )
    }
}

export function appendImage(element: JQuery, image: Image): JQuery {
    if (image instanceof FileImage) {
        let imgElement = createImageAsFileImage(image);
        element.append(imgElement);
        return imgElement;
    } else if (image instanceof WebFontImage) {
        let fontElement = createImageAsWebFontImage(image);
        element.append(fontElement);
        return fontElement;
    }
    throw Error("Image type unknown");
}

export function prependImage(element: JQuery, image: Image): JQuery {
    if (image instanceof FileImage) {
        let imgElement = createImageAsFileImage(image);
        element.prepend(imgElement);
        return imgElement;
    } else if (image instanceof WebFontImage) {
        let fontElement = createImageAsWebFontImage(image);
        element.prepend(fontElement);
        return fontElement;
    }
    throw Error("Image type unknown");
}

export function createImageAsFileImage(image: Image): JQuery {
    let element = jQuery("<img>");
    let fileImage = <FileImage>image;
    element.attr("src", fileImage.getPath());
    return element;
}

export function createImageAsWebFontImage(image: Image): JQuery {
    let element = jQuery("<span>");
    let fontImage = <WebFontImage>image;
    let classes = fontImage.getClasses();
    for (var i = 0; i < classes.length; i++) {
        element.addClass(classes[i]);
    }
    return element;
}