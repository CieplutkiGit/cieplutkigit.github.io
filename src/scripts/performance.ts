const optimizeImage = (image: HTMLImageElement) => {
  image.loading = "lazy";
  image.decoding = "async";
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
