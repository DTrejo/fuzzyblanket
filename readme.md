# fuzzyblanket

## What does this do?

- sets up your project to use alexseville/blanket according to the node.js
  instructions

### how to use / instructions
```sh
cd myproject/
npm -g install fuzzyblanket
fuzzyblanket --code src/
# your project is set up to do code coverage.
npm test
# your browser will now open up to your coverage report
```


### psuedocode
- reads package-json
- runs `npm install --save-dev blanket` if you don't already have it installed
- adds these properties to your package.json

    ```js
    scripts.posttest: 'mocha --require blanket -R html-cov > coverage.html && open coverage.html'
    scripts.blanket: {
        "pattern": "<dirname-of-your-project>/<path-to-your-code>"
    }
    ```

- prints the resulting `package.json` for your knowledge
- writes the resulting `package.json` back to the filesystem

## usage

```
Usage: fuzzyblanket [--code your/source/code] [--package your/npm/module]

Options:
  --code, -c     the location of your source files; do not include your tests!
                              [default: "/Users/david.trejo/dev/myproject/lib"]
  --package, -p  a path to the npm package to which you want to add `blanket`.
                                  [default: "/Users/david.trejo/dev/myproject"]
  --force, -f    overwrite the scripts.posttest and scripts.blanket fields in
                 package.json
  --preview      see what changes will be made to your package.json without
                 making them

```
