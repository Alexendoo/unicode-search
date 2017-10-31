declare module "worker-loader!*" {
  interface loadedWorker {
    new (): Worker
  }
  const worker: loadedWorker
  export default worker
}
