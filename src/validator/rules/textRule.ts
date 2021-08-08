import { ValidationRule } from "./validationRule";

export class TextRule extends ValidationRule<string> {
    private _maxLen = -1;
    private _minLen = -1;
    private _alpha = false;
    private _alphaNum = false;

    /**
     * Set maximum length of subject
     * @param len Maximum length
     */
    public maxLen(len: number): this {
        this._maxLen = len;
        return this;
    }

    /**
     * Set minimum length of subject
     * @param len Minimum length
     */
    public minLen(len: number): this {
        this._minLen = len;
        return this;
    }

    /**
     * Check if subject consists only of letters
     */
    public alpha(): this {
        this._alpha = true;
        this._alphaNum = false;
        return this;
    }

    /**
     * Check if subject consists only of letters and digits
     */
    public alphaNum(): this {
        this._alpha = false;
        this._alphaNum = true;
        return this;
    }

    protected test(): void {
        if (this.subject.length == 0) {
            if (this.isRequired) {
                this.putFailedTest("required", false, true);
                return;
            }
        }

        if (this._maxLen != -1 && this.subject.length > this._maxLen) {
            this.putFailedTest("maxlen", this.subject.length, this.maxLen);
        }

        if (this._minLen != -1 && this.subject.length < this._minLen) {
            this.putFailedTest("minlen", this.subject.length, this._minLen);
        }

        if (this._alpha && !this.subject.match("^[a-zA-Z]*$")) {
            this.putFailedTest("alpha", false, true);
        }
        if (this._alphaNum && !this.subject.match("^[a-zA-Z0-9]*$")) {
            this.putFailedTest("alphaNum", false, true);
        }
    }
}
