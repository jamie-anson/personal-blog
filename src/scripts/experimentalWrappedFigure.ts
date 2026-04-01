import { layoutNextLine, prepareWithSegments, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext';

type ParagraphLayout = {
  cursor: LayoutCursor;
  prepared: PreparedTextWithSegments;
};

const ROOT_SELECTOR = '[data-experimental-wrap-root]';

const getPxValue = (value: string, fallback: number) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getLineHeight = (style: CSSStyleDeclaration) => {
  const parsed = Number.parseFloat(style.lineHeight);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  const fontSize = Number.parseFloat(style.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.68 : 28;
};

const getFontShorthand = (style: CSSStyleDeclaration) => {
  const fontStyle = style.fontStyle && style.fontStyle !== 'normal' ? `${style.fontStyle} ` : '';
  const fontWeight = style.fontWeight ? `${style.fontWeight} ` : '';

  return `${fontStyle}${fontWeight}${style.fontSize} ${style.fontFamily}`;
};

const cloneParagraphLayouts = (paragraphs: PreparedTextWithSegments[]): ParagraphLayout[] =>
  paragraphs.map((prepared) => ({
    prepared,
    cursor: { segmentIndex: 0, graphemeIndex: 0 }
  }));

const hideFallbackButKeepItAccessible = (fallback: HTMLElement) => {
  fallback.style.position = 'absolute';
  fallback.style.width = '1px';
  fallback.style.height = '1px';
  fallback.style.padding = '0';
  fallback.style.margin = '-1px';
  fallback.style.overflow = 'hidden';
  fallback.style.clipPath = 'inset(50%)';
  fallback.style.whiteSpace = 'nowrap';
  fallback.style.border = '0';
};

const resetFallbackVisibility = (fallback: HTMLElement) => {
  fallback.removeAttribute('style');
};

const waitForImage = async (image: HTMLImageElement) => {
  if (image.complete) {
    return;
  }

  await new Promise<void>((resolve) => {
    const done = () => {
      image.removeEventListener('load', done);
      image.removeEventListener('error', done);
      resolve();
    };

    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', done, { once: true });
  });
};

const waitForFonts = async () => {
  if (!('fonts' in document)) {
    return;
  }

  try {
    await document.fonts.ready;
  } catch {
    // Fall back to the stacked experience if font readiness fails later.
  }
};

const renderWrappedLayout = async (root: HTMLElement) => {
  const fallback = root.querySelector<HTMLElement>('[data-wrap-fallback]');
  const figure = root.querySelector<HTMLElement>('[data-wrap-figure]');
  const fallbackImage = figure?.querySelector<HTMLImageElement>('img');
  const paragraphNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-wrap-paragraph]'));
  const enhanced = root.querySelector<HTMLElement>('[data-wrap-enhanced]');
  const linesLayer = root.querySelector<HTMLElement>('[data-wrap-lines]');

  if (!fallback || !figure || !fallbackImage || paragraphNodes.length === 0 || !enhanced || !linesLayer) {
    return;
  }

  await Promise.all([waitForFonts(), waitForImage(fallbackImage)]);

  const paragraphStyle = getComputedStyle(paragraphNodes[Math.min(1, paragraphNodes.length - 1)]);
  const rootStyle = getComputedStyle(root);
  const rootWidth = root.getBoundingClientRect().width;
  const figureRect = figure.getBoundingClientRect();
  const figureGap = getPxValue(rootStyle.getPropertyValue('--experimental-figure-gap'), 28);
  const figureEdgeMargin = getPxValue(
    rootStyle.getPropertyValue('--experimental-figure-edge-margin'),
    figureGap
  );
  const minReadableMeasure = getPxValue(rootStyle.getPropertyValue('--experimental-min-readable-measure'), 320);
  const enhancementBreakpoint = getPxValue(
    rootStyle.getPropertyValue('--experimental-enhancement-breakpoint'),
    940
  );
  const fullWidth = rootWidth - figureEdgeMargin;
  const wrappedWidth = fullWidth - figureRect.width - figureGap;

  if (window.innerWidth < enhancementBreakpoint || wrappedWidth < minReadableMeasure) {
    root.classList.remove('is-enhanced');
    enhanced.hidden = true;
    linesLayer.replaceChildren();
    resetFallbackVisibility(fallback);
    return;
  }

  const lineHeight = getLineHeight(paragraphStyle);
  const paragraphGap = lineHeight * 0.58;
  const font = getFontShorthand(paragraphStyle);
  const textColor = paragraphStyle.color;
  const paragraphLayouts = cloneParagraphLayouts(
    paragraphNodes.map((node) => prepareWithSegments(node.textContent ?? '', font))
  );
  const isLeftAlignedFigure = root.classList.contains('experimental-wrap-layout--left');
  const spans: HTMLSpanElement[] = [];

  let y = 0;

  for (let paragraphIndex = 0; paragraphIndex < paragraphLayouts.length; paragraphIndex += 1) {
    const paragraph = paragraphLayouts[paragraphIndex];

    while (true) {
      const overlapsFigure = y < figureRect.height;
      const maxWidth = overlapsFigure ? wrappedWidth : fullWidth;
      const line = layoutNextLine(paragraph.prepared, paragraph.cursor, maxWidth);

      if (line === null) {
        break;
      }

      const span = document.createElement('span');
      span.className = 'experimental-wrap-layout__line';
      span.textContent = line.text;
      span.style.top = `${y}px`;
      span.style.left = overlapsFigure && isLeftAlignedFigure ? `${figureRect.width + figureGap}px` : '0px';
      span.style.width = `${maxWidth}px`;
      span.style.color = textColor;
      spans.push(span);

      paragraph.cursor = line.end;
      y += lineHeight;
    }

    if (paragraphIndex < paragraphLayouts.length - 1) {
      y += paragraphGap;
    }
  }

  linesLayer.style.font = font;
  linesLayer.style.lineHeight = `${lineHeight}px`;
  linesLayer.style.color = textColor;
  linesLayer.replaceChildren(...spans);
  enhanced.style.height = `${Math.max(y, figureRect.height)}px`;
  enhanced.hidden = false;
  hideFallbackButKeepItAccessible(fallback);
  root.classList.add('is-enhanced');
};

const initializeWrappedFigure = (root: HTMLElement) => {
  if (root.dataset.wrapInitialized === 'true') {
    return;
  }

  root.dataset.wrapInitialized = 'true';
  let lastObservedWidth = 0;

  const rerender = () => {
    void renderWrappedLayout(root).catch(() => {
      const fallback = root.querySelector<HTMLElement>('[data-wrap-fallback]');
      const enhanced = root.querySelector<HTMLElement>('[data-wrap-enhanced]');
      const linesLayer = root.querySelector<HTMLElement>('[data-wrap-lines]');

      root.classList.remove('is-enhanced');
      enhanced?.setAttribute('hidden', '');
      linesLayer?.replaceChildren();

      if (fallback) {
        resetFallbackVisibility(fallback);
      }
    });
  };

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];

    if (!entry) {
      return;
    }

    if (Math.abs(entry.contentRect.width - lastObservedWidth) < 1) {
      return;
    }

    lastObservedWidth = entry.contentRect.width;
    rerender();
  });
  resizeObserver.observe(root);

  window.addEventListener('resize', rerender, { passive: true });
  rerender();
};

document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
  initializeWrappedFigure(root);
});
