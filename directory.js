const directoryRoot = document.querySelector("[data-directory]");

if (directoryRoot) {
  const ALL = "すべて";
  const cards = [...directoryRoot.querySelectorAll("[data-directory-card]")];
  const processTabs = directoryRoot.querySelector("[data-directory-processes]");
  const taskTabs = directoryRoot.querySelector("[data-directory-tasks]");
  const resultCount = directoryRoot.querySelector("[data-directory-count]");
  const keywordInput = directoryRoot.querySelector("[data-directory-keyword]");
  const primarySelect = directoryRoot.querySelector("[data-directory-primary]");
  const secondarySelect = directoryRoot.querySelector("[data-directory-secondary]");
  const operatorExclude = directoryRoot.querySelector("[data-directory-operator-exclude]");
  const processOrder = JSON.parse(directoryRoot.dataset.processOrder || "[]");
  const taskOrder = JSON.parse(directoryRoot.dataset.taskOrder || "{}");
  let activeProcess = ALL;
  let activeTask = ALL;

  const values = (card, key) => (card.dataset[key] || "").split("|").filter(Boolean);
  const unique = (items) => [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b, "ja"));

  function filterButton(label, active, dataName) {
    return `<button class="case-tab${dataName === "task" ? " task-filter" : ""}${active ? " active" : ""}" type="button" data-directory-${dataName}="${label}">${label}</button>`;
  }

  function availableProcesses() {
    return processOrder.filter((process) => cards.some((card) => values(card, "processes").includes(process)));
  }

  function availableTasks() {
    const ordered = activeProcess === ALL
      ? Object.values(taskOrder).flat()
      : taskOrder[activeProcess] || [];
    return [...new Set(ordered)];
  }

  function renderTabs() {
    const processes = [ALL, ...availableProcesses()];
    processTabs.innerHTML = processes
      .map((process) => filterButton(process, process === activeProcess, "process"))
      .join("");
    [...processTabs.querySelectorAll("[data-directory-process]")].forEach((button, index) => {
      button.dataset.directoryProcess = processes[index];
    });

    const tasks = [ALL, ...availableTasks()];
    if (!tasks.includes(activeTask)) activeTask = ALL;
    taskTabs.innerHTML = tasks.map((task) => filterButton(task, task === activeTask, "task")).join("");
  }

  function render() {
    const query = (keywordInput?.value || "").trim().toLocaleLowerCase("ja");
    const primary = primarySelect?.value || ALL;
    const secondary = secondarySelect?.value || ALL;
    let visible = 0;

    cards.forEach((card) => {
      const matches =
        (activeProcess === ALL || values(card, "processes").includes(activeProcess)) &&
        (activeTask === ALL || values(card, "tasks").includes(activeTask)) &&
        (primary === ALL || values(card, "primary").includes(primary)) &&
        (secondary === ALL || values(card, "secondary").includes(secondary)) &&
        (!operatorExclude?.checked || card.dataset.operator !== "true") &&
        (!query || (card.dataset.search || "").toLocaleLowerCase("ja").includes(query));
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    resultCount.textContent = `${visible}件の導入事例を表示中`;
  }

  processTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-directory-process]");
    if (!button) return;
    activeProcess = button.dataset.directoryProcess;
    activeTask = ALL;
    renderTabs();
    render();
  });

  taskTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-directory-task]");
    if (!button) return;
    activeTask = button.dataset.directoryTask;
    renderTabs();
    render();
  });

  [keywordInput, primarySelect, secondarySelect].filter(Boolean).forEach((control) => {
    control.addEventListener(control.tagName === "INPUT" ? "input" : "change", render);
  });
  operatorExclude?.addEventListener("change", render);

  renderTabs();
  render();
}
