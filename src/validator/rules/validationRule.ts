import { HashMap } from "@tsalliance/sdk";
import { UniqueValidationFunction } from "../functions/uniqueValidationFunction";
import { FailedRule } from "../validator";

export abstract class ValidationRule<T> {
    private readonly _subject: T;
    private readonly _fieldname: string;
    private readonly _failedTests: Array<FailedRule> = [];
    private _required = false;
    private _uniqueValidationFunction: UniqueValidationFunction<T> = null;

    constructor(subject: T, fieldname: string) {
        this._subject = subject;
        this._fieldname = fieldname;
    }

    public get failedTests(): Array<FailedRule> {
        return this._failedTests;
    }

    public get fieldname(): string {
        return this._fieldname;
    }

    protected get subject(): T {
        return this._subject;
    }

    protected get isRequired(): boolean {
        return this._required;
    }

    /**
     * Check if a value is unique
     * @param uniqueValidationFn Function for validation
     * @return Rule instance
     */
    public unique(uniqueValidationFn: UniqueValidationFunction<T>): this {
        this._uniqueValidationFunction = uniqueValidationFn;
        return this;
    }

    /**
     * Set the field to be required
     * @returns Rule instance
     */
    public required(): this {
        this._required = true;
        return this;
    }

    /**
     * Run all required tests on a subject
     * @return True or False
     * @throws ValidationException ValidationException
     */
    public check(): boolean {
        if (this.needsValidation() && this.testInternal()) {
            this.test();
        } else {
            if (this._required) {
                this.putFailedTest("required", false, this._required);
                return false;
            }
        }

        return this._failedTests.length <= 0;
    }

    /**
     * Execute test
     */
    protected abstract test(): void;

    /**
     * Register a failed test in the registry
     * @param testName Name of the test
     * @param foundValue Value that is present
     * @param expectedValue Value that was expected
     */
    protected putFailedTest(testName: string, foundValue: any, expectedValue: any): void {
        this.checkForAndDeleteExistingTest(testName);

        this._failedTests.push({
            name: testName,
            expected: expectedValue,
            found: foundValue,
        });
    }

    /**
     * Check if a test already failed and delete from list
     * @param testName Test's name
     */
    private checkForAndDeleteExistingTest(testName: string): void {
        const item = this._failedTests.find((item: HashMap<any>) => {
            if (item["name"] === testName) {
                return item;
            }
        });

        const index = this._failedTests.indexOf(item);
        this._failedTests.splice(index, 1);
    }

    /**
     * Perform internal tests like testing for null or unique
     */
    private testInternal(): boolean {
        if (this._subject == null) {
            this.putFailedTest("required", false, true);
            return false;
        }

        if (this._uniqueValidationFunction != null && this._uniqueValidationFunction(this._subject)) {
            this.putFailedTest("unique", false, true);
        }

        return true;
    }

    /**
     * Check if a value exists and therefor if validation is required or not
     * @return True or False
     */
    private needsValidation(): boolean {
        let needsValidation: boolean;

        if (this._required) {
            return true;
        }

        // Check if subject is null, return false
        if (this._subject == undefined || this._subject == null) {
            return false;
        } else {
            if (typeof this._subject == "string") {
                needsValidation = this._subject.length != 0;
            } else {
                needsValidation = true;
            }
        }        

        return needsValidation;
    }
}
