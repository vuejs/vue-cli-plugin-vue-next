# vue-cli-plugin-vue-next

A Vue CLI plugin for trying out the Vue 3 alpha.

This is for preview purposes only. There might be bugs and undocumented behavior differences from v2, which are expected.

Also note that if you are using VSCode, Vetur isn't updated to take advantage of Vue 3's typing yet so intellisense in Vue files may not be fully functional (especially in templates).

## Usage

```sh
# in an existing Vue CLI project
vue add vue-next
```

## What's implemented?

- [x] Add Vue 3 alpha and `@vue/complier-sfc` to the project dependencies.
- [x] Configure webpack to compile `.vue` files with the new Vue 3 compiler.
- [x] [A simple codemod](./generator/codemods/rfc09-global-api) that automatically migrates some global API changes mentioned in [RFC-0009](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md).

## TODOs

- [ ] More comprehensive codemods for breaking changes in Vue 3.
