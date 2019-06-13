# css-unique-classes-loader

This loader does one only thing

- create unique class names from css

it will always export an object with two properties:

`raw` the compiled, transformed, minimized source
`map` object where keys are original classNames, values the unique ids
