export class InvalidTallyError extends Error {
    public constructor(message: string | undefined = undefined) {
        super(message);
    }
}
