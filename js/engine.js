const engineParts = [
  "js/engine-core.js",
  "js/engine-story.js",
  "js/engine-ui.js",
  "js/engine-boot.js"
];

engineParts.reduce((chain, src) => chain.then(() => new Promise((resolve, reject) => {
  const script = document.createElement("script");
  script.src = `${src}?v=1.2.3-oss`;
  script.onload = resolve;
  script.onerror = () => reject(new Error(`Failed to load ${src}`));
  document.body.appendChild(script);
})), Promise.resolve()).catch(error => {
  document.body.innerHTML = `<pre style="color:white;padding:24px">${error.message}</pre>`;
});
