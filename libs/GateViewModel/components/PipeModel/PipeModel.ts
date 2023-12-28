export class PipeModel {
    static readonly getPipeId = (pipe: [string, string]) => {
        return pipe[0] + pipe[1];
    }
    private readonly _id;
    private readonly _source;
    private readonly _target;

    constructor(pipe: [string, string]) {
        this._id = PipeModel.getPipeId(pipe);
        this._source = pipe[0];
        this._target = pipe[1];
    }

    get id() {
        return this._id;
    }

    get source() {
        return this._source;
    }

    get target() {
        return this._target;
    }
}