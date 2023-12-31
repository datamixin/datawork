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
import Lean from "webface/core/Lean";

/**
 * Factory untuk membuat Lean dari any raw object.
 */
export interface LeanFactory {

    /**
     * Daftarkan Lean menggunakan register(name, json)
     */
    register(name: string, type: typeof Lean): void;

    /**
     * Buat lean baru dengan memanggil createLean(raw)
     */
    create(raw: any): Lean;

    /**
     * Buat lean baru dengan menggunakan name tersebut.
     */
    createByName(name: string, raw: any): Lean;

}

export default LeanFactory;