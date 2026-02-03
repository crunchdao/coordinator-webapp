export function markdownToHtml(src: string) {
  return src
    .replace(/^### (.*)$/gm, "<h3 class='text-xl'>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2 class='text-2xl'>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1 class='text-3xl'>$1</h1>")
    .replace(/(\*\*)(.*?)\1/g, "<b>$2</b>")
    .replace(/(\*)(.*?)\1/g, "<em>$2</em>")
    .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}
