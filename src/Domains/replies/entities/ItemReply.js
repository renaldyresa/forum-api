class ItemReply {
    constructor(payload) {
        this._verifyPayload(payload);

        const {
            id, username, date, content, comment_id,
        } = payload;
        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
    }

    _verifyPayload({
        id, username, date, content,
    }) {
        if (!id || !username || !date || !content) {
            throw new Error('ITEM_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
            throw new Error('ITEM_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    checkDeleted = (isDelete) => {
        if (isDelete) {
            this.content = '**balasan telah dihapus**';
        }
    }
}

module.exports = ItemReply;
