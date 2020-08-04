const Project = require('../models/Project.model.js');
const { promisify } = require('../helpers.js');


const resolvers = {
    projects: user => promisify(Project.find({ members: { $elemMatch: { $eq: user.id } } })),
};

module.exports = resolvers;