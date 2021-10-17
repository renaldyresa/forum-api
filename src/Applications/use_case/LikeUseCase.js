class LikeUseCase {
    constructor({ threadRepository, commentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        const { threadId, commentId, owner } = useCasePayload;
        await this._threadRepository.verifyThreadId(threadId);
        await this._commentRepository.verifyCommentId(commentId);

        const likes = await this._likeRepository.getLike(threadId, commentId, owner);

        if (!likes.length) {
            await this._likeRepository.addLike(threadId, commentId, owner);
        } else {
            await this._likeRepository.removeLike(likes[0].id);
        }
    }

    _validateUseCasePayload(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;
        if (!threadId || !commentId || !owner) {
            throw new Error('PUT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
            throw new Error('PUT_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = LikeUseCase;
