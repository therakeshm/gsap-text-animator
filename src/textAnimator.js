// Error messages
const ERRORS = {
  NO_JQUERY:
    "jQuery is required but not loaded. Please include jQuery before TextAnimator.",
  NO_GSAP:
    "GSAP is required but not loaded. Please include GSAP before TextAnimator.",
  NO_SCROLL_TRIGGER:
    "ScrollTrigger plugin is required but not loaded. Please include ScrollTrigger before TextAnimator if you want to use scroll animations.",
  INVALID_OPTIONS: "Invalid options provided to TextAnimator.",
  INVALID_DURATION: "Animation duration must be a positive number.",
  INVALID_OFFSET: "Scroll trigger offset must be a positive number.",
  ELEMENT_NOT_FOUND: "No animatable elements found on the page.",
  REFRESH_FAILED: "Failed to refresh animations. Check if elements exist.",
};

//! TODO: Add Scrolltrigger Error handling
// TODO: Add more animations
// --> OPTIMIZE: ScrollTrigger not working when scrolling up

// Debug messages
const DEBUG = {
  INIT: "Initializing TextAnimator...",
  OPTIONS: "Current options:",
  ELEMENTS_FOUND: (count) => `Found ${count} elements to animate`,
  SCROLL_TRIGGER_ON: "ScrollTrigger is enabled",
  SCROLL_TRIGGER_OFF: "ScrollTrigger is disabled",
  STYLES_INJECTED: "Styles have been injected",
  PROCESSING_LETTERS: (count) => `Processing ${count} letter animations`,
  PROCESSING_WORDS: (count) => `Processing ${count} word animations`,
  PROCESSING_STAGGERED: (count) => `Processing ${count} staggered animations`,
  REFRESH_START: "Refreshing animations...",
  REFRESH_COMPLETE: "Refresh complete",
  ANIMATION_CREATED: (type) => `Created ${type} animation`,
};

// CSS Styles
const STYLES = `
    /* Base styles */
    [class*='animate-text'] {
        opacity: 1;
    }

    /* Letter cascade */
    .animate-text-letters .char {
        display: inline-block;
        opacity: 0;
        transform: translateY(40px);
    }

    /* Word flow */
    .animate-text-words .word-wrapper {
        display: inline-block;
        overflow: hidden;
        margin-right: 0.3em;
    }
    .animate-text-words .word {
        display: inline-block;
        transform: translateY(100%);
    }

    /* Staggered slide */
    .animate-text-staggered .word-wrapper {
        display: inline-block;
        overflow: hidden;
        margin-right: 0.3em;
        opacity: 0;
        transform: translateY(50%);
    }
`;

function checkDependencies() {
  if (typeof jQuery === "undefined") {
    throw new Error(ERRORS.NO_JQUERY);
  }
  if (typeof gsap === "undefined") {
    throw new Error(ERRORS.NO_GSAP);
  }
}

window.TextAnimator = class {
  constructor(options = {}) {
    try {
      checkDependencies();

      this.options = {
        useScrollTrigger: true,
        scrollTriggerOffset: 100,
        defaultDuration: 1,
        defaultEase: "power3.out",
        autoInjectStyles: true,
        debug: false,
        ...options,
      };

      if (this.options.debug) {
        console.log(DEBUG.INIT);
        console.log(DEBUG.OPTIONS, this.options);
      }

      this.validateOptions();

      if (this.options.useScrollTrigger) {
        if (typeof ScrollTrigger === "undefined") {
          if (this.options.debug) console.warn(ERRORS.NO_SCROLL_TRIGGER);
          this.options.useScrollTrigger = false;
        } else {
          gsap.registerPlugin(ScrollTrigger);
          if (this.options.debug) console.log(DEBUG.SCROLL_TRIGGER_ON);
        }
      } else if (this.options.debug) {
        console.log(DEBUG.SCROLL_TRIGGER_OFF);
      }

      if (this.options.autoInjectStyles) {
        this.injectStyles();
        if (this.options.debug) console.log(DEBUG.STYLES_INJECTED);
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.init());
      } else {
        this.init();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  validateOptions() {
    if (typeof this.options !== "object") {
      throw new Error(ERRORS.INVALID_OPTIONS);
    }
    if (this.options.defaultDuration <= 0) {
      throw new Error(ERRORS.INVALID_DURATION);
    }
    if (this.options.scrollTriggerOffset < 0) {
      throw new Error(ERRORS.INVALID_OFFSET);
    }
  }

  injectStyles() {
    if (!document.querySelector("#text-animator-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "text-animator-styles";
      styleSheet.textContent = STYLES;
      document.head.appendChild(styleSheet);
    }
  }

  init() {
    const elements = $(
      ".animate-text-letters, .animate-text-words, .animate-text-staggered"
    );

    if (this.options.debug) {
      console.log(DEBUG.ELEMENTS_FOUND(elements.length));
    }

    if (elements.length === 0) {
      if (this.options.debug) console.warn(ERRORS.ELEMENT_NOT_FOUND);
      return;
    }

    this.processLetterAnimations();
    this.processWordAnimations();
    this.processStaggeredAnimations();
    this.createAnimations();
  }

  processLetterAnimations() {
    const elements = $(".animate-text-letters:not(.processed)");
    if (this.options.debug) {
      console.log(DEBUG.PROCESSING_LETTERS(elements.length));
    }

    elements.each(function () {
      const text = $(this).text();
      $(this)
        .html(
          text
            .split("")
            .map(
              (char) =>
                `<span class="char">${char === " " ? "&nbsp;" : char}</span>`
            )
            .join("")
        )
        .addClass("processed");
    });
  }

  processWordAnimations() {
    const elements = $(".animate-text-words:not(.processed)");
    if (this.options.debug) {
      console.log(DEBUG.PROCESSING_WORDS(elements.length));
    }

    elements.each(function () {
      const text = $(this).text();
      $(this)
        .html(
          text
            .split(" ")
            .map(
              (word) =>
                `<span class="word-wrapper"><span class="word">${word}</span></span>`
            )
            .join(" ")
        )
        .addClass("processed");
    });
  }

  processStaggeredAnimations() {
    const elements = $(".animate-text-staggered:not(.processed)");
    if (this.options.debug) {
      console.log(DEBUG.PROCESSING_STAGGERED(elements.length));
    }

    elements.each(function () {
      const text = $(this).text();
      $(this)
        .html(
          text
            .split(" ")
            .map((word) => `<span class="word-wrapper">${word}</span>`)
            .join(" ")
        )
        .addClass("processed");
    });
  }

  createScrollTrigger(element) {
    return this.options.useScrollTrigger
      ? {
          scrollTrigger: {
            trigger: element,
            start: `top bottom-=${this.options.scrollTriggerOffset}`,
            toggleActions: "play none none reverse",
          },
        }
      : {};
  }

  createAnimations() {
    // Smooth Letter Cascade Animation
    $(".animate-text-letters").each((index, element) => {
      gsap.to($(element).find(".char"), {
        ...this.createScrollTrigger(element),
        y: 0,
        opacity: 1,
        duration: this.options.defaultDuration,
        ease: this.options.defaultEase,
        stagger: {
          amount: 0.6,
          ease: "power2.inOut",
        },
      });
      if (this.options.debug)
        console.log(DEBUG.ANIMATION_CREATED("letter cascade"));
    });

    // Smooth Word Flow Animation
    $(".animate-text-words").each((index, element) => {
      gsap.to($(element).find(".word"), {
        ...this.createScrollTrigger(element),
        y: 0,
        duration: this.options.defaultDuration * 1.2,
        ease: "power4.out",
        stagger: {
          amount: 0.5,
          ease: "power2.inOut",
        },
      });
      if (this.options.debug) console.log(DEBUG.ANIMATION_CREATED("word flow"));
    });

    // Staggered Slide Animation
    $(".animate-text-staggered").each((index, element) => {
      gsap.to($(element).find(".word-wrapper"), {
        ...this.createScrollTrigger(element),
        y: 0,
        opacity: 1,
        duration: this.options.defaultDuration,
        ease: "power3.out",
        stagger: {
          amount: 0.5,
          ease: "power2.inOut",
        },
      });
      if (this.options.debug)
        console.log(DEBUG.ANIMATION_CREATED("staggered slide"));
    });
  }

  refresh() {
    try {
      if (this.options.debug) console.log(DEBUG.REFRESH_START);

      const elementsToRefresh = $(
        ".animate-text-letters, .animate-text-words, .animate-text-staggered"
      );

      if (elementsToRefresh.length === 0) {
        throw new Error(ERRORS.REFRESH_FAILED);
      }

      elementsToRefresh.removeClass("processed");
      this.init();

      if (this.options.debug) console.log(DEBUG.REFRESH_COMPLETE);
    } catch (error) {
      if (this.options.debug) console.error(error);
      throw error;
    }
  }

  setDebug(enabled) {
    this.options.debug = enabled;
    console.log(`Debug mode ${enabled ? "enabled" : "disabled"}`);
  }
};
