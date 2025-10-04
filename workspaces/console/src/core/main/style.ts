import {
  createColor,
  createFont,
  createSprite,
  createStyle,
  createUiTextUnlitMaterial,
  createUiUnlitMaterial,
} from "../lib/styledUnit";

const standardFonts = [
  "resdb:///fcff04f4bec2b3636f05ed894dc1f9a752c4cb587ee49857ec7a82abaf6ca016.ttf",
  "resdb:///c801b8d2522fb554678f17f4597158b1af3f9be3abd6ce35d5a3112a81e2bf39.ttf",
  "resdb:///4cac521169034ddd416c6deffe2eb16234863761837df677a910697ec5babd25.ttf",
  "resdb:///23e7ad7cb0a5a4cf75e07c9e0848b1eb06bba15e8fa9b8cb0579fc823c532927.ttf",
  "resdb:///415dc6290378574135b64c808dc640c1df7531973290c4970c51fdeb849cb0c5.ttf",
  "resdb:///bcda0bcc22bab28ea4fedae800bfbf9ec76d71cc3b9f851779a35b7e438a839d.otf",
] as const;

export const { StyledSpace, Color, Sprite, Material, Font } = createStyle({
  Color: {
    background: createColor([0.18, 0.18, 0.18, 1]),
    subBackground: createColor([0.25, 0.25, 0.25, 1]),
    button: createColor([0.4, 0.4, 0.4, 1]),
    text: createColor([1, 1, 1, 1]),
    textReversed: createColor([0, 0, 0, 1]),
    white: createColor([1, 1, 1, 1]),
  },
  Sprite: {
    circle: createSprite({
      url: "resdb:///427a01c03424b86b4b8ffba936e4eb6cbf4be4d6773fa1f45ec004cfb526d016.png",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
      filterMode: "Anisotropic",
      wrapModeU: "Clamp",
      wrapModeV: "Clamp",
    }),
    circleBase: createSprite({
      url: "resdb:///427a01c03424b86b4b8ffba936e4eb6cbf4be4d6773fa1f45ec004cfb526d016.png",
      rect: [0, 0, 1, 1],
      borders: [0.5, 0.5, 0.5, 0.5],
      scale: 0.1,
      fixedSize: 100,
      filterMode: "Anisotropic",
      wrapModeU: "Clamp",
      wrapModeV: "Clamp",
    }),
    base: createSprite({
      url: "resdb:///81353cfd10591df09fd2c1e85d2782b3f0da2c90aecb0fe8f0a7ee9686ca47f1.webp",
      rect: [0, 0, 1, 1],
      borders: [0.5, 0.5, 0.5, 0.5],
      scale: 1,
      fixedSize: 8,
      filterMode: "Anisotropic",
      wrapModeU: "Clamp",
      wrapModeV: "Clamp",
    }),
    button: createSprite({
      url: "resdb:///a55251726365e27870afe9a83539829d5315332c8ea1fb43f095227f53fa8c20.webp",
      rect: [0, 0, 1, 1],
      borders: [0.4318, 0.16796875, 0.4318, 0.16796875],
      scale: 1,
      fixedSize: 8,
    }),
  },
  Material: {
    base: createUiUnlitMaterial({
      alphaClip: true,
      alphaCutoff: 0.5,
      offsetFactor: 10,
      offsetUnits: 500,
    }),
    baseAlpha: createUiUnlitMaterial({
      alphaClip: true,
      alphaCutoff: 0.25,
      offsetFactor: 100,
      offsetUnits: 4000,
    }),
    front: createUiUnlitMaterial({
      alphaClip: true,
      alphaCutoff: 0.5,
      offsetFactor: 1,
      offsetUnits: 100,
    }),
    text: createUiTextUnlitMaterial({
      zWrite: "On",
      offsetFactor: -0.1,
      offsetUnits: -50,
    }),
  },
  Font: {
    main: createFont({
      urls: [
        "resdb:///529360eec9dfd688614993dbd7515bc61f7651ebae6c53dd005f6247f98b30c5",
        ...standardFonts,
      ],
    }),
  },
});
