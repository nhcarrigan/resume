/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { writeFile, copyFile, stat, mkdir } from "node:fs/promises";
import { join } from "node:path";
// eslint-disable-next-line import/no-extraneous-dependencies -- Since this is a dev script, there are no production dependencies.
import { parse } from "yaml";
import {
  buildHeading,
  buildEmployment,
  buildVolunteer,
  buildEducation,
  buildCertifications,
  buildAwards,
  buildProjects,
  buildPublications,
} from "./buildSections.js";
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
    var _collapsedDetails = [];

    window.addEventListener("beforeprint", function() {
      _cdnStyle = document.getElementById("nhcarrigan-global-styles");
      if (_cdnStyle) { _cdnStyle.remove(); }
      document.querySelectorAll("details:not([open])").forEach(function(el) {
        _collapsedDetails.push(el);
        el.open = true;
      });
    });
    window.addEventListener("afterprint", function() {
      if (_cdnStyle) { document.head.appendChild(_cdnStyle); _cdnStyle = null; }
      _condensedSections.forEach(function(el) { el.style.display = ""; });
      _condensedSections = [];
      _collapsedDetails.forEach(function(el) { el.open = false; });
      _collapsedDetails = [];
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
      ["certifications", "awards", "projects", "publications"].forEach(function(id) {
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
yaml.awards.sort((a, b) => {
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

const heading = buildHeading(yaml);
const employment = buildEmployment(yaml);
const volunteer = buildVolunteer(yaml);
const education = buildEducation(yaml);
const certifications = buildCertifications(yaml);
const awards = buildAwards(yaml);
const projects = buildProjects(yaml);
const publications = buildPublications(yaml);

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
    + awards
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
