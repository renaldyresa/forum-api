const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('LikeRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addLike function', () => {
        it('should add like correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await likeRepositoryPostgres.addLike('thread-123', 'comment-123', 'user-123');

            // Assert
            const likes = await LikesTableTestHelper.findLikeById('like-123');
            expect(likes).toHaveLength(1);
        });
    });

    describe('removeLike function', () => {
        it('should throw error NotFoundError when use invalid like id', async () => {
            // Arrange
            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(likeRepositoryPostgres.removeLike('xxxx'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLikes({});

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await likeRepositoryPostgres.removeLike('like-123');

            // Assert
            const like = await LikesTableTestHelper.findLikeById('like-123');
            expect(like).toHaveLength(0);
        });
    });

    describe('getLike function', () => {
        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLikes({});

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const likes = await likeRepositoryPostgres.getLike('thread-123', 'comment-123', 'user-123');

            // Assert
            expect(likes).toHaveLength(1);
        });
    });

    describe('getLikesByCommentIds function', () => {
        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLikes({});

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const likes = await likeRepositoryPostgres.getLikesByCommentIds(['comment-123']);

            // Assert
            expect(likes).toHaveLength(1);
        });
    });
});
