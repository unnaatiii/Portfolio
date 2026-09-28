const tilt = document.getElementById("hero-tilt");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (tilt && !prefersReduced) {
  const inner = tilt.querySelector(".hero-tilt-inner");
  const shine = tilt.querySelector(".hero-shine");

  const reset = () => {
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  tilt.addEventListener("mousemove", (event) => {
    const box = tilt.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const rotateY = (x - 0.5) * 22;
    const rotateX = (0.5 - y) * 14;

    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;

    if (shine) {
      shine.style.setProperty("--shine-x", `${x * 100}%`);
      shine.style.setProperty("--shine-y", `${y * 100}%`);
    }
  });

  tilt.addEventListener("mouseleave", reset);
}
