const User =  require('../../model/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (user)
          return res.status(400).json({
            message: "Admin Already Register",
          });
    
        const { firstName, lastName, email, password } = req.body;
        const _user = new User({
          firstName,
          lastName,
          email,
          password,
          userName: Math.random().toString(),
          role: 'admin'
        });
    
        _user.save((error, data) => {
          if (error) {
            return res.status(400).json({
              message: "Something went wrong",
            });
          }
          if (data) {
            return res.status(201).json({
              message: "Admin create successfully",
              user: data,
            });
          }
        });
      });
    
}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec((error, user) => {
    if(error) return res.status(400).json({ error });
      if(user){
         if(user.authenticate(req.body.password) && user.role === 'admin'){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, {expiresIn: '4h'});
            const {_id, firstName, lastName, email, role, fullName} = user;
            res.status(200).json({
                token,
                user: {_id, firstName, lastName, email, role, fullName }
            })
         }else{
             return res.status(400).json({
                 message: "Invalid Password"
             })
         }
      }else{
          return res.status(400).json({ message: "something went wrong"})
      }
    })
}
