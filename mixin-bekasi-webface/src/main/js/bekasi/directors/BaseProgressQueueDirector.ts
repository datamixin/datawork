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
import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";
import AdvertiserRoster from "bekasi/ui/AdvertiserRoster";
import AdvertiserPromoter from "bekasi/ui/AdvertiserPromoter";

import ProgressQueueEntry from "bekasi/directors/ProgressQueueEntry";
import ProgressQueueDirector from "bekasi/directors/ProgressQueueDirector";

export default class BaseProgressQueueDirector implements ProgressQueueDirector {

	public static INTERVAL = 500;
	public static PASSTIME = 1000;

	private roster = new AdvertiserRoster();
	private entries: BaseProgressQueueEntry[] = [];
	private timeout: number = null;

	public registerSupport(agent: AdvertiserAgent): void {
		this.roster.register(agent);
	}

	public createQueueEntry(title: string): ProgressQueueEntry {
		let promoter = this.roster.createPromoter(title);
		let entry = new BaseProgressQueueEntry(promoter, this);
		this.entries.push(entry);
		if (this.timeout === null) {
			this.monitor();
		}
		return entry;
	}

	private monitor(): void {
		this.timeout = setTimeout(() => {
			this.doMonitor();
		}, BaseProgressQueueDirector.INTERVAL);
	}

	private doMonitor(): void {
		if (this.entries.length > 0) {
			for (let i = 0; i < this.entries.length; i++) {
				let entry = this.entries[i];
				let lifetime = entry.lifetime();
				if (lifetime > BaseProgressQueueDirector.PASSTIME) {
					entry.exhibit();
				}
			}
			this.monitor();
		} else {
			this.timeout = null;
		}
	}

	public terminate(entry: BaseProgressQueueEntry): void {
		let index = this.entries.indexOf(entry);
		this.entries.splice(index, 1);
	}

}

class BaseProgressQueueEntry implements ProgressQueueEntry {

	private begintime = new Date().getTime();
	private promoter: AdvertiserPromoter = null;
	private director: BaseProgressQueueDirector = null;

	constructor(promoter: AdvertiserPromoter, director: BaseProgressQueueDirector) {
		this.promoter = promoter;
		this.director = director;
	}

	public starttime(): number {
		return this.begintime;
	}

	public lifetime(): number {
		return new Date().getTime() - this.begintime;
	}

	public exhibit(): void {
		this.promoter.exhibit();
	}

	public progress(message: string): void {
		this.promoter.progress(message);
	}

	public raise(caution: any): void {
		this.promoter.raise(caution);
	}

	public complete(): void {
		this.promoter.complete();
		setTimeout(() => {
			this.director.terminate(this);
		}, BaseProgressQueueDirector.INTERVAL);
	}

}