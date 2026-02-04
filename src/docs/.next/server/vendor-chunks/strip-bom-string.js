"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/strip-bom-string";
exports.ids = ["vendor-chunks/strip-bom-string"];
exports.modules = {

/***/ "(rsc)/./node_modules/strip-bom-string/index.js":
/*!************************************************!*\
  !*** ./node_modules/strip-bom-string/index.js ***!
  \************************************************/
/***/ ((module) => {

eval("/*!\n * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>\n *\n * Copyright (c) 2015, 2017, Jon Schlinkert.\n * Released under the MIT License.\n */\n\n\n\nmodule.exports = function(str) {\n  if (typeof str === 'string' && str.charAt(0) === '\\ufeff') {\n    return str.slice(1);\n  }\n  return str;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc3RyaXAtYm9tLXN0cmluZy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGItdG9vbGtpdC1kb2NzLW5leHQvLi9ub2RlX21vZHVsZXMvc3RyaXAtYm9tLXN0cmluZy9pbmRleC5qcz9lYjhkIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogc3RyaXAtYm9tLXN0cmluZyA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvc3RyaXAtYm9tLXN0cmluZz5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIDIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnICYmIHN0ci5jaGFyQXQoMCkgPT09ICdcXHVmZWZmJykge1xuICAgIHJldHVybiBzdHIuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/strip-bom-string/index.js\n");

/***/ })

};
;