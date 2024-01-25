export default interface IAuthErrors<Fields extends string = string> {
    errors: Record<Fields, Array<string>>;
}
