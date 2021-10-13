const ItemComment = require('../../Domains/comments/entities/ItemComment');
const ItemReply = require('../../Domains/replies/entities/ItemReply');

function compare(a, b) {
    if (a.date < b.date) {
        return -1;
    }
    return 1;
}

const ConvertToItemComments = (comments) => {
    const result = [];
    comments.forEach((comment) => {
        const itemComment = new ItemComment(comment);
        itemComment.checkDeleted(comment.is_delete);
        result.push(itemComment);
    });
    result.sort(compare);
    return result;
};

const ConvertToItemReplies = (replies) => {
    const result = [];
    replies.forEach((reply) => {
        const itemReply = new ItemReply(reply);
        itemReply.checkDeleted(reply.is_delete);
        result.push(itemReply);
    });
    result.sort(compare);
    return result;
};

module.exports = { ConvertToItemComments, ConvertToItemReplies };
