# woasifissmam.github.io

Personal portfolio of **Md Woasif Mehmud Issmam** (`ishuboi`) — Computer Science &
Engineering undergraduate at the Islamic University of Technology, Dhaka.

> You either build from it or you die out of it.

## What this is

A dependency-free static site. No framework, no build step, no `node_modules`.
Every piece of content lives in a JSON file, so the site grows by editing data
rather than markup — which is the point, with four semesters still to go.

**Design.** Black and lime. Two-axis cinematic navigation: chapters run
vertically, panels within a chapter run horizontally. Custom lime-slice cursor,
generated lime-slice backdrop, opt-in light mode.

## Navigating

| Input | Action |
|---|---|
| `↑` `↓` | Move between chapters |
| `←` `→` | Move within a chapter |
| `Home` / `End` | First / last chapter |
| `Esc` | Back to the top |
| `M` | Open the index |
| Scroll / swipe | Same, on both axes |

A panel taller than the window scrolls first and only then hands the gesture to
the navigator.

## Structure

```
index.html                 Panel shell — the only markup file
assets/css/style.css       Design tokens, layout, motion
assets/js/app.js           Navigation engine, renderers, cursor, letterbox
assets/js/icons.js         Generated icon paths (Simple Icons, CC0 + three drawn here)
assets/img/gallery/        Photographs
assets/resume/             Downloadable CV
data/*.json                All content
```

## Editing content

Nothing below requires touching HTML, CSS or JavaScript.

| File | Holds |
|---|---|
| `data/profile.json` | Name, motto, about, contact, social links |
| `data/projects.json` | Featured projects and the archive |
| `data/education.json` | Timeline, achievements, leadership, co-curricular |
| `data/stack.json` | Tools and languages, grouped by confidence |
| `data/interests.json` | The "Beyond" cards |
| `data/gallery.json` | Photography collections |

### Adding a project

Append one object to `featured` in `data/projects.json`. A project panel, a row
in the work index, and a pip in the horizontal track are all generated from it.
`stack` holds icon ids from `assets/js/icons.js`; `stackLabels` holds the text
shown beside them.

### Adding a photograph

Drop the file into `assets/img/gallery/`, then append one object to the relevant
collection in `data/gallery.json`. A missing file degrades to a styled
placeholder rather than a broken image.

### Adding a chapter

Add a `<div class="row">` containing one or more `<section class="panel">` to
`index.html`. Each panel needs `data-panel` (its hash) and `data-title` (its
label). The rail, the index and the keyboard map build themselves from the DOM.

## Running locally

`fetch` will not read `file://`, so serve the directory:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deployment

GitHub Pages, from the default branch root. `.nojekyll` is present so Jekyll
does not process the directory.

## Credits

Brand marks from [Simple Icons](https://simpleicons.org) (CC0 1.0). The JavaFX,
Antigravity and LinkedIn marks, the WI monogram, the lime-slice backdrop and the
cursor are drawn in this repository. Typefaces: Space Grotesk and JetBrains Mono.

AI assistance is disclosed in [`AI-USAGE.md`](AI-USAGE.md).
