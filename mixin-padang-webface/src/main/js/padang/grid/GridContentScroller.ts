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
export interface GridContentScroller {

    getAvailableWidth(): number;

    getRequiredWidth(): number;

    getExtraWidth(): number;

    getAvailableHeight(): number;

    getRequiredHeight(): number;

    getExtraHeight(): number;

    scrollToTop(top: number): void;

    scrollToLeft(left: number): void;

}

export default GridContentScroller;