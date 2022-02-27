

const ex = {
    getCss_border,
    getObj_border,
    getValueUnit,
    getTransform,
    colors2rgba,
    format2colors,
    getDefault,
    getMiddleNode,
    colorCheck,
    jsonParse,
    getPathPointLines,
    css2json,
    getPointFromPath,
    toCamelCase,
    getDfromPoint,
    getPointFromPoints,
    transToPoint,
    utf8Length,
    json2css
}

module.exports = ex

const colorMap = {
    snow: { rgba: { r: 255, g: 250, b: 250, a: 1 } },
    ghostwhite: { rgba: { r: 248, g: 248, b: 255, a: 1 } },
    whitesmoke: { rgba: { r: 245, g: 245, b: 245, a: 1 } },
    gainsboro: { rgba: { r: 220, g: 220, b: 220, a: 1 } },
    floralwhite: { rgba: { r: 255, g: 250, b: 240, a: 1 } },
    oldlace: { rgba: { r: 253, g: 245, b: 230, a: 1 } },
    linen: { rgba: { r: 250, g: 240, b: 230, a: 1 } },
    antiquewhite: { rgba: { r: 250, g: 235, b: 215, a: 1 } },
    papayawhip: { rgba: { r: 255, g: 239, b: 213, a: 1 } },
    blanchedalmond: { rgba: { r: 255, g: 235, b: 205, a: 1 } },
    bisque: { rgba: { r: 255, g: 228, b: 196, a: 1 } },
    peachpuff: { rgba: { r: 255, g: 218, b: 185, a: 1 } },
    navajowhite: { rgba: { r: 255, g: 222, b: 173, a: 1 } },
    moccasin: { rgba: { r: 255, g: 228, b: 181, a: 1 } },
    cornsilk: { rgba: { r: 255, g: 248, b: 220, a: 1 } },
    ivory: { rgba: { r: 255, g: 255, b: 240, a: 1 } },
    lemonchiffon: { rgba: { r: 255, g: 250, b: 205, a: 1 } },
    seashell: { rgba: { r: 255, g: 245, b: 238, a: 1 } },
    honeydew: { rgba: { r: 240, g: 255, b: 240, a: 1 } },
    mintcream: { rgba: { r: 245, g: 255, b: 250, a: 1 } },
    azure: { rgba: { r: 240, g: 255, b: 255, a: 1 } },
    aliceblue: { rgba: { r: 240, g: 248, b: 255, a: 1 } },
    lavender: { rgba: { r: 230, g: 230, b: 250, a: 1 } },
    lavenderblush: { rgba: { r: 255, g: 240, b: 245, a: 1 } },
    mistyrose: { rgba: { r: 255, g: 228, b: 225, a: 1 } },
    white: { rgba: { r: 255, g: 255, b: 255, a: 1 } },
    black: { rgba: { r: 0, g: 0, b: 0, a: 1 } },
    darkslategray: { rgba: { r: 47, g: 79, b: 79, a: 1 } },
    dimgrey: { rgba: { r: 105, g: 105, b: 105, a: 1 } },
    slategrey: { rgba: { r: 112, g: 128, b: 144, a: 1 } },
    lightslategray: { rgba: { r: 119, g: 136, b: 153, a: 1 } },
    grey: { rgba: { r: 190, g: 190, b: 190, a: 1 } },
    lightgray: { rgba: { r: 211, g: 211, b: 211, a: 1 } },
    midnightblue: { rgba: { r: 25, g: 25, b: 112, a: 1 } },
    navyblue: { rgba: { r: 0, g: 0, b: 128, a: 1 } },
    cornflowerblue: { rgba: { r: 100, g: 149, b: 237, a: 1 } },
    darkslateblue: { rgba: { r: 72, g: 61, b: 139, a: 1 } },
    slateblue: { rgba: { r: 106, g: 90, b: 205, a: 1 } },
    mediumslateblue: { rgba: { r: 123, g: 104, b: 238, a: 1 } },
    lightslateblue: { rgba: { r: 132, g: 112, b: 255, a: 1 } },
    mediumblue: { rgba: { r: 0, g: 0, b: 205, a: 1 } },
    royalblue: { rgba: { r: 65, g: 105, b: 225, a: 1 } },
    blue: { rgba: { r: 0, g: 0, b: 255, a: 1 } },
    dodgerblue: { rgba: { r: 30, g: 144, b: 255, a: 1 } },
    deepskyblue: { rgba: { r: 0, g: 191, b: 255, a: 1 } },
    skyblue: { rgba: { r: 135, g: 206, b: 235, a: 1 } },
    lightskyblue: { rgba: { r: 135, g: 206, b: 250, a: 1 } },
    steelblue: { rgba: { r: 70, g: 130, b: 180, a: 1 } },
    lightsteelblue: { rgba: { r: 176, g: 196, b: 222, a: 1 } },
    lightblue: { rgba: { r: 173, g: 216, b: 230, a: 1 } },
    powderblue: { rgba: { r: 176, g: 224, b: 230, a: 1 } },
    paleturquoise: { rgba: { r: 175, g: 238, b: 238, a: 1 } },
    darkturquoise: { rgba: { r: 0, g: 206, b: 209, a: 1 } },
    mediumturquoise: { rgba: { r: 72, g: 209, b: 204, a: 1 } },
    turquoise: { rgba: { r: 64, g: 224, b: 208, a: 1 } },
    cyan: { rgba: { r: 0, g: 255, b: 255, a: 1 } },
    lightcyan: { rgba: { r: 224, g: 255, b: 255, a: 1 } },
    cadetblue: { rgba: { r: 95, g: 158, b: 160, a: 1 } },
    mediumaquamarine: { rgba: { r: 102, g: 205, b: 170, a: 1 } },
    aquamarine: { rgba: { r: 127, g: 255, b: 212, a: 1 } },
    darkgreen: { rgba: { r: 0, g: 100, b: 0, a: 1 } },
    darkolivegreen: { rgba: { r: 85, g: 107, b: 47, a: 1 } },
    darkseagreen: { rgba: { r: 143, g: 188, b: 143, a: 1 } },
    seagreen: { rgba: { r: 46, g: 139, b: 87, a: 1 } },
    mediumseagreen: { rgba: { r: 60, g: 179, b: 113, a: 1 } },
    lightseagreen: { rgba: { r: 32, g: 178, b: 170, a: 1 } },
    palegreen: { rgba: { r: 152, g: 251, b: 152, a: 1 } },
    springgreen: { rgba: { r: 0, g: 255, b: 127, a: 1 } },
    lawngreen: { rgba: { r: 124, g: 252, b: 0, a: 1 } },
    green: { rgba: { r: 0, g: 255, b: 0, a: 1 } },
    chartreuse: { rgba: { r: 127, g: 255, b: 0, a: 1 } },
    medspringgreen: { rgba: { r: 0, g: 250, b: 154, a: 1 } },
    greenyellow: { rgba: { r: 173, g: 255, b: 47, a: 1 } },
    lime: { rgba: { r: 0, g: 255, b: 0, a: 1, } },
    limegreen: { rgba: { r: 50, g: 205, b: 50, a: 1 } },
    yellowgreen: { rgba: { r: 154, g: 205, b: 50, a: 1 } },
    forestgreen: { rgba: { r: 34, g: 139, b: 34, a: 1 } },
    olivedrab: { rgba: { r: 107, g: 142, b: 35, a: 1 } },
    darkkhaki: { rgba: { r: 189, g: 183, b: 107, a: 1 } },
    palegoldenrod: { rgba: { r: 238, g: 232, b: 170, a: 1 } },
    ltgoldenrodyello: { rgba: { r: 250, g: 250, b: 210, a: 1 } },
    lightyellow: { rgba: { r: 255, g: 255, b: 224, a: 1 } },
    yellow: { rgba: { r: 255, g: 255, b: 0, a: 1 } },
    gold: { rgba: { r: 255, g: 215, b: 0, a: 1 } },
    lightgoldenrod: { rgba: { r: 238, g: 221, b: 130, a: 1 } },
    goldenrod: { rgba: { r: 218, g: 165, b: 32, a: 1 } },
    darkgoldenrod: { rgba: { r: 184, g: 134, b: 11, a: 1 } },
    rosybrown: { rgba: { r: 188, g: 143, b: 143, a: 1 } },
    indianred: { rgba: { r: 205, g: 92, b: 92, a: 1 } },
    saddlebrown: { rgba: { r: 139, g: 69, b: 19, a: 1 } },
    sienna: { rgba: { r: 160, g: 82, b: 45, a: 1 } },
    peru: { rgba: { r: 205, g: 133, b: 63, a: 1 } },
    burlywood: { rgba: { r: 222, g: 184, b: 135, a: 1 } },
    beige: { rgba: { r: 245, g: 245, b: 220, a: 1 } },
    wheat: { rgba: { r: 245, g: 222, b: 179, a: 1 } },
    sandybrown: { rgba: { r: 244, g: 164, b: 96, a: 1 } },
    tan: { rgba: { r: 210, g: 180, b: 140, a: 1 } },
    chocolate: { rgba: { r: 210, g: 105, b: 30, a: 1 } },
    firebrick: { rgba: { r: 178, g: 34, b: 34, a: 1 } },
    brown: { rgba: { r: 165, g: 42, b: 42, a: 1 } },
    darksalmon: { rgba: { r: 233, g: 150, b: 122, a: 1 } },
    salmon: { rgba: { r: 250, g: 128, b: 114, a: 1 } },
    lightsalmon: { rgba: { r: 255, g: 160, b: 122, a: 1 } },
    orange: { rgba: { r: 255, g: 165, b: 0, a: 1 } },
    darkorange: { rgba: { r: 255, g: 140, b: 0, a: 1 } },
    coral: { rgba: { r: 255, g: 127, b: 80, a: 1 } },
    lightcoral: { rgba: { r: 240, g: 128, b: 128, a: 1 } },
    tomato: { rgba: { r: 255, g: 99, b: 71, a: 1 } },
    orangered: { rgba: { r: 255, g: 69, b: 0, a: 1 } },
    red: { rgba: { r: 255, g: 0, b: 0, a: 1 } },
    hotpink: { rgba: { r: 255, g: 105, b: 180, a: 1 } },
    deeppink: { rgba: { r: 255, g: 20, b: 147, a: 1 } },
    pink: { rgba: { r: 255, g: 192, b: 203, a: 1 } },
    lightpink: { rgba: { r: 255, g: 182, b: 193, a: 1 } },
    palevioletred: { rgba: { r: 219, g: 112, b: 147, a: 1 } },
    maroon: { rgba: { r: 176, g: 48, b: 96, a: 1 } },
    mediumvioletred: { rgba: { r: 199, g: 21, b: 133, a: 1 } },
    violetred: { rgba: { r: 208, g: 32, b: 144, a: 1 } },
    magenta: { rgba: { r: 255, g: 0, b: 255, a: 1 } },
    violet: { rgba: { r: 238, g: 130, b: 238, a: 1 } },
    plum: { rgba: { r: 221, g: 160, b: 221, a: 1 } },
    orchid: { rgba: { r: 218, g: 112, b: 214, a: 1 } },
    mediumorchid: { rgba: { r: 186, g: 85, b: 211, a: 1 } },
    darkorchid: { rgba: { r: 153, g: 50, b: 204, a: 1 } },
    darkviolet: { rgba: { r: 148, g: 0, b: 211, a: 1 } },
    blueviolet: { rgba: { r: 138, g: 43, b: 226, a: 1 } },
    purple: { rgba: { r: 160, g: 32, b: 240, a: 1 } },
    mediumpurple: { rgba: { r: 147, g: 112, b: 219, a: 1 } },
    thistle: { rgba: { r: 216, g: 191, b: 216, a: 1 } },
    snow1: { rgba: { r: 255, g: 250, b: 250, a: 1 } },
    snow2: { rgba: { r: 238, g: 233, b: 233, a: 1 } },
    snow3: { rgba: { r: 205, g: 201, b: 201, a: 1 } },
    snow4: { rgba: { r: 139, g: 137, b: 137, a: 1 } },
    seashell1: { rgba: { r: 255, g: 245, b: 238, a: 1 } },
    seashell2: { rgba: { r: 238, g: 229, b: 222, a: 1 } },
    seashell3: { rgba: { r: 205, g: 197, b: 191, a: 1 } },
    seashell4: { rgba: { r: 139, g: 134, b: 130, a: 1 } },
    antiquewhite1: { rgba: { r: 255, g: 239, b: 219, a: 1 } },
    antiquewhite2: { rgba: { r: 238, g: 223, b: 204, a: 1 } },
    antiquewhite3: { rgba: { r: 205, g: 192, b: 176, a: 1 } },
    antiquewhite4: { rgba: { r: 139, g: 131, b: 120, a: 1 } },
    bisque1: { rgba: { r: 255, g: 228, b: 196, a: 1 } },
    bisque2: { rgba: { r: 238, g: 213, b: 183, a: 1 } },
    bisque3: { rgba: { r: 205, g: 183, b: 158, a: 1 } },
    bisque4: { rgba: { r: 139, g: 125, b: 107, a: 1 } },
    peachpuff1: { rgba: { r: 255, g: 218, b: 185, a: 1 } },
    peachpuff2: { rgba: { r: 238, g: 203, b: 173, a: 1 } },
    peachpuff3: { rgba: { r: 205, g: 175, b: 149, a: 1 } },
    peachpuff4: { rgba: { r: 139, g: 119, b: 101, a: 1 } },
    navajowhite1: { rgba: { r: 255, g: 222, b: 173, a: 1 } },
    navajowhite2: { rgba: { r: 238, g: 207, b: 161, a: 1 } },
    navajowhite3: { rgba: { r: 205, g: 179, b: 139, a: 1 } },
    navajowhite4: { rgba: { r: 139, g: 121, b: 94, a: 1 } },
    lemonchiffon1: { rgba: { r: 255, g: 250, b: 205, a: 1 } },
    lemonchiffon2: { rgba: { r: 238, g: 233, b: 191, a: 1 } },
    lemonchiffon3: { rgba: { r: 205, g: 201, b: 165, a: 1 } },
    lemonchiffon4: { rgba: { r: 139, g: 137, b: 112, a: 1 } },
    cornsilk1: { rgba: { r: 255, g: 248, b: 220, a: 1 } },
    cornsilk2: { rgba: { r: 238, g: 232, b: 205, a: 1 } },
    cornsilk3: { rgba: { r: 205, g: 200, b: 177, a: 1 } },
    cornsilk4: { rgba: { r: 139, g: 136, b: 120, a: 1 } },
    ivory1: { rgba: { r: 255, g: 255, b: 240, a: 1 } },
    ivory2: { rgba: { r: 238, g: 238, b: 224, a: 1 } },
    ivory3: { rgba: { r: 205, g: 205, b: 193, a: 1 } },
    ivory4: { rgba: { r: 139, g: 139, b: 131, a: 1 } },
    honeydew1: { rgba: { r: 240, g: 255, b: 240, a: 1 } },
    honeydew2: { rgba: { r: 224, g: 238, b: 224, a: 1 } },
    honeydew3: { rgba: { r: 193, g: 205, b: 193, a: 1 } },
    honeydew4: { rgba: { r: 131, g: 139, b: 131, a: 1 } },
    lavenderblush1: { rgba: { r: 255, g: 240, b: 245, a: 1 } },
    lavenderblush2: { rgba: { r: 238, g: 224, b: 229, a: 1 } },
    lavenderblush3: { rgba: { r: 205, g: 193, b: 197, a: 1 } },
    lavenderblush4: { rgba: { r: 139, g: 131, b: 134, a: 1 } },
    mistyrose1: { rgba: { r: 255, g: 228, b: 225, a: 1 } },
    mistyrose2: { rgba: { r: 238, g: 213, b: 210, a: 1 } },
    mistyrose3: { rgba: { r: 205, g: 183, b: 181, a: 1 } },
    mistyrose4: { rgba: { r: 139, g: 125, b: 123, a: 1 } },
    azure1: { rgba: { r: 240, g: 255, b: 255, a: 1 } },
    azure2: { rgba: { r: 224, g: 238, b: 238, a: 1 } },
    azure3: { rgba: { r: 193, g: 205, b: 205, a: 1 } },
    azure4: { rgba: { r: 131, g: 139, b: 139, a: 1 } },
    slateblue1: { rgba: { r: 131, g: 111, b: 255, a: 1 } },
    slateblue2: { rgba: { r: 122, g: 103, b: 238, a: 1 } },
    slateblue3: { rgba: { r: 105, g: 89, b: 205, a: 1 } },
    slateblue4: { rgba: { r: 71, g: 60, b: 139, a: 1 } },
    royalblue1: { rgba: { r: 72, g: 118, b: 255, a: 1 } },
    royalblue2: { rgba: { r: 67, g: 110, b: 238, a: 1 } },
    royalblue3: { rgba: { r: 58, g: 95, b: 205, a: 1 } },
    royalblue4: { rgba: { r: 39, g: 64, b: 139, a: 1 } },
    blue1: { rgba: { r: 0, g: 0, b: 255, a: 1 } },
    blue2: { rgba: { r: 0, g: 0, b: 238, a: 1 } },
    blue3: { rgba: { r: 0, g: 0, b: 205, a: 1 } },
    blue4: { rgba: { r: 0, g: 0, b: 139, a: 1 } },
    dodgerblue1: { rgba: { r: 30, g: 144, b: 255, a: 1 } },
    dodgerblue2: { rgba: { r: 28, g: 134, b: 238, a: 1 } },
    dodgerblue3: { rgba: { r: 24, g: 116, b: 205, a: 1 } },
    dodgerblue4: { rgba: { r: 16, g: 78, b: 139, a: 1 } },
    steelblue1: { rgba: { r: 99, g: 184, b: 255, a: 1 } },
    steelblue2: { rgba: { r: 92, g: 172, b: 238, a: 1 } },
    steelblue3: { rgba: { r: 79, g: 148, b: 205, a: 1 } },
    steelblue4: { rgba: { r: 54, g: 100, b: 139, a: 1 } },
    deepskyblue1: { rgba: { r: 0, g: 191, b: 255, a: 1 } },
    deepskyblue2: { rgba: { r: 0, g: 178, b: 238, a: 1 } },
    deepskyblue3: { rgba: { r: 0, g: 154, b: 205, a: 1 } },
    deepskyblue4: { rgba: { r: 0, g: 104, b: 139, a: 1 } },
    skyblue1: { rgba: { r: 135, g: 206, b: 255, a: 1 } },
    skyblue2: { rgba: { r: 126, g: 192, b: 238, a: 1 } },
    skyblue3: { rgba: { r: 108, g: 166, b: 205, a: 1 } },
    skyblue4: { rgba: { r: 74, g: 112, b: 139, a: 1 } },
    lightskyblue1: { rgba: { r: 176, g: 226, b: 255, a: 1 } },
    lightskyblue2: { rgba: { r: 164, g: 211, b: 238, a: 1 } },
    lightskyblue3: { rgba: { r: 141, g: 182, b: 205, a: 1 } },
    lightskyblue4: { rgba: { r: 96, g: 123, b: 139, a: 1 } },
    slategray1: { rgba: { r: 198, g: 226, b: 255, a: 1 } },
    slategray2: { rgba: { r: 185, g: 211, b: 238, a: 1 } },
    slategray3: { rgba: { r: 159, g: 182, b: 205, a: 1 } },
    slategray4: { rgba: { r: 108, g: 123, b: 139, a: 1 } },
    lightsteelblue1: { rgba: { r: 202, g: 225, b: 255, a: 1 } },
    lightsteelblue2: { rgba: { r: 188, g: 210, b: 238, a: 1 } },
    lightsteelblue3: { rgba: { r: 162, g: 181, b: 205, a: 1 } },
    lightsteelblue4: { rgba: { r: 110, g: 123, b: 139, a: 1 } },
    lightblue1: { rgba: { r: 191, g: 239, b: 255, a: 1 } },
    lightblue2: { rgba: { r: 178, g: 223, b: 238, a: 1 } },
    lightblue3: { rgba: { r: 154, g: 192, b: 205, a: 1 } },
    lightblue4: { rgba: { r: 104, g: 131, b: 139, a: 1 } },
    lightcyan1: { rgba: { r: 224, g: 255, b: 255, a: 1 } },
    lightcyan2: { rgba: { r: 209, g: 238, b: 238, a: 1 } },
    lightcyan3: { rgba: { r: 180, g: 205, b: 205, a: 1 } },
    lightcyan4: { rgba: { r: 122, g: 139, b: 139, a: 1 } },
    paleturquoise1: { rgba: { r: 187, g: 255, b: 255, a: 1 } },
    paleturquoise2: { rgba: { r: 174, g: 238, b: 238, a: 1 } },
    paleturquoise3: { rgba: { r: 150, g: 205, b: 205, a: 1 } },
    paleturquoise4: { rgba: { r: 102, g: 139, b: 139, a: 1 } },
    cadetblue1: { rgba: { r: 152, g: 245, b: 255, a: 1 } },
    cadetblue2: { rgba: { r: 142, g: 229, b: 238, a: 1 } },
    cadetblue3: { rgba: { r: 122, g: 197, b: 205, a: 1 } },
    cadetblue4: { rgba: { r: 83, g: 134, b: 139, a: 1 } },
    turquoise1: { rgba: { r: 0, g: 245, b: 255, a: 1 } },
    turquoise2: { rgba: { r: 0, g: 229, b: 238, a: 1 } },
    turquoise3: { rgba: { r: 0, g: 197, b: 205, a: 1 } },
    turquoise4: { rgba: { r: 0, g: 134, b: 139, a: 1 } },
    cyan1: { rgba: { r: 0, g: 255, b: 255, a: 1 } },
    cyan2: { rgba: { r: 0, g: 238, b: 238, a: 1 } },
    cyan3: { rgba: { r: 0, g: 205, b: 205, a: 1 } },
    cyan4: { rgba: { r: 0, g: 139, b: 139, a: 1 } },
    darkslategray1: { rgba: { r: 151, g: 255, b: 255, a: 1 } },
    darkslategray2: { rgba: { r: 141, g: 238, b: 238, a: 1 } },
    darkslategray3: { rgba: { r: 121, g: 205, b: 205, a: 1 } },
    darkslategray4: { rgba: { r: 82, g: 139, b: 139, a: 1 } },
    aquamarine1: { rgba: { r: 127, g: 255, b: 212, a: 1 } },
    aquamarine2: { rgba: { r: 118, g: 238, b: 198, a: 1 } },
    aquamarine3: { rgba: { r: 102, g: 205, b: 170, a: 1 } },
    aquamarine4: { rgba: { r: 69, g: 139, b: 116, a: 1 } },
    darkseagreen1: { rgba: { r: 193, g: 255, b: 193, a: 1 } },
    darkseagreen2: { rgba: { r: 180, g: 238, b: 180, a: 1 } },
    darkseagreen3: { rgba: { r: 155, g: 205, b: 155, a: 1 } },
    darkseagreen4: { rgba: { r: 105, g: 139, b: 105, a: 1 } },
    seagreen1: { rgba: { r: 84, g: 255, b: 159, a: 1 } },
    seagreen2: { rgba: { r: 78, g: 238, b: 148, a: 1 } },
    seagreen3: { rgba: { r: 67, g: 205, b: 128, a: 1 } },
    seagreen4: { rgba: { r: 46, g: 139, b: 87, a: 1 } },
    palegreen1: { rgba: { r: 154, g: 255, b: 154, a: 1 } },
    palegreen2: { rgba: { r: 144, g: 238, b: 144, a: 1 } },
    palegreen3: { rgba: { r: 124, g: 205, b: 124, a: 1 } },
    palegreen4: { rgba: { r: 84, g: 139, b: 84, a: 1 } },
    springgreen1: { rgba: { r: 0, g: 255, b: 127, a: 1 } },
    springgreen2: { rgba: { r: 0, g: 238, b: 118, a: 1 } },
    springgreen3: { rgba: { r: 0, g: 205, b: 102, a: 1 } },
    springgreen4: { rgba: { r: 0, g: 139, b: 69, a: 1 } },
    green1: { rgba: { r: 0, g: 255, b: 0, a: 1 } },
    green2: { rgba: { r: 0, g: 238, b: 0, a: 1 } },
    green3: { rgba: { r: 0, g: 205, b: 0, a: 1 } },
    green4: { rgba: { r: 0, g: 139, b: 0, a: 1 } },
    chartreuse1: { rgba: { r: 127, g: 255, b: 0, a: 1 } },
    chartreuse2: { rgba: { r: 118, g: 238, b: 0, a: 1 } },
    chartreuse3: { rgba: { r: 102, g: 205, b: 0, a: 1 } },
    chartreuse4: { rgba: { r: 69, g: 139, b: 0, a: 1 } },
    olivedrab1: { rgba: { r: 192, g: 255, b: 62, a: 1 } },
    olivedrab2: { rgba: { r: 179, g: 238, b: 58, a: 1 } },
    olivedrab3: { rgba: { r: 154, g: 205, b: 50, a: 1 } },
    olivedrab4: { rgba: { r: 105, g: 139, b: 34, a: 1 } },
    darkolivegreen1: { rgba: { r: 202, g: 255, b: 112, a: 1 } },
    darkolivegreen2: { rgba: { r: 188, g: 238, b: 104, a: 1 } },
    darkolivegreen3: { rgba: { r: 162, g: 205, b: 90, a: 1 } },
    darkolivegreen4: { rgba: { r: 110, g: 139, b: 61, a: 1 } },
    khaki1: { rgba: { r: 255, g: 246, b: 143, a: 1 } },
    khaki2: { rgba: { r: 238, g: 230, b: 133, a: 1 } },
    khaki3: { rgba: { r: 205, g: 198, b: 115, a: 1 } },
    khaki4: { rgba: { r: 139, g: 134, b: 78, a: 1 } },
    lightgoldenrod1: { rgba: { r: 255, g: 236, b: 139, a: 1 } },
    lightgoldenrod2: { rgba: { r: 238, g: 220, b: 130, a: 1 } },
    lightgoldenrod3: { rgba: { r: 205, g: 190, b: 112, a: 1 } },
    lightgoldenrod4: { rgba: { r: 139, g: 129, b: 76, a: 1 } },
    lightyellow1: { rgba: { r: 255, g: 255, b: 224, a: 1 } },
    lightyellow2: { rgba: { r: 238, g: 238, b: 209, a: 1 } },
    lightyellow3: { rgba: { r: 205, g: 205, b: 180, a: 1 } },
    lightyellow4: { rgba: { r: 139, g: 139, b: 122, a: 1 } },
    yellow1: { rgba: { r: 255, g: 255, b: 0, a: 1 } },
    yellow2: { rgba: { r: 238, g: 238, b: 0, a: 1 } },
    yellow3: { rgba: { r: 205, g: 205, b: 0, a: 1 } },
    yellow4: { rgba: { r: 139, g: 139, b: 0, a: 1 } },
    gold1: { rgba: { r: 255, g: 215, b: 0, a: 1 } },
    gold2: { rgba: { r: 238, g: 201, b: 0, a: 1 } },
    gold3: { rgba: { r: 205, g: 173, b: 0, a: 1 } },
    gold4: { rgba: { r: 139, g: 117, b: 0, a: 1 } },
    goldenrod1: { rgba: { r: 255, g: 193, b: 37, a: 1 } },
    goldenrod2: { rgba: { r: 238, g: 180, b: 34, a: 1 } },
    goldenrod3: { rgba: { r: 205, g: 155, b: 29, a: 1 } },
    goldenrod4: { rgba: { r: 139, g: 105, b: 20, a: 1 } },
    darkgoldenrod1: { rgba: { r: 255, g: 185, b: 15, a: 1 } },
    darkgoldenrod2: { rgba: { r: 238, g: 173, b: 14, a: 1 } },
    darkgoldenrod3: { rgba: { r: 205, g: 149, b: 12, a: 1 } },
    darkgoldenrod4: { rgba: { r: 139, g: 101, b: 8, a: 1 } },
    rosybrown1: { rgba: { r: 255, g: 193, b: 193, a: 1 } },
    rosybrown2: { rgba: { r: 238, g: 180, b: 180, a: 1 } },
    rosybrown3: { rgba: { r: 205, g: 155, b: 155, a: 1 } },
    rosybrown4: { rgba: { r: 139, g: 105, b: 105, a: 1 } },
    indianred1: { rgba: { r: 255, g: 106, b: 106, a: 1 } },
    indianred2: { rgba: { r: 238, g: 99, b: 99, a: 1 } },
    indianred3: { rgba: { r: 205, g: 85, b: 85, a: 1 } },
    indianred4: { rgba: { r: 139, g: 58, b: 58, a: 1 } },
    sienna1: { rgba: { r: 255, g: 130, b: 71, a: 1 } },
    sienna2: { rgba: { r: 238, g: 121, b: 66, a: 1 } },
    sienna3: { rgba: { r: 205, g: 104, b: 57, a: 1 } },
    sienna4: { rgba: { r: 139, g: 71, b: 38, a: 1 } },
    burlywood1: { rgba: { r: 255, g: 211, b: 155, a: 1 } },
    burlywood2: { rgba: { r: 238, g: 197, b: 145, a: 1 } },
    burlywood3: { rgba: { r: 205, g: 170, b: 125, a: 1 } },
    burlywood4: { rgba: { r: 139, g: 115, b: 85, a: 1 } },
    wheat1: { rgba: { r: 255, g: 231, b: 186, a: 1 } },
    wheat2: { rgba: { r: 238, g: 216, b: 174, a: 1 } },
    wheat3: { rgba: { r: 205, g: 186, b: 150, a: 1 } },
    wheat4: { rgba: { r: 139, g: 126, b: 102, a: 1 } },
    tan1: { rgba: { r: 255, g: 165, b: 79, a: 1 } },
    tan2: { rgba: { r: 238, g: 154, b: 73, a: 1 } },
    tan3: { rgba: { r: 205, g: 133, b: 63, a: 1 } },
    tan4: { rgba: { r: 139, g: 90, b: 43, a: 1 } },
    chocolate1: { rgba: { r: 255, g: 127, b: 36, a: 1 } },
    chocolate2: { rgba: { r: 238, g: 118, b: 33, a: 1 } },
    chocolate3: { rgba: { r: 205, g: 102, b: 29, a: 1 } },
    chocolate4: { rgba: { r: 139, g: 69, b: 19, a: 1 } },
    firebrick1: { rgba: { r: 255, g: 48, b: 48, a: 1 } },
    firebrick2: { rgba: { r: 238, g: 44, b: 44, a: 1 } },
    firebrick3: { rgba: { r: 205, g: 38, b: 38, a: 1 } },
    firebrick4: { rgba: { r: 139, g: 26, b: 26, a: 1 } },
    brown1: { rgba: { r: 255, g: 64, b: 64, a: 1 } },
    brown2: { rgba: { r: 238, g: 59, b: 59, a: 1 } },
    brown3: { rgba: { r: 205, g: 51, b: 51, a: 1 } },
    brown4: { rgba: { r: 139, g: 35, b: 35, a: 1 } },
    salmon1: { rgba: { r: 255, g: 140, b: 105, a: 1 } },
    salmon2: { rgba: { r: 238, g: 130, b: 98, a: 1 } },
    salmon3: { rgba: { r: 205, g: 112, b: 84, a: 1 } },
    salmon4: { rgba: { r: 139, g: 76, b: 57, a: 1 } },
    lightsalmon1: { rgba: { r: 255, g: 160, b: 122, a: 1 } },
    lightsalmon2: { rgba: { r: 238, g: 149, b: 114, a: 1 } },
    lightsalmon3: { rgba: { r: 205, g: 129, b: 98, a: 1 } },
    lightsalmon4: { rgba: { r: 139, g: 87, b: 66, a: 1 } },
    orange1: { rgba: { r: 255, g: 165, b: 0, a: 1 } },
    orange2: { rgba: { r: 238, g: 154, b: 0, a: 1 } },
    orange3: { rgba: { r: 205, g: 133, b: 0, a: 1 } },
    orange4: { rgba: { r: 139, g: 90, b: 0, a: 1 } },
    darkorange1: { rgba: { r: 255, g: 127, b: 0, a: 1 } },
    darkorange2: { rgba: { r: 238, g: 118, b: 0, a: 1 } },
    darkorange3: { rgba: { r: 205, g: 102, b: 0, a: 1 } },
    darkorange4: { rgba: { r: 139, g: 69, b: 0, a: 1 } },
    coral1: { rgba: { r: 255, g: 114, b: 86, a: 1 } },
    coral2: { rgba: { r: 238, g: 106, b: 80, a: 1 } },
    coral3: { rgba: { r: 205, g: 91, b: 69, a: 1 } },
    coral4: { rgba: { r: 139, g: 62, b: 47, a: 1 } },
    tomato1: { rgba: { r: 255, g: 99, b: 71, a: 1 } },
    tomato2: { rgba: { r: 238, g: 92, b: 66, a: 1 } },
    tomato3: { rgba: { r: 205, g: 79, b: 57, a: 1 } },
    tomato4: { rgba: { r: 139, g: 54, b: 38, a: 1 } },
    orangered1: { rgba: { r: 255, g: 69, b: 0, a: 1 } },
    orangered2: { rgba: { r: 238, g: 64, b: 0, a: 1 } },
    orangered3: { rgba: { r: 205, g: 55, b: 0, a: 1 } },
    orangered4: { rgba: { r: 139, g: 37, b: 0, a: 1 } },
    red1: { rgba: { r: 255, g: 0, b: 0, a: 1 } },
    red2: { rgba: { r: 238, g: 0, b: 0, a: 1 } },
    red3: { rgba: { r: 205, g: 0, b: 0, a: 1 } },
    red4: { rgba: { r: 139, g: 0, b: 0, a: 1 } },
    deeppink1: { rgba: { r: 255, g: 20, b: 147, a: 1 } },
    deeppink2: { rgba: { r: 238, g: 18, b: 137, a: 1 } },
    deeppink3: { rgba: { r: 205, g: 16, b: 118, a: 1 } },
    deeppink4: { rgba: { r: 139, g: 10, b: 80, a: 1 } },
    hotpink1: { rgba: { r: 255, g: 110, b: 180, a: 1 } },
    hotpink2: { rgba: { r: 238, g: 106, b: 167, a: 1 } },
    hotpink3: { rgba: { r: 205, g: 96, b: 144, a: 1 } },
    hotpink4: { rgba: { r: 139, g: 58, b: 98, a: 1 } },
    pink1: { rgba: { r: 255, g: 181, b: 197, a: 1 } },
    pink2: { rgba: { r: 238, g: 169, b: 184, a: 1 } },
    pink3: { rgba: { r: 205, g: 145, b: 158, a: 1 } },
    pink4: { rgba: { r: 139, g: 99, b: 108, a: 1 } },
    lightpink1: { rgba: { r: 255, g: 174, b: 185, a: 1 } },
    lightpink2: { rgba: { r: 238, g: 162, b: 173, a: 1 } },
    lightpink3: { rgba: { r: 205, g: 140, b: 149, a: 1 } },
    lightpink4: { rgba: { r: 139, g: 95, b: 101, a: 1 } },
    palevioletred1: { rgba: { r: 255, g: 130, b: 171, a: 1 } },
    palevioletred2: { rgba: { r: 238, g: 121, b: 159, a: 1 } },
    palevioletred3: { rgba: { r: 205, g: 104, b: 137, a: 1 } },
    palevioletred4: { rgba: { r: 139, g: 71, b: 93, a: 1 } },
    maroon1: { rgba: { r: 255, g: 52, b: 179, a: 1 } },
    maroon2: { rgba: { r: 238, g: 48, b: 167, a: 1 } },
    maroon3: { rgba: { r: 205, g: 41, b: 144, a: 1 } },
    maroon4: { rgba: { r: 139, g: 28, b: 98, a: 1 } },
    violetred1: { rgba: { r: 255, g: 62, b: 150, a: 1 } },
    violetred2: { rgba: { r: 238, g: 58, b: 140, a: 1 } },
    violetred3: { rgba: { r: 205, g: 50, b: 120, a: 1 } },
    violetred4: { rgba: { r: 139, g: 34, b: 82, a: 1 } },
    magenta1: { rgba: { r: 255, g: 0, b: 255, a: 1 } },
    magenta2: { rgba: { r: 238, g: 0, b: 238, a: 1 } },
    magenta3: { rgba: { r: 205, g: 0, b: 205, a: 1 } },
    magenta4: { rgba: { r: 139, g: 0, b: 139, a: 1 } },
    orchid1: { rgba: { r: 255, g: 131, b: 250, a: 1 } },
    orchid2: { rgba: { r: 238, g: 122, b: 233, a: 1 } },
    orchid3: { rgba: { r: 205, g: 105, b: 201, a: 1 } },
    orchid4: { rgba: { r: 139, g: 71, b: 137, a: 1 } },
    plum1: { rgba: { r: 255, g: 187, b: 255, a: 1 } },
    plum2: { rgba: { r: 238, g: 174, b: 238, a: 1 } },
    plum3: { rgba: { r: 205, g: 150, b: 205, a: 1 } },
    plum4: { rgba: { r: 139, g: 102, b: 139, a: 1 } },
    mediumorchid1: { rgba: { r: 224, g: 102, b: 255, a: 1 } },
    mediumorchid2: { rgba: { r: 209, g: 95, b: 238, a: 1 } },
    mediumorchid3: { rgba: { r: 180, g: 82, b: 205, a: 1 } },
    mediumorchid4: { rgba: { r: 122, g: 55, b: 139, a: 1 } },
    darkorchid1: { rgba: { r: 191, g: 62, b: 255, a: 1 } },
    darkorchid2: { rgba: { r: 178, g: 58, b: 238, a: 1 } },
    darkorchid3: { rgba: { r: 154, g: 50, b: 205, a: 1 } },
    darkorchid4: { rgba: { r: 104, g: 34, b: 139, a: 1 } },
    purple1: { rgba: { r: 155, g: 48, b: 255, a: 1 } },
    purple2: { rgba: { r: 145, g: 44, b: 238, a: 1 } },
    purple3: { rgba: { r: 125, g: 38, b: 205, a: 1 } },
    purple4: { rgba: { r: 85, g: 26, b: 139, a: 1 } },
    mediumpurple1: { rgba: { r: 171, g: 130, b: 255, a: 1 } },
    mediumpurple2: { rgba: { r: 159, g: 121, b: 238, a: 1 } },
    mediumpurple3: { rgba: { r: 137, g: 104, b: 205, a: 1 } },
    mediumpurple4: { rgba: { r: 93, g: 71, b: 139, a: 1 } },
    thistle1: { rgba: { r: 255, g: 225, b: 255, a: 1 } },
    thistle2: { rgba: { r: 238, g: 210, b: 238, a: 1 } },
    thistle3: { rgba: { r: 205, g: 181, b: 205, a: 1 } },
    thistle4: { rgba: { r: 139, g: 123, b: 139, a: 1 } },
    grey11: { rgba: { r: 28, g: 28, b: 28, a: 1 } },
    grey21: { rgba: { r: 54, g: 54, b: 54, a: 1 } },
    grey31: { rgba: { r: 79, g: 79, b: 79, a: 1 } },
    grey41: { rgba: { r: 105, g: 105, b: 105, a: 1 } },
    grey51: { rgba: { r: 130, g: 130, b: 130, a: 1 } },
    grey61: { rgba: { r: 156, g: 156, b: 156, a: 1 } },
    grey71: { rgba: { r: 181, g: 181, b: 181, a: 1 } },
    gray81: { rgba: { r: 207, g: 207, b: 207, a: 1 } },
    gray91: { rgba: { r: 232, g: 232, b: 232, a: 1 } },
    darkgrey: { rgba: { r: 169, g: 169, b: 169, a: 1 } },
    darkblue: { rgba: { r: 0, g: 0, b: 139, a: 1 } },
    darkcyan: { rgba: { r: 0, g: 139, b: 139, a: 1 } },
    darkmagenta: { rgba: { r: 139, g: 0, b: 139, a: 1 } },
    darkred: { rgba: { r: 139, g: 0, b: 0, a: 1 } },
    lightgreen: { rgba: { r: 144, g: 238, b: 144, a: 1 } }
}

const symbolCode = {
    "'": { value: ' ', label: '空格', ascii: '&nbsp;', code: '&#160;' },
    '<': { value: '<', label: '小于号', ascii: '&lt;', code: '&#60;' },
    ">": { value: '>', label: '大于号', ascii: '&gt;', code: '&#62;' },
    "&": { value: '&', label: '和号', ascii: '&amp;', code: '&#38;' },
    '"': { value: '"', label: '引号', ascii: '&quot;', code: '&#34;' },
    "'": { value: "'", label: '撇号', ascii: '&apos;', code: '&#39;' },
    "￠": { value: '￠', label: '分（cent）', ascii: '&cent;', code: '&#162;' },
    "£": { value: '£', label: '镑（pound）', ascii: '&pound;', code: '&#163;' },
    "¥": { value: '¥', label: '元（yen）', ascii: '&yen;', code: '&#165;' },
    "€": { value: '€', label: '欧元（euro）', ascii: '&euro;', code: '&#8364;' },
    "§": { value: '§', label: '小节', ascii: '&sect;', code: '&#167;' },
    "©": { value: '©', label: '版权（copyright）', ascii: '&copy;', code: '&#169;' },
    "®": { value: '®', label: '注册商标', ascii: '&reg;', code: '&#174;' },
    "™": { value: '™', label: '商标', ascii: '&trade;', code: '&#8482;' },
    "×": { value: '×', label: '乘号', ascii: '&times;', code: '&#215;' },
    "÷": { value: '÷', label: '除号', ascii: '&divide;', code: '&#247;' },
}

function symbolFormat(str) {
    if (symbolCode[str]) {
        return symbolCode[str].code
    } else {
        return str
    }
}

function css2json(str) {
    let arr = str.split(';')
    let style = {}
    arr.forEach(ele => {
        let st = ele.trim()
        if (st) {
            let temp = ele.split(':')
            let key = temp[0].trim()
            let value = temp[1].trim()
            style[key] = value
        }
    })
    return style
}

function json2css(obj) {
    let str = ''
    for (const key in obj) {
        str += `${key}:${obj[key]};`
    }
    return str
}

function jsonParse(str) {
    try {
        let json = JSON.parse(`{${str}}`)
        return json
    } catch (error) {
        if (error.message.includes('Unexpected string in JSON at position')) {
            let index = error.message.match(/\d+/)[0] * 1
            let pre = str.slice(index - 20 > 0 ? (index - 20) : 0, index)
            let aft = str.slice(index + 1, index + 20 > str.length - 1 ? str.length - 1 : index + 20)
            console.log(`... ${pre}\x1b[41m${str[index]}\x1b[0m${aft} ...`)
        }

        return {}
    }
}

function getDefault(start, end) {
    let a = end.x - start.x
    let b = end.y - start.y
    let params = {
        x1: start.x + 0.25 * a,
        y1: start.y + 0.25 * b,
        x2: start.x + 0.75 * a,
        y2: start.y + 0.75 * b,
    }
    return params
}

function getDfromPoint(point) {
    let d = ''
    point.forEach(ele => {
        switch (ele.type) {
            case 'M': case 'l': case 'L': case 'm':
                d += ` ${ele.type}${ele.x},${ele.y}`; break;
            case 'C': case 'c':
                d += ` ${ele.type}${ele.params.x1},${ele.params.y1},${ele.params.x2},${ele.params.y2},${ele.x},${ele.y}`; break;
            case 'S': case 's':
                d += ` ${ele.type}${ele.params.x2},${ele.params.y2},${ele.x},${ele.y}`; break;
            case 'Q': case 'q':
                d += ` ${ele.type}${ele.params.x1},${ele.params.y1},${ele.x},${ele.y}`; break;
            case 'A': case 'a':
                d += ` ${ele.type}${ele.params.rx},${ele.params.ry},${ele.params.angle},${ele.params.arc},${ele.params.sweep},${ele.x},${ele.y}`; break;
            case 'H': case 'h':
                d += ` ${ele.type}${ele.x}`; break;
            case 'V': case 'v':
                d += ` ${ele.type}${ele.y}`; break;

        }
    })
    return d
}

function transToPoint(point) {
    let str = ''
    point.forEach(ele => {
        str += `${ele.x},${ele.y} `
    })
    return str
}

function getPointFromPoints(points) {
    let temp = points.match(/\d+\.?\d*/g)
    let point = []
    let len = temp.length / 2
    for (let index = 0; index < len; index++) {
        let params = temp.splice(0, 2)

        if (index) {
            point.push({
                type: 'L',
                x: params[0] * 1,
                y: params[1] * 1,
            })
        } else {
            point.push({
                type: 'M',
                x: params[0] * 1,
                y: params[1] * 1,
            })
        }
    }
    return point
}

function getPointFromPath(d) {
    let path = []
    if (typeof d == 'string') {
        path = d.match(/[MmLlCcSsQqTtAHhVv][^MmLlCcSsQqTtAHhVv]*/g)
    } else {
        path = d
    }
    let point = []
    path.forEach(ele => {
        let type = ele.match(/[MmLlCcSsQqTtAHhVv]/)[0]
        let params = ele.match(/-?\d+\.?\d*/g)
        let len = params.length / 2
        switch (type) {
            case 'M':
                point.push({
                    type: 'M',
                    x: params[0] * 1,
                    y: params[1] * 1,
                })
                break;
            case 'm':
                if (point.length > 0) {
                    point.push({
                        type: 'M',
                        x: params[0] * 1 + point[point.length - 1].x,
                        y: params[1] * 1 + point[point.length - 1].y
                    })
                } else {
                    point.push({
                        type: 'M',
                        x: params[0] * 1,
                        y: params[1] * 1,
                    })
                }
                break;
            case 'L':
                for (let index = 0; index < len; index++) {
                    let Lpoint = params.splice(0, 2)
                    point.push({
                        type: 'L',
                        params: {
                            x1: point[point.length - 1].x + (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y1: point[point.length - 1].y + (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                            x2: Lpoint[0] * 1 - (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y2: Lpoint[1] * 1 - (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                        },
                        x: Lpoint[0] * 1,
                        y: Lpoint[1] * 1
                    })
                }
                break;
            case 'l':
                for (let index = 0; index < len; index++) {
                    let Lpoint = params.splice(0, 2)
                    point.push({
                        type: 'L',
                        params: {
                            x1: point[point.length - 1].x + (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y1: point[point.length - 1].y + (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                            x2: Lpoint[0] * 1 + point[point.length - 1].x - (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y2: Lpoint[1] * 1 + point[point.length - 1].y - (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                        },
                        x: Lpoint[0] * 1 + point[point.length - 1].x,
                        y: Lpoint[1] * 1 + point[point.length - 1].y
                    })
                }
                break
            case 'C':
                point.push({
                    type: 'C',
                    x: params[4] * 1,
                    y: params[5] * 1,
                    params: {
                        x1: params[0] * 1,
                        y1: params[1] * 1,
                        x2: params[2] * 1,
                        y2: params[3] * 1,
                    }
                })
                break;
            case 'c':
                point.push({
                    type: 'C',
                    x: params[4] * 1 + point[point.length - 1].x,
                    y: params[5] * 1 + point[point.length - 1].y,
                    params: {
                        x1: params[0] * 1 + point[point.length - 1].x,
                        y1: params[1] * 1 + point[point.length - 1].y,
                        x2: params[2] * 1 + point[point.length - 1].x,
                        y2: params[3] * 1 + point[point.length - 1].y,
                    }
                })
                break;
            case 'S':
                point.push({
                    type: 'C',
                    x: params[2] * 1,
                    y: params[3] * 1,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x2,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y2,
                        x2: params[0] * 1,
                        y2: params[1] * 1,
                    }
                })
                break;
            case 's':
                point.push({
                    type: 'C',
                    x: params[2] * 1 + point[point.length - 1].x,
                    y: params[3] * 1 + point[point.length - 1].y,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x2,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y2,
                        x2: params[0] * 1 + point[point.length - 1].x,
                        y2: params[1] * 1 + point[point.length - 1].y,
                    }
                })
                break;
            case 'Q':
                point.push({
                    type: 'Q',
                    x: params[2] * 1,
                    y: params[3] * 1,
                    params: {
                        x1: params[0] * 1,
                        y1: params[1] * 1,
                        x2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 'q':
                point.push({
                    type: 'Q',
                    x: params[2] * 1 + point[point.length - 1].x,
                    y: params[3] * 1 + point[point.length - 1].y,
                    params: {
                        x1: params[0] * 1 + point[point.length - 1].x,
                        y1: params[1] * 1 + point[point.length - 1].y,
                        x2: params[0] * 1 + point[point.length - 1].x - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 + point[point.length - 1].y - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 'T':
                point.push({
                    type: 'Q',
                    x: params[0] * 1,
                    y: params[1] * 1,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x1,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y1,
                        x2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 't':
                point.push({
                    type: 'Q',
                    x: params[0] * 1 + point[point.length - 1].x,
                    y: params[1] * 1 + point[point.length - 1].y,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x1,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y1,
                        x2: params[0] * 1 + point[point.length - 1].x - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 + point[point.length - 1].y - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 'A':
                point.push({
                    type: 'A',
                    x: params[5] * 1,
                    y: params[6] * 1,
                    params: {
                        x1: point[point.length - 1].x + (params[5] * 1 - point[point.length - 1].x) / 4,
                        y1: point[point.length - 1].y + (params[6] * 1 - point[point.length - 1].y) / 4,
                        x2: params[5] * 1 - (params[5] * 1 - point[point.length - 1].x) / 4,
                        y2: params[6] * 1 - (params[6] * 1 - point[point.length - 1].y) / 4,
                        rx: params[0] * 1,
                        ry: params[1] * 1,
                        angle: params[2] * 1,
                        arc: params[3] * 1,
                        sweep: params[4] * 1,
                    }
                })
                break;
            case 'a':
                point.push({
                    type: 'A',
                    x: params[5] * 1 + point[point.length - 1].x,
                    y: params[6] * 1 + point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x + (params[5] * 1 - point[point.length - 1].x) / 4,
                        y1: point[point.length - 1].y + (params[6] * 1 - point[point.length - 1].y) / 4,
                        x2: params[5] * 1 + point[point.length - 1].x - (params[5] * 1 - point[point.length - 1].x) / 4,
                        y2: params[6] * 1 + point[point.length - 1].y - (params[6] * 1 - point[point.length - 1].y) / 4,
                        rx: params[0] * 1 + point[point.length - 1].x,
                        ry: params[1] * 1 + point[point.length - 1].y,
                        angle: params[2] * 1,
                        arc: params[3] * 1,
                        sweep: params[4] * 1,
                    }
                })
                break;
            case 'H':
                point.push({
                    type: 'L',
                    x: params[0] * 1,
                    y: point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x + (params[0] * 1 - point[point.length - 1].x) / 4,
                        y1: point[point.length - 1].y + (point[point.length - 1].y - point[point.length - 1].y) / 4,
                        x2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: point[point.length - 1].y - (point[point.length - 1].y - point[point.length - 1].y) / 4,
                    },
                })
                break
            case 'h':
                point.push({
                    type: 'L',
                    x: params[0] * 1 + point[point.length - 1].x,
                    y: point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x + (params[0] * 1) / 4,
                        y1: point[point.length - 1].y,
                        x2: params[0] * 1 + point[point.length - 1].x - (params[0] * 1) / 4,
                        y2: point[point.length - 1].y
                    },
                })
                break
            case 'V':
                point.push({
                    type: 'L',
                    x: point[point.length - 1].x,
                    y: params[0] * 1,
                    params: {
                        y1: point[point.length - 1].y + (params[0] * 1 - point[point.length - 1].y) / 4,
                        x1: point[point.length - 1].x,
                        y2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].y) / 4,
                        x2: point[point.length - 1].x,
                    },
                })
                break
            case 'v':
                point.push({
                    type: 'L',
                    x: point[point.length - 1].x,
                    y: params[0] * 1 + point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x,
                        y1: point[point.length - 1].y + (params[0] * 1 + point[point.length - 1].y - point[point.length - 1].y) / 4,
                        x2: point[point.length - 1].x,
                        y2: params[0] * 1 + point[point.length - 1].y - (params[0] * 1 + point[point.length - 1].y - point[point.length - 1].y) / 4,

                    },
                })
                break
        }
    })
    return point
}

function toCamelCase(str) {
    if (!str.includes('-')) { return str }
    let temp = str.split('-')
    let d = ''
    temp.forEach((ele, index) => {
        if (index) {
            d += toFirstChatUp(ele)
        } else {
            d += ele
        }
    })
    return d
}

function toFirstChatUp(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function getPathPointLines(d) {
    let path = []
    if (typeof d == 'string') {
        path = d.match(/[mMLlCcQqA][^mMLlCcQqA]*/g)
    } else {
        path = d
    }
    let line = []
    let point = []
    path.forEach(ele => {
        let type = ele.match(/[mMLlCcQqA]/)[0]
        let params = ele.match(/\d+\.?\d*/g)
        switch (type) {
            case 'M': case 'm':
                point.push({ x: params[0] * 1, y: params[1] * 1 })
                break;
            case 'L':
                point.push({ x: params[0] * 1, y: params[1] * 1 })
                line.push({
                    type: 'L',
                    start: point[point.length - 2],
                    end: point[point.length - 1],
                    params: getDefault(point[point.length - 2], point[point.length - 1])
                })
                break;
            case 'C':
                point.push({ x: params[4] * 1, y: params[5] * 1 })
                line.push({
                    type: 'C',
                    start: point[point.length - 2],
                    end: point[point.length - 1],
                    params: {
                        x1: params[0] * 1,
                        y1: params[1] * 1,
                        x2: params[2] * 1,
                        y2: params[3] * 1
                    }
                })
                break;
            case 'Q':
                point.push({ x: params[2] * 1, y: params[3] * 1 })
                line.push({
                    type: 'Q',
                    start: point[point.length - 2],
                    end: point[point.length - 1],
                    params: {
                        x1: params[0] * 1,
                        y1: params[1] * 1,
                        x2: params[0] * 1,
                        y2: params[1] * 1
                    }
                })
                break;
        }
    })
    // let type = str[0]
    return {
        points: point,
        lines: line
    }
    // let params = str.match(/\d+\.?\d*/g)
}

function getMiddleNode(start, end) {
    let a = end.x - start.x
    let b = end.y - start.y
    return {
        type: 'L',
        x: start.x + a / 2,
        y: start.y + b / 2,
        params: getDefault(start, end)
    }
}

function colors2rgba(colors) {
    if (!colors) { return 'rgba(0,0,0,0)' }
    return `rgba(${colors.rgba.r},${colors.rgba.g},${colors.rgba.b},${colors.rgba.a})`
}

function getCss_border(params) {
    return `${params.width}px ${params.type} rgba(${params.color.rgba.r},${params.color.rgba.g},${params.color.rgba.b},${params.color.rgba.a})`
}

function getObj_border(str) {
    console.log(str)
    let ob = str.split(' ')
    // console.log(str,ob)
    let width = ob[0].match(/\d+/)[0]

    let rgb = ob[2].match(/\d+\.?\d*/g)
    return {
        width: width * 1,
        type: ob[1],
        color: { rgba: { r: rgb[0] * 1, g: rgb[1] * 1, b: rgb[2] * 1, a: rgb[3] ? rgb[3] * 1 : 1 } }
    }
}

function getValueUnit(str) {
    let value = str.match(/\d*\.?\d*/)[0]
    let unit = str.replace(/\d*\.?\d*/, '')
    return {
        value: value * 1,
        unit: unit
    }
}

function colorCheck(c1, c2) {
    let hexRegExp = new RegExp(/^#?[0-9a-z]+$/)
    let h1 = '', h2 = ''
    if (hexRegExp.test(c1)) { h1 = c1.match(/[0-9a-z]+/)[0] } else { h1 = rgbHex(c1) }
    if (hexRegExp.test(c2)) { h2 = c2.match(/[0-9a-z]+/)[0] } else { h2 = rgbHex(c2) }
    return h1 == h2
}

function getTransform(str) {
    // console.log(str)
    let type = str.match(/rotate\d?d?/)[0]
    let value = str.replace(/.*\(|\).*/g, '').match(/\d+\.?\d*/g)

    switch (type) {
        case 'rotate':
            return {
                type: type,
                value: value[0] * 1
            }
        case 'rotate3d':
            return {
                type: type,
                value: { x: value[0] * 1, y: value[1] * 1, z: value[2] * 1, a: value[3] * 1 }
            }
        default:
            return {
                type: '',
                value: ''
            }
    }
}

function hexRgb(hex, options = {}) {
    if (typeof hex !== 'string') {
        throw new TypeError('Expected a valid hex string');
    }

    hex = hex.replace(/^#/, '');
    let alphaFromHex = 1;

    if (hex.length === 8) {
        alphaFromHex = Number.parseInt(hex.slice(6, 8), 16) / 255;
        hex = hex.slice(0, 6);
    }

    if (hex.length === 4) {
        alphaFromHex = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
        hex = hex.slice(0, 3);
    }

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const number = Number.parseInt(hex, 16);
    const red = number >> 16;
    const green = (number >> 8) & 255;
    const blue = number & 255;
    const alpha = typeof options.alpha === 'number' ? options.alpha : alphaFromHex;

    if (options.format === 'array') {
        return [red, green, blue, alpha];
    }

    if (options.format === 'css') {
        const alphaString = alpha === 1 ? '' : ` / ${Number((alpha * 100).toFixed(2))}%`;
        return `rgb(${red} ${green} ${blue}${alphaString})`;
    }

    return { red, green, blue, alpha };
}

function format2colors(string) {
    if (colorMap[string.toLowerCase()]) { return colorMap[string.toLowerCase()] }
    if (string.includes('rgb')) {
        let rgb = string.match(/\d+\.?\d*/g)
        return { rgba: { r: rgb[0] * 1, g: rgb[1] * 1, b: rgb[2] * 1, a: rgb[3] ? rgb[3] * 1 : 1 } }
    } else {
        let color = hexRgb(string)
        return { rgba: { r: color.red, g: color.green, b: color.blue, a: color.alpha } }
    }
}

function rgbHex(red, green, blue, alpha) {
    const isPercent = (red + (alpha || '')).toString().includes('%');

    if (typeof red === 'string') {
        [red, green, blue, alpha] = red.match(/(0?\.?\d{1,3})%?\b/g).map(component => Number(component));
    } else if (alpha !== undefined) {
        alpha = Number.parseFloat(alpha);
    }

    if (typeof red !== 'number' ||
        typeof green !== 'number' ||
        typeof blue !== 'number' ||
        red > 255 ||
        green > 255 ||
        blue > 255
    ) {
        throw new TypeError('Expected three numbers below 256');
    }

    if (typeof alpha === 'number') {
        if (!isPercent && alpha >= 0 && alpha <= 1) {
            alpha = Math.round(255 * alpha);
        } else if (isPercent && alpha >= 0 && alpha <= 100) {
            alpha = Math.round(255 * alpha / 100);
        } else {
            throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
        }

        alpha = (alpha | 1 << 8).toString(16).slice(1); // eslint-disable-line no-mixed-operators
    } else {
        alpha = '';
    }

    // TODO: Remove this ignore comment.
    // eslint-disable-next-line no-mixed-operators
    return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
}

function utf8Length(val) {
    var str = new String(val);
    var bytesCount = 0;
    for (var i = 0, n = str.length; i < n; i++) {
        var c = str.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            bytesCount += 1;
        } else {
            bytesCount += 2;
        }
    }
    return bytesCount;
}