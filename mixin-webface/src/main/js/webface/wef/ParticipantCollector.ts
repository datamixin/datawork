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
import Participant from "webface/wef/Participant";
import ChildrenSelector from "webface/wef/ChildrenSelector";
import ParticipantEvaluator from "webface/wef/ParticipantEvaluator";

export interface ParticipantCollector<T extends Participant> {

    /**
     * Lakukan proses pengumpulan semua participant dari sebuah coordinator.
     */
    collect(): void;

    /**
     * Berikan evaluator yang akan digunakan untuk mengevaluasi participant yang ter-collect.
     */
    setEvaluator(evaluator: ParticipantEvaluator<T>): void;

    /**
     * Berikan children selector untuk dasar pemilihan anak collector.
     */
    setSelector(selector: ChildrenSelector): void;

    /**
     * Ambil semua participant yang terkumpulan tanpa evaluasi.
     */
    getParticipants(): T[];

    /**
     * Ambil semua participant yang telah melewati tahap evaluasi menggunakan evaluator.
     */
    getEvaluatedParticipants(context?: any): T[];

}

export default ParticipantCollector;

