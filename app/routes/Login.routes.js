module.exports = app => {

    var router = require("express").Router();


    //router.post('/login' // , call a controller{
    //    const { email, password } = req.body;
    //   const user = db.users.list().find((user) => user.email === email);
    //   if (!(user && user.password === password)) {
    //       res.sendStatus(401);
    //       return;
    //   }
    //  const token = jwt.sign({ sub: user.id }, jwtSecret);
    //   res.send({ token });
    // });

    router.use('/api/users', router);

};