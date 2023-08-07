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
import EObject from "webface/model/EObject";

import DesignTemplate from "vegazoo/directors/templates/DesignTemplate";
import DesignTemplateRegistry from "vegazoo/directors/templates/DesignTemplateRegistry";

import ChannelEncodingRemapper from "vegazoo/directors/templates/remappers/ChannelEncodingRemapper";

export default class RuleTemplate implements DesignTemplate {

    public static MARK_TYPE = "rule";
    public static RULE = "Rule";
    public static ENCODING = {
        y: { label: "Y", datum: 0 },
    }

    public getName(): string {
        return RuleTemplate.RULE;
    }

    public getPriority(): number {
        return 9;
    }

    public getIcon(): string {
        return "mdi-ruler-square";
    }

    public getEncodingRemapper(): ChannelEncodingRemapper {
        return new RuleEncodingRemapper();
    }

    public getMarkType(): string {
        return RuleTemplate.MARK_TYPE;
    }

    public getEncodingLabel(key: string): string {
        return RuleTemplate.ENCODING[key].label;
    }

}

class RuleEncodingRemapper extends ChannelEncodingRemapper {

    public remapFeature(oldMapping: { [name: string]: EObject }): { [name: string]: EObject } {
        let newMapping: { [name: string]: EObject } = {};
        this.mapField(oldMapping, "y", newMapping, []);
        return newMapping;
    }

}

let factory = DesignTemplateRegistry.getInstance();
factory.register(RuleTemplate.MARK_TYPE, new RuleTemplate());