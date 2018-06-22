// Compiled using marko@4.10.0 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/dist/html").t(__filename),
    marko_componentType = "/red-carpet$1.0.0/src/templates/index.marko",
    components_helpers = require("marko/dist/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/dist/runtime/html/helpers"),
    marko_escapeXmlAttr = marko_helpers.xa,
    marko_loadTag = marko_helpers.t,
    component_globals_tag = marko_loadTag(require("marko/dist/components/taglib/component-globals-tag")),
    init_components_tag = marko_loadTag(require("marko/dist/components/taglib/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/dist/taglibs/async/await-reorderer-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<!doctype html><html><head><title>STRIKE A POSE</title><link rel=\"stylesheet\" href=\"" +
    marko_escapeXmlAttr(input.app_styles) +
    "\"></head><body>");

  component_globals_tag({}, out);

  out.w("<div class=\"redCarpet\" id=\"root\"></div><script src=\"" +
    marko_escapeXmlAttr(input.app_script) +
    "\"></script>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "7");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ae_: true,
    _l_: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/red-carpet$1.0.0/src/templates/index.marko",
    tags: [
      "marko/dist/components/taglib/component-globals-tag",
      "marko/dist/components/taglib/init-components-tag",
      "marko/dist/taglibs/async/await-reorderer-tag"
    ]
  };
