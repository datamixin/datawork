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
import Map from "webface/util/Map";
import ObjectMap from "webface/util/ObjectMap";
import * as functions from "webface/functions";

export let URL_PREFERENCES: string = "url_preferences";

export function getURLParameter(param: string): string {
	param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	let regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
	let results = regex.exec(window.location.search);

	if (results !== null) {
		let result = results[1].replace(/\+/g, " ");
		return decodeURIComponent(result);
	}

	return null;
}

export function setLastUrl(url: string, replace?: boolean): void {

	let urls: string[] = [];

	let urlPreferences = getStorageItem(URL_PREFERENCES);

	if (functions.isNullOrUndefined(urlPreferences)) {
		urls.push(window.location.href);
	} else {
		let oldUrls: string[] = JSON.parse(urlPreferences);
		for (var i = 0; i < oldUrls.length; i++) {
			let oldUrl = oldUrls[i];
			urls.push(oldUrl);
		}
	}

	if (replace) {
		urls.pop();
	}

	urls.push(url);

	setStorageItem(URL_PREFERENCES, JSON.stringify(urls));
}

export function getLastUrl(): string {

	let urls: string[] = [];

	let urlPreferences = getStorageItem(URL_PREFERENCES);

	if (functions.isNullOrUndefined(urlPreferences)) {
		return null;
	}

	urls = JSON.parse(urlPreferences);
	urls.pop();
	setStorageItem(URL_PREFERENCES, JSON.stringify(urls));
	return urls[urls.length - 1];
}

export function getParentURL(path: string, protocols?: { [key: string]: string }): string {
	let location = window.location;
	let newURI: string = null;
	if (protocols === undefined) {
		newURI = location.protocol;
	} else {
		newURI = protocols[location.protocol];
	}
	newURI += "//" + location.host;
	let lastSlash = location.pathname.lastIndexOf("/");
	let directory = location.pathname.substring(0, lastSlash);
	lastSlash = directory.lastIndexOf("/");
	let root = location.pathname.substring(0, lastSlash);
	newURI += root + "/" + path;
	return newURI;
}

export function historyPushState(title: string, url: string): void {
	let obj = { title: title, url: url };
	let state = history.state;

	let stateChanged = true;
	if (!functions.isNullOrUndefined(state)) {
		if (state === obj) {
			stateChanged = false;
		}
	} else {
		history.replaceState(obj, title, url);
	}

	if (stateChanged == true) {
		history.pushState(obj, title, url);
	}

}

export function setStorageItem(key: string, value: any): void {

	if (typeof (Storage) !== "undefined") {
		sessionStorage.setItem(key, value);
	}
}

export function getStorageItem(key: string): string {

	if (typeof (Storage) !== "undefined") {
		return sessionStorage.getItem(key);
	}
	return null;
}


export function bindMouseWheel(element: JQuery, callBack: (x: number, y: number) => number): void {

	element[0].addEventListener('wheel', (event: WheelEvent) => {

		let deltaX = event.deltaX;
		let deltaY = event.deltaY;

		let xDirection = 0;
		if (deltaX < 0) {
			xDirection = 1;
		}
		if (deltaX > 0) {
			xDirection = -1;
		}

		let yDirection = 0;
		if (deltaY < 0) {
			yDirection = 1;
		}
		if (deltaY > 0) {
			yDirection = -1;
		}

		let affected = callBack(xDirection, yDirection);

		if (affected !== 0) {
			event.stopPropagation();
		}

	}, { passive: true });

}

export function populateJQueryData(object: JQuery, data: Map<any>): void {
	let names = data.keySet();
	for (var i = 0; i < names.length; i++) {
		let name = names[i];
		object.data(name, data.get(name));
	}
}

export function getIncrementedName(name: string, used: string[], delimiter?: string): string {
	let counter = 1;
	let separator = delimiter === undefined ? "" : delimiter;
	for (let i = 0; i < used.length; i++) {
		let usedName = used[i];
		if (usedName.startsWith(name)) {
			let rightPart = usedName.substring(name.length + separator.length);
			let index = parseInt(rightPart);
			if (!isNaN(index)) {
				counter = Math.max(counter, index + 1);
			}
		}
	}
	return name + separator + counter;
}

export function getJQueryDataAsMap(object: JQuery): Map<any> {
	let map = new ObjectMap<any>();
	let names = Object.keys(object.data());
	for (var i = 0; i < names.length; i++) {
		let name = names[i];
		map.put(name, object.data(name));
	}
	return map;
}

export function randomUUID() {
	return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

