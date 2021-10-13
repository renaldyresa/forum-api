const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'title',
            body: 'test',
            owner: 'user-123',
        };

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedAddedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(
            new NewThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
            }),
            useCasePayload.owner,
        );
    });
});
