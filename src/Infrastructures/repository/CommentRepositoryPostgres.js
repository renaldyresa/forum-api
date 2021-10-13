const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const { ConvertToItemComments } = require('../../Commons/utils');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment, threadId, owner) {
        const { content } = newComment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, threadId, content, date, owner],
        };

        const result = await this._pool.query(query);
        return new AddedComment({ ...result.rows[0] });
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('komen gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifyCommentId(commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Comment Id tidak ditemukan');
        }
    }

    async verifyOwnerComment(commentId, owner) {
        await this.verifyCommentId(commentId);

        const query = {
            text: 'SELECT owner FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak memiliki akses pada komen ini');
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete 
                    FROM comments INNER JOIN users ON comments.owner = users.id 
                    WHERE comments.thread_id = $1`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return ConvertToItemComments(result.rows);
    }
}

module.exports = CommentRepositoryPostgres;
