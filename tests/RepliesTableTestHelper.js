/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123', comment_id = 'comment-123', content = 'reply-content', date = 'reply-date', owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5)',
            values: [id, comment_id, content, date, owner],
        };

        await pool.query(query);
    },

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
    },
};

module.exports = RepliesTableTestHelper;
