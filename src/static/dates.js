const dates = document.querySelectorAll(".date:not(#certifications .date):not(#awards .date):not(#projects .date):not(#publications .date)");const subdates = document.querySelectorAll("[class^='subdate']");
const today = new Date();
for (const date of [...dates, ...subdates]) {
  const start = new Date("5" + date.textContent.split(" - ")[0]);
  const end =
    date.textContent.split(" - ")[1] === "Present"
      ? "present"
      : new Date("5" + date.textContent.split(" - ")[1]);
  const diff =
    (end === "present" ? today.getTime() : end.getTime()) - start.getTime();
  const diffYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const diffMonths = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
  );
  const diffString = [];
  if (diffYears > 0) {
    diffString.push(`${diffYears} year${diffYears === 1 ? "" : "s"}`);
  }
  if (diffMonths > 0) {
    diffString.push(`${diffMonths} month${diffMonths === 1 ? "" : "s"}`);
  }
  if (diffString.length === 0) {
    diffString.push("less than a month");
  }
  if (end === "present") {
    date.textContent = `${start.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
    })} - present (${diffString.join(", ")})`;
    continue;
  }
  date.textContent = `${start.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  })} - ${end.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  })} (${diffString.join(", ")})`;
}
