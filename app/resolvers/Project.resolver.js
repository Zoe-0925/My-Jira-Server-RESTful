const Issue = require('../models/Issue.model.js');
const { promisify } = require('../helpers.js');

const resolvers = {
    issues: project => promisify(Issue.find({ project: project.id }))
};

module.exports = resolvers;