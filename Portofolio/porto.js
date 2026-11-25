  gsap.registerPlugin(ScrollTrigger);

  /* ===== Lenis (smooth scroll) tersambung ke GSAP ===== */
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Klik link anchor (#about, #contact, dll) ikut scroll halus Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });

  /* ===== Navbar: masuk sekali saat halaman dibuka ===== */
  gsap.from(".navbar", { y: -80, opacity: 0, duration: 0.9, ease: "power3.out" });
  gsap.from(".navbar nav strong", {
    y: -12, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.35,
  });

  /* ===== Muncul saat section masuk, hilang saat section terlewat ===== */
  const EASE = "power3.out";

  function revealSection(trigger, items) {
    // kondisi awal: tersembunyi
    items.forEach((i) => gsap.set(i.sel, { opacity: 0, ...i.from }));

    const show = () =>
      items.forEach((i, idx) =>
        gsap.to(i.sel, {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 0.8, ease: EASE,
          delay: idx * 0.08,
          stagger: i.stagger || 0,
          overwrite: true,
        })
      );

    // leaveBack = true -> kembali ke posisi awal (section di bawah layar)
    // leaveBack = false -> naik & memudar (section sudah terlewat ke atas)
    const hide = (leaveBack) =>
      items.forEach((i) =>
        gsap.to(i.sel, {
          opacity: 0,
          ...(leaveBack ? { x: i.from.x || 0, y: i.from.y || 0, scale: i.from.scale || 1 } : { x: 0, y: -40, scale: 1 }),
          duration: 0.5, ease: "power2.in",
          overwrite: true,
        })
      );

    const st = ScrollTrigger.create({
      trigger,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: show,
      onEnterBack: show,
      onLeave: () => hide(false),
      onLeaveBack: () => hide(true),
    });

    if (st.isActive) show(); // kalau sudah terlihat saat halaman dibuka
  }

  // Hero (termasuk tombol Explore & Contact Me lewat wrapper .buttons)
  revealSection(".hero", [
    { sel: ".hero h1",        from: { y: 40 } },
    { sel: ".typing",         from: { y: 30 } },
    { sel: ".desc",           from: { y: 30 } },
    { sel: ".buttons",        from: { y: 30 } },
    { sel: ".connect",        from: { y: 20 } },
    { sel: ".socials",        from: { y: 20 } },
    { sel: ".hero-photo img", from: { scale: 0.8 } },
    { sel: ".stat",           from: { x: -40 }, stagger: 0.15 },
  ]);

  // Section about
  revealSection(".more-about", [
    { sel: ".more-about > *", from: { y: 40 }, stagger: 0.15 },
  ]);

  /* ===== Motion: hover pegas pada ikon sosial ===== */
  const { animate } = Motion;
  document.querySelectorAll(".socials a").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      animate(el, { scale: 1.12 }, { type: "spring", stiffness: 400, damping: 15 })
    );
    el.addEventListener("mouseleave", () =>
      animate(el, { scale: 1 }, { type: "spring", stiffness: 400, damping: 20 })
    );
  });