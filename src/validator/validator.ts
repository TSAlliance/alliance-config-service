import { ValidationRule } from "./rules/validationRule";
import { TextRule } from "./rules/textRule";
import { EmailRule } from "./rules/emailRule";
import { PasswordRule } from "./rules/passwordRule";
import { UrlRule } from "./rules/urlRule";
import { NumberRule } from "./rules/numberRule";

import { ApiError } from "src/error/exceptionFilter";
import { Injectable, Scope } from "@nestjs/common";

export interface FailedRule {
    name: string;
    expected: any;
    found: any;
}

export interface ValidationError {
    fieldname: string;
    errors: FailedRule[];
}

@Injectable({scope: Scope.REQUEST})
export class Validator {
    private _rules: Array<ValidationRule<any>> = [];

    public text(fieldname: string, subject: string): TextRule {
        const rule = new TextRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public email(fieldname: string, subject: string): EmailRule {
        const rule = new EmailRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public password(fieldname: string, subject: string): PasswordRule {
        const rule = new PasswordRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public url(fieldname: string, subject: string): UrlRule {
        const rule = new UrlRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public number(fieldname: string, subject: number): NumberRule {
        const rule = new NumberRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public throwErrors(): void {
        const errors: Array<ValidationError> = this._rules
            .filter((rule) => rule.failedTests.length > 0)
            .map((rule) => {
                return {
                    fieldname: rule.fieldname,
                    errors: rule.failedTests
                };
            });

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
}

export class ValidationException extends ApiError {

    private errors?: ValidationError[];

    constructor(errors?: ValidationError[]) {
        super("Failed validating a value.", 400, "VALIDATION_ERROR", false);
        this.errors = errors;
    }

    public getResponse(): Record<string, unknown> {
        const response = this.errorDto.toResponse();
        response.details = this.errors;
        return response;
    }
}
