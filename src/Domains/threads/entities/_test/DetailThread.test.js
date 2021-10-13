const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test',
            title: 'test',
        };

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 1234,
            title: 'test',
            body: 'test',
            date: '1223',
            username: 'resa',
        };

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when function setComments did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: '1234',
            title: 'test',
            body: 'test',
            date: '1223',
            username: 'resa',
        };

        // Action
        const detailThread = new DetailThread(payload);

        // Assert
        expect(() => detailThread.setComments('test')).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create detailThread object and function setComments correcly', () => {
        // Arrange
        const payload = {
            id: '1234',
            title: 'test',
            body: 'test',
            date: '1223',
            username: 'resa',
        };

        // Action
        const detailThread = new DetailThread(payload);
        detailThread.setComments([]);

        // Assert
        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.comments).toEqual([]);
    });
});
