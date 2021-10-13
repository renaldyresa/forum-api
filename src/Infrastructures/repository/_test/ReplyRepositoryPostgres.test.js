const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist new reply and return added reply correctly', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const newReply = new NewReply({
                content: 'reply-content',
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedReply = await replyRepositoryPostgres.addReply(newReply, 'comment-123', 'user-123');

            // Assert
            const reply = await RepliesTableTestHelper.findReplyById('reply-123');
            expect(addedReply).toStrictEqual(new AddedReply({
                id: 'reply-123',
                content: newReply.content,
                owner: 'user-123',
            }));
            expect(reply).toHaveLength(1);
        });
    });

    describe('deleteReply function', () => {
        it('should throw NotFoundError when use invalid reply id', async () => {
        // Arrange
            const replyInvalid = 'reply-invalid';
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(replyRepositoryPostgres.deleteReply(replyInvalid))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should change value from column is_delete corretly', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await replyRepositoryPostgres.deleteReply('reply-123');

            // Assert
            const reply = await RepliesTableTestHelper.findReplyById('reply-123');
            expect(reply).toHaveLength(1);
            expect(reply[0].is_delete).toEqual(true);
        });
    });

    describe('verifyReplyId function', () => {
        it('should throw NotFoundError when use invalid reply id', async () => {
            const replyId = 'reply-invalid';
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(replyRepositoryPostgres.verifyReplyId(replyId))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should run correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(replyRepositoryPostgres.verifyReplyId('reply-123'))
                .resolves
                .toBeUndefined();
        });
    });

    describe('verifyOwnerReply function', () => {
        it('should throw AuthorizationError when use invalid owner', async () => {
            // Arrange
            const invalidOwner = 'user-invalid';

            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(replyRepositoryPostgres.verifyOwnerReply('reply-123', invalidOwner))
                .rejects
                .toThrowError(AuthorizationError);
        });

        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(replyRepositoryPostgres.verifyOwnerReply('reply-123', 'user-123'))
                .resolves
                .toBeUndefined();
        });
    });

    describe('getRepliesByCommentId function', () => {
        it('should return array item reply correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

            // Assert
            expect(replies).toHaveLength(1);
        });
    });
});
