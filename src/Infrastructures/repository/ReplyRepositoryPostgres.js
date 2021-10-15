const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(newReply, commentId, owner) {
        const { content } = newReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, commentId, content, date, owner],
        };

        const result = await this._pool.query(query);
        return new AddedReply({ ...result.rows[0] });
    }

    async getRepliesByCommentId(commentIds) {
        const query = {
            text: `SELECT replies.* , users.username 
                    FROM replies INNER JOIN users ON replies.owner = users.id 
                    WHERE replies.comment_id = ANY($1::text[])`,
            values: [commentIds],
        };

        const result = await this._pool.query(query);
        
        return result.rows;
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifyReplyId(replyId) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Balasan Id tidak ditemukan');
        }
    }

    async verifyOwnerReply(replyId, owner) {
        await this.verifyReplyId(replyId);

        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak memiliki akses pada balasan ini');
        }
    }
}

module.exports = ReplyRepositoryPostgres;
