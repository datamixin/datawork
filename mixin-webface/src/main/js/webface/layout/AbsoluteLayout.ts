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

import Layout from "webface/widgets/Layout";
import Composite from "webface/widgets/Composite";

import AbsoluteData from "webface/layout/AbsoluteData";

export default class AbsoluteLayout extends Layout {

    private static TRANSFORM = "transform";

    public prepare(composite: Composite): void {
        let element = composite.getElement();
        element.addClass("layout-absolute");
    }

    public layout(composite: Composite): void {

        let children = composite.getChildren();
        for (let i = 0; i < children.length; i++) {

            let child = children[i];
            let layoutData = <AbsoluteData>child.getLayoutData() || new AbsoluteData();

            let element = child.getElement();
            element.css("position", "absolute");

            if (layoutData.width !== webface.DEFAULT) element.outerWidth(layoutData.width);
            if (layoutData.height !== webface.DEFAULT) element.outerHeight(layoutData.height);

            if (layoutData.left !== webface.DEFAULT) element.css(webface.LEFT, layoutData.left);
            if (layoutData.top !== webface.DEFAULT) element.css(webface.TOP, layoutData.top);
            if (layoutData.right !== webface.DEFAULT) element.css(webface.RIGHT, layoutData.right);
            if (layoutData.bottom !== webface.DEFAULT) element.css(webface.BOTTOM, layoutData.bottom);
            if (layoutData.transform !== null) element.css(AbsoluteLayout.TRANSFORM, layoutData.transform);

            // width dan height harus selalu di reset agar menggunakan yang hasil computeSize
            let control = <any>child;
            control.width = webface.DEFAULT;
            control.height = webface.DEFAULT;

            // Absolute layout tidak menggunakan setSize karena size bukan perhitungan di sini
            child.computeSize();
        }
    }

}

