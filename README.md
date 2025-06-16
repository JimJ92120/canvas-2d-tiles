# canvas-2d-tiles

A small **engine** to render tile-based **2D canvas** with a **top-down** view.

View [demo](https://jimj92120.github.io/canvas-2d-tiles/).

---

# setup

|        |        |
| ------ | ------ |
| `node` | `>=20` |
| `npm`  | `>=10` |

### install

```sh
# clone repository
git clone <repository-name>

# install dependencies
npm install
```

---

# commands

```sh
# start development server
npm run start

# build
npm run build
```

---

---

# engine

`src/engine/index.ts` holds the main logic.

---

## components

### scene

See `src/engine/components/Scene.ts` and `src/components/sceneRecord.ts`.

`Scene` maps the allowed positions (position where a `Player` can move to), with `0` for allowed positions (to move to) and `1` for restricted ones.  
To allow interactions, `SceneEvent` can be added through the `Scene.eventRecord`, using the parsed position where an event should be triggered.

A background image can be added, if set to `null`, the `Rendered` will display different colors based on `Scene.data` cells values.

e.g:

```ts
const eventRecord = {
  // an event at position x: 1 and y: 2
  // to trigger a Prompt to display "hello world"
  "1:2": {
    type: SceneEventType.Prompt,
    data: ["hello world"],
  },

  // an event at position x: 5 and y: 2
  // to trigger a View to display #template-id template content
  "5,2": {
    type: SceneEventType.View,
    data: "#template-id",
  },
};
```

### player

See `src/engine/components/Player.ts` and `src/components/player.ts`.

`Player` allows user to navigate through a `Scene` and interact with it.  
If the `Player` collides at a position having a `SceneEvent`, the event will be triggered.

A **sprite sheet** can be added to display a certain `Player` image and animate it.  
Required **sprite sheet** positions / offset can be set through `Player.spriteData`.  
Otherwise, the `Player` will be displayed from the `Renderer` with a simple color and a mark to indicate the direction the `Player` is facing.

---

## events

Events are triggered based on different `SceneEventType`.
Each event has its own specific data to be passed.

### load

|        |                               |
| ------ | ----------------------------- |
| event  | `SceneEventType.Load`         |
| data   | `string`                      |
|        | The `Scene.name` to be loaded |
| module | -                             |

Load a new `Scene` into the `Renderer`.

### prompt

|        |                                  |
| ------ | -------------------------------- |
| event  | `SceneEventType.Prompt`          |
| data   | `string[]`                       |
|        | The text content to be displayed |
| module | `src/engine/Prompt.ts`           |

Display a simple text content in an `<dialog>`.
Content can be separated into multiple "slides", allowing users to display the next slide item with `Prompt.nextOrHide()` method.

Multi-line breaks are supported with `\n`.

Data example:

```ts
[
  "this is some text",
  "this is some text displayed on the next slide",
  "this is some\nmulti-line content",
];
```

### view

|        |                                   |
| ------ | --------------------------------- |
| event  | `SceneEventType.View`             |
| data   | `string`                          |
|        | An existing `<template>` selector |
| module | `src/engine/View.ts`              |

Display HTML content from an existing `<template>` element in a `<dialog>`.

`<template>` content is parsed to remove the following `HTMLElement` (non-supported within the `View`):

- `<canvas>`
- `<frame>`
- `<frameset>`
- `<head>`
- `<html>`
- `<iframe>`
- `<script>`
- `<style>`
- `<svg>`

### menu

|        |                                                        |
| ------ | ------------------------------------------------------ |
| event  | `SceneEventType.Menu`                                  |
| data   | `MenuItem[]`                                           |
|        | A list of `MenuItem` with a `title` and a `SceneEvent` |
| module | `src/engine/Menu.ts`                                   |

Display a list of items in a `<dialog>`, allowing users to trigger other events.

Following `SceneTypeEvent` are not supported within a `MenuItem` and therefore can't be triggered:

- `SceneTypeEvent.Load`
- `SceneTypeEvent.Menu`

Data example:

```ts
[
  {
    title: "menu item #1",
    event: {
      type: SceneEventType.Prompt,
      data: ["this is some prompt"],
    },
  },
  {
    title: "menu item #2",
    event: {
      type: SceneEventType.View,
      data: "#template-id",
    },
  },
];
```

---

---

#
