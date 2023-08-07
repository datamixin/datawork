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

// Replace function ini untuk mengubah isi header
import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

export let beforeSend = (jqXHR: JQueryXHR, settings?: any) => {

}

export function setBeforeSend(func: (jqXHR: JQueryXHR, settings?: any) => void): void {
    beforeSend = func;
}

export function doGet(path: string, data: any): JQueryXHR {
    return ajax(path, "GET", data);
}

export function doPost(path: string, data: any, secondsTimeout?: number): JQueryXHR {
    return ajax(path, "POST", data, secondsTimeout);
}

export function doPut(path: string, data: any): JQueryXHR {
    return ajax(path, "PUT", data);
}

export function doDelete(path: string, data: any): JQueryXHR {
    return ajax(path, "DELETE", data);
}

export function ajax(path: string, method: string, data: any, secondsTimeout?: number): JQueryXHR {

    let settings = <JQueryAjaxSettings>{
        type: method,
        data: data,
        beforeSend: (xhr: JQueryXHR) => {
            beforeSend(xhr);
        },
        timeout: secondsTimeout === undefined ? (60 * 1000) : (secondsTimeout * 1000)
    };

    return $.ajax(path, settings);

}

export function doPostDownload(path: string, data: any, filename: string): void {
    doPost(path, data).done((result) => {
        let blob = new Blob([result]);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }).fail((error) => {
        DetailMessageDialog.open(error, "Fail Post Download");
    });
}
