#!/usr/bin/env bash

node node_modules/icon-font-generator/bin/icon-font-generator src/assets/images/icons/*.svg \
    -o src/assets/fonts/plasma-icons \
    -n PlasmaIcons \
    --csspath src/assets/scss/_icons.scss \
    --csstp tmpl/css.hbs \
    --htmlpath font-demo.html \
    --htmltp tmpl/html.hbs \
    --types "svg, ttf, woff, woff2, eot"\
    -p pi \
    --normalize \
    --center

sed -i "s/..\/fonts/src\/assets\/fonts/g" font-demo.html
