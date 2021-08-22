const User = require('../models/user');

const loginForm = async (req, res, next) => {
    res.render('user/login')
}

const loginAction = async (req, res, next) => {
    req.flash('success', `Welcome back ${req.body.username}!`)
    const route = req.session.prevPage || 'rides';
    delete req.session.prevPage;
    res.redirect(route);
}

const registerForm = async (req, res, next) => {
    res.render('user/new')    
}

const registerAction = async(req, res, next) => {
    
    try {
        const {username, email, password} = req.body;
        const newUser = await new User({username, email});
        const regUser = await User.register(newUser, password);
        await regUser.save();

        req.login(regUser, e => {
            if (e) { next(e) }
            req.flash('success', 'Successfully created new account!');
            res.redirect('rides/')
        })

        
    } catch (e) {
        req.flash('error', 'Unable to create account!');
        res.redirect('register/')
    }
}

const logout = (req, res) => {
    req.logout()   
    req.flash('success', 'Successfully logged out!');
    res.redirect('/login');
}

module.exports = {loginForm, loginAction, registerForm, registerAction, logout}