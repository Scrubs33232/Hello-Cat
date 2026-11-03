const HCTabs = (() => {
  function moveIndicator(tabsEl, activeBtn) {
    const indicator = tabsEl.querySelector(".tabs__indicator");
    if (!indicator || !activeBtn) return;

    const tabsRect = tabsEl.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${btnRect.left - tabsRect.left}px)`;
  }

  function syncIndicators(tabName) {
    document.querySelectorAll(".tabs").forEach((tabsEl) => {
      const activeBtn = tabsEl.querySelector(`.tabs__item[data-tab="${tabName}"]`);
      moveIndicator(tabsEl, activeBtn);
    });
  }

  function setActiveTab(tabName) {
    document.querySelectorAll(".tabs__item").forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll(".panel").forEach((panel) => {
      const isActive = panel.id === `panel-${tabName}`;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    syncIndicators(tabName);
  }

  function closeMobileMenu() {
    const mobileTabs = document.getElementById("mobileTabs");
    mobileTabs.classList.remove("is-open");
    mobileTabs.hidden = true;
  }

  function toggleMobileMenu() {
    const mobileTabs = document.getElementById("mobileTabs");
    const isOpen = mobileTabs.classList.toggle("is-open");
    mobileTabs.hidden = !isOpen;
    if (isOpen) {
      const activeTab = mobileTabs.querySelector(".tabs__item.is-active")?.dataset.tab;
      requestAnimationFrame(() => moveIndicator(mobileTabs, mobileTabs.querySelector(`.tabs__item[data-tab="${activeTab}"]`)));
    }
  }

  function init() {
    document.querySelectorAll(".tabs__item").forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveTab(btn.dataset.tab);
        closeMobileMenu();
      });
    });

    document.getElementById("burgerBtn").addEventListener("click", toggleMobileMenu);

    window.addEventListener("resize", () => {
      const activeTab = document.querySelector(".tabs__item.is-active")?.dataset.tab;
      if (activeTab) syncIndicators(activeTab);
    });

    requestAnimationFrame(() => setActiveTab("faces"));
  }

  return { init };
})();
