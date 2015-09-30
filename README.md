# publish-dist

[![Build Status][travis-image]][travis-url]

> Publish dist

[travis-image]: https://img.shields.io/travis/tlvince/publish-dist.svg
[travis-url]: https://travis-ci.org/tlvince/publish-dist

## Usage

Want semantic-release to build and commit dist? Here's one approach:

1. Initialise semantic-release with your repo as normal
2. Generate a new GitHub access token (only repo/public_repo scope is required)
3. Run `travis env set CI_USER_TOKEN [token]`
4. Add a npm build script that's suitable for your project
5. Add `deploy` to `.gitignore`
6. Add `publish-dist` as a dev dependency
7. Add it as an npm deploy script
8. Add a predeploy script that runs the npm build script
9. Call `npm run deploy` after `semantic-release pre`

That's it!

See [tlvince/tlvince-semantic-release-push-dist][1] as a working example.

[1]: https://github.com/tlvince/tlvince-semantic-release-push-dist

**Pro tip**: create a machine/bot account on GitHub (generate a access token
for this account) and add it as a collaborator (with push access) to your repo.

## Author

© 2015 Tom Vincent <https://tlvince.com/contact>

## License

Released under the [MIT License](http://tlvince.mit-license.org).
