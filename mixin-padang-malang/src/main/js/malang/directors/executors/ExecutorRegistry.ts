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
import XLearning from "malang/model/XLearning";

import Executor from "malang/directors/executors/Executor";

export default class ExecutorRegistry {

	private static instance = new ExecutorRegistry();

	private executors = new Map<string, Executor>();

	constructor() {
		if (ExecutorRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use ExecutorRegistry.getInstance() instead of new");
		}
		ExecutorRegistry.instance = this;
	}

	public static getInstance(): ExecutorRegistry {
		return ExecutorRegistry.instance;
	}

	public register(name: string, executor: Executor): void {
		this.executors.set(name, executor);
	}

	public list(): Iterable<Executor> {
		return this.executors.values();
	}

	public get(learning: XLearning): Executor {
		let eClass = learning.eClass();
		let name = eClass.getName();
		return this.executors.get(name) || null;
	}

}