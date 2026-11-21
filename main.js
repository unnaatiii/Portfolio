const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}

const sections = document.querySelectorAll(".section-reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add("is-visible"));
}

const progressBar = document.querySelector(".scroll-progress");
const hero = document.querySelector(".hero");
let scrollFrame;
const updateScrollEffects = () => {
  if (progressBar) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.setProperty("--scroll-progress", `${scrollable > 0 ? window.scrollY / scrollable : 0}`);
  }
  if (hero && !reducedMotion) {
    const shift = Math.min(window.scrollY, window.innerHeight) * -0.09;
    hero.style.setProperty("--scroll-parallax", `${shift}px`);
    hero.style.setProperty("--scroll-copy-parallax", `${shift * 0.45}px`);
  }
};
window.addEventListener("scroll", () => {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(() => {
      updateScrollEffects();
      scrollFrame = null;
    });
  }
}, { passive: true });
updateScrollEffects();

const portrait = document.querySelector(".portrait-wrap");
if (portrait && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  let frame;
  portrait.addEventListener("pointermove", (event) => {
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      portrait.style.setProperty("--tilt-x", `${-y * 10}deg`);
      portrait.style.setProperty("--tilt-y", `${x * 14}deg`);
      portrait.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 14}deg)`;
      portrait.style.setProperty("--light-x", `${x * 100 + 50}%`);
      portrait.style.setProperty("--light-y", `${y * 100 + 50}%`);
    });
  });
  portrait.addEventListener("pointerleave", () => {
    portrait.style.setProperty("--tilt-x", "0deg");
    portrait.style.setProperty("--tilt-y", "0deg");
    portrait.style.transform = "rotateX(0deg) rotateY(0deg)";
    portrait.style.setProperty("--light-x", "50%");
    portrait.style.setProperty("--light-y", "40%");
  });
}
