# Alpha channel on a 3D model

A colour has three numbers: red, green and blue. The **alpha channel** is a fourth, from 0 (nothing there) to 1 (fully solid). It does not change the colour. It says how much of that colour to put on screen and how much of whatever is behind to keep.

**[Try it in the browser](./index.html)**: a textured knot and two glass panes drawn four ways (alpha ignored, blended, blended with depth written, and cutout), with the blending sum for one pixel worked out live.

## Where alpha lives on a model

| Place | What it does | Example |
|---|---|---|
| A texture (RGBA image: PNG, TGA, WebP) | Alpha varies across the surface | Leaves, fences, hair cards, decals |
| The material | One opacity for the whole surface | Tinted glass (glTF: the fourth value of `baseColorFactor`) |
| Vertex colours | Alpha at each vertex, blended across the triangle | Soft fades on particles |

## Three ways to draw it

| Mode (glTF `alphaMode`) | What happens | Good for | Watch out for |
|---|---|---|---|
| `OPAQUE` | Alpha is ignored | Solid objects | Holes in a texture show whatever colour is stored there |
| `MASK` | Pixels below the cutoff (default 0.5) are thrown away, the rest are solid | Foliage, fences | Jagged edges; thin leaves fade or shimmer at a distance |
| `BLEND` | Mixed with what is behind: `result = colour × α + behind × (1 − α)` | Glass, smoke, ghosts | Drawing order |

Worked example: red `(255, 0, 0)` at α = 0.6 over blue `(0, 0, 255)` gives `(153, 0, 102)`.

## Things that commonly go wrong

- **Sorting.** Blending is not commutative (red over blue is not blue over red). Draw opaque things first, then transparent ones from far to near. Surfaces that cross each other cannot always be sorted. Writing depth for a transparent surface (the third mode on the page) makes a near pane hide what is behind it, even where it is see-through.
- **Straight versus premultiplied alpha.** Straight alpha stores the colour unscaled and multiplies on blending. Premultiplied stores `colour × α` already and blends as `colour + behind × (1 − α)`. Mixing the two up gives dark or bright fringes.
- **Edge fringes.** Pixels at a cutout edge may keep the colour of the background they were painted over, so a leaf shows a halo. Artists extend the colour past the edge to avoid it.
- **Mipmaps.** Shrinking a texture averages alpha, so cutouts get fainter in the distance. Engines rescale alpha per level to keep the covered area constant.
- **Alpha-to-coverage** (with multisampling) turns a soft alpha into a dither of covered samples, which gives smoother cutout edges without sorting.

## In three.js terms

`material.opacity` is the material alpha, `material.transparent = true` turns on blending, `material.alphaTest = 0.5` is the cutout threshold, and `material.depthWrite = false` is the usual setting for blended surfaces.
