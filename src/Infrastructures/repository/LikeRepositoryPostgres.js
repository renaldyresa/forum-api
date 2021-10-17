const LikeRepository = require('../../Domains/likes/LikeRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(threadId, commentId, owner) {
        const id = `like-${this._idGenerator()}`;
        
        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, threadId, commentId, owner],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('like gagal ditambahkan');
        }
    }

    async removeLike(id) {
        const query = {
            text: 'DELETE FROM likes WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('like gagal dihapus');
        }
    }

    async getLike(threadId, commentId, owner) {
        const query = {
            text: 'SELECT id FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3',
            values: [threadId, commentId, owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getLikesByCommentIds(commentIds) {
        const query = {
            text: `SELECT * FROM likes 
                    WHERE comment_id = ANY($1::text[])`,
            values: [commentIds]
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
} 

module.exports = LikeRepositoryPostgres;