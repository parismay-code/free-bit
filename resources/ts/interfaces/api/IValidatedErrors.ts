export default interface IValidatedErrors<Fields extends string = string> {
    errors: Record<Fields, Array<string>>;
}
