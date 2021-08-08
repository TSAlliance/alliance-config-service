import { ValidationRule } from "./validationRule";

export class NumberRule extends ValidationRule<number> {
    private _max = -1;
    private _min = -1;

    /**
     * Set maximum length of number
     * @param max Maximum
     */
    public max(max: number): this {
        this._max = max;
        return this;
    }

    /**
     * Set minimum length of number
     * @param min Minimum
     */
    public min(min: number): this {
        this._min = min;
        return this;
    }

    protected test(): void {
        if (this._max != -1 && this.subject > this._max) {
            this.putFailedTest("max", this.subject, this._max);
        }

        if (this._min != -1 && this.subject < this._min) {
            this.putFailedTest("min", this.subject, this._min);
        }
    }
}
