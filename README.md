# publish-dist

[![Build Status][travis-image]][travis-url]

> Publish dist

A CLI tool that commits and pushes `dist` if the last commit was not made by
itself. Intended to be used as part of [semantic-release][].

Example `package.json`:

```json
{
  "name": "my-app",
  "scripts": {
    "build": "make",
    "publish-dist": "npm run build && publish-dist",
    "semantic-release": "semantic-release pre && npm run publish-dist && npm publish && semantic-release post"
  },
  "repository": {
    "url": "https://github.com/me/my-app"
  },
  "author": "Tom Vincent <npm@tlvince.com>"
}
```

[travis-image]: https://img.shields.io/travis/tlvince/publish-dist.svg
[travis-url]: https://travis-ci.org/tlvince/publish-dist
[semantic-release]: https://github.com/semantic-release/semantic-release

## Usage

At minimum, publish-dist expects:

* `dist` to exist before it is ran
* The environment variable `CI_USER_TOKEN` to be set
* To be using the `master` branch

### With semantic-release

Want semantic-release to build and commit dist? Here's one approach:

1. Initialise semantic-release with your repo as normal
2. Generate a new GitHub access token (only repo/public_repo scope is required)
3. Run `travis env set CI_USER_TOKEN [token]`
4. Add a npm build script that's suitable for your project
5. Add `publish-dist` as a dev dependency
6. Add it as an npm deploy script
7. Add a predeploy script that runs the npm build script
8. Call `npm run deploy` after `semantic-release pre`

That's it!

See [tlvince/tlvince-semantic-release-push-dist][1] as a working example.

[1]: https://github.com/tlvince/tlvince-semantic-release-push-dist

**Pro tip**: create a machine/bot account on GitHub (generate a access token
for this account) and add it as a collaborator (with push access) to your repo.
Don't forget to pass `--author-name` and `--author-email`.

## Options

### `--author-name`

The commit's author name (`git config user.name`). Defaults to `.package.json` `author`.

### `--author-email`

The commit's author email (`git config user.email`). Defaults to `.package.json` `author`.

## See also

* [publish-latest](https://www.npmjs.com/package/publish-latest)

## Author

© 2015 Tom Vincent <https://tlvince.com/contact>

## License

Released under the [MIT License](http://tlvince.mit-license.org).
