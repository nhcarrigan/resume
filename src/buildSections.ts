/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  renderBulletList,
  renderCards,
  renderIssuedCard,
  renderDescribedCard,
} from "./renderHelpers.js";
import type { Resume } from "./interfaces/resume.js";

/**
 * Builds the page heading, including the summary and format download links.
 * @param yaml - The parsed resume data.
 * @returns The rendered heading markup.
 */
const buildHeading = (yaml: Resume): string => {
  return `<h1>${yaml.name}</h1>
<p class="info">${yaml.contact}</p>
<p>${yaml.summary}</p>
<p id="links">
  <a href="#employment">Employment</a> |
    <a href="#volunteer">Volunteer Work</a> |
    <a href="#education">Education</a> |
    <a href="#certifications">Certifications</a> |
    <a href="#awards">Awards</a> |
    <a href="#projects">Projects</a> |
    <a href="#publications">Publications</a> |
</p>
<div id="formats">
  <button onclick="downloadFile('https://data.nhcarrigan.com/resume.yml', 'resume.yml')">Download YAML</button>
  <button onclick="downloadFile('https://data.nhcarrigan.com/resume.json', 'resume.json')">Download JSON</button>
  <button onclick="window.print()">Print Resume</button>
  <button onclick="printCondensed()">Print Condensed Resume</button>
</div>
<p class="cta">
  Interested in hiring me?
    <a href="https://testimonials.nhcarrigan.com" target="_blank"
      >See what past clients have to say</a
    >, or <a href="https://forms.nhcarrigan.com/form/XRlQjeu8CbMrTA-v0IPOxlUPEPitLKXTWg70UUCIORA">submit your own request</a>!`;
};

/**
 * Builds the employment section, including collapsible bullet highlights for
 * the current position at each employer and every prior position held there.
 * @param yaml - The parsed resume data.
 * @returns The rendered employment section markup.
 */
const buildEmployment = (yaml: Resume): string => {
  return `<section id="employment">
<h2>Employment</h2>
${yaml.employment.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.company}</span>
      <span class="type">${item.type}</span>
    </div>
    <span class="date">${item.start_date} - ${item.end_date}</span>
    <div class="bullets">${renderBulletList(item.bullets, true)}</div>
      ${
        item.prior_positions
          ? `<hr />
        ${item.prior_positions.
          map((position, index) => {
            return `<p class="subtitle${String(index + 1)}">${position.title}</p>
            <p class="subdate${String(index + 1)}">${position.start_date} - ${
              position.end_date
            }</p>
            <div class="bullets${String(index + 1)}">${
              renderBulletList(position.bullets, false)
            }</div>`;
          }).
          join("<hr/>")}`
          : ""
      }
    </div>`;
  }).
  join("\n")}
</section>`;
};

/**
 * Builds the volunteer work section, including collapsible bullet highlights
 * for each role.
 * @param yaml - The parsed resume data.
 * @returns The rendered volunteer section markup.
 */
const buildVolunteer = (yaml: Resume): string => {
  return `<section id="volunteer">
<h2>Volunteer Work</h2>
${yaml.volunteer.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p> 
    <div>
      <span class="company">${item.company}</span>
    </div>
    <span class="date">${item.start_date} - ${item.end_date}</span>
    <div class="bullets">${renderBulletList(item.bullets, true)}</div>
    </div>`;
  }).
  join("\n")}
</section>`;
};

/**
 * Builds the education section.
 * @param yaml - The parsed resume data.
 * @returns The rendered education section markup.
 */
const buildEducation = (yaml: Resume): string => {
  return `<section id="education">
<h2>Education</h2>
${yaml.education.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.institution}</span>
      <span class="type">${item.type}</span>
    </div>
    <span class="date">${item.start_date} - ${item.end_date}</span>
    <p class="description">${item.description}</p>
    </div>`;
  }).
  join("\n")}
</section>`;
};

/**
 * Builds the certifications section.
 * @param yaml - The parsed resume data.
 * @returns The rendered certifications section markup.
 */
const buildCertifications = (yaml: Resume): string => {
  return `<section id="certifications">
<h2>Certifications</h2>
${renderCards(yaml.certifications, renderIssuedCard)}
</section>`;
};

/**
 * Builds the awards section.
 * @param yaml - The parsed resume data.
 * @returns The rendered awards section markup.
 */
const buildAwards = (yaml: Resume): string => {
  return `<section id="awards">
<h2>Awards</h2>
${renderCards(yaml.awards, renderIssuedCard)}
</section>`;
};

/**
 * Builds the projects section.
 * @param yaml - The parsed resume data.
 * @returns The rendered projects section markup.
 */
const buildProjects = (yaml: Resume): string => {
  return `<section id="projects">
<h2>Projects</h2>
${renderCards(yaml.projects, renderDescribedCard)}
</section>`;
};

/**
 * Builds the publications section.
 * @param yaml - The parsed resume data.
 * @returns The rendered publications section markup.
 */
const buildPublications = (yaml: Resume): string => {
  return `<section id="publications">
<h2>Publications</h2>
${renderCards(yaml.publications, renderDescribedCard)}
</section>`;
};

export {
  buildHeading,
  buildEmployment,
  buildVolunteer,
  buildEducation,
  buildCertifications,
  buildAwards,
  buildProjects,
  buildPublications,
};
