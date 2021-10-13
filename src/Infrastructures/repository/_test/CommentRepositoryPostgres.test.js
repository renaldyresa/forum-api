const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist new comment and return added comment correctly', async () => {
        // Arrange
            const owner = 'user-123';
            const threadId = 'thread-123';
            await UsersTableTestHelper.addUser({ id: owner });
            await ThreadsTableTestHelper.addThread({ id: threadId, owner });
            const newComment = new NewComment({
                content: 'comment-content',
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const added = await commentRepositoryPostgres.addComment(newComment, threadId, owner);

            // Assert
            const comment = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(added).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: newComment.content,
                owner,
            }));
            expect(comment).toHaveLength(1);
        });
    });

    describe('deleteComment function', () => {
        it('should throw NotFoundError when use invalid comment id', async () => {
        // Arrange
            const commentId = 'comment-invalid';
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(commentRepositoryPostgres.deleteComment(commentId))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should change value column is_delete corretly', async () => {
        // Arrange
            const commentId = 'comment-123';
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({ id: commentId });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.deleteComment(commentId);

            // Assert
            const comment = await CommentsTableTestHelper.findCommentById(commentId);
            expect(comment).toHaveLength(1);
            expect(comment[0].is_delete).toEqual(true);
        });
    });

    describe('verifyCommentId function', () => {
        it('should throw NotFoundError when use invalid comment id', async () => {
            // Arrange
            const commentId = 'comment-invalid';
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(commentRepositoryPostgres.verifyCommentId(commentId))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentId('comment-123'))
                .resolves.toBeUndefined();
        });
    });

    describe('verifyOwnerComment function', () => {
        it('should throw AuthorizationError when use invalid owner', async () => {
            // Arrange
            const invalidOwner = 'user-invalid';

            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(commentRepositoryPostgres.verifyOwnerComment('comment-123', invalidOwner))
                .rejects
                .toThrowError(AuthorizationError);
        });

        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(commentRepositoryPostgres.verifyOwnerComment('comment-123', 'user-123'))
                .resolves
                .toBeUndefined();
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should return array item comment correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

            // Assert
            expect(comments).toHaveLength(1);
        });
    });
});
