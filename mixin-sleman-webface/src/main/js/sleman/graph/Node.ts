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
export default class Node {

    private name: string = null;
    private sources: string[] = [];
    private targets: string[] = [];

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public sourceCount(): number {
        return this.sources.length;
    }

    public addSource(source: string): void {
        this.sources.push(source);
    }

    public getSource(index: number): string {
        return this.sources[index];
    }

    public targetCount(): number {
        return this.targets.length;
    }

    public addTarget(target: string): void {
        this.targets.push(target);
    }

    public getTarget(index: number): string {
        return this.targets[index];
    }

}