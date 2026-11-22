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

document.querySelectorAll(".vlog-toggle").forEach((toggle) => {
  const panel = document.getElementById(toggle.getAttribute("aria-controls"));
  const label = toggle.querySelector("span");
  if (!panel) return;

  toggle.addEventListener("click", () => {
    const isOpening = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(isOpening));
    if (label) label.textContent = isOpening ? "Close story" : "Read story";

    if (isOpening) {
      panel.hidden = false;
      if (window.gsap && !reducedMotion) {
        gsap.fromTo(panel, { height: 0, autoAlpha: 0 }, {
          height: "auto", autoAlpha: 1, duration: 0.5, ease: "power2.out",
          clearProps: "height"
        });
      }
    } else if (window.gsap && !reducedMotion) {
      gsap.to(panel, {
        height: 0, autoAlpha: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: "all" }); }
      });
    } else {
      panel.hidden = true;
    }
  });
});

const sections = document.querySelectorAll(".section-reveal");
const gsapTargets = document.querySelectorAll(
  ".section-reveal, .vlog-entry, .projects-main, .projects-contact, .projects-footer, .vlog-hero-copy, .vlog-footer"
);

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  if (reducedMotion) {
    gsapTargets.forEach((target) => target.classList.add("is-visible"));
  } else {
    const heroIntro = document.querySelectorAll(".hero .intro-reveal");
    if (heroIntro.length) {
      gsap.fromTo(heroIntro, { autoAlpha: 0, y: 46 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.16,
        delay: 0.15,
        ease: "power3.out"
      });
    }

    gsapTargets.forEach((target) => {
      const revealItems = target.matches(".project-card")
        ? [target]
        : Array.from(target.children).filter((item) => !item.matches(".grain"));

      if (!revealItems.length) return;

      gsap.fromTo(revealItems, {
        autoAlpha: 0,
        y: 76,
        scale: 0.97,
        filter: "blur(7px)"
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.05,
        stagger: target.matches(".project-card") ? 0 : 0.16,
        ease: "power3.out",
        clearProps: "filter",
        scrollTrigger: { trigger: target, start: "top 88%", once: true },
        onStart: () => target.classList.add("is-visible")
      });
    });

    const qualityImage = document.querySelector(".award-art img");
    if (qualityImage) {
      const motionByViewport = gsap.matchMedia();
      motionByViewport.add("(min-width: 601px)", () => {
        gsap.fromTo(qualityImage, { x: 110, y: 28, rotate: 7, scale: 0.88 }, {
          x: 0, y: 0, rotate: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: ".achievement-block", start: "top 82%", end: "center 48%", scrub: 0.8 }
        });
      });
      motionByViewport.add("(max-width: 600px)", () => {
        gsap.fromTo(qualityImage, { y: 70, scale: 0.9 }, {
          y: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: qualityImage, start: "top 92%", end: "center 65%", scrub: 0.6 }
        });
      });
    }
  }
} else {
  sections.forEach((section) => section.classList.add("is-visible"));
  gsapTargets.forEach((target) => target.classList.add("is-visible"));
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
