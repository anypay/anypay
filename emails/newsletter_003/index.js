"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Handlebars = require("handlebars");
let body = fs_1.readFileSync(path_1.join(__dirname, 'email.html'));
let template = Handlebars.compile(body.toString());
exports.default = {
    title: "Okay, big deal. A few bucks.",
    template,
    body: template({})
};
//# sourceMappingURL=index.js.map
