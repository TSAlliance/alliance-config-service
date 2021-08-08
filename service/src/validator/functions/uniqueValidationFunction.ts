export interface UniqueValidationFunction<SubjectType> {
    (subject: SubjectType): boolean;
}
