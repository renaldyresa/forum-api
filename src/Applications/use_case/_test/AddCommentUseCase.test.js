const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'test',
            owner: 'user-123',
        };

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(
            new NewComment({
                content: useCasePayload.content,
            }),
            useCasePayload.threadId,
            useCasePayload.owner,
        );
    });
});
