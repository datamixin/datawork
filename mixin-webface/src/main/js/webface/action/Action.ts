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
import Image from "webface/graphics/Image";

export abstract class Action {

    private text: string = null;
    private visible: boolean = true;
    private enabled: boolean = true;

    constructor(text?: string) {
        this.text = text;
    }

    public getText(): string {
        return this.text;
    }

    public getImage(): Image {
        return null;
    }

    public getColor(): string {
        return null;
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public isActive(): boolean {
        return false;
    }

    public getPriority(): number {
        return -1;
    }

    public run(): void {

    }

}

export default Action;
