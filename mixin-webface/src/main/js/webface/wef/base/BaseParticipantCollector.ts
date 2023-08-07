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
import PartViewer from "webface/wef/PartViewer";
import Controller from "webface/wef/Controller";
import Participant from "webface/wef/Participant";
import ChildrenSelector from "webface/wef/ChildrenSelector";
import DirectorParticipant from "webface/wef/DirectorParticipant";
import ParticipantCollector from "webface/wef/ParticipantCollector";
import ParticipantEvaluator from "webface/wef/ParticipantEvaluator";

import AllChildrenSelector from "webface/wef/base/AllChildrenSelector";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";
import PassParticipantEvaluator from "webface/wef/base/PassParticipantEvaluator";

export default class BaseParticipantCollector<T extends Participant> implements ParticipantCollector<T>{

    private key: string;
    private partViewer: PartViewer;
    private evaluator: ParticipantEvaluator<T> = new PassParticipantEvaluator();
    private selector: ChildrenSelector = new AllChildrenSelector();
    private participants: DirectorParticipant<T>[] = [];

    constructor(key: string, partViewer: PartViewer, evaluator?: ParticipantEvaluator<T>) {
        this.key = key;
        this.partViewer = partViewer;

        // Set evaluator jika ada
        if (evaluator !== undefined) {
            this.evaluator = evaluator;
        }
    }

    public setSelector(selector: ChildrenSelector): void {
        this.selector = selector;
    }

    public setEvaluator(evaluator: ParticipantEvaluator<T>): void {
        this.evaluator = evaluator;
    }

    public collect(): void {
        this.participants = [];
        this.discoverParticipantsFromViewers(this.partViewer);
    }

    // Discover disemua viewer yang ada.
    private discoverParticipantsFromViewers(viewer: PartViewer): void {

        // Discover hanya jika viewer adalah controller viewer
        if (viewer instanceof BaseControllerViewer) {
            let controllerViewer = <BaseControllerViewer>viewer;
            let controller = controllerViewer.getRootController();
            if (controller) {
                this.discoverParticipantsAtController(controller);
            }
        }

        // Cari di semua anakan
        let children = viewer.getChildren();
        for (var i = 0; i < children.length; i++) {
            let childViewer = children[i];
            this.discoverParticipantsFromViewers(childViewer);
        }
    }

    // Discover di semua controller yang ada
    private discoverParticipantsAtController(controller: Controller): void {

        if (controller.hasParticipant(this.key)) {
            let participants = <T[]>controller.getParticipants(this.key);
            for (let participant of participants) {
                this.participants.push(new DirectorParticipant(participant, controller));
            }
        }

        // Berikutnya collect di semua anakan
        let children = this.selector.selectChildren(controller);
        for (var i = 0; i < children.length; i++) {
            let child = children[i];
            this.discoverParticipantsAtController(child);
        }

    }

    public getParticipants(): T[] {
        let participants: T[] = [];
        for (var i = 0; i < this.participants.length; i++) {
            let participant = this.participants[i];
            participants.push(participant.getParticipant());
        }
        return participants;
    }

    public getEvaluatedParticipants(context?: any): T[] {
        let participants: T[] = [];
        for (var i = 0; i < this.participants.length; i++) {
            let participant = this.participants[i];
            if (this.evaluator.evaluate(participant, context) === true) {
                participants.push(participant.getParticipant());
            }
        }
        return participants;
    }
}
