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
import * as functions from "webface/util/functions";

export let FOLDER = "folder";
export let ROOT = "Root";

export let SPACE = "admin";

export let CATEGORY_WIZARDS = "Wizards";
export let CATEGORY_PROJECTS = "Projects";

export let CATEGORY_ORDER = [CATEGORY_WIZARDS, CATEGORY_PROJECTS];

export let CLIENT_ID = functions.randomUUID();
