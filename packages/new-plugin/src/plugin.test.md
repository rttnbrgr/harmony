# Faux Test Suite

These are the tests for figma.

## On figma refresh

Before running this, refresh the frame.

- create shape and name the layer Foo
  - add fill color to Foo
  - add effect to Foo
- create text and name it Bar
  - add color to Bar
  - add effect to Bar
- make sure Foo and Bar are selected
- Generate Layer Styles

## Layer Styles

Concerned that the layer styles are created with Foo and Bar names.

- Color Style Foo
- Effect Style Foo
- Text Style Bar
- Color Style Bar
- Effect Style Bar

## Dedupe

Concerned with reducing duplicates.

- select Foo and Bar
- Generate Layer Styles
- should match first Layer Styles run
