//Cited from  https://github.com/g00glen00b/apollo-express-vue-example/blob/master/graphql-qa-clone-api/src/helpers/index.js
const promisify = query => new Promise((resolve, reject) => {
    query.exec((err, data) => {
        if (err) reject(err);
        else resolve(data);
    });
});

//Cited from  https://github.com/g00glen00b/apollo-express-vue-example/blob/master/graphql-qa-clone-api/src/helpers/index.js
const returnOnError = (operation, alternative) => {
    try {
        return operation();
    } catch (e) {
        return alternative;
    }
};

module.exports= { promisify, returnOnError };