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
import Controller from "webface/wef/Controller";

import BasePartViewer from "webface/wef/base/BasePartViewer";
import BaseParticipantCollector from "webface/wef/base/BaseParticipantCollector";

import ContentLayoutDirector from "bekasi/directors/ContentLayoutDirector";
import ContentLayoutParticipant from "bekasi/directors/ContentLayoutParticipant";
import { CONTENT_LAYOUT_PARTICIPANT } from "bekasi/directors/ContentLayoutParticipant";

export default class BaseContentLayoutDirector implements ContentLayoutDirector {

    private collector: BaseParticipantCollector<ContentLayoutParticipant>;
    private relayoutCallback = () => { };

    constructor(viewer: BasePartViewer) {
        let key = CONTENT_LAYOUT_PARTICIPANT;
        this.collector = new BaseParticipantCollector<ContentLayoutParticipant>(key, viewer);
    }

    public relayout(source: Controller): void {
        this.collector.collect();
        let participants = this.collector.getParticipants();
        for (let i = 0; i < participants.length; i++) {
            let participant = participants[i];
            if (participant.isContaining(source)) {
                participant.relayout();
            }
        }
        this.relayoutCallback();
    }

    public setRootCallback(callback: () => void): void {
        this.relayoutCallback = callback;
    }

}