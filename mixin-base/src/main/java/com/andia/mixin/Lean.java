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
package com.andia.mixin;

/**
 * Lean adalah object dengan zero arguments constructor. Field access
 * menggunakan aturan java bean. Default value untuk field adalah null kecuali
 * Map dan array. Map dan array harus di inisiliasi dengan object kosong
 * 
 * Contoh:
 * 
 * <pre>
 * export class Person {
 *   
 *   private String name = null;
 *   private Integer age = null;
 *   private Boolean married = null;
 *   private Lean lean = null;
 *   private List<String> aliases = new ArrayList<>();
 *   private Map<String, String> studies = new HashMap<>();
 *   
 *   public String getName(){
 *      return this.name;
 *   }
 *   
 *   public Integer getAge(){
 *      return this.age;
 *   }
 *   
 *   public Boolean isMarried(){
 *      return this.married;
 *   }
 *   
 *   public Lean getLean(){
 *      return this.lean;
 *   }
 *   
 *   public List<String> getAliases(){
 *      return this.aliases;
 *   }
 *
 *   public Map<Strign, String> getStudies(){
 *      return this.studies;
 *   }
 *
 * }
 * </pre>
 * 
 * @author jon
 *
 */
public abstract class Lean {

	public final static String LEAN_NAME = "leanName";

	private String leanName;

	public Lean(Class<?> leanClass) {
		this.leanName = leanClass.getSimpleName();
	}

	public String getLeanName() {
		return leanName;
	}

}
