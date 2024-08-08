export const createStaticClass = <T>() => {
  return class ABaseScv {
    private static _instance: T

    public static get instance() {
      return this._instance || (this._instance = new this() as T)
    }

    public static create(i: T) {
      this._instance = i
    }
  }
}
