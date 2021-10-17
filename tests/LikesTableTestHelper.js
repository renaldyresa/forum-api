/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
    async addLikes({
        id = 'like-123', thread_id = 'thread-123', comment_id = 'comment-123', owner = 'user-123'
    }) {
        const query = {
            text: 'INSERT INTO likes VALUES ($1, $2, $3, $4)',
            values: [id, thread_id, comment_id, owner],
        };

        await pool.query(query);
    },

    async findLikeById(id) {
        const query = {
            text: 'SELECT * FROM likes WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes WHERE 1=1');
    },

};

module.exports = LikesTableTestHelper;