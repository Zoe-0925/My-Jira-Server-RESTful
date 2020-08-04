const Comment = require('../models/Comment.model.js');
const { promisify } = require('../helpers.js');

const resolvers = {
    comments: issue => promisify(Comment.find({ issueId: issue.id })),
};

module.exports=resolvers;