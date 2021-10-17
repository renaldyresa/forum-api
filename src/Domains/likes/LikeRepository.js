class LikeRepository {
    async addLike(threadId, commentId, owner) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async removeLike(id) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLike(threadId, commentId, owner) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikesByCommentIds(commentIds) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeRepository;
