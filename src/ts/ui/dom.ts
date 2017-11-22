export const app = document.getElementById("app")
export const input = document.getElementById("chars") as HTMLInputElement

export function clearNode(node: Node) {
  while (node.firstChild !== null) {
    node.removeChild(node.firstChild)
  }
}
