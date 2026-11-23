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

document.querySelectorAll(".vlog-entry-trigger").forEach((toggle) => {
  const panel = document.getElementById(toggle.getAttribute("aria-controls"));
  const label = toggle.querySelector(".vlog-toggle-text");
  if (!panel) return;

  toggle.addEventListener("click", () => {
    const isOpening = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(isOpening));
    if (label) label.textContent = isOpening ? "Close story" : "Read full story";

    if (isOpening) {
      panel.hidden = false;
      if (window.gsap && !reducedMotion) {
        window.gsap.fromTo(panel, { height: 0, autoAlpha: 0 }, {
          height: "auto", autoAlpha: 1, duration: 0.5, ease: "power2.out",
          clearProps: "height"
        });
      }
    } else if (window.gsap && !reducedMotion) {
      window.gsap.to(panel, {
        height: 0, autoAlpha: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => { panel.hidden = true; window.gsap.set(panel, { clearProps: "all" }); }
      });
    } else {
      panel.hidden = true;
    }
  });
});

const initializeGsapEffects = () => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
const resumeButton = document.querySelector(".resume-button");
if (resumeButton && window.gsap && !reducedMotion) {
  let activeMagicScene;
  let activeMagicTimeline;

  resumeButton.addEventListener("click", () => {
    activeMagicTimeline?.kill();
    activeMagicScene?.remove();

    const scene = document.createElement("div");
    scene.className = "resume-magic-scene";
    scene.setAttribute("aria-hidden", "true");
    document.body.appendChild(scene);
    activeMagicScene = scene;

    const buttonBox = resumeButton.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const startX = buttonBox.left + buttonBox.width / 2;
    const startY = buttonBox.top + buttonBox.height / 2;
    const swirlTurns = 2.6;
    const swirlRadius = Math.min(118, Math.max(44, width * 0.085));
    const edgePad = Math.min(200, Math.max(120, width * 0.28));
    const endX = Math.min(width - edgePad, Math.max(edgePad, startX + width * 0.14));
    const endY = 34;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("resume-magic-trail");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const spiralPoints = [`M ${startX} ${startY}`];
    for (let i = 1; i <= 220; i += 1) {
      const progress = i / 220;
      const radius = swirlRadius * Math.sin(Math.PI * progress);
      const angle = Math.PI * 2 * swirlTurns * progress;
      const x = startX + (endX - startX) * progress + Math.cos(angle) * radius;
      const y = startY + (endY - startY) * progress;
      spiralPoints.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    path.setAttribute("d", spiralPoints.join(" "));
    svg.appendChild(path);
    scene.appendChild(svg);

    const card = document.createElement("div");
    card.className = "resume-float-card";
    card.innerHTML = '<div class="resume-card-top"><b>US<span>.</span></b><i>01 / 01</i></div><div class="resume-card-seal">✦</div><p>UNNATI SRIVASTAV</p><strong>MY RESUME</strong><div class="resume-card-lines"><i></i><i></i><i></i></div><small>QUALITY · FRONTEND</small>';
    scene.appendChild(card);

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    const sparkleCount = 17;
    for (let i = 0; i < sparkleCount; i += 1) {
      const point = path.getPointAtLength((pathLength * (i + 1)) / (sparkleCount + 1));
      const sparkle = document.createElement("span");
      sparkle.className = `resume-card-sparkle${i % 3 === 0 ? " is-rose" : ""}`;
      sparkle.textContent = i % 4 === 0 ? "✧" : "✦";
      sparkle.style.left = `${point.x}px`;
      sparkle.style.top = `${point.y}px`;
      scene.appendChild(sparkle);
      gsap.fromTo(sparkle, { autoAlpha: 0, scale: 0, y: 0 }, {
        autoAlpha: 1, scale: 1, y: -19, duration: 0.35, delay: i * 0.075,
        yoyo: true, repeat: 1, ease: "back.out(2)"
      });
    }

    const motion = { progress: 0 };
    const updateCard = () => {
      const progress = motion.progress;
      const pointOnTrail = path.getPointAtLength(pathLength * progress);
      const scale = progress < 0.2 ? 0.38 + progress * 3.1 : 1 - ((progress - 0.2) / 0.8) * 0.42;
      const opacity = progress < 0.07 ? progress / 0.07 : progress > 0.76 ? Math.max(0, (1 - progress) / 0.24) : 1;
      gsap.set(card, {
        x: pointOnTrail.x - card.offsetWidth / 2,
        y: pointOnTrail.y - card.offsetHeight / 2,
        rotation: Math.sin(progress * Math.PI * 2 * swirlTurns) * 13,
        scale,
        autoAlpha: opacity
      });
    };

    updateCard();
    gsap.fromTo(resumeButton, { scale: 1 }, {
      scale: 1.045, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out",
      transformOrigin: "50% 50%"
    });
    activeMagicTimeline = gsap.timeline({
      onComplete: () => {
        scene.remove();
        if (activeMagicScene === scene) activeMagicScene = null;
      }
    });
    activeMagicTimeline.to(motion, {
      progress: 1, duration: 2.05, ease: "power1.inOut", onUpdate: updateCard
    }, 0);
    activeMagicTimeline.to(path, {
      strokeDashoffset: 0, duration: 1.8, ease: "power1.inOut"
    }, 0);
    activeMagicTimeline.to(path, {
      opacity: 0, duration: 0.45, ease: "power1.out"
    }, 1.5);
    activeMagicTimeline.fromTo(card, {
      filter: "drop-shadow(0 12px 18px rgba(255, 189, 98, .15))"
    }, {
      filter: "drop-shadow(0 18px 28px rgba(255, 189, 98, .55))",
      duration: 0.45, yoyo: true, repeat: 2, ease: "sine.inOut"
    }, 0.1);
  });
}

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
};

if (document.readyState === "complete") initializeGsapEffects();
else document.addEventListener("DOMContentLoaded", initializeGsapEffects, { once: true });

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
