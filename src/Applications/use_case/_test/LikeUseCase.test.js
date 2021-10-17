const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
    it('should orchestrating the like action correctly if add like', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const expectedGetLikeFunc = [];

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve());

        const mockLikeRepsotory = new LikeRepository();
        mockLikeRepsotory.getLike = jest.fn(() => Promise.resolve(expectedGetLikeFunc));
        mockLikeRepsotory.addLike = jest.fn(() => Promise.resolve());

        const likeUserCase = new LikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepsotory,
        });

        // Action
        await likeUserCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepsotory.getLike).toBeCalledWith(
            useCasePayload.threadId,
            useCasePayload.commentId,
            useCasePayload.owner,
        );
        expect(mockLikeRepsotory.addLike).toBeCalledWith(
            useCasePayload.threadId,
            useCasePayload.commentId,
            useCasePayload.owner,
        );
    });
});
