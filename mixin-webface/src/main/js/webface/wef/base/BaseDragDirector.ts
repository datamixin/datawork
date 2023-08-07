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
import Map from "webface/util/Map";
import ObjectMap from "webface/util/ObjectMap";

import PartViewer from "webface/wef/PartViewer";
import DragDirector from "webface/wef/DragDirector";
import DragParticipant from "webface/wef/DragParticipant";

import BaseParticipantCollector from "webface/wef/base/BaseParticipantCollector";

export default class BaseDragDirector implements DragDirector {

    private collector: BaseParticipantCollector<DragParticipant>;
    private participants: DragParticipant[] = [];
    private inRangeParticipant: DragParticipant = null;

    private startData: Map<any>;

    constructor(partViewer: PartViewer, participantKey: string) {
        this.collector = new BaseParticipantCollector<DragParticipant>(participantKey, partViewer);
    }

    public start(data: Map<any>): void {

        // Kumpulkan semua participant yang memenuhi criteria
        this.collector.collect();
        this.participants = this.collector.getEvaluatedParticipants();

        this.startData = data;

        // Semua partisipan di inform start drag
        for (let i = 0; i < this.participants.length; i++) {
            let participant = this.participants[i];
            participant.start(this.startData);
        }

    }

    public drag(data: Map<any>, x: number, y: number): void {

        // Ambil participant terakhir yang paling descent
        let inRange: DragParticipant = null;
        for (let i = 0; i < this.participants.length; i++) {

            let participant = this.participants[i];
            if (participant.isInRange(x, y)) {
                inRange = participant;
            }
        }

        // Pilih participant yang ada didalam range
        if (inRange !== null) {

            if (inRange !== this.inRangeParticipant) {

                // Bersihkan feedback di participant sebelumnya
                if (this.inRangeParticipant !== null) {
                    this.inRangeParticipant.clearFeedback(data);
                }
                this.inRangeParticipant = inRange;

            }

            // Tampilkan feedback di participant
            if (inRange.isShowFeedback(this.startData)) {
                inRange.showFeedback(data, x, y);
            }

        } else {

            // Bersihkan feedback di participant sebelumnya
            this.outRangeParticipant(data);
        }
    }

    private outRangeParticipant(data: Map<any>): void {
        if (this.inRangeParticipant !== null) {
            this.inRangeParticipant.clearFeedback(data);
        }
        this.inRangeParticipant = null;
    }

    public stop(): void {

        this.startData = null;
        this.outRangeParticipant(new ObjectMap<any>());

        // Semua partisipan di inform stop drag
        for (let i = 0; i < this.participants.length; i++) {
            let participant = this.participants[i];
            participant.stop();
        }
    }
}
