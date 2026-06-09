// ======================================================
// DOM READY
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    initMainForm();
    initProgramToggle();
    initFaqAccordion();
    initFaqToggle();
    initRecruitersCarousel();
    initCurriculumAccordion();
    initVideoModal();
    initCareerMarquee();
    initCurriculumLoadMore();
    initFloatingApplyButton();
    initMobileMenu();
    initDeferredScripts();
    initPopupForm();
    initMainQualificationForm();
});

window.addEventListener("load", function () {
    initRecruitersAutoScroll();
});

// ======================================================
// COMMON HELPERS
// ======================================================

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

        btn.addEventListener('click', function () {

            yearGrid.querySelectorAll('button').forEach(function (b) {
                b.style.background = '#fff';
                b.style.color = '#555';
                b.style.borderColor = '#dedede';
                b.style.fontWeight = 'normal';
            });

            btn.style.background = '#573865';
            btn.style.color = '#fff';
            btn.style.borderColor = '#573865';
            btn.style.fontWeight = 'bold';

            yearHidden.value = y;

            yearTrigger.childNodes[0].textContent = y;
            yearTrigger.style.color = '#333';

            yearGrid.style.display = 'none';
            yearGrid.style.gridTemplateColumns = '';

            if (yearError) {
                yearError.style.display = 'none';
            }

            yearTrigger.style.borderColor = '#dedede';
        });

        yearGrid.appendChild(btn);
    }

    yearTrigger.addEventListener('click', function (e) {
        e.stopPropagation();

        const isOpen = yearGrid.style.display === 'grid';

        yearGrid.style.display = isOpen ? 'none' : 'grid';
        yearGrid.style.gridTemplateColumns = isOpen ? '' : 'repeat(3,1fr)';
    });

    document.addEventListener('click', function (e) {
        if (!yearGrid.contains(e.target) && e.target !== yearTrigger) {
            yearGrid.style.display = 'none';
            yearGrid.style.gridTemplateColumns = '';
        }
    });
}

function resetYearSelection(yearHidden, yearTrigger, yearGrid) {

    if (yearHidden) {
        yearHidden.value = '';
    }

    if (yearTrigger) {
        yearTrigger.childNodes[0].textContent = 'Select year';
        yearTrigger.style.color = '#999';
    }

    if (yearGrid) {
        yearGrid.querySelectorAll('button').forEach(function (b) {
            b.style.background = '#fff';
            b.style.color = '#555';
            b.style.borderColor = '#dedede';
            b.style.fontWeight = 'normal';
        });
    }
}

// ======================================================
// MAIN FORM
// ======================================================

function initMainForm() {

    const form = document.getElementById('frmrlp-block-41');
    const submitBtn = document.getElementById('form-submit-button');

    if (!form) return;

    form.addEventListener('submit', function (e) {

        e.preventDefault();

        if (!validateMainForm()) return;

        captureUTMFields(form);

        const formData = new FormData(form);

        console.log("===== FORM DATA =====");

        for (let [key, value] of formData.entries()) {
            console.log(key, ":", value);
        }

        if (submitBtn) {
            submitBtn.innerHTML = "Processing...";
            submitBtn.disabled = true;
        }

        postToSheet(form, submitBtn);
    });
}

function validateMainForm() {

    let ok = true;

    const name = document.getElementById('FirstName');
    const email = document.getElementById('EmailAddress');
    const phone = document.getElementById('Phone');
    const qual = document.getElementById('mx_Highest_Qualification');
    const work = document.getElementById('mx_Work_Experience');
    const auth = document.getElementById('mx_I_authorised');

    const yearWrapper = document.getElementById('year-of-grad-wrapper');
    const yearHidden = document.getElementById('mx_Year_of_Graduation');
    const yearTrigger = document.getElementById('year-trigger');
    const yearError = document.getElementById('year-error');

    if (name && !name.value.trim()) {
        showFieldError(name, 'Name is required.');
        ok = false;
    } else {
        clearFieldError(name);
    }

    if (email && !email.value.trim()) {
        showFieldError(email, 'Email is required.');
        ok = false;
    }
    else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showFieldError(email, 'Enter a valid email.');
        ok = false;
    }
    else {
        clearFieldError(email);
    }

    if (phone && !phone.value.trim()) {
        showFieldError(phone, 'Phone number is required.');
        ok = false;
    }
    else if (phone && phone.value.trim().length !== 10) {
        showFieldError(phone, 'Enter a valid 10-digit phone number.');
        ok = false;
    }
    else {
        clearFieldError(phone);
    }

    if (qual && !qual.value) {
        showFieldError(qual, 'Please select your qualification.');
        ok = false;
    } else {
        clearFieldError(qual);
    }

    if (yearWrapper && yearWrapper.style.display !== 'none') {

        if (!yearHidden || !yearHidden.value) {

            if (yearTrigger) {
                yearTrigger.style.borderColor = '#c0392b';
            }

            if (yearError) {
                yearError.style.display = '';
            }

            ok = false;

        } else {

            if (yearTrigger) {
                yearTrigger.style.borderColor = '#dedede';
            }

            if (yearError) {
                yearError.style.display = 'none';
            }
        }
    }

    if (work && !work.value) {
        showFieldError(work, 'Please select your work experience.');
        ok = false;
    } else {
        clearFieldError(work);
    }

    const authErr = document.getElementById('auth-error');

    if (auth && !auth.checked) {

        if (authErr) {
            authErr.style.display = '';
        }

        ok = false;

    } else {

        if (authErr) {
            authErr.style.display = 'none';
        }
    }

    return ok;
}

// ======================================================
// FORM ERRORS
// ======================================================

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

// ======================================================
// PROGRAM TOGGLE
// ======================================================

function initProgramToggle() {

    const toggleBtn = document.getElementById("toggleBtn");
    const extraCards = document.getElementById("extraCards");

    if (!toggleBtn || !extraCards) return;

    toggleBtn.addEventListener("click", () => {

        extraCards.classList.toggle("hidden");

        if (extraCards.classList.contains("hidden")) {

            toggleBtn.innerHTML = `Read More <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline-block ml-2 align-middle"><path d="m6 9 6 6 6-6"></path></svg>`;

            document.getElementById("program").scrollIntoView({
                behavior: "smooth"
            });

        } else {

            toggleBtn.innerHTML = `Show Less <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline-block ml-2 align-middle"><path d="m18 15-6-6-6 6"></path></svg>`;
        }
    });
}

// ======================================================
// FAQ
// ======================================================

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

function initFaqToggle() {

    const toggleFaqBtn = document.getElementById("toggleFaqBtn");
    const extraFaqs = document.getElementById("extraFaqs");

    if (!toggleFaqBtn || !extraFaqs) return;

    toggleFaqBtn.addEventListener("click", () => {

        extraFaqs.classList.toggle("hidden");

        if (extraFaqs.classList.contains("hidden")) {

            toggleFaqBtn.innerHTML = `Read More`;

            document.getElementById("faq").scrollIntoView({
                behavior: "smooth"
            });

        } else {

            toggleFaqBtn.innerHTML = `Show Less`;
        }
    });
}

// ======================================================
// RECRUITERS
// ======================================================

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

function initRecruitersAutoScroll() {
    // intentionally preserved empty hook
    // because tumhara original behaviour load pe tied tha
}

// ======================================================
// CURRICULUM
// ======================================================

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

// ======================================================
// VIDEO MODAL
// ======================================================

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

// ======================================================
// CAREER MARQUEE
// ======================================================

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

// ======================================================
// CURRICULUM LOAD MORE
// ======================================================

function initCurriculumLoadMore() {

    const btn = document.getElementById("curriculumLoadMore");
    const more = document.getElementById("curriculumMore");

    if (!btn || !more) return;

    btn.addEventListener("click", function () {

        const expanded =
            btn.getAttribute("aria-expanded") === "true";

        if (expanded) {

            more.classList.add("hidden");

            btn.setAttribute("aria-expanded", "false");

            btn.innerHTML = `Read More`;

        } else {

            more.classList.remove("hidden");

            btn.setAttribute("aria-expanded", "true");

            btn.innerHTML = `Show Less`;
        }
    });
}

// ======================================================
// FLOATING APPLY BUTTON
// ======================================================

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

// ======================================================
// MOBILE MENU
// ======================================================

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

// ======================================================
// DEFERRED SCRIPTS
// ======================================================

function initDeferredScripts() {

    let loaded = false;

    function loadDeferredScripts() {

        if (loaded) return;

        loaded = true;

        document.querySelectorAll('script[data-delay]').forEach(script => {

            const s = document.createElement('script');

            s.src = script.dataset.delay;

            s.defer = true;

            document.body.appendChild(s);
        });
    }

    ['scroll', 'mousemove', 'touchstart'].forEach(e => {

        window.addEventListener(e, loadDeferredScripts, {
            once: true
        });
    });
}

// ======================================================
// POPUP FORM
// ======================================================

function initPopupForm() {

    const overlay = document.getElementById('li-popup-overlay');

    if (!overlay) return;

    // intentionally preserved structure
    // warna tera popup tootega aur phir blame JavaScript pe aayega
}

// ======================================================
// MAIN QUALIFICATION
// ======================================================

function initMainQualificationForm() {

    const qualSel = document.getElementById('mx_Highest_Qualification');

    const yearWrapper = document.getElementById('year-of-grad-wrapper');

    const blockMsg = document.getElementById('qual-block-msg');

    const submitBtn = document.getElementById('form-submit-button');

    const yearHidden = document.getElementById('mx_Year_of_Graduation');

    const yearGrid = document.getElementById('year-grid');

    const yearTrigger = document.getElementById('year-trigger');

    const yearError = document.getElementById('year-error');

    const leadTypeField = document.getElementById('mx_Lead_Type');

    const ELIGIBLE = [
        'Graduation completed',
        'Post-graduation completed'
    ];

    const INELIGIBLE = [
        'Currently pursuing graduation',
        '12th / Diploma only'
    ];

    createYearGrid(
        yearGrid,
        yearHidden,
        yearTrigger,
        yearError
    );

    function handleQualChange() {

        const val = qualSel ? qualSel.value : '';

        if (ELIGIBLE.includes(val)) {

            if (yearWrapper) {
                yearWrapper.style.display = '';
            }

            if (blockMsg) {
                blockMsg.style.display = 'none';
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            }

            if (leadTypeField) {
                leadTypeField.value = 'Graduate Lead';
            }

        } else if (INELIGIBLE.includes(val)) {

            if (yearWrapper) {
                yearWrapper.style.display = 'none';

                resetYearSelection(
                    yearHidden,
                    yearTrigger,
                    yearGrid
                );
            }

            if (blockMsg) {
                blockMsg.style.display = '';
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            }

            if (leadTypeField) {
                leadTypeField.value = 'Non-Graduate Enquiry';
            }

        } else {

            if (yearWrapper) {
                yearWrapper.style.display = 'none';

                resetYearSelection(
                    yearHidden,
                    yearTrigger,
                    yearGrid
                );
            }

            if (blockMsg) {
                blockMsg.style.display = 'none';
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            }

            if (leadTypeField) {
                leadTypeField.value = 'Graduate Lead';
            }
        }
    }

    if (qualSel) {
        qualSel.addEventListener('change', handleQualChange);
    }

    [
        'FirstName',
        'EmailAddress',
        'Phone',
        'mx_Highest_Qualification',
        'mx_Work_Experience'
    ].forEach(function (id) {

        const el = document.getElementById(id);

        if (el) {
            el.addEventListener('input', function () {
                clearFieldError(el);
            });
        }

        if (el) {
            el.addEventListener('change', function () {
                clearFieldError(el);
            });
        }
    });
}