/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

/**
 * Renders a collapsible list of bullet points inside a native details element.
 * @param bullets - The bullet point strings to render.
 * @param expanded - Whether the details element should start expanded.
 * @returns The rendered details/summary/ul markup.
 */
const renderBulletList = (
  bullets:  Array<string>,
  expanded: boolean,
): string => {
  return `<details${expanded
    ? " open"
    : ""}>
    <summary>Highlights</summary>
    <ul>
      ${bullets.
        map((bullet) => {
          return `<li>${bullet}</li>`;
        }).
        join("\n")}
    </ul>
    </details>`;
};

/**
 * Maps an array of items to rendered card markup and joins the result.
 * @param items - The items to render.
 * @param render - The function that renders a single item.
 * @returns The joined, rendered markup for every item.
 */
const renderCards = <Item>(
  items:  Array<Item>,
  render: (item: Item)=> string,
): string => {
  return items.
    map((item) => {
      return render(item);
    }).
    join("\n");
};

/**
 * Renders a card for an item that was issued to Naomi, such as a
 * certification or an award.
 * @param item - The issued item to render.
 * @param item.title - The title of the certification or award.
 * @param item.issuer - The organisation that issued the item.
 * @param item.date - The date the item was issued.
 * @returns The rendered card markup.
 */
const renderIssuedCard = (item: {
  title:  string;
  issuer: string;
  date:   string;
}): string => {
  return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.issuer}</span>
    </div>
    <span class="date">${item.date}</span>
    </div>`;
};

/**
 * Renders a card for an item that has a company and a description, such as
 * a project or a publication.
 * @param item - The item to render.
 * @param item.title - The title of the project or publication.
 * @param item.company - The company the item is associated with.
 * @param item.description - The body copy summarising the item.
 * @param item.date - The date associated with the item.
 * @returns The rendered card markup.
 */
const renderDescribedCard = (item: {
  title:       string;
  company:     string;
  description: string;
  date:        string;
}): string => {
  return `<div class="card">
    <p class="title">${item.title}</p>
    <div>
      <span class="company">${item.company}</span>
    </div>
    <span class="date">${item.date}</span>
    <p class="description">${item.description}</p>
    </div>`;
};

export { renderBulletList, renderCards, renderIssuedCard, renderDescribedCard };
