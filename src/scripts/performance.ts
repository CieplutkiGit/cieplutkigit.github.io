const optimizeImage = (image: HTMLImageElement) => {
  image.decoding = "async";

  const isBelowInitialViewport = image.getBoundingClientRect().top > window.innerHeight;
  const isProjectMedia = image.matches(
    ".evidence-card-image, .case-evidence-photo img, [data-case-screenshots] img"
  );

  if (isBelowInitialViewport || isProjectMedia) {
    image.loading = "lazy";
  }
};

document.querySelectorAll<HTMLImageElement>("img").forEach(optimizeImage);

const imageObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      if (node instanceof HTMLImageElement) {
        optimizeImage(node);
      }

      node.querySelectorAll<HTMLImageElement>("img").forEach(optimizeImage);
    });
  });
});

imageObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});
