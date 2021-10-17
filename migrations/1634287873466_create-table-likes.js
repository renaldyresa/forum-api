/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('likes', 'fk_likes.thread.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('likes', 'fk_likes.comment.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
    pgm.addConstraint('likes', 'fk_likes.user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('likes', 'fk_likes.thread.id');
    pgm.dropConstraint('likes', 'fk_likes.comment.id');
    pgm.dropConstraint('likes', 'fk_likes.user.id');
    pgm.dropConstraint('likes');
};
