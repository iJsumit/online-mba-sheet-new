document.addEventListener("DOMContentLoaded", function () {
    renderLeadForm('heroFormContainer');
    initLeadPopup();
    initToggles();
    initFaqAccordion();
    initRecruitersCarousel();
    initCurriculumAccordion();
    initVideoModal();
    initCareerMarquee();
    initFloatingApplyButton();
    initMobileMenu();
    initQualificationForms();
    formFunction();
});


function renderLeadForm(targetId) {

    const target =
        document.getElementById(targetId);

    const template =
        document.getElementById('leadFormTemplate');

    if (!target || !template) return;

    target.appendChild(
        template.content.cloneNode(true)
    );
}


function getUTM(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || '';
}

function captureUTMFields(form) {
    const fields = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "utm_id"
    ];

    fields.forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            input.value = getUTM(name);
        }
    });

    const exactUrlField = form.querySelector('[name="exact_url"]');
    if (exactUrlField) {
        exactUrlField.value = window.location.href;
    }

    const searchTermField = form.querySelector('[name="search_term"]');
    if (searchTermField) {
        searchTermField.value = getUTM('utm_term');
    }
}

function redirectThankYou() {
    window.location.href = "https://online.jaipuria.ac.in/thank-you/";
}

function postToSheet(form, submitBtn, btnText = "Submit") {

    const formData = new FormData(form);

    const salesRequest = fetch(
        'https://script.google.com/macros/s/AKfycbwmmNWR3s8LtRYZh-M6b0c3iyIIfQw6iZubkIpbftBycqfP6mvG9M6abS52eecNGSSv/exec',
        {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        }
    );

    const backupRequest = fetch(
        'https://script.google.com/macros/s/AKfycbzZ2SbvLhCXqAXxGawg39XlONL_B066rlLtFj5X6ZRpF3-k0tcfdk3OC_0HACBzDLrSiw/exec',
        {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        }
    );

    Promise.all([
        salesRequest,
        backupRequest
    ])
        .then(() => {
            redirectThankYou();
        })
        .catch((err) => {

            console.error('Sheet Error:', err);

            if (submitBtn) {
                submitBtn.innerHTML = btnText;
                submitBtn.disabled = false;
            }
        });
}

function createYearGrid(yearGrid, yearHidden, yearTrigger, yearError) {

    if (!yearGrid || !yearTrigger) return;

    const yearLabel =
        yearTrigger.querySelector('.year-label');

    if (!yearGrid.children.length) {

        const currentYear = new Date().getFullYear();

        for (let y = currentYear; y >= 1980; y--) {

            const btn = document.createElement('button');

            btn.type = 'button';
            btn.textContent = y;

            btn.style.cssText = `
                font-family:Open Sans;
                font-size:12px;
                padding:5px 2px;
                border:1px solid #dedede;
                background:#fff;
                color:#555;
                cursor:pointer;
                border-radius:2px;
                text-align:center;
                width:100%;
            `;

            yearGrid.appendChild(btn);
        }
    }

    yearGrid.querySelectorAll('button').forEach(btn => {

        if (btn.dataset.bound) return;

        btn.dataset.bound = '1';

        btn.addEventListener('click', () => {

            yearGrid.querySelectorAll('button').forEach(b => {

                b.style.background = '#fff';
                b.style.color = '#555';
                b.style.borderColor = '#dedede';
                b.style.fontWeight = 'normal';
            });

            btn.style.background = '#573865';
            btn.style.color = '#fff';
            btn.style.borderColor = '#573865';
            btn.style.fontWeight = 'bold';

            yearHidden.value = btn.textContent;

            if (yearLabel) {
                yearLabel.textContent = btn.textContent;
            }

            yearTrigger.style.color = '#333';
            yearTrigger.style.borderColor = '#dedede';

            yearGrid.style.display = 'none';
            yearGrid.style.gridTemplateColumns = '';

            if (yearError) {
                yearError.style.display = 'none';
            }
        });
    });

    if (!yearTrigger.dataset.bound) {

        yearTrigger.dataset.bound = '1';

        yearTrigger.addEventListener('click', e => {

            e.stopPropagation();

            const isOpen =
                yearGrid.style.display === 'grid';

            yearGrid.style.display =
                isOpen ? 'none' : 'grid';

            yearGrid.style.gridTemplateColumns =
                isOpen ? '' : 'repeat(3,1fr)';
        });
    }

    if (!yearGrid.dataset.docBound) {

        yearGrid.dataset.docBound = '1';

        document.addEventListener('click', e => {

            if (
                !yearGrid.contains(e.target) &&
                !yearTrigger.contains(e.target)
            ) {

                yearGrid.style.display = 'none';
                yearGrid.style.gridTemplateColumns = '';
            }
        });
    }
}

function resetYearSelection(yearHidden, yearTrigger, yearGrid) {
    yearHidden.value = '';
    yearTrigger.querySelector('.year-label').textContent = 'Select year';
    yearTrigger.style.color = '#999';
    yearGrid.querySelectorAll('button').forEach(b => {
        b.style.background = '#fff';
        b.style.color = '#555';
        b.style.borderColor = '#dedede';
        b.style.fontWeight = 'normal';
    });
}

function formFunction() {
    if (form.dataset.submitInit) return;

form.dataset.submitInit = '1';
    document.querySelectorAll('.lead-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!validateMainForm(form)) return;
            captureUTMFields(form);
            const submitBtn = form.querySelector('[type="submit"]');
            const formData = new FormData(form);
            console.log(Object.fromEntries(formData.entries()));
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Processing...'; }
            // postToSheet(form, submitBtn);
        });
    });
}

function validateMainForm(form) {
    let ok = true;

    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const qual = form.querySelector('[name="qualification"]');
    const work = form.querySelector('[name="experience"]');
    const auth = form.querySelector('[name="authorised"]');

    const yearWrapper =
        form.querySelector('.year-of-grad-wrapper');

    const yearHidden =
        form.querySelector('[name="yearOfGraduation"]');

    const yearTrigger =
        form.querySelector('.year-trigger');

    const yearError =
        form.querySelector('.year-error');

    const authErr =
        form.querySelector('.auth-error');

    if (!name.value.trim()) {
        showFieldError(name, 'Name is required.');
        ok = false;
    } else {
        clearFieldError(name);
    }

    const emailValue = email.value.trim();

    if (!emailValue) {

        showFieldError(
            email,
            'Email is required.'
        );

        ok = false;

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    ) {

        showFieldError(
            email,
            'Enter a valid email.'
        );

        ok = false;

    } else {

        clearFieldError(email);

    }

    const phoneValue = phone.value.trim();

    if (!phoneValue) {

        showFieldError(
            phone,
            'Phone number is required.'
        );

        ok = false;

    } else if (
        !/^\d{10}$/.test(phoneValue)
    ) {

        showFieldError(
            phone,
            'Enter a valid 10-digit phone number.'
        );

        ok = false;

    } else {

        clearFieldError(phone);

    }

    if (!qual.value) {

        showFieldError(
            qual,
            'Please select your qualification.'
        );

        ok = false;

    } else {

        clearFieldError(qual);

    }

    if (
        yearWrapper.style.display !== 'none' &&
        !yearHidden.value
    ) {

        yearTrigger.style.borderColor =
            '#c0392b';

        yearError.style.display = '';

        ok = false;

    } else {

        yearTrigger.style.borderColor =
            '#dedede';

        yearError.style.display = 'none';

    }

    if (!work.value) {

        showFieldError(
            work,
            'Please select your work experience.'
        );

        ok = false;

    } else {

        clearFieldError(work);

    }

    if (!auth.checked) {

        authErr.style.display = '';

        ok = false;

    } else {

        authErr.style.display = 'none';

    }

    return ok;


}

function showFieldError(inputEl, msg) {

    if (!inputEl) return;

    inputEl.style.borderColor = '#c0392b';

    const wrapper = inputEl.closest('.field-control-group');

    if (!wrapper) return;

    const msgDiv = wrapper.querySelector('.field-validation-messages');
    const label = wrapper.querySelector('.validation-msg');

    if (msgDiv) {
        msgDiv.style.display = '';
    }

    if (label) {
        label.textContent = msg;
        label.classList.remove('hide');
        label.style.color = '#c0392b';
        label.style.fontFamily = 'Open Sans';
        label.style.fontSize = '11px';
    }
}

function clearFieldError(inputEl) {

    if (!inputEl) return;

    inputEl.style.borderColor = '';

    const wrapper = inputEl.closest('.field-control-group');

    if (!wrapper) return;

    const msgDiv = wrapper.querySelector('.field-validation-messages');
    const label = wrapper.querySelector('.validation-msg');

    if (msgDiv) {
        msgDiv.style.display = 'none';
    }

    if (label) {
        label.textContent = '';
        label.classList.add('hide');
    }
}

function initFaqAccordion() {

    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(function (btn) {

        btn.addEventListener('click', function () {

            const body = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');

            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            faqBtns.forEach(function (b) {

                b.setAttribute('aria-expanded', 'false');

                b.nextElementSibling.classList.add('hidden');

                const ic = b.querySelector('.faq-icon');

                if (ic) {
                    ic.style.transform = '';
                }
            });

            if (!isOpen) {

                btn.setAttribute('aria-expanded', 'true');

                body.classList.remove('hidden');

                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });
}

function initRecruitersCarousel() {

    const tracks = Array.from(document.querySelectorAll(".recruitersTrack"));

    if (!tracks.length) return;

    const prevBtn = document.getElementById("recruitersPrev");
    const nextBtn = document.getElementById("recruitersNext");

    const transitionMs = 550;

    function getGapPx(item) {
        const style = window.getComputedStyle(item);

        return (
            (parseFloat(style.marginLeft) || 0) +
            (parseFloat(style.marginRight) || 0)
        );
    }

    function initInfiniteTrack(track) {

        const items = Array.from(track.children);

        if (items.length < 2) return null;

        const first = items[0];

        const itemWidth = first.getBoundingClientRect().width;
        const gap = getGapPx(first);

        const viewport = track.parentElement;

        const viewportWidth = viewport.getBoundingClientRect().width;

        const clonesNeeded =
            Math.ceil(viewportWidth / (itemWidth + gap)) + 2;

        for (let i = 0; i < clonesNeeded; i++) {
            track.appendChild(items[i % items.length].cloneNode(true));
        }

        let x = 0;

        function stepPx() {
            const el = track.children[0];

            return el.getBoundingClientRect().width + getGapPx(el);
        }

        function apply(withTransition = true) {

            track.style.transition = withTransition
                ? `transform ${transitionMs}ms ease-in-out`
                : "none";

            track.style.transform = `translateX(${x}px)`;
        }

        function normalize() {

            const per = stepPx();
            const originalWidth = per * items.length;

            if (Math.abs(x) >= originalWidth) {
                x += originalWidth;
                apply(false);
            }

            if (x > 0) {
                x -= originalWidth;
                apply(false);
            }
        }

        function next() {
            x -= stepPx();
            apply(true);

            setTimeout(normalize, transitionMs + 20);
        }

        function prev() {
            x += stepPx();
            apply(true);

            setTimeout(normalize, transitionMs + 20);
        }

        return { next, prev };
    }

    const instances = tracks.map(initInfiniteTrack);

    prevBtn?.addEventListener("click", () => {
        instances.forEach(i => i?.prev());
    });

    nextBtn?.addEventListener("click", () => {
        instances.forEach(i => i?.next());
    });
}

function initCurriculumAccordion() {

    const root = document.querySelector('[data-accordion="curriculum"]');

    if (!root) return;

    const triggers = Array.from(
        root.querySelectorAll("[data-acc-trigger]")
    );

    function closeAll(exceptBtn = null) {

        triggers.forEach((btn) => {

            if (btn === exceptBtn) return;

            const panelId = btn.getAttribute("aria-controls");
            const panel = panelId
                ? document.getElementById(panelId)
                : null;

            btn.setAttribute("aria-expanded", "false");

            btn.closest("div.border")?.classList.remove("acc-open");

            if (panel) {
                panel.hidden = true;
            }
        });
    }

    triggers.forEach((btn) => {

        btn.addEventListener("click", () => {

            const panelId = btn.getAttribute("aria-controls");

            const panel = panelId
                ? document.getElementById(panelId)
                : null;

            if (!panel) return;

            const isOpen =
                btn.getAttribute("aria-expanded") === "true";

            closeAll(btn);

            btn.setAttribute(
                "aria-expanded",
                isOpen ? "false" : "true"
            );

            btn.closest("div.border")?.classList.toggle(
                "acc-open",
                !isOpen
            );

            panel.hidden = isOpen;
        });
    });
}

function initToggles() {
    document.querySelectorAll("[data-toggle]").forEach(btn => {
        const text = btn.querySelector(".toggle-text");
        const icon = btn.querySelector("svg");
        btn.addEventListener("click", () => {
            const content = document.getElementById(btn.dataset.toggle);
            if (!content) return;
            const hidden = content.classList.toggle("hidden");
            text && (text.textContent = hidden ? "Read More" : "Show Less");
            icon?.classList.toggle("rotate-180", !hidden);
            if (btn.dataset.scroll && hidden) {
                document.getElementById(btn.dataset.scroll)
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
            btn.hasAttribute("aria-expanded") && btn.setAttribute("aria-expanded", !hidden);
        });
    });
}

function initVideoModal() {

    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("videoModalFrame");
    const titleEl = document.getElementById("videoModalTitle");

    if (!modal || !frame) return;

    const triggers = Array.from(
        document.querySelectorAll("[data-modal-trigger]")
    );

    const closers = Array.from(
        document.querySelectorAll("[data-modal-close]")
    );

    function openModal(videoUrl, title) {

        if (titleEl) {
            titleEl.textContent = title || "Success Story";
        }

        frame.src = videoUrl;

        modal.classList.remove("hidden");

        modal.setAttribute("aria-hidden", "false");

        document.documentElement.style.overflow = "hidden";
    }

    function closeModal() {

        modal.classList.add("hidden");

        modal.setAttribute("aria-hidden", "true");

        document.documentElement.style.overflow = "";

        frame.src = "";
    }

    function onTriggerActivate(el) {

        const videoUrl = el.getAttribute("data-video");
        const title = el.getAttribute("data-title") || "Success Story";

        if (!videoUrl) return;

        openModal(videoUrl, title);
    }

    triggers.forEach((el) => {

        el.addEventListener("click", () => {
            onTriggerActivate(el);
        });

        el.addEventListener("keydown", (e) => {

            if (e.key === "Enter" || e.key === " ") {

                e.preventDefault();

                onTriggerActivate(el);
            }
        });
    });

    closers.forEach((el) => {
        el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {

        if (
            e.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {
            closeModal();
        }
    });
}

function initCareerMarquee() {

    const marquee = document.querySelector("#career-scroll .career-marquee");
    const track = document.querySelector("#career-scroll .career-track");

    if (!marquee || !track) return;

    let items = Array.from(track.querySelectorAll(".career-item"));

    const SPEED = 60;

    let x = 0;
    let lastTs = null;

    function visibleCount() {

        const w = window.innerWidth;

        if (w < 768) return 2;

        return 5;
    }

    function applySizes() {

        items = Array.from(track.querySelectorAll(".career-item"));

        const vw = marquee.clientWidth;

        const gap = window.innerWidth < 768 ? 12 : 16;

        const visible = visibleCount();

        const cardW = Math.floor(
            (vw - gap * (visible - 1)) / visible
        );

        track.style.display = "flex";
        track.style.gap = gap + "px";
        track.style.willChange = "transform";

        items.forEach((item) => {

            item.style.flex = `0 0 ${cardW}px`;
            item.style.width = `${cardW}px`;
        });

        x = 0;

        track.style.transform = `translate3d(${x}px,0,0)`;
    }

    function tick(ts) {

        if (!lastTs) {
            lastTs = ts;
        }

        const dt = (ts - lastTs) / 1000;

        lastTs = ts;

        const half = track.scrollWidth / 2;

        x -= SPEED * dt;

        if (Math.abs(x) >= half) {
            x = 0;
        }

        track.style.transform = `translate3d(${x}px,0,0)`;

        requestAnimationFrame(tick);
    }

    applySizes();

    window.addEventListener("resize", () => {

        clearTimeout(window.__careerResizeT);

        window.__careerResizeT = setTimeout(applySizes, 120);
    });

    requestAnimationFrame(tick);
}

function initFloatingApplyButton() {

    const btn = document.getElementById('floatingApplyNow');
    const formEl = document.querySelector('#apply-now');

    if (!btn || !formEl) return;

    const SHOW_AFTER_PX = 250;

    let formInView = false;

    const io = new IntersectionObserver(
        (entries) => {

            formInView = entries[0].isIntersecting;

            update();
        },
        {
            root: null,
            threshold: 0.15
        }
    );

    io.observe(formEl);

    function update() {

        const scrolled = window.scrollY > SHOW_AFTER_PX;

        if (scrolled && !formInView) {
            btn.classList.add('is-visible');
        }
        else {
            btn.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', update, {
        passive: true
    });

    window.addEventListener('resize', update);

    update();

    btn.addEventListener('click', function (e) {

        e.preventDefault();

        formEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        history.replaceState(null, '', '#apply-now');
    });
}

function initMobileMenu() {

    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");

    if (!btn || !menu) return;

    btn.addEventListener("click", () => {

        const isOpen = !menu.classList.contains("hidden");

        menu.classList.toggle("hidden");

        btn.setAttribute("aria-expanded", String(!isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            menu.classList.add("hidden");

            btn.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (e) => {

        if (!menu.contains(e.target) && !btn.contains(e.target)) {

            menu.classList.add("hidden");

            btn.setAttribute("aria-expanded", "false");
        }
    });
}

function initQualificationForms() {
    if (form.dataset.qualInit) return;

    form.dataset.qualInit = '1';
    document.querySelectorAll('.lead-form').forEach(form => {
        const qualSel = form.querySelector('[name="qualification"]');
        const yearWrapper = form.querySelector('.year-of-grad-wrapper');
        const blockMsg = form.querySelector('.qual-block-msg');
        const yearHidden = form.querySelector('[name="yearOfGraduation"]');
        const yearGrid = form.querySelector('.year-grid');
        const yearTrigger = form.querySelector('.year-trigger');
        const yearError = form.querySelector('.year-error');
        const ELIGIBLE = ['Graduation completed', 'Post-graduation completed'];
        createYearGrid(yearGrid, yearHidden, yearTrigger, yearError);
        function handleQualChange() {
            const isEligible = ELIGIBLE.includes(qualSel.value);
            yearWrapper.style.display = isEligible ? '' : 'none';
            blockMsg.style.display = qualSel.value && !isEligible ? '' : 'none';
            if (!isEligible) {
                resetYearSelection(yearHidden, yearTrigger, yearGrid);
            }
        }
        qualSel.addEventListener('change', handleQualChange);
    });
}

function initLeadPopup() {

    const popup =
        document.getElementById('leadPopup');

    const container =
        document.getElementById('popupFormContainer');

    const closeBtn =
        document.getElementById('closePopup');

    if (!popup || !container) return;

    setTimeout(() => {

        renderLeadForm('popupFormContainer');

        popup.classList.remove('hidden');

        initQualificationForms();

        formFunction();

    }, 5000);

    closeBtn?.addEventListener(
        'click',
        () => popup.classList.add('hidden')
    );
}