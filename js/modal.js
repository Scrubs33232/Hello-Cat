const HCModal = (() => {
  function openModal(modal) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function initDisclaimer() {
    const trigger = document.getElementById("disclaimerTrigger");
    const modal = document.getElementById("disclaimerModal");
    const overlay = document.getElementById("disclaimerOverlay");
    const closeBtn = document.getElementById("disclaimerClose");
    if (!trigger || !modal) return;

    trigger.addEventListener("click", () => openModal(modal));
    overlay.addEventListener("click", () => closeModal(modal));
    closeBtn.addEventListener("click", () => closeModal(modal));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal(modal);
    });
  }

  function init() {
    initDisclaimer();
  }

  return { init };
})();
