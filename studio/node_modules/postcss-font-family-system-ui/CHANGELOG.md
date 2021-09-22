# Changes to postcss-font-family-system-ui

## 3.0.0 (2018-01-20)

##### Breaking Changes

* **main:**  removes `Fira Sans` as Firefox OS is dead
  - if you relies on the 2.x behavior, you can use the newly introduced `family` option
  ```js
  postcssSystemUiFont({
    family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI','Roboto','Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'
  })
  ```
##### Refactors

* **package:**  es6 + rollup + babel - postcss-value-parser

##### New Features

* **main:** adds `family` option to specify polyfill font-family stack

#### 2.1.4 (2018-01-17)

##### Chores

* **package:**  update @std/esm to version 0.19.5 (0723f986)

#### 2.1.3 (2018-01-13)

##### Chores

* **package:**  update @std/esm to version 0.19.2 (dee84838)

#### 2.1.2 (2018-01-09)

##### Chores

* **package:**  update @std/esm to version 0.19.1 (#35)

##### Refactors

* **main:**  simplify value parsing (#36) (7d970e9c)

#### 2.1.1 (2017-11-20)

##### Bug Fixes

* **package:** add @std/esm to dependencies (15a32854)

### 2.1.0 (2017-11-20)

##### Chores

* **package:**
  * use @std/esm as module loader (1691c6d7)
    - `@std/esm` enable us to add an ES `module` build of the package
  * ignore test files in npm package (9dfa7921)
  * use yaspeller-ci for spell check (e49a3e83)
  * remove unused clean scripts (77b36b67)
  * remove package-lock in favor of yarn lockfile (e95bb29c)
  * update yarn.lock (795b879f)
  * update lockfile (452e89b2)
  * update yaspeller to version 4.0.0 (3dfe2fe2)
  * update tap to version 10.6.0 (0d3fa960)
  * update nyc to version 11.0.2 (344b6cf8)
  * add npm package lock (50dbe1dc)
  * upgrade dependencies (134e89fe)
  * update cross-env to version 5.0.0 (5d6b9884)
* **test:** use jest as test runner (#22) (f8d483c0)
* **travis:** add greenkeeper lockfile (26500e85)

##### Documentation Changes

* **readme:**
  * reveal master branch build status (cbc3c5a1)
  * update CSS Fonts Module Level 4 draft link (ef8c1d02)

#### 2.0.1 (2017-5-8)

##### Chores

* **babelrc:** drops node 0.12 support (f1c88a74)

## 2.0.0 (2017-5-8)

##### Chores

* **package:**
  * update nyc to latest version (32b6c515)
  * upgrade dependencies (5a6924da)
  * update standard to version 10.0.0 (f9e3996d)
  * update cross-env to version 4.0.0 (7c079fc9)
  * update babel-preset-env to version 1.3.2 (0d398ac1)
  * update babel-plugin-istanbul to version 4.0.0 (f24a2407)
  * update standard to version 9.0.0 (7803b7e5)
  * update cross-env to version 3.2.3 (ed6a6017)

##### Documentation Changes

* **readme:**
  * add version table (b7ba613b)
  * minor adjustment on install process and snippet code styles (d20ffa05)

##### Bug Fixes

* **package:** update postcss to version 6.0.1 (460f7fd1)

##### Tests

* **index:** fix test title (63b21796)

#### 1.0.2 (2017-2-6)

##### Chores

* **package:**
  * update postcss to version 5.2.12 (22a4c13b)
  * remove unused babel-preset-babili (419a2207)
  * add babel-register to devDependencies (4fd6756e)
  * add keywords (ceb3ee60)

##### Refactors

* **main:** declare tree locally (569c552f)

#### 1.0.1 (2017-2-2)

##### Documentation Changes

* **readme:**
  * add missing semicolon to sample (7caa4897)
  * add Greenkeeper badge (a45179e3)
  * add badges (f8d2be69)

##### Tests

* **yaspeller:** ignore CHANGELOG.md (533a37a3)
* **travis:** drop node_js 0.12 in support matrix (b71e98cb)

## 1.0.0 (2017-2-2)

##### New Features

* **readme:** add basic readme (17b4eb5b)
* **main:** initial release (1c75288b)
