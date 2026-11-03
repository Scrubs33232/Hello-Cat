const HCGate = (() => {
  function enter(skipAnimation) {
    const gate = document.getElementById("gate");
    const app = document.getElementById("app");

    app.hidden = false;
    sessionStorage.setItem("hc_entered", "1");

    if (skipAnimation) {
      gate.remove();
      return;
    }

    gate.classList.add("is-leaving");
    gate.addEventListener(
      "transitionend",
      () => {
        gate.remove();
      },
      { once: true }
    );
  }

  function initParallax() {
    const bg = document.querySelector(".gate__bg");
    const gate = document.getElementById("gate");
    if (!bg || !gate) return;

    gate.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      bg.style.transform = `translate(${x * -14}px, ${y * -10}px) scale(1.04)`;
    });

    gate.addEventListener("mouseleave", () => {
      bg.style.transform = "translate(0, 0) scale(1.04)";
    });
  }

  function init() {
    const gate = document.getElementById("gate");
    gate.addEventListener("click", () => enter(false));
    initParallax();

    if (sessionStorage.getItem("hc_entered") === "1") {
      enter(true);
    }
  }

  return { init };
})();
