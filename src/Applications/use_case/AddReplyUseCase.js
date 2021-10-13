const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        await this._threadRepository.verifyThreadId(useCasePayload.threadId);
        await this._commentRepository.verifyCommentId(useCasePayload.commentId);

        const newReply = new NewReply(useCasePayload);
        return this._replyRepository.addReply(
            newReply,
            useCasePayload.commentId,
            useCasePayload.owner,
        );
    }

    _validateUseCasePayload(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;
        if (!threadId || !commentId || !owner) {
            throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
            throw new Error('ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddReplyUseCase;
