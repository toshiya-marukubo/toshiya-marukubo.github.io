class Loading {
  constructor(loadingClassName, loadedClassName) {
    this.loadingClassName = loadingClassName;
    this.loadedClassName = loadedClassName;
    this.target = document.getElementsByClassName(this.loadingClassName)[0];
    
    this.onLoad();
  }

  onLoad() {
    this.target.classList.add(this.loadedClassName);
  }
}
