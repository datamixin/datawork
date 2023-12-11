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
import EClass from "webface/model/EClass";
import EObject from "webface/model/EObject";

import XLet from "sleman/model/XLet";
import XNull from "sleman/model/XNull";
import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XUnary from "sleman/model/XUnary";
import XAlias from "sleman/model/XAlias";
import XValue from "sleman/model/XValue";
import XObject from "sleman/model/XObject";
import XBinary from "sleman/model/XBinary";
import XNumber from "sleman/model/XNumber";
import XMember from "sleman/model/XMember";
import XLambda from "sleman/model/XLambda";
import XLogical from "sleman/model/XLogical";
import XPointer from "sleman/model/XPointer";
import XForeach from "sleman/model/XForeach";
import XArgument from "sleman/model/XArgument";
import XReference from "sleman/model/XReference";
import XIdentifier from "sleman/model/XIdentifier";
import XExpression from "sleman/model/XExpression";
import XAssignment from "sleman/model/XAssignment";
import XConditional from "sleman/model/XConditional";

import SExpression from "sleman/SExpression";
import ExpressionFactory from "sleman/ExpressionFactory";
import { setFactoryInstance } from "sleman/ExpressionFactory";

import SlemanFactory from "sleman/model/SlemanFactory";
import SlemanPackage from "sleman/model/SlemanPackage";

import ExpressionParser from "sleman/base/ExpressionParser";
import BaseBinaryBuilder from "sleman/base/BaseBinaryBuilder";

export default class BaseSlemanFactory extends SlemanFactory implements ExpressionFactory {

    public create(eClass: EClass): EObject {
        let name = eClass.getName();
        let ePackage = SlemanPackage.eINSTANCE;
        let eObject: any = ePackage.getEClass(name);
        return new eObject();
    }

    public createNull(): XNull {
        return new XNull();
    }

    public createText(value?: string): XText {
        let text = this.createXText();
        text.setValue(value);
        return text;
    }

    public createNumber(value?: number): XNumber {
        let model = this.createXNumber();
        model.setValue(value);
        return model;
    }

    public createLogical(value?: boolean): XLogical {
        let logical = this.createXLogical();
        logical.setValue(value);
        return logical;
    }

    public createList(elements?: XExpression[]): XList {
        let list = this.createXList();
        let items = list.getElements();
        items.addAll(elements);
        return list;
    }

    public createObject(fields?: XAssignment[]): XObject {
        let object = this.createXObject();
        let properties = object.getFields();
        properties.addAll(fields);
        return object;
    }

    public createConditional(logical?: XExpression, consequent?: XExpression, alternate?: XExpression): XConditional {
        let conditional = new XConditional();
        conditional.setLogical(logical);
        conditional.setConsequent(consequent);
        conditional.setAlternate(alternate);
        return conditional;
    }

    public createLet(variables?: XAssignment[], expression?: XExpression): XLet {
        let model = new XLet();
        model.setResult(expression);
        let elements = model.getVariables();
        elements.addAll(variables);
        return model;
    }

    public createAssignment(name?: string, expression?: XExpression): XAssignment {
        let assignment = this.createXAssignment();
        let identifier = this.createIdentifier(name);
        assignment.setName(identifier);
        assignment.setExpression(expression);
        return assignment;
    }

    public createForeach(expression?: XExpression): XForeach {
        let foreach = new XForeach();
        foreach.setExpression(expression)
        return foreach;
    }

    public createLambda(parameters?: XIdentifier[], expression?: XExpression): XLambda {
        let lambda = new XLambda();
        let items = lambda.getParameters();
        items.addAll(parameters);
        lambda.setExpression(expression)
        return lambda;
    }

    public createBinary(left?: XExpression, operator?: string, right?: XExpression): XBinary {
        let binary = new XBinary();
        binary.setLeft(left);
        binary.setOperator(operator);
        binary.setRight(right);
        return binary;
    }

    public createUnary(operator?: string, argument?: XExpression, prefix?: boolean): XUnary {
        let unary = new XUnary();
        unary.setOperator(operator);
        unary.setPrefix(prefix === undefined ? true : prefix);
        unary.setArgument(argument);
        return unary;
    }

    public createBinaryBuilder(): BaseBinaryBuilder {
        let builder = new BaseBinaryBuilder();
        return builder;
    }

    public createCall(callee?: string | XPointer, args?: XArgument[]): XCall {
        let call = this.createXCall();
        if (callee instanceof XPointer) {
            call.setCallee(<XPointer>callee);
        } else {
            let pointer = this.createReference(<string>callee);
            call.setCallee(pointer);
        }
        let items = call.getArguments();
        items.addAll(args);
        return call;
    }

    public createMember(object?: string | XPointer, property?: string | number | SExpression): XMember {
        return this.createXMember(object, property);
    }

    public createXMember(object?: string | XPointer, property?: string | number | SExpression): XMember {
        let member = new XMember();
        if (object instanceof XPointer) {
            member.setObject(<XPointer>object);
        } else {
            let pointer = this.createReference(<string>object);
            member.setObject(pointer);
        }
        if (property instanceof XExpression) {
            member.setProperty(property);
        } else if (typeof (property) === "string") {
            member.setProperty(this.createText(property));
        } else if (typeof (property) === "number") {
            member.setProperty(this.createNumber(property));
        }
        return member;
    }

    public createIdentifier(name?: string): XIdentifier {
        let identifier = this.createXIdentifier(name);
        return identifier;
    }

    public createAlias(name?: string): XAlias {
        let alias = this.createXAlias(name);
        return alias;
    }

    public createReference(identifier?: string): XReference {
        return this.createXReference(identifier);
    }

    public createArgument(expression?: XExpression): XArgument {
        let argument = new XArgument();
        argument.setExpression(expression !== undefined ? expression : null);
        return argument;
    }

    public createPointer(qualifiedName: string): XPointer {
        return this.createXPointer(qualifiedName);
    }

    public createXPointer(qualifiedName: string): XPointer {
        let names = qualifiedName.split(".");
        let pointer: XPointer = this.createXReference(names[0]);
        for (let i = 1; i < names.length; i++) {
            let name = names[i];
            let property = this.createXReference(name);
            pointer = this.createMember(pointer, property);
        }
        return pointer;
    }

    public createXAlias(name?: string): XAlias {
        let alias = new XAlias();
        alias.setName(name !== undefined ? name : null);
        return alias;
    }

    public createXReference(identifier?: string): XReference {
        let reference = new XReference();
        reference.setName(identifier !== undefined ? identifier : null);
        return reference;
    }

    public createXNull(): XNull {
        return new XNull();
    }

    public createXText(value?: string): XText {
        let expression = new XText();
        expression.setValue(value !== undefined ? value : null)
        return expression;
    }

    public createXNumber(value?: number): XNumber {
        let expression = new XNumber();
        expression.setValue(value !== undefined ? value : null)
        return expression;
    }

    public createXLogical(value?: boolean): XLogical {
        let expression = new XLogical();
        expression.setValue(value !== undefined ? value : null)
        return expression;
    }

    public createXList(...elements: XExpression[]): XList {
        let list = new XList();
        let members = list.getElements();
        for (let element of elements) {
            members.add(element);
        }
        return list;
    }

    public createXObject(...assignments: XAssignment[]): XObject {
        let object = new XObject();
        let members = object.getFields();
        for (let assignment of assignments) {
            members.add(assignment);
        }
        return object;
    }

    public createXCall(pointer?: string, ...args: (XExpression | XArgument)[]): XCall {
        let call = new XCall();
        if (pointer !== undefined) {
            let callee = this.createXPointer(pointer);
            call.setCallee(callee);
            let argList = call.getArguments();
            for (let arg of args) {
                if (arg instanceof XArgument) {
                    argList.add(arg);
                } else if (arg instanceof XExpression) {
                    let argument = this.createArgument(arg);
                    argList.add(argument);
                }
            }
        }
        return call;
    }

    public createXLet(): XLet {
        return new XLet();
    }

    public createXForeach(expression?: XExpression): XForeach {
        let foreach = new XForeach();
        foreach.setExpression(expression !== undefined ? expression : null);
        return foreach;
    }

    public createXAssignment(name?: string, expression?: XExpression): XAssignment {
        let assignment = new XAssignment();
        let identifier = this.createXIdentifier(name);
        assignment.setName(identifier !== undefined ? identifier : null);
        assignment.setExpression(expression !== undefined ? expression : null);
        return assignment;
    }

    public createXArgument(expression?: XExpression): XArgument {
        let argument = new XArgument();
        argument.setExpression(expression !== undefined ? expression : null);
        return argument;
    }

    public createXIdentifier(name?: string): XIdentifier {
        let identifier = new XIdentifier();
        identifier.setName(name !== undefined ? name : null);
        return identifier;
    }

    public createValue(data: any): XValue {
        if (data === null) {
            return this.createNull();
        } else {
            if (typeof (data) === 'string') {
                return this.createText(data);
            } else if (typeof (data) === 'number') {
                if (isNaN(data)) {
                    return this.createNull();
                } else {
                    return this.createNumber(data);
                }
            } else if (typeof (data) === 'boolean') {
                return this.createLogical(data);
            } else if (data instanceof Array) {
                let list = this.createXList();
                let elements = list.getElements();
                for (let item of data) {
                    let element = this.createValue(item);
                    elements.add(element)
                }
                return list;
            } else {
                let object = this.createXObject();
                let fields = object.getFields();
                let keys = Object.keys(data);
                for (let key of keys) {
                    let entry = data[key];
                    let value = this.createValue(entry);
                    let assignment = this.createAssignment(key, value);
                    fields.add(assignment);
                }
                return object;
            }
        }
    }

    public parse(literal: string): SExpression {
        let parser = new ExpressionParser(literal);
        return parser.getExpression();
    }

}

SlemanFactory.eINSTANCE = new BaseSlemanFactory();

setFactoryInstance(<ExpressionFactory><any>SlemanFactory.eINSTANCE);