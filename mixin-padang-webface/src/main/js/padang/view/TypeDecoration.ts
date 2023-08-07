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
export let ICON_MAP = {

	str: "mdi-alphabetical",
	XText: "mdi-alphabetical",
	string: "mdi-alphabetical",
	STRING: "mdi-alphabetical",
	TextPlan: "mdi-alphabetical",
	VisageText: "mdi-alphabetical",

	int: "mdi-numeric",
	int32: "mdi-numeric",
	int64: "mdi-numeric",
	INT32: "mdi-numeric",
	INT64: "mdi-numeric",
	float: "mdi-numeric",
	float32: "mdi-numeric",
	float64: "mdi-numeric",
	FLOAT32: "mdi-numeric",
	FLOAT64: "mdi-numeric",
	XNumber: "mdi-numeric",
	NumberPlan: "mdi-numeric",
	VisageNumber: "mdi-numeric",

	bool: "mdi-toggle-switch-off-outline",
	bool_: "mdi-toggle-switch-off-outline",
	BOOLEAN: "mdi-toggle-switch-off-outline",
	XLogical: "mdi-toggle-switch-off-outline",
	LogicalPlan: "mdi-toggle-switch-off-outline",
	VisageLogical: "mdi-toggle-switch-off-outline",

	date: "mdi-calendar",
	datetime: "mdi-calendar-clock",
	DATETIME: "mdi-calendar-clock",

	list: "mdi-code-brackets",
	XList: "mdi-code-brackets",
	ListPlan: "mdi-code-brackets",
	VisageList: "mdi-code-brackets",
	MIXINLIST: "mdi-code-brackets",

	object: "mdi-code-braces",
	object_: "mdi-code-braces",
	XObject: "mdi-code-braces",
	MapPlan: "mdi-code-braces",
	EntityPlan: "mdi-code-braces",
	VisageObject: "mdi-code-braces",
	MIXINOBJECT: "mdi-code-braces",

	table: "mdi-table",
	MIXINTABLE: "mdi-table",
	VisageTable: "mdi-table",

	column: "mdi-table-column",

	XBinary: "mdi-set-center",
	XCall: "mdi-function",
	XReference: "mdi-music-accidental-sharp",
	XLambda: "mdi-lambda",
	XMember: "mdi-menu-open",
	XUnary: "mdi-coins",
	XAlias: "mdi-identifier",
	XLet: "mdi-alpha-l-box-outline",
	XForeach: "mdi-code-parentheses",

	unknown: "mdi-help-circle-outline",
}

export let getIconOrSymbol = (type: string) => {
	let icon = ICON_MAP[type];
	if (icon === undefined) {
		if (type !== undefined && type.length > 0) {
			let c = type.charAt(0);
			let s = c.toLocaleLowerCase();
			icon = "mdi-alpha-" + s + "-circle-outline";
		}
	}
	return icon;
}

export default {
	ICON_MAP,
}