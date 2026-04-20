/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { writeFile, copyFile, stat, mkdir } from "node:fs/promises";
import { join } from "node:path";
// eslint-disable-next-line import/no-extraneous-dependencies -- Since this is a dev script, there are no production dependencies.
import { parse } from "yaml";
import type { Resume } from "./interfaces/resume.js";

const htmlBeginning = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Naomi Carrigan</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="This is Naomi's full work history!" />
    <script
      src="https://cdn.nhcarrigan.com/headers/index.js"
      async
      defer
    ></script>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main>`;
const htmlEnd = `    </main>
  </body>
  <script src="./dates.js"></script>
  <script>
    var _cdnStyle = null;
    var _condensedSections = [];

    window.addEventListener("beforeprint", function() {
      _cdnStyle = document.getElementById("nhcarrigan-global-styles");
      if (_cdnStyle) { _cdnStyle.remove(); }
    });
    window.addEventListener("afterprint", function() {
      if (_cdnStyle) { document.head.appendChild(_cdnStyle); _cdnStyle = null; }
      _condensedSections.forEach(function(el) { el.style.display = ""; });
      _condensedSections = [];
    });

    function downloadFile(url, filename) {
      fetch(url)
        .then(function(r) { return r.blob(); })
        .then(function(blob) {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
        });
    }

    function printCondensed() {
      ["certifications", "projects", "publications"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) { el.style.display = "none"; _condensedSections.push(el); }
      });
      window.print();
    }
  </script>
</html>`;

const request = await fetch(
  "https://data.nhcarrigan.com/resume.yml",
);
if (!request.ok) {
  // eslint-disable-next-line no-console -- error logging.
  console.error(
    `Failed to fetch resume.yaml: ${request.status.toString()} ${request.statusText}`,
  );
  process.exit(1);
}
const result = await request.text();
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- parse does not accept a generic.
const yaml = (await parse(
  result,
)) as Resume;
const currentEmployment = yaml.employment.
  filter((item) => {
    return item.end_date === "Present";
  }).
  sort((a, b) => {
    return (
      new Date(`5${b.start_date}`).getTime()
      - new Date(`5${a.start_date}`).getTime()
    );
  });
const currentVolunteer = yaml.volunteer.
  filter((item) => {
    return item.end_date === "Present";
  }).
  sort((a, b) => {
    return (
      new Date(`5${b.start_date}`).getTime()
      - new Date(`5${a.start_date}`).getTime()
    );
  });
const pastEmployment = yaml.employment.
  filter((item) => {
    return item.end_date !== "Present";
  }).
  sort((a, b) => {
    return (
      new Date(`5${b.end_date}`).getTime()
      - new Date(`5${a.end_date}`).getTime()
    );
  });
const pastVolunteer = yaml.volunteer.
  filter((item) => {
    return item.end_date !== "Present";
  }).
  sort((a, b) => {
    return (
      new Date(`5${b.end_date}`).getTime()
      - new Date(`5${a.end_date}`).getTime()
    );
  });

yaml.employment = [ ...currentEmployment, ...pastEmployment ];
yaml.volunteer = [ ...currentVolunteer, ...pastVolunteer ];
yaml.certifications.sort((a, b) => {
  return new Date(`5${b.date}`).getTime() - new Date(`5${a.date}`).getTime();
});
yaml.education.sort((a, b) => {
  return (
    new Date(`5${b.end_date}`).getTime() - new Date(`5${a.end_date}`).getTime()
  );
});
yaml.projects.sort((a, b) => {
  return new Date(`5${b.date}`).getTime() - new Date(`5${a.date}`).getTime();
});
yaml.publications.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

const heading = `<h1>${yaml.name}</h1>
<p class="info">${yaml.contact}</p>
<p>${yaml.summary}</p>
<p id="links">
  <a href="#employment">Employment</a> |
    <a href="#volunteer">Volunteer Work</a> |
    <a href="#education">Education</a> |
    <a href="#certifications">Certifications</a> |
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

const employment = `<section id="employment">
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
      ${
        item.prior_positions
          ? `<hr />
        ${item.prior_positions.
          map((position, index) => {
            return `<p class="subtitle${String(index + 1)}">${position.title}</p>
            <p class="subdate${String(index + 1)}">${position.start_date} - ${
              position.end_date
            }</p>`;
          }).
          join("<hr/>")}`
          : ""
      }
    <p class="description">${item.description}</p>
    </div>`;
  }).
  join("\n")}
</section>`;

const volunteer = `<section id="volunteer">
<h2>Volunteer Work</h2>
${yaml.volunteer.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p> 
    <div>
      <span class="company">${item.company}</span>
    </div>
    <span class="date">${item.start_date} - ${item.end_date}</span>
    <p class="description">${item.description}</p>
    </div>`;
  }).
  join("\n")}
</section>`;

const education = `<section id="education">
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

const certifications = `<section id="certifications">
<h2>Certifications</h2>
${yaml.certifications.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.issuer}</span>
    </div>
    <span class="date">${item.date}</span>
    </div>`;
  }).
  join("\n")}
</section>`;

const projects = `<section id="projects">
<h2>Projects</h2>
${yaml.projects.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.company}</span>
    </div>
    <span class="date">${item.date}</span>
    <p class="description">${item.description}</p>
    </div>`;
  }).
  join("\n")}
</section>`;

const publications = `<section id="publications">
<h2>Publications</h2>
${yaml.publications.
  map((item) => {
    return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.company}</span>
    </div>
    <span class="date">${item.date}</span>
    <p class="description">${item.description}</p>
    </div>`;
  }).
  join("\n")}
</section>`;

const directoryStatus = await stat(join(process.cwd(), "site")).
  then((status) => {
    return status.isDirectory();
  }).
  catch(() => {
    return false;
  });

if (!directoryStatus) {
  await mkdir(join(process.cwd(), "site"));
}

await writeFile(
  join(process.cwd(), "site", "index.html"),
  htmlBeginning
    + heading
    + employment
    + volunteer
    + education
    + certifications
    + projects
    + publications
    + htmlEnd,
  "utf8",
);
await copyFile(
  join(process.cwd(), "src", "static", "style.css"),
  join(process.cwd(), "site", "style.css"),
);
await copyFile(
  join(process.cwd(), "src", "static", "dates.js"),
  join(process.cwd(), "site", "dates.js"),
);
