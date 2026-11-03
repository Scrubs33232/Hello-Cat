const HCRender = (() => {
  function initials(name) {
    return name.slice(0, 2).toUpperCase();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function attachAvatarFallback(card) {
    const img = card.querySelector(".member-card__avatar img");
    const fallback = card.querySelector(".member-card__fallback");
    img.addEventListener(
      "error",
      () => {
        img.style.display = "none";
        fallback.style.display = "flex";
      },
      { once: true }
    );
  }

  function renderMembers() {
    const grid = document.getElementById("membersGrid");
    grid.innerHTML = HC_DATA.members
      .map(
        (m, i) => `
      <article class="member-card" style="--i:${i}">
        <div class="member-card__ring">
          <div class="member-card__avatar">
            <img src="${escapeHtml(m.pfp)}" alt="${escapeHtml(m.name)}" loading="lazy">
            <span class="member-card__fallback">${escapeHtml(initials(m.name))}</span>
          </div>
        </div>
        <h3 class="member-card__name">${escapeHtml(m.name)}</h3>
        <p class="member-card__role">${escapeHtml(m.role)}</p>
        ${m.bio ? `<p class="member-card__bio">${escapeHtml(m.bio)}</p>` : ""}
      </article>`
      )
      .join("");

    grid.querySelectorAll(".member-card").forEach(attachAvatarFallback);
  }

  const PLACEHOLDER_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>';

  function renderStore() {
    const grid = document.getElementById("storeGrid");
    const empty = document.getElementById("storeEmpty");
    const items = HC_DATA.store;

    if (!items.length) {
      grid.hidden = true;
      empty.hidden = false;
      return;
    }

    grid.hidden = false;
    empty.hidden = true;

    grid.innerHTML = items
      .map(
        (item, i) => `
      <article class="store-card" style="--i:${i}">
        <div class="store-card__media">
          ${item.badge ? `<span class="store-card__badge">${escapeHtml(item.badge)}</span>` : ""}
          ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">` : PLACEHOLDER_ICON}
        </div>
        <div class="store-card__body">
          <h3 class="store-card__title">${escapeHtml(item.name)}</h3>
          <p class="store-card__desc">${escapeHtml(item.desc)}</p>
          <div class="store-card__footer">
            <span class="store-card__price">${escapeHtml(item.price)}</span>
            ${item.link ? `<a class="btn--buy" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Buy</a>` : `<button class="btn--buy" type="button" disabled>Buy</button>`}
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  const DISCORD_GUILD_ID = "1563428054464995351";
  const DISCORD_WIDGET_URL = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`;

  async function renderDiscord() {
    document.getElementById("discordInvite").href = HC_DATA.discord.inviteUrl;

    try {
      const res = await fetch(DISCORD_WIDGET_URL);
      if (!res.ok) throw new Error("widget unavailable");
      const data = await res.json();

      document.getElementById("discordName").textContent = data.name || "Hello Cat";
      document.getElementById("onlineCount").textContent = data.presence_count.toLocaleString();
      if (data.instant_invite) {
        document.getElementById("discordInvite").href = data.instant_invite;
      }
    } catch (err) {
      console.error("HC discord widget fetch failed:", err);
      document.getElementById("onlineCount").textContent = "—";
    }
  }

  function init() {
    renderMembers();
    renderStore();
    renderDiscord();
  }

  return { init };
})();
