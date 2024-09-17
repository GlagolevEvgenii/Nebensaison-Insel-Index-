import { data } from "./data.js";

const currentLocale = "de-De";
const observer = new IntersectionObserver(observerCb, {
  root: document.querySelector(".table-wrapper"),
  rootMargin: "0px",
  threshold: 0.7,
});

function observerCb(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      table.expandGradient.classList.remove("expanded");
    } else {
      table.expandGradient.classList.add("expanded");
    }
  });
}

const table = {
  table: document.querySelector(".table"),
  body: document.querySelector(".table-body"),
  heading: document.querySelectorAll(".table-heading"),
  expanded: false,
  renderArray: [...data].slice(0, 10),

  previousSorter: document.querySelector("[data-heading='score']"),
  currentSorter: document.querySelector("[data-heading='score']"),
  direction: "asc",
  expandButton: document.querySelector(".expand-button"),
  expandGradient: document.querySelector(".table-gradient"),

  init() {
    table.binds();
  },

  binds() {
    document
      .querySelector(".table-head-row")
      .addEventListener("click", table.handleSort);
    table.expandButton.addEventListener("click", table.expandList);
  },

  expandList() {
    table.expanded = !table.expanded;
    table.table.classList.toggle("expanded", table.expanded);
    table.expandButton.classList.toggle("expanded", table.expanded);
    table.expandGradient.classList.toggle("expanded", table.expanded);

    table.renderArray = !table.expanded ? [...data].slice(0, 10) : [...data];
    table.expandButton.textContent = table.expanded
      ? "Weitere Inseln anzeigen"
      : "Weniger Inseln anzeigen";

    if (!table.expanded) {
      document.querySelector(".table-wrapper").scrollTo({ top: 0 });
    }

    table.sort(table.currentSorter.dataset.heading, table.direction);
    table.render();
    table.styleHeader();
    if (table.expanded) {
      observer.observe(table.body.lastElementChild);
    } else {
      observer.disconnect();
    }
  },

  handleSort(e) {
    table.currentSorter = e.target.closest("th");
    if (table.currentSorter === table.previousSorter) {
      table.direction = table.direction === "asc" ? "des" : "asc";
    }

    table.sort(table.currentSorter.dataset.heading, table.direction);
    table.render();
    table.styleHeader();
    table.previousSorter = table.currentSorter;
  },

  styleHeader() {
    table.expandGradient.classList.remove("expanded");
    const prev = table.previousSorter.dataset.heading;
    const current = table.currentSorter.dataset.heading;
    table.body
      .querySelectorAll(`[data-cell=${prev}]`)
      .forEach((el) => el.classList.remove("active"));
    table.previousSorter.classList.remove("active");

    table.currentSorter.classList.add("active");
    table.body
      .querySelectorAll(`[data-cell=${current}]`)
      .forEach((el) => el.classList.add("active"));

    if (table.direction === "asc") {
      table.currentSorter.classList.add("asc");
      return;
    }
    table.currentSorter.classList.remove("asc");
  },

  sort(field, direction) {
    if (direction === "asc") {
      if (typeof table.renderArray[0][field] === "string") {
        table.renderArray.sort((a, b) => a[field].localeCompare(b[field]));
      }
      table.renderArray.sort((a, b) => {
        return (
          (a[field] < b[field]) - (b[field] < a[field]) ||
          (a.score < b.score) - (b.score < a.score) ||
          a.insel.localeCompare(b.insel)
        );
      });
    } else {
      if (typeof table.renderArray[0][field] === "string") {
        table.renderArray.sort((a, b) => b[field].localeCompare(a[field]));
      }
      table.renderArray.sort((a, b) => {
        return (
          (b[field] < a[field]) - (a[field] < b[field]) ||
          (a.score < b.score) - (b.score < a.score) ||
          a.insel.localeCompare(b.insel)
        );
      });
    }
  },

  render() {
    table.body.innerHTML = "";
    let tableRows = table.renderArray.map(
      (e) => `<tr class="table-row">
                <td data-cell="insel" class =''>
               <div class="table-cell-insel">
                   <div class="land-icon__wrapper">
                        <svg class="land-icon" width="14" height="14">
                            <use href="./img/flags.svg#${e.land}"></use>
                        </svg>
                  </div>
                     
                  <div class='insel'>${e.insel}</div>                   
                 
                  </div>
                </td>
                <td data-cell="googleSuchanfragen" >${e.googleSuchanfragen.toLocaleString(
                  currentLocale
                )}</td>
                <td data-cell="tikTokHashtags" class="table-cell-stadion">${e.tikTokHashtags.toLocaleString(
                  currentLocale
                )} </td>
                <td data-cell="strandeBlaueFlagge" class="table-cell-bratwurstpreis">${
                  e.strandeBlaueFlagge
                }
                 </td>
                <td data-cell="wasserTemperatur" class="table-cell-bierpreis">${e.wasserTemperatur.toLocaleString(
                  currentLocale,
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }
                )} °C
                  </td>
                <td data-cell="sicherheit" class="table-cell-googleBewertungen">${e.sicherheit.toLocaleString(
                  currentLocale,
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }
                )}</td>
                <td data-cell="visum" class="table-cell-ticket">${e.visum}</td>
                <td data-cell="outdoorAktivitaten" class="table-cell-minuten">${e.outdoorAktivitaten.toLocaleString(
                  currentLocale
                )}
                </td>
              
                <td data-cell="regentage" class="table-cell-parkplatze">${e.regentage.toLocaleString(
                  currentLocale,
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }
                )}</td>
                <td data-cell="sonnenstunden" class="table-cell-toiletten">${e.sonnenstunden.toLocaleString(
                  currentLocale,
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }
                )}</td>
                <td data-cell="bierpreis" class="table-cell-toiletten">${e.bierpreis.toLocaleString(
                  currentLocale,
                  {
                    style: "currency",
                    currency: "EUR",
                  }
                )}</td>
                </td>
                <td data-cell="direktflugverbindungen" class="table-cell-toiletten">${
                  e.direktflugverbindungen
                }</td>
                <td data-cell="score" class="table-cell-score">${e.score}</td>
              </tr>`
    );

    table.body.insertAdjacentHTML("afterbegin", tableRows.join(""));
  },
};

document.addEventListener("DOMContentLoaded", table.init);
