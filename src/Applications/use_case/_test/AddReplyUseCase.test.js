const AddReplyUseCase = require('../AddReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'test',
            owner: 'user-123',
        };

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply));

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve());

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());

        const addReplyUseCase = new AddReplyUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId);
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
        expect(mockReplyRepository.addReply).toBeCalledWith(
            new NewReply({
                content: useCasePayload.content,
            }),
            useCasePayload.commentId,
            useCasePayload.owner,
        );
    });
});
