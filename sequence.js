class Sequence {
  constructor(sequence, settings = {}, links) {
    this._item = sequence;
    this._links = links
    this._id = this._item.dataset.sequenceId;
    this._canvas = this._item.querySelector('[data-sequence-canvas]');
    this._scrollParent = this._item.closest('[data-scroll-parent]');
    this._context = this._canvas.getContext('2d');
    this._resizedParent = this._canvas.parentElement;
    this._frameCount = +this._item.dataset.sequenceFrames;
    this._firstFrame = +this._item.dataset.firstFrame;
    this._lastFrame = +this._item.dataset.lastFrame;
    this._sequencePath = this._item.dataset.sequencePath;
    this._imageFormat = this._item.dataset.imageFormat;
    this._isHoverPreload = this._item.dataset.hoverPreload;
    this._event = new Event('popular-is-loaded');

    this._frames = [];
    this._controls = [];

    this.isMouseDown = false;

    this._settings = settings;

    this._sequenceCallback = this._settings.sequenceCallback;

    if (this._id) {
      this._controls = document.querySelectorAll(`[data-sequence-control="${this._id}"]`);
    }

    this._isLoaded = false;
    this._isMouseDown = false;
    this._framesLoaded = 0;
    this._activeFrame = null;
    this._scrollTop = null;
    this._maxScrollTop = null;
    this._scrollFraction = null;
    this._frameIndex = null;
    this._dif = 0;

    this._onWindowScroll = this._onWindowScroll.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);
    this._onControlClick = this._onControlClick.bind(this);
    this._onMouseMoveHoverItem = this._onMouseMoveHoverItem.bind(this);
    this._onMouseOverHoverItem = this._onMouseOverHoverItem.bind(this);
    this._onMouseenterHoverItem = this._onMouseenterHoverItem.bind(this);
    // this._onTouchMoveItem = this._onTouchMoveItem.bind(this);
    this._onMousedownItem = this._onMousedownItem.bind(this);
    this._onMouseupItem = this._onMouseupItem.bind(this);
    this._onMouseMoveMousedownItem = this._onMouseMoveMousedownItem.bind(this);
  }

  get isLoaded() {
    return this._isLoaded;
  }

  _preloadImages(
    links,
    frames,
    frameCount,
    sequencePath,
    imageFormat,
    framesLoaded,
    onComplete,
  ) {
    return new Promise(() => {
      links.forEach((item, index)=>{
        frames[index] = new Image();
        frames[index].src = item.src;

        frames[index].onload = function() {
          framesLoaded++;
          if (framesLoaded > frameCount - 1) {
            onComplete();
          }
        };
      })
    });
  }

  _getImageScale(frame) {
    const canvasWidth = this._canvas.width;
    const canvasHeight = this._canvas.height;
    const imgWidth = frame.width;
    const imgHeight = frame.height;
    const scaleX = canvasWidth / imgWidth;
    const scaleY = canvasHeight / imgHeight;
    let scale;

    if (this._item.dataset.sequenceFit === 'contain') {
      scale = imgWidth >= imgHeight ? scaleX : scaleY;
    } else {
      scale = scaleX > scaleY ? scaleX : scaleY;
    }

    return scale;
  }

  _updateImage(index) {
    const framesElements = !Array.isArray(this._frames) ? Object.values(this._frames)[0] : this._frames;
    if (framesElements[index]) {
      const imgWidth = framesElements[index].width;
      const imgHeight = framesElements[index].height;
      const scale = this._getImageScale(framesElements[index]);
      const offsetY = this._canvas.height - imgHeight * scale;
      const offsetX = this._canvas.width - imgWidth * scale;

      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._context.drawImage(framesElements[index], offsetX / 2, offsetY / 2, imgWidth * scale, imgHeight * scale);
    }
  }

  launchSequence(onComplete) {
    return new Promise(() => {
      const isReverse = this._lastFrame - this._firstFrame < 0;
      let frameCounter = this._firstFrame;

      const initSequence = () => {
        if (this._isLoaded) {
          if (!isReverse) {
            frameCounter += 1;
          } else {
            frameCounter -= 1;
          }

          if (!isReverse) {
            if (frameCounter < this._lastFrame) {
              this._updateImage(frameCounter, this._frames, this._context, this._canvas);
            } else {
              if (onComplete) {
                onComplete();
              }
              return;
            }
          } else if (frameCounter > this._lastFrame) {
            this._updateImage(frameCounter, this._frames, this._context, this._canvas);
          } else {
            if (onComplete) {
              onComplete();
            }
            return;
          }

          this._frameIndex = frameCounter;
        }

        requestAnimationFrame(initSequence);
      };

      initSequence();
    });
  }

  _getValuesOnScroll() {
    this._scrollTop = this._scrollParent.getBoundingClientRect().top * -1;
    this._maxScrollTop = this._scrollParent.scrollHeight - window.innerHeight;
    this._scrollFraction = this._scrollTop / this._maxScrollTop;
    this._frameIndex = Math.min(this._frameCount - 1, Math.ceil(this._scrollFraction * this._frameCount));
  }

  _onControlClick({ target }) {
    const callback = target.dataset.sequenceCallback;
    this._firstFrame = +target.dataset.firstFrame;
    this._lastFrame = +target.dataset.lastFrame;

    const doSomething1 = () => {
      console.log('sequence 1 played');
    };
    const doSomething2 = () => {
      console.log('sequence 2 played');
    };

    const callbacks = {
      callbackAfter1Sequence: doSomething1,
      callbackAfter2Sequence: doSomething2,
    };
    this.launchSequence(() => {
      if (callback) {
        callbacks[callback]();
      }
    });
  }

  _onWindowScroll() {
    if (!this._isLoaded) {
      return;
    }

    this._getValuesOnScroll();

    if (this._scrollFraction <= 1 && this._scrollFraction > 0) {
      requestAnimationFrame(() => this._updateImage(this._frameIndex + 1));
      this._activeFrame = this._frames[this._frameIndex + 1];
    }
  }

  _onWindowResize() {
    // this._canvas.width = this._resizedParent.offsetWidth;
    // this._canvas.height = this._resizedParent.offsetHeight;

    this._updateImage(this._frameIndex);
  }

  _activatePreloading() {
    this._preloadImages(this._links, this._frames, this._frameCount, this._sequencePath, this._imageFormat, this._framesLoaded, () => {
      this._isLoaded = true;
      document.dispatchEvent(this._event);
      this._updateImage(this._firstFrame);

      if (this._item.dataset.sequence === 'scroll') {
        this._updateImage(this._frameIndex);
      }
    });
  }

  _onMouseenterHoverItem() {
    if (!this._isLoaded) {
      const loader = this._item.querySelector('.loader');
      if (loader) {
        loader.classList.remove('hidden');
      }

      this._preloadImages(this._links, this._frames, this._frameCount, this._sequencePath, this._imageFormat, this._framesLoaded, () => {
        this._isLoaded = true;
        this._updateImage(this._firstFrame);

        loader.classList.add('hidden');
      });
    }
  }

  _onMouseOverHoverItem(evt) {
    const rect = this._item.getBoundingClientRect();
    const posX = evt.clientX - rect.left;

    const hoverFraction = posX / rect.width;

    this._dif = this._frameIndex - Math.ceil(hoverFraction * this._frameCount);
  }

  _onMouseMoveHoverItem(evt) {
    const rect = this._item.getBoundingClientRect();
    const posX = evt.clientX - rect.left;

    const hoverFraction = posX / rect.width;
    const frameIndexHover = Math.min(this._frameCount - 1, Math.ceil(hoverFraction * this._frameCount));
    let frameOffset = frameIndexHover + this._dif;

    if (frameOffset <= 0) {
      frameOffset = this._frameCount + frameOffset;
    }

    if (frameOffset >= this._frameCount) {
      frameOffset -= this._frameCount;
    }

    requestAnimationFrame(() => this._updateImage(frameOffset));

    this._frameIndex = frameOffset;
  }

  _onMouseMoveMousedownItem(evt) {
    if (!this.isMouseDown) {
      return;
    }

    // сейчас изображение крутится при ведении мышкой по всему экрану, если нужно, чтобы смена кадров происходила только в области изображения, нужно ниже исправить main на this._item
    const main = document.querySelector('.popular');
    const rect = main.getBoundingClientRect();
    const posX = evt.clientX - rect.left;

    const hoverFraction = posX / rect.width;
    const frameIndexHover = Math.min(this._frameCount - 1, Math.ceil(hoverFraction * this._frameCount));
    let frameOffset = frameIndexHover + this._dif;

    if (frameOffset <= 0) {
      frameOffset = this._frameCount + frameOffset;
    }

    if (frameOffset >= this._frameCount) {
      frameOffset -= this._frameCount;
    }

    requestAnimationFrame(() => this._updateImage(frameOffset));

    this._frameIndex = frameOffset;

    document.querySelector('.popular').classList.add('is-draggable');
  }

  _onMousedownItem(evt) {
    // при клике этот метод блокирует все клики внутри секции
    // this._item.setPointerCapture(evt.pointerId);

    this.isMouseDown = true;

    // сейчас изображение крутится при ведении мышкой по всему экрану, если нужно, чтобы смена кадров происходила только в области изображения, нужно ниже исправить main на this._item
    const main = document.querySelector('.popular');
    const rect = main.getBoundingClientRect();
    const posX = evt.clientX - rect.left;

    const hoverFraction = posX / rect.width;

    this._dif = this._frameIndex - Math.ceil(hoverFraction * this._frameCount);
  }

  _onMouseupItem() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
    }
    if (document.querySelectorAll('.popular').length > 0) {
      document.querySelector('.popular').classList.remove('is-draggable');
    }
  }

  init() {
    this._canvas.width = this._resizedParent.offsetWidth;
    this._canvas.height = this._resizedParent.offsetHeight;

    if (this._isHoverPreload !== '') {
      this._activatePreloading();
    }

    if (this._item.dataset.sequence === 'launch') {
      this.launchSequence(() => {
        if (this._sequenceCallback) {
          this._sequenceCallback();
        }
      });
    }

    if (this._item.dataset.sequence === 'scroll') {
      this._getValuesOnScroll();
      window.addEventListener('scroll', this._onWindowScroll);
    }

    if (this._controls.length) {
      this._controls.forEach((control) => {
        control.addEventListener('click', this._onControlClick);
      });
    }

    if (this._item.dataset.sequence === 'hover') {
      this._item.addEventListener('pointermove', this._onMouseMoveHoverItem);
      this._item.addEventListener('pointerover', this._onMouseOverHoverItem);
      this._item.addEventListener('pointerenter', this._onMouseenterHoverItem);
    }

    if (this._item.dataset.sequence === 'mousedown') {
      document.querySelector('.slider-popular').addEventListener('pointermove', this._onMouseMoveMousedownItem);
      document.querySelector('.slider-popular').addEventListener('pointerdown', this._onMousedownItem);
      document.addEventListener('pointerup', this._onMouseupItem);
      document.querySelector('.slider-popular').addEventListener('click', () => {
        setTimeout(() => {
          const steps = +document.querySelector('.slider-popular').getAttribute('data-step');
          const direction = document.querySelector('.slider-popular').getAttribute('data-dir');
          const ar = Array.from(Array(steps).keys());
          const secDelay = 45;

          if (direction === 'right') {
            ar.forEach((item, index) => {
              setTimeout(() => {
                if (this._frameIndex === null || this._frameIndex <= 0) {
                  this._frameIndex = this._frameCount;
                }
                this._frameIndex = --this._frameIndex;
                requestAnimationFrame(() => this._updateImage(this._frameIndex));
              }, index * secDelay);
            });
          }
          if (direction === 'left') {
            ar.forEach((item, index) => {
              setTimeout(() => {
                if (this._frameIndex === null || this._frameIndex > this._frameCount) {
                  this._frameIndex = 0;
                }
                this._frameIndex = ++this._frameIndex;
                requestAnimationFrame(() => this._updateImage(this._frameIndex));
              }, index * secDelay);
            });
          }
        }, 2);
      });
    }
    window.addEventListener('resize', this._onWindowResize);
  }
}




const initSequence = (links) => {
  const sequence = document.querySelector('[data-sequence="launch"]');
  const scrollSequence = document.querySelector('[data-sequence="scroll"]');
  const modalSequence = document.querySelector('[data-sequence="modal"]');
  const hoverSequence = document.querySelectorAll('[data-sequence="hover"]');
  const mousedownSequenceEl = document.querySelectorAll('[data-sequence="mousedown"]');

  if (sequence) {
    const doSmth = () => {
      console.log('launch seq played');
    };

    const setting = {
      sequenceCallback: doSmth,
    };

    const sequenceLaunch = new Sequence(sequence, setting);
    sequenceLaunch.init();
  }

  if (modalSequence) {
    const sequenceModal = new Sequence(modalSequence);
    sequenceModal.init();
    window.sequenceModal = sequenceModal;
  }

  if (scrollSequence) {
    const sequenceScroll = new Sequence(scrollSequence);
    sequenceScroll.init();
  }

  if (hoverSequence.length) {
    hoverSequence.forEach((item) => {
      const sequenceHover = new Sequence(item);
      sequenceHover.init();
    });
  }

  if (mousedownSequenceEl) {
    mousedownSequenceEl.forEach((item) => {
      const mousedownSequence = new Sequence(item, {}, links);
      mousedownSequence.init();
    });
  }
};

export default Sequence;
