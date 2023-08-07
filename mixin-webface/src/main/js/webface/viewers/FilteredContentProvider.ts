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
import LabelProvider from "webface/viewers/LabelProvider";
import ContentProvider from "webface/viewers/ContentProvider";

export default class FilteredContentProvider implements ContentProvider {

    protected filter: string = null;

    private provider: ContentProvider = null;
    private labelProvider: LabelProvider = null;

    constructor(provider: ContentProvider, labelProvider: LabelProvider) {
        this.provider = provider;
        this.labelProvider = labelProvider;
    }

    public setFilter(filter: string): void {
        this.filter = filter;
    }

    public getElementCount(input: any): number {

        let length = this.provider.getElementCount(input);

        if (this.filter !== null) {
            let filteredInputs = this.getFilteredInputs(input);
            length = filteredInputs.length;
        }
        return length;
    }

    public getElement(input: any, index: number): any {

        let element = this.provider.getElement(input, index);

        if (this.filter !== null) {
            let filteredInputs = this.getFilteredInputs(input);
            element = filteredInputs[index];
        }
        return element;
    }

    protected getFilteredInputs(input: any): any[] {

        let filteredInputs: any[] = [];
        if (input instanceof Array) {
            let elements = <any[]>input;
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];                
                let text = this.labelProvider.getText(element);                               
                if (text.search(this.filter) > -1) {
                    filteredInputs.push(element);
                }
            }
        }
        return filteredInputs;
    }

}
