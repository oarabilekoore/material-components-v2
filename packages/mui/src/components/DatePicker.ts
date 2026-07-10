import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const pickerSva = sva({
  base: {
    backgroundColor: "var(--md-surface-container-high, var(--md-surface))",
    borderRadius: "28px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    color: "var(--md-on-surface)",
    width: "328px",
    boxSizing: "border-box",
  },
});

const headerSva = sva({
  base: {
    fontSize: "12px",
    fontWeight: "500",
    color: "var(--md-on-surface-variant)",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "4px",
  },
});

const titleSva = sva({
  base: {
    fontSize: "24px",
    fontWeight: "400",
    color: "var(--md-on-surface)",
    marginBottom: "16px",
  },
});

const gridSva = sva({
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    textAlign: "center",
    fontSize: "12px",
  },
});

const daySva = sva({
  base: {
    width: "36px",
    height: "36px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.1s ease, color 0.1s ease",
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "var(--md-primary)",
        color: "var(--md-on-primary)",
      },
      false: {
        color: "var(--md-on-surface)",
      },
    },
    today: {
      true: {
        border: "1px solid var(--md-primary)",
      },
    },
  },
});

export class DatePicker extends BaseElement {
  private currentYear: number;
  private currentMonth: number;
  private selectedDate: Date | null = null;
  private onSelectCallback: ((date: Date) => void) | null = null;

  private headerEl: HTMLDivElement;
  private titleEl: HTMLDivElement;
  private monthLabelEl: HTMLSpanElement;
  private gridEl: HTMLDivElement;

  constructor() {
    super("div");
    this.element.className = pickerSva();

    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();

    this.headerEl = document.createElement("div");
    this.headerEl.className = headerSva();
    this.headerEl.textContent = "Select date";
    this.element.appendChild(this.headerEl);

    this.titleEl = document.createElement("div");
    this.titleEl.className = titleSva();
    this.titleEl.textContent = today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    this.element.appendChild(this.titleEl);

    const navBar = document.createElement("div");
    navBar.style.display = "flex";
    navBar.style.justifyContent = "space-between";
    navBar.style.alignItems = "center";
    navBar.style.marginBottom = "8px";

    this.monthLabelEl = document.createElement("span");
    this.monthLabelEl.style.fontWeight = "500";
    
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "◀";
    prevBtn.style.background = "none";
    prevBtn.style.border = "none";
    prevBtn.style.color = "var(--md-primary)";
    prevBtn.style.cursor = "pointer";
    prevBtn.addEventListener("click", () => this.navigate(-1));

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "▶";
    nextBtn.style.background = "none";
    nextBtn.style.border = "none";
    nextBtn.style.color = "var(--md-primary)";
    nextBtn.style.cursor = "pointer";
    nextBtn.addEventListener("click", () => this.navigate(1));

    navBar.appendChild(prevBtn);
    navBar.appendChild(this.monthLabelEl);
    navBar.appendChild(nextBtn);
    this.element.appendChild(navBar);

    const daysHeader = document.createElement("div");
    daysHeader.className = gridSva();
    ["S", "M", "T", "W", "T", "F", "S"].forEach((d) => {
      const sp = document.createElement("span");
      sp.textContent = d;
      sp.style.color = "var(--md-on-surface-variant)";
      daysHeader.appendChild(sp);
    });
    this.element.appendChild(daysHeader);

    this.gridEl = document.createElement("div");
    this.gridEl.className = gridSva();
    this.element.appendChild(this.gridEl);

    this.render();
  }

  private navigate(direction: number) {
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.render();
  }

  private render() {
    this.monthLabelEl.textContent = new Date(this.currentYear, this.currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    this.gridEl.innerHTML = "";

    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const numDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      this.gridEl.appendChild(document.createElement("div"));
    }

    const today = new Date();

    for (let day = 1; day <= numDays; day++) {
      const dayEl = document.createElement("div");
      
      const isSelected = this.selectedDate !== null && 
                         this.selectedDate.getDate() === day &&
                         this.selectedDate.getMonth() === this.currentMonth &&
                         this.selectedDate.getFullYear() === this.currentYear;
                         
      const isToday = today.getDate() === day &&
                      today.getMonth() === this.currentMonth &&
                      today.getFullYear() === this.currentYear;

      dayEl.className = daySva({ selected: isSelected, today: isToday });
      dayEl.textContent = String(day);

      dayEl.addEventListener("click", () => {
        this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.titleEl.textContent = this.selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        this.render();
        if (this.onSelectCallback) {
          this.onSelectCallback(this.selectedDate);
        }
      });

      this.gridEl.appendChild(dayEl);
    }
  }

  SetOnSelect(callback: (date: Date) => void): this {
    this.onSelectCallback = callback;
    return this;
  }

  GetSelectedDate(): Date | null {
    return this.selectedDate;
  }

  override GetType(): string {
    return "DatePicker";
  }
}

function CreateDatePicker(): DatePicker {
  return new DatePicker();
}

/**
 * AddDatePicker function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {DatePicker}
 *
 */
export function AddDatePicker(parent: LayoutElement): DatePicker {
  const picker = CreateDatePicker();
  parent.AddChild(picker);
  return picker;
}
