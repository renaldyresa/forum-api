const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        const newThread = new NewThread(useCasePayload);
        return this._threadRepository.addThread(newThread, useCasePayload.owner);
    }

    _validateUseCasePayload(useCasePayload) {
        const { owner } = useCasePayload;
        if (!owner) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_THEAD_ID');
        }

        if (typeof owner !== 'string') {
            throw new Error('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddThreadUseCase;
