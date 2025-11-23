import { c as create_ssr_component, a as add_attribute, v as validate_component } from "../../chunks/index-1e54ea6c.js";
import "d3";
import "topojson-client";
/* empty css                         */var MapTwo_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".map-container.svelte-1ixpd07{width:100%;display:flex;justify-content:center}",
  map: null
};
const MapTwo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let container;
  $$result.css.add(css$1);
  return `<div class="${"map-container svelte-1ixpd07"}"${add_attribute("this", container, 0)}></div>`;
});
var PhdStipends_svelte_svelte_type_style_lang = "";
const css = {
  code: ".chart-wrapper.svelte-9c9s6m{width:100%;display:flex;justify-content:center}",
  map: null
};
const PhdStipends = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let container;
  $$result.css.add(css);
  return `<div class="${"chart-wrapper svelte-9c9s6m"}"${add_attribute("this", container, 0)}></div>`;
});
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="${"content"}">
  <h1>Where you Study Could Affect the Size of Your Stipend</h1>

  <p class="${"subhead"}">Hover your mouse on each dot and take a look at the stipend each university offers 
    to their English PhDs. Larger circles represent higher stipend amounts.
  </p>

  
  <section class="${"chart-container"}"><div>${validate_component(MapTwo, "MapTwo").$$render($$result, {}, {}, {})}</div></section>

  
  <p>When the National Institute of Health announced a funding cut of $4 million, several 
    universities responded by suspending doctoral admissions.
  </p>

  <p>But this is not new. For PhD students in non-STEM fields, the financial burden 
    started long ago.
  </p>

  <p>A study by Professor Eric Weiskott of Boston College examined stipends across 
    135 universities ranked by U.S. News and World Report in 2022, revealing sharp 
    disparities tied to location. Among these, 80 offered a doctoral degree in English, 
    but three declined to release their data.
  </p>

  <p>The stipend difference between private and public universities is significant. 
    In the 2021-2022 academic year, the median stipend for English PhD candidates at 
    private universities barely reached $30,000, while public universities offered 
    nearly $10,000 less to their doctoral students.
  </p>

  <p>The east coast has the highest density of English PhD programs, meaning students 
    from states such as Massachusetts, Connecticut, or New York benefit from both 
    higher private university stipends and a greater number of institutional options. 
    An English PhD candidate in states like Kansas or Arizona, however, are likely 
    attending a public university with lower baseline funding while also competing for 
    fewer academic opportunities overall.
  </p>

  <p>But this advantage can be misleading when cost of living enters the equation. 
    Geographic proximity to expensive metropolitan areas can put students under 
    financial pressure.
  </p>

  <p>While located in central New Jersey, Rutgers University sits within commuting 
    distance of New York City, which has the highest cost of living in the United 
    States. According to Professor Weiskott&#39;s research, more than one quarter of 
    current Rutgers English graduate students actually reside in Brooklyn, Manhattan, 
    Queens, or adjacent Jersey City. These students receive a $31,000 stipend while 
    living in the same expensive housing markets as their counterparts at Columbia 
    University, who receive approximately $41,000.
  </p>

  <p>Here is a chart that shows how doctoral students, especially those in Humanities, 
    Arts, and Social Sciences have long endured the lowest stipends, barely enough to 
    cover basic living expenses.
  </p>

  
  <section class="${"chart-container"}"><div><h3 class="${"chart-title"}">PhD stipends by field of study over time (2015\u20132022)</h3>
      <p class="${"chart-subtitle"}">Each line represents a field of study.</p>

      ${validate_component(PhdStipends, "PhdStipends").$$render($$result, {}, {}, {})}</div></section></main>`;
});
export { Routes as default };
