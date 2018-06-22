const FacebookStrategy = require('passport-facebook').Strategy;
const UsersService = require('services/users');
const { ValidateUserLogin } = require('services/passport');
let { ROOT_URL } = require('config');

// if (ROOT_URL[ROOT_URL.length - 1] !== '/') {
//   ROOT_URL += '/';
// }

module.exports = passport => {
  if (
    1 &&
    1 &&
    "http://127.0.0.1:3000"
  ) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: 1,
          clientSecret: 1,
          callbackURL: `${"http://127.0.0.1:3000"}api/v1/auth/facebook/callback`,
          passReqToCallback: true,
          profileFields: ['id', 'displayName', 'picture.type(large)'],
        },
        async (req, accessToken, refreshToken, profile, done) => {
          let user;
          try {
            user = await UsersService.findOrCreateExternalUser(profile);
          } catch (err) {
            return done(err);
          }

          return ValidateUserLogin(profile, user, done);
        }
      )
    );
  } else if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'Facebook cannot be enabled, missing one of TALK_FACEBOOK_APP_ID, TALK_FACEBOOK_APP_SECRET, TALK_ROOT_URL'
    );
  }
};
