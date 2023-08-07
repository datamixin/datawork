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
import { DateTime } from "luxon";
import { Duration } from "luxon";

import * as webface from "webface/webface";
import Control from "webface/widgets/Control";

export function isSimple(value: any): boolean {
    return value == null ||
        typeof (value) === webface.STRING ||
        typeof (value) === webface.BOOLEAN ||
        typeof (value) === webface.NUMBER;
}

export function isObject(value: any): boolean {
    return typeof (value) === webface.OBJECT;
}

export function capitalize(text: string): string {
    return text.replace(/(?:^|\s)\S/g, function(a) {
        return a.toUpperCase();
    });
}

export function isEquals(a: any, b: any) {

    if (a === b) {
        return true;
    }

    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different, objects are not equals
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        let aValue = a[propName];
        let bValue = b[propName];

        // Check values is object or primitive.
        if (aValue instanceof Object && bValue instanceof Object) {
            let equal = isEquals(aValue, bValue);
            if (!equal) {
                return false;
            }
        } else if (aValue !== bValue) { //If values of same property are not equal, return false.
            return false;
        }
    }

    // If we made it this far, objects are considered equals
    return a === b;
}

export function getBorderWidth(element: JQuery): number {
    let leftWidth = parseInt(element.css("borderLeftWidth"));
    let rightWidth = parseInt(element.css("borderRightWidth"));
    return leftWidth + rightWidth;
}

export function isImplements(object: any, implementedClass: Function): boolean {
    let keys = Object.keys(implementedClass.prototype);
    let matches = 0;
    for (var name in object) {
        if (keys.indexOf(name) >= 0) {
            matches++;
        }
    }
    return matches === keys.length;
}

export function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
}

export function getString(value: any): string {
    if (value !== null && value !== undefined) {
        return value.toString();
    }
    return "";
}

// Apakah tipe java classType yang diberikan merupakan type number.
export function isJavaNumberType(classType: string): boolean {

    let numberTypes: string[] = [];

    // List java numberType.
    numberTypes.push("java.lang.Byte");
    numberTypes.push("java.lang.Short");
    numberTypes.push("java.lang.Integer");
    numberTypes.push("java.lang.Long");
    numberTypes.push("java.lang.Float");
    numberTypes.push("java.lang.Double");
    numberTypes.push("java.math.BigDecimal");

    return numberTypes.indexOf(classType) !== -1;
}

// Apakah tipe java classType yang diberikan merupakan type boolean
export function isJavaStringType(classType: string): boolean {
    return classType === "java.lang.String";
}

// Apakah tipe java classType yang diberikan merupakan type boolean
export function isJavaBooleanType(classType: string): boolean {
    return classType === "java.lang.Boolean";
}

// Apakah tipe java classType yang diberikan merupakan type date time.
export function isJavaDateTimeType(classType: string): boolean {

    let dateTimeTypes: string[] = [];

    // List java dateTimeType.
    dateTimeTypes.push("java.util.Date");
    dateTimeTypes.push("java.sql.Date");
    dateTimeTypes.push("java.sql.Time");
    dateTimeTypes.push("java.sql.Timestamp");

    return dateTimeTypes.indexOf(classType) !== -1;
}

export function formatNumber(value: number, format: string): string {
    let n = numeral(value);
    if (format !== undefined) {
        return n.format(format);
    } else if (format === null) {
        return "null";
    } else {
        return value.toString();
    }
}

export function formatDuration(millis: number): string {

    let millisecond = 1;
    let second = 1000 * millisecond;
    let minute = 60 * second;
    let hour = 60 * minute;
    let day = 24 * hour;

    // let format = "H [h] mm [min] ss [sec] SSS [ms]";
    let dayDuration = 0;

    let format = "S 'ms'";

    if (millis >= second) {
        format = "s 'seconds' ";
    }

    if (millis >= minute) {
        format = "m 'minutes' ";
    }

    if (millis >= hour) {
        format = "H 'hours' ";
    }

    if (millis >= day) {
        dayDuration = Math.floor(millis / day);
        millis = millis % day;
    }

    let duration = Duration.fromMillis(millis);
    let durationFormatted = duration.toFormat(format);
    durationFormatted = durationFormatted.replace(/s 0+/, 's ');
    if (dayDuration > 0) {
        durationFormatted = dayDuration + " D 'days' " + durationFormatted;
    }

    return durationFormatted;
}

export function formatDate(time: Date | number, format?: string): string {
    let pattern = format === undefined ? "yyyy-MM-dd" : format;
    let date = getDate(time);
    let datetime = DateTime.fromJSDate(date);
    return datetime.toFormat(pattern);
}

export function formatDateTime(time: Date | number, format?: string): string {
    let pattern = format === undefined ? "yyyy-MM-dd HH:mm:ss" : format;
    return formatDate(time, pattern);
}

export function formatTime(time: Date | number, format?: string): string {
    let pattern = format === undefined ? "HH:mm:ss" : format;
    return formatDate(time, pattern);
}

export function parseDate(text: string, format?: string): number {
    let pattern = format === undefined ? "yyyy-MM-dd" : format;
    let datetime = DateTime.fromString(text, pattern);
    return datetime.toJSDate().getTime();
}

export function parseDateTime(text: string, format?: string): number {
    let pattern = format === undefined ? "yyyy-MM-dd HH:mm:ss" : format;
    let datetime = DateTime.fromString(text, pattern);
    return datetime.toJSDate().getTime();
}

export function parseTime(text: string, format?: string): number {
    let pattern = format === undefined ? "HH:mm:ss" : format;
    let datetime = DateTime.fromString(text, pattern);
    return datetime.toJSDate().getTime();
}

export function getDate(time: Date | number): Date {
    if (time instanceof Date) {
        return <Date>time;
    } else {
        return new Date(<number>time);
    }
}

export function measureTextWidth(target: JQuery | Control, text: string): number {

    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    if (isNullOrUndefined(canvas)) {
        canvas = <HTMLCanvasElement>document.createElement("canvas");
        canvas.style.display = "none";
        canvas.style.position = "absolute";
        canvas.style.bottom = "0px";
    }
    let context = canvas.getContext("2d");

    if (text === undefined || text === null) {
        return 0;
    }

    let element: JQuery = null;
    if (target instanceof Control) {
        element = target.getElement();
    } else {
        element = <JQuery>target;
    }

    // Ambil font dari element untuk di set ke canvas
    let fontFamily = element.css("font-family");
    let fontSize = element.css("font-size");
    if (fontFamily) {
        context.font = fontSize + " " + fontFamily;
    }

    let metrics = context.measureText(text);
    return metrics.width;
}

export function isInRange(element: JQuery, x: number, y: number): boolean {
    let offset = element.offset();
    let left = offset.left;
    let top = offset.top;
    let width = element.width();
    let height = element.height();
    return (x > left && x < left + width) && (y > top && y < top + height);
}

export function isElementAtPoint(element: JQuery, x: number, y: number): boolean {
    let elements = getElementsAtPoint(x, y);
    let index = $(elements).index(element);
    return index > -1;
}

export function getElementsAtPoint(x: number, y: number): any[] {
    let elements = [];
    let previousPointerEvents = [];
    let current: any;
    let i, d;

    // get all elements via elementFromPoint, and remove them from hit-testing in order
    while ((current = document.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current != null) {

        // push the element and its current style
        elements.push(current);
        previousPointerEvents.push({
            value: current.style.getPropertyValue("pointer-events"),
            priority: current.style.getPropertyPriority("pointer-events")
        });

        // add "pointer-events: none", to get to the underlying element
        current.style.setProperty("pointer-events", "none", "important");
    }

    // restore the previous pointer-events values
    for (i = previousPointerEvents.length; d = previousPointerEvents[--i];) {
        elements[i].style.setProperty("pointer-events", d.value ? d.value : "", d.priority);
    }

    // return our results
    return elements;
}

// Untuk meniadakan right-click
$(() => {
    $().bind("contextmenu", function(e) {
        e.preventDefault();
    });
});

