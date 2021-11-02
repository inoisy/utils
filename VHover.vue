<script>
export default {
  name: 'VHover',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: undefined,
    },
    openDelay: {
      type: [Number, String],
      default: 0,
    },
    closeDelay: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      openTimeout: undefined,
      closeTimeout: undefined,
      isActive: !!this.value,
    };
  },
  watch: {
    value(val) {
      this.isActive = !!val;
    },
    isActive(val) {
      if (!!val !== this.value) {
        this.$emit('input', val);
      }
    },
  },
  methods: {
    onMouseEnter() {
      this.runDelay('open');
    },
    onMouseLeave() {
      this.runDelay('close');
    },
    /**
     * Clear any pending delay timers from executing
     */
    clearDelay() {
      clearTimeout(this.openTimeout);
      clearTimeout(this.closeTimeout);
    },
    /**
     * Runs callback after a specified delay
     */
    runDelay(type, cb) {
      // runDelay (type: 'open' | 'close', cb?: () => void): void {
      this.clearDelay();

      const delay = parseInt(this[`${type}Delay`], 10);

      this[`${type}Timeout`] = setTimeout(
        cb ||
          (() => {
            this.isActive = { open: true, close: false }[type];
          }),
        delay
      );
    },
  },

  render() {
    if (!this.$scopedSlots.default && this.value === undefined) {
      console.warn('v-hover is missing a default scopedSlot or bound value', this);

      return null;
    }

    let element;

    /* istanbul ignore else */
    if (this.$scopedSlots.default) {
      element = this.$scopedSlots.default({ hover: this.isActive });
    }

    if (Array.isArray(element) && element.length === 1) {
      element = element[0];
    }

    if (!element || Array.isArray(element) || !element.tag) {
      console.warn('v-hover should only contain a single element', this);

      return element;
    }

    if (!this.disabled) {
      element.data = element.data || {};
      this._g(element.data, {
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave,
      });
    }

    return element;
  },
};
</script>
