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
export default class TaskKey {

    private identity: string = null
    private reference: any = null;

    constructor(identity: string, reference?: any) {
        this.identity = identity;
        this.reference = reference === undefined ? null : reference;
    }

    public getIdentity(): string {
        return this.identity;
    }

    public getReference(): any {
        return this.reference;
    }

    public setReference(reference: any): void {
        this.reference = reference;
    }

}
