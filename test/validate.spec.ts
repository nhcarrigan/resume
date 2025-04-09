/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
/* eslint-disable max-lines-per-function, max-statements, max-nested-callbacks, max-lines -- It's a test file. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { parse } from "yaml";
import type { Resume } from "../src/interfaces/resume";

const dateRegex
  // eslint-disable-next-line stylistic/max-len -- This is a long regex.
  = /^(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/;
const dateRegexWithPresent
  // eslint-disable-next-line stylistic/max-len -- This is a long regex.
  = /^(?:(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}|Present)$/;
const dateRegexWithDay
  // eslint-disable-next-line stylistic/max-len -- This is a long regex.
  = /^\d{1,2} (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/;

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- parse does not accept a generic.
const yaml = (await parse(
  await readFile(join(process.cwd(), "src", "source.yaml"), "utf8"),
)) as Resume;

describe("yaml Validation", () => {
  it("should have a valid name", () => {
    expect.assertions(2);
    expect(yaml.name, "name is undefined").toBeDefined();
    expect(yaml.name, "name is empty string").not.toBe("");
  });

  it("should have a valid contact", () => {
    expect.assertions(2);
    expect(yaml.contact, "contact is undefined").toBeDefined();
    expect(yaml.contact, "contact is empty string").not.toBe("");
  });

  it("should have a valid summary", () => {
    expect.assertions(2);
    expect(yaml.summary, "summary is undefined").toBeDefined();
    expect(yaml.summary, "summary is empty string").not.toBe("");
  });

  it("should have employment", () => {
    expect.assertions(3);
    expect(yaml.employment, "employment is undefined").toBeDefined();
    expect(yaml.employment, "employment is not array").toBeInstanceOf(Array);
    expect(yaml.employment.length, "employment is empty").toBeGreaterThan(0);
  });

  it.each(yaml.employment)(
    "employment $title - $company should have title",
    (item) => {
      expect.assertions(2);
      expect(item.title, "title is undefined").toBeDefined();
      expect(item.title, "title is empty string").not.toBe("");
    },
  );

  it.each(yaml.employment)(
    "employment $title - $company should have company",
    (item) => {
      expect.assertions(2);
      expect(item.company, "company is undefined").toBeDefined();
      expect(item.company, "company is empty string").not.toBe("");
    },
  );

  it.each(yaml.employment)(
    "employment $title - $company should have type",
    (item) => {
      expect.assertions(2);
      expect(item.type, "type is undefined").toBeDefined();
      expect(item.type, "type value is invalid").toBeOneOf([
        "Contract",
        "Freelance",
        "Full Time",
        "Founder",
      ]);
    },
  );

  it.each(yaml.employment)(
    "employment $title - $company should have start date",
    (item) => {
      expect.assertions(2);
      expect(item["start_date"], "start_date is undefined").toBeDefined();
      expect(item["start_date"], "start_date is not full month").toMatch(
        dateRegex,
      );
    },
  );

  it.each(yaml.employment)(
    "employment $title - $company should have end date",
    (item) => {
      expect.assertions(2);
      expect(item["end_date"], "end_date is undefined").toBeDefined();
      expect(item["end_date"], "end_date is not full month or Present").toMatch(
        dateRegexWithPresent,
      );
    },
  );

  it.each(yaml.employment)(
    "employment $title - $company should have description",
    (item) => {
      expect.assertions(2);
      expect(item.description, "description is undefined").toBeDefined();
      expect(item.description, "description is empty string").not.toBe("");
    },
  );

  it.each(
    yaml.employment.filter((item) => {
      return "prior_positions" in item;
    }),
  )(
    "employment $title - $company should have valid prior positions",
    (item) => {
      expect.assertions(9);
      expect(
        item.prior_positions,
        "prior_positions is undefined",
      ).toBeDefined();
      expect(
        item.prior_positions,
        "prior_positions is not array",
      ).toBeInstanceOf(Array);
      expect(
        item.prior_positions?.length,
        "prior_positions is empty",
      ).toBeGreaterThan(0);
      expect(
        item.prior_positions?.every((position) => {
          return "title" in position;
        }),
        "prior_positions is missing title",
      ).toBeTruthy();
      expect(
        item.prior_positions?.every((position) => {
          return "start_date" in position;
        }),
        "prior_positions is missing start_date",
      ).toBeTruthy();
      expect(
        item.prior_positions?.every((position) => {
          return "end_date" in position;
        }),
        "prior_positions is missing end_date",
      ).toBeTruthy();
      expect(
        item.prior_positions?.every((position) => {
          return position.title !== "";
        }),
        "prior_positions title is empty",
      ).toBeTruthy();
      expect(
        item.prior_positions?.every((position) => {
          return dateRegex.test(position.start_date);
        }),
        "prior_positions start_date is invalid",
      ).toBeTruthy();
      expect(
        item.prior_positions?.every((position) => {
          return dateRegexWithPresent.test(position.end_date);
        }),
        "prior_positions end_date is invalid",
      ).toBeTruthy();
    },
  );

  it.each(yaml.employment)(
    "employment $title - $company should not have extraneous keys",
    (item) => {
      expect.assertions(1);
      expect(Object.keys(item).length, "has extra keys").toBeOneOf([ 6, 7 ]);
    },
  );

  it("should have volunteer", () => {
    expect.assertions(3);
    expect(yaml.volunteer, "volunteer is undefined").toBeDefined();
    expect(yaml.volunteer, "volunteer is not array").toBeInstanceOf(Array);
    expect(yaml.volunteer.length, "volunteer is empty").toBeGreaterThan(0);
  });

  it.each(yaml.volunteer)(
    "volunteer $title - $company should have title",
    (item) => {
      expect.assertions(2);
      expect(item.title, "title is undefined").toBeDefined();
      expect(item.title, "title is empty string").not.toBe("");
    },
  );

  it.each(yaml.volunteer)(
    "volunteer $title - $company should have company",
    (item) => {
      expect.assertions(2);
      expect(item.company, "company is undefined").toBeDefined();
      expect(item.company, "company is empty string").not.toBe("");
    },
  );

  it.each(yaml.volunteer)(
    "volunteer $title - $company should have start date",
    (item) => {
      expect.assertions(2);
      expect(item["start_date"], "start_date is undefined").toBeDefined();
      expect(item["start_date"], "start_date is not full month").toMatch(
        dateRegex,
      );
    },
  );

  it.each(yaml.volunteer)(
    "volunteer $title - $company should have end date",
    (item) => {
      expect.assertions(2);
      expect(item["end_date"], "end_date is undefined").toBeDefined();
      expect(item["end_date"], "end_date is not full month or Present").toMatch(
        dateRegexWithPresent,
      );
    },
  );

  it.each(yaml.volunteer)(
    "volunteer $title - $company should have description",
    (item) => {
      expect.assertions(2);
      expect(item.description, "description is undefined").toBeDefined();
      expect(item.description, "description is empty string").not.toBe("");
    },
  );

  it.each(yaml.volunteer)(
    "volunteer $title - $company should not have extraneous keys",
    (item) => {
      expect.assertions(1);
      expect(Object.keys(item).length, "has extra keys").toBeOneOf([ 5, 6 ]);
    },
  );

  it("should have education", () => {
    expect.assertions(3);
    expect(yaml.education, "education is undefined").toBeDefined();
    expect(yaml.education, "education is not array").toBeInstanceOf(Array);
    expect(yaml.education.length, "education is empty").toBeGreaterThan(0);
  });

  it.each(yaml.education)("education $title should have title", (item) => {
    expect.assertions(2);
    expect(item.title, "title is undefined").toBeDefined();
    expect(item.title, "title is empty string").not.toBe("");
  });

  it.each(yaml.education)("education $title should have start date", (item) => {
    expect.assertions(2);
    expect(item["start_date"], "start_date is undefined").toBeDefined();
    expect(item["start_date"], "start_date is not full month").toMatch(
      dateRegex,
    );
  });

  it.each(yaml.education)("education $title should have end date", (item) => {
    expect.assertions(2);
    expect(item["end_date"], "end_date is undefined").toBeDefined();
    expect(item["end_date"], "end_date is not full month or Present").toMatch(
      dateRegexWithPresent,
    );
  });

  it.each(yaml.education)(
    "education $title should have institution",
    (item) => {
      expect.assertions(2);
      expect(item.institution, "institution is undefined").toBeDefined();
      expect(item.institution, "institution is empty string").not.toBe("");
    },
  );

  it.each(yaml.education)(
    "education $title should have description",
    (item) => {
      expect.assertions(2);
      expect(item.description, "description is undefined").toBeDefined();
      expect(item.description, "description is empty string").not.toBe("");
    },
  );

  it.each(yaml.education)("education $title should have type", (item) => {
    expect.assertions(2);
    expect(item.type, "type is undefined").toBeDefined();
    expect(item.type, "type is empty string").not.toBe("");
  });

  it.each(yaml.education)(
    "education $title should not have extraneous keys",
    (item) => {
      expect.assertions(1);
      expect(Object.keys(item).length, "has extra keys").toBeOneOf([ 6, 7 ]);
    },
  );

  it("should have certifications", () => {
    expect.assertions(3);
    expect(yaml.certifications, "certifications is undefined").toBeDefined();
    expect(yaml.certifications, "certifications is not array").toBeInstanceOf(
      Array,
    );
    expect(
      yaml.certifications.length,
      "certifications is empty",
    ).toBeGreaterThan(0);
  });

  it.each(yaml.certifications)(
    "certification $title should have title",
    (item) => {
      expect.assertions(2);
      expect(item.title, "title is undefined").toBeDefined();
      expect(item.title, "title is empty string").not.toBe("");
    },
  );

  it.each(yaml.certifications)(
    "certification $title should have date",
    (item) => {
      expect.assertions(2);
      expect(item.date, "date is undefined").toBeDefined();
      expect(item.date, "date is not full month").toMatch(dateRegex);
    },
  );

  it.each(yaml.certifications)(
    "certification $title should have issuer",
    (item) => {
      expect.assertions(2);
      expect(item.issuer, "issuer is undefined").toBeDefined();
      expect(item.issuer, "issuer is empty string").not.toBe("");
    },
  );

  it.each(yaml.certifications)(
    "certification $title should not have extraneous keys",
    (item) => {
      expect.assertions(1);
      expect(Object.keys(item).length, "has extra keys").toBeOneOf([ 3, 4 ]);
    },
  );

  it("should have projects", () => {
    expect.assertions(3);
    expect(yaml.projects, "projects is undefined").toBeDefined();
    expect(yaml.projects, "projects is not array").toBeInstanceOf(Array);
    expect(yaml.projects.length, "projects is empty").toBeGreaterThan(0);
  });

  it.each(yaml.projects)("project $title should have title", (item) => {
    expect.assertions(2);
    expect(item.title, "title is undefined").toBeDefined();
    expect(item.title, "title is empty string").not.toBe("");
  });

  it.each(yaml.projects)("project $title should have date", (item) => {
    expect.assertions(2);
    expect(item.date, "date is undefined").toBeDefined();
    expect(item.date, "date is not full month").toMatch(dateRegex);
  });

  it.each(yaml.projects)("project $title should have description", (item) => {
    expect.assertions(2);
    expect(item.description, "description is undefined").toBeDefined();
    expect(item.description, "description is empty string").not.toBe("");
  });

  it.each(yaml.projects)("project $title should have company", (item) => {
    expect.assertions(2);
    expect(item.company, "company is undefined").toBeDefined();
    expect(item.company, "company is empty string").not.toBe("");
  });

  it.each(yaml.projects)(
    "project $title should not have extraneous keys",
    (item) => {
      expect.assertions(1);
      expect(Object.keys(item).length, "has extra keys").toBeOneOf([ 4, 5 ]);
    },
  );

  it("should have publications", () => {
    expect.assertions(3);
    expect(yaml.publications, "publications is undefined").toBeDefined();
    expect(yaml.publications, "publications is not array").toBeInstanceOf(
      Array,
    );
    expect(yaml.publications.length, "publications is empty").toBeGreaterThan(
      0,
    );
  });

  it.each(yaml.publications)(
    "publications $title should have title",
    (item) => {
      expect.assertions(2);
      expect(item.title, "title is undefined").toBeDefined();
      expect(item.title, "title is empty string").not.toBe("");
    },
  );

  it.each(yaml.publications)("publications $title should have date", (item) => {
    expect.assertions(2);
    expect(item.date, "date is undefined").toBeDefined();
    expect(item.date, "date is not full month and day").toMatch(
      dateRegexWithDay,
    );
  });

  it.each(yaml.publications)(
    "publications $title should have description",
    (item) => {
      expect.assertions(2);
      expect(item.description, "description is undefined").toBeDefined();
      expect(item.description, "description is empty string").not.toBe("");
    },
  );

  it.each(yaml.publications)(
    "publications $title should have company",
    (item) => {
      expect.assertions(2);
      expect(item.company, "company is undefined").toBeDefined();
      expect(item.company, "company is empty string").not.toBe("");
    },
  );

  it.each(yaml.publications)(
    "publications $title should not have extraneous keys",
    (item) => {
      expect.assertions(1);
      expect(Object.keys(item).length, "has extra keys").toBeOneOf([ 4, 5 ]);
    },
  );
});
