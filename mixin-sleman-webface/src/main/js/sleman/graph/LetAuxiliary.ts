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
import * as util from "webface/model/util";

import * as functions from "webface/util/functions";

import Node from "sleman/graph/Node";
import Graph from "sleman/graph/Graph";

import XLet from "sleman/model/XLet";
import XCall from "sleman/model/XCall";
import XMember from "sleman/model/XMember";
import * as model from "sleman/model/model";
import XPointer from "sleman/model/XPointer";
import XConstant from "sleman/model/XConstant";
import XReference from "sleman/model/XReference";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import InspectorFactory from "sleman/inspectors/InspectorFactory";

export default class LetAuxiliary {

	public static RESULT = "Result";

	private static VALUE = "Value";

	private model: XLet = null;
	private graph: Graph = null;

	public constructor(model: XLet) {
		this.model = model;
		this.populateGraph();
	}

	public getModel(): XLet {
		return this.model;
	}

	public static create(model: XExpression): LetAuxiliary {
		if (model instanceof XLet) {
			return new LetAuxiliary(model);
		} else {
			let factory = SlemanFactory.eINSTANCE;
			let xLet = factory.createXLet();
			let variables = xLet.getVariables();
			let variable = factory.createXAssignment(LetAuxiliary.RESULT, model);
			variables.add(variable);
			let reference = factory.createXReference(LetAuxiliary.RESULT);
			xLet.setResult(reference);
			return new LetAuxiliary(xLet);
		}
	}

	private populateGraph(): void {

		this.graph = new Graph();

		// Buat node
		this.forEachVariableName(this.model, (_variable: XAssignment, name: string) => {
			let node = new Node(name);
			this.graph.addNode(node);
		});

		// Kumpulkan sources dan targets
		this.forEachVariableName(this.model, (variable: XAssignment, name: string) => {

			// Kumpulkan semua pointers untuk node ini
			let expression = variable.getExpression();
			let factory = InspectorFactory.getInstance();
			let inspector = factory.create(expression);
			let expressions: XExpression[] = [];
			inspector.collect(XPointer, expressions, expression);

			for (let pointer of expressions) {
				if (pointer instanceof XReference) {
					let sourceName = pointer.getName();
					if (this.graph.containsNode(sourceName)) {

						// Daftar sourceName sebagai source bagi current node
						let currentNode = this.graph.getNode(name);
						if (name !== sourceName) {
							currentNode.addSource(sourceName);
						}

						// Daftar node sebagai target bagi source
						let sourceNode = this.graph.getNode(sourceName);
						if (name !== sourceName) {
							sourceNode.addTarget(name);
						}
					}
				}
			}
		});
	}

	private forEachVariableName(model: XLet, callback: (variable: XAssignment, name: string) => void): void {
		let variables = model.getVariables();
		for (let i = 0; i < variables.size; i++) {
			let variable = variables.get(i);
			let identifier = variable.getName();
			let name = identifier.getName();
			callback(variable, name);
		}
	}

	public removeVariable(name: string): void {

		let node = this.graph.getNode(name);
		if (node !== null) {
			let supportedNodes = [name];
			this.collectSupportedNodes(supportedNodes, node);

			// Tambahkan command untuk replace expression menjadi variable terakhir
			let resultName: string = null;
			this.forEachVariableName(this.model, (_variable: XAssignment, name: string) => {
				if (supportedNodes.indexOf(name) === -1) {
					resultName = name;
				}
			});

			let factory = SlemanFactory.eINSTANCE;
			let replacement: XExpression = null;
			if (resultName !== null) {
				replacement = factory.createXReference(resultName)
			} else {
				replacement = factory.createXNumber(0);
			}
			this.model.setResult(replacement);

			// Tambah command untuk hapus semua supported variable
			for (let node of supportedNodes) {
				this.forEachVariableName(this.model, (variable: XAssignment, name: string) => {
					if (name === node) {
						util.remove(variable);
					}
				});
			}

			this.populateGraph();
		}
	}

	private collectSupportedNodes(nodes: string[], node: Node) {
		for (let i = 0; i < node.targetCount(); i++) {
			let targetName = node.getTarget(i);
			if (nodes.indexOf(targetName) === -1) {
				nodes.push(targetName);
			}
			let target = this.graph.getNode(targetName);
			this.collectSupportedNodes(nodes, target);
		}
	}

	public addVariable(expression: XExpression): string {
		if (expression instanceof XCall) {
			return this.addCallVariable(expression);
		} else {
			return this.addExpressionVariable(LetAuxiliary.VALUE, expression);
		}
	}

	public addCallVariable(call: XCall): string {

		// Ambil call callee untuk nama variable pertama
		let callee = call.getCallee();
		let variableName: string = null;
		if (callee instanceof XMember) {
			let member = <XMember>callee;
			let property = member.getProperty();
			if (property instanceof XReference) {
				variableName = property.getName();
			} else {
				variableName = (<XConstant>property).toValue();
			}
		} else {
			let reference = <XReference>callee;
			variableName = reference.getName();
		}

		return this.addExpressionVariable(variableName, call);
	}

	public addDefaultVariable(expression: XExpression): string {
		let eClass = expression.eClass();
		let name: string = eClass.getName();
		let length = model.URI.length;
		name = name.substring(length + 1);
		return this.addExpressionVariable(name, expression);
	}

	public addExpressionVariable(name: string, expression: XExpression): string {

		// Buat variable dan berikan nama yang unique
		let names = this.listVariableNames();
		let unique = functions.getIncrementedName(name, names);

		let factory = SlemanFactory.eINSTANCE;
		let variable = factory.createXAssignment(unique, expression);

		// Tambahkan ke variables
		let variables = this.model.getVariables();
		variables.add(variable);

		// Jadikan ke result
		let reference = factory.createXReference(unique);
		this.model.setResult(reference);

		this.populateGraph();
		return unique;
	}

	public getCallVariable(name: string): XCall {
		let variables = this.model.getVariables();
		for (let i = 0; i < variables.size; i++) {
			let variable = variables.get(i);
			let identifier = variable.getName();
			if (identifier.getName() === name) {
				let expression = variable.getExpression();
				return <XCall>expression;
			}
		}
		return null;
	}

	public listUsedVariablesBy(result: string): string[] {
		let node = this.graph.getNode(result);
		let supportingNodes: string[] = [];
		this.collectSupportingNodes(supportingNodes, node);
		return supportingNodes;
	}

	public removeUnusedVariablesBy(result: string): void {

		// Cari semua variable yang digunakan untuk membangun result
		let usedNames = this.listUsedVariablesBy(result);
		let names = this.listVariableNames();
		for (let i = 0; i < names.length; i++) {

			// Hapus variable yang tidak digunakan agar minimal
			let name = names[i];
			if (usedNames.indexOf(name) === -1 && name !== result) {
				let variables = this.model.getVariables();
				for (let j = 0; j < variables.size; j++) {
					let variable = variables.get(j);
					let identifier = variable.getName();
					if (identifier.getName() === name) {
						variables.remove(variable);
						break;
					}
				}
			}
		}
	}

	public simplifyOnlyForVariable(name: string): void {

		// Lihat apakan ada variable tersebut
		let names = this.listVariableNames();
		if (names.indexOf(name) !== -1) {

			// Hapus variable yang tidak digunakan
			this.removeUnusedVariablesBy(name);

			// Setting result menjadi literal
			let factory = SlemanFactory.eINSTANCE;
			let result = factory.createXReference(name);
			this.model.setResult(result);

		}
	}

	private collectSupportingNodes(nodes: string[], node: Node) {
		for (let i = 0; i < node.sourceCount(); i++) {
			let sourceName = node.getSource(i);
			if (nodes.indexOf(sourceName) === -1) {
				nodes.push(sourceName);
			}
			let target = this.graph.getNode(sourceName);
			this.collectSupportingNodes(nodes, target);
		}
	}

	public isExistsVariable(name: string): boolean {
		let names = this.listVariableNames();
		return names.indexOf(name) !== -1;
	}

	public listVariableNames(): string[] {
		let names: string[] = [];
		this.forEachVariableName(this.model, (_variable: XAssignment, name: string) => {
			names.push(name);
		});
		return names;
	}

	public getResultName(): string {
		let result = <XReference>this.model.getResult();
		return result.getName();
	}

}