const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist new thread and return added thread correctly', async () => {
        // Arrange
            const owner = 'user-123';
            await UsersTableTestHelper.addUser({ id: owner });
            const newThread = new NewThread({
                title: 'thread-title',
                body: 'thread-body',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread, owner);

            // Assert
            const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: newThread.title,
                owner,
            }));
            expect(thread).toHaveLength(1);
        });
    });

    describe('verifyThreadId function', () => {
        it('should throw NotFoundError when use invalid thread id', async () => {
            const threadId = 'thread-invalid';
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(threadRepositoryPostgres.verifyThreadId(threadId))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should run function correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action and assert
            await expect(threadRepositoryPostgres.verifyThreadId('thread-123'))
                .resolves
                .toBeUndefined();
        });
    });

    describe('getThreadById function', () => {
        it('should return Detail thread correctly', async () => {
        // Arrange
            const owner = 'user-123';
            const username = 'resa';
            const threadId = 'thread-123';
            const title = 'thread-title';
            const body = 'thread-body';
            const date = 'thread-date';

            await UsersTableTestHelper.addUser({ id: owner, username });
            await ThreadsTableTestHelper.addThread({
                id: threadId, title, body, date, owner,
            });

            const expectedDetailThread = new DetailThread({
                id: threadId,
                title,
                body,
                date,
                username,
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const detailThread = await threadRepositoryPostgres.getThreadById(threadId);

            // Assert
            expect(JSON.stringify(detailThread))
                .toStrictEqual(JSON.stringify(expectedDetailThread));
        });
    });
});
