# Images

## Portrait
Drop your portrait here as:

    assets/img/portrait/issmam.jpg

Recommended: square-ish, at least 800×800, under 400 KB.

## Photography gallery
Drop photographs into `assets/img/gallery/`, then add one entry to
`data/gallery.json` under the relevant collection:

```json
{ "src": "assets/img/gallery/filename.jpg", "title": "Title", "caption": "One line.", "orientation": "landscape" }
```

`orientation` is either `landscape` or `portrait` and controls how much of the
grid the photo claims. Nothing else needs to be edited — the gallery, the
lightbox and the counters are all built from that file.

Filenames currently expected by `data/gallery.json`:

- `assets/img/gallery/tiger.jpg`
- `assets/img/gallery/jellyfish.jpg`
- `assets/img/gallery/medusa.jpg`

Any slot without a file renders as a styled placeholder rather than a broken
image, so the site is never broken by a missing photograph.
