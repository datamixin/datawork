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
import Modification from "webface/model/Modification";

/**
* Setiap modification harus di sync dengam model di server agar model valid
*/
export interface ModelSynchronizer {

    /**
     * Antrikan modification + callback-nya yang di panggil jika modification complete
     * @param modification
     */
    queue(modification: Modification, callback: () => void): void;

    /**
     * Kirim semua daftar modifikasi sesuai urutan queue. 
     */
    commit(callback?: () => void): void;

}

export default ModelSynchronizer;