const AM = require('./modules/account-manager');
const EM = require('./modules/email-dispatcher');
const MYSQL = require('./modules/mysql-manager');
const SQLCONST = require('./mysql_queries');

module.exports = function (app) {

    /*
     login & logout
     */

    app.get('/', function (req, res) {
        // check if the user has an auto login key saved in a cookie //
        if (req.cookies.login === undefined) {
            res.render('login', {
                title: 'Hello - Please Login To Your Account',
                registerEnabled: gConfig.enable_user_signup
            });
        } else {
            // attempt automatic login //
            AM.validateLoginKey(req.cookies.login, req.ip, function (e, o) {
                if (o) {
                    AM.autoLogin(o.user, o.pass, function (o) {
                        req.session.user = o;
                        res.redirect('/home');
                    });
                } else {
                    res.render('login', {title: 'Hello - Please Login To Your Account'});
                }
            });
        }
    });

    app.post('/', function (req, res) {
        AM.manualLogin(req.body['user'], req.body['pass'], function (e, o) {
            if (!o) {
                res.status(400).send(e);
            } else {
                req.session.user = o;
                if (req.body['remember-me'] === 'false') {
                    res.status(200).send(o);
                } else {
                    AM.generateLoginKey(o.user, req.ip, function (key) {
                        res.cookie('login', key, {maxAge: 900000});
                        res.status(200).send(o);
                    });
                }
            }
        });
    });

    app.post('/logout', function (req, res) {
        res.clearCookie('login');
        req.session.destroy(function (e) {
            res.status(200).send('ok');
        });
    });

    /*
     control panel
     */

    app.get('/home', function (req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.render('home', {
                title: 'Control Panel',
                udata: req.session.user
            });
        }
    });

    app.post('/home', function (req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            AM.updateAccount({
                id: req.session.user._id,
                name: req.body['name'],
                email: req.body['email'],
                pass: req.body['pass'],
            }, function (e, o) {
                if (e) {
                    res.status(400).send('error-updating-account');
                } else {
                    req.session.user = o.value;
                    res.status(200).send('ok');
                }
            });
        }
    });

    /*
     Town & stuff
     */

    app.get('/towns', function (req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            const connection = MYSQL.getMysqlConnection();
            connection.connect();

            let useQuery = "";

            if (req.session.user.staff === "1")
                useQuery = SQLCONST.SQL_GET_TOWN_LIST_STAFF;
            else
                useQuery = SQLCONST.SQL_GET_TOWN_LIST_MEMBER;

            connection.query(useQuery, [req.session.user.playerUUID],function (err, rows) {
                let townList = [];
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    // Loop check on each row
                    for (var row of rows)
                    {
                        // Create an object to save current row's data
                        let townDef = {
                            'TownName': row.townName,
                            'TownSize': row.numChunks,
                            'isAdminTown': row.isAdminTown,
                            'TownMayor': row.name
                        };

                        // Add object into array
                        townList.push(townDef);
                    }

                    res.render('townlist', {"townList": townList, "serverName": gConfig.server_name, "isStaff": req.session.user.staff});
                }
            });

            connection.end();
        }
    });

    /*
     new accounts
     */

    if (gConfig.enable_user_signup === true) {
        app.get('/signup', function (req, res) {
            res.render('signup', {title: 'Signup'});
    });

        app.post('/signup', function (req, res) {
            AM.addNewAccount({
                email: req.body['email'],
                user: req.body['user'],
                pass: req.body['pass'],
                staff: 0,
                accountToken: AM.createAccountSecret(),
                playerUUID: ""
            }, function (e) {
                if (e) {
                    res.status(400).send(e);
                } else {
                    res.status(200).send('ok');
                }
            });
    });
    }
    /*
     password reset
     */

    app.post('/lost-password', function (req, res) {
        let email = req.body['email'];
        AM.generatePasswordKey(email, req.ip, function (e, account) {
            if (e) {
                res.status(400).send(e);
            } else {
                EM.dispatchResetPasswordLink(account, function (e, m) {
                    if (!e) {
                        res.status(200).send('ok');
                    } else {
                        for (k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
                    }
                });
            }
        });
    });

    app.get('/reset-password', function (req, res) {
        AM.validatePasswordKey(req.query['key'], req.ip, function (e, o) {
            if (e || o == null) {
                res.redirect('/');
            } else {
                req.session.passKey = req.query['key'];
                res.render('reset', {title: 'Reset Password'});
            }
        })
    });

    app.post('/reset-password', function (req, res) {
        let newPass = req.body['pass'];
        let passKey = req.session.passKey;
        // destory the session immediately after retrieving the stored passkey //
        req.session.destroy();
        AM.updatePassword(passKey, newPass, function (e, o) {
            if (o) {
                res.status(200).send('ok');
            } else {
                res.status(400).send('unable to update password');
            }
        })
    });

    app.get('*', function (req, res) {
        res.render('404', {title: 'Page Not Found'});
    });
  
};