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

/**
 * Lean adalah object dengan zero arguments constructor.
 * Field access menggunakan aturan java bean.
 * Default value untuk field adalah null kecuali Map dan array.
 * Map dan array harus di inisiliasi dengan object kosong
 * 
 * Contoh:
 * 
 * export class Person {
 *   
 *   private name: string = null;
 *   private age: number = null;
 *   private married: boolean = null;
 *   private bean: Lean = null;
 *   private aliases: string[] = [];
 *   
 *   public getName(): string{
 *      return this.name;
 *   }
 *   
 *   public getAge(): number{
 *      return this.age;
 *   }
 *   
 *   public isMarried(): boolean{
 *      return this.married;
 *   }
 *   
 *   public getLean(): Lean{
 *      return this.bean;
 *   }
 *   
 *   public getAliases(): string[]{
 *      return this.aliases;
 *   }
 *
 * }
 * 
 */
export abstract class Lean {

    private leanName: string = null;

    constructor(name: string) {
        this.leanName = name;
    }

    public xLeanName(): string {
        return this.leanName;
    }

    public toString(): string {
        return "bean: {name: " + this.leanName + "}";
    }
}

export default Lean;