import { ValidationRule } from "./validationRule";

export class UrlRule extends ValidationRule<string> {
    protected test(): void {
        const urlRegex =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm;

        if (!this.subject.match(urlRegex)) {
            this.putFailedTest("url", false, true);
        }
    }
}
