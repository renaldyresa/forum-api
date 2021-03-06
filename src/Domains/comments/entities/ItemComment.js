class ItemComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const {
            id, username, date, content,
        } = payload;
        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.likeCount = 0;
        this.replies = [];
    }

    _verifyPayload({
        id, username, date, content,
    }) {
        if (!id || !username || !date || !content) {
            throw new Error('ITEM_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
            throw new Error('ITEM_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    checkDeleted = (isDelete) => {
        if (isDelete) {
            this.content = '**komentar telah dihapus**';
        }
    }

    setReplies = (replies) => {
        if (typeof replies !== 'object') {
            throw new Error('ITEM_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        this.replies = replies;
    }
}

module.exports = ItemComment;
