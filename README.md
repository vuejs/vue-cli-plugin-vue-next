# vue-cli-plugin-vue-next

A Vue CLI plugin for trying out the Vue 3 beta.

This is for preview purposes only. There might be bugs and undocumented behavior differences from v2, which are expected.

Also note that if you are using VSCode, Vetur isn't updated to take advantage of Vue 3's typing yet so intellisense in Vue files may not be fully functional (especially in templates).

## Usage

```sh
# in an existing Vue CLI project
vue add vue-next
```

## What's implemented?

- [x] Add Vue 3 beta and `@vue/compiler-sfc` to the project dependencies.
- [x] Configure webpack to compile `.vue` files with the new Vue 3 compiler.
- [x] [Codemods](./generator/codemods/global-api) that automatically migrate some global API changes mentioned in [RFC-0009](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md).
- [x] Install Vuex 4.0 & Vue Router 4.0 in the project, if older versions of them are detected.
- [x] Codemods for the API changes in Vuex and Vue Router.

## TODOs

- [ ] More comprehensive codemods for breaking changes in Vue 3.
- [ ] TypeScript support
- [ ] Test utils support
