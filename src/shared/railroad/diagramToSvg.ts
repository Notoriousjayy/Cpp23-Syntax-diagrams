/**
 * Converts a railroad-diagrams Diagram to an SVG string.
 * 
 * Handles multiple possible API shapes from the @prantlf/railroad-diagrams library:
 * - `diagram.toSVG()` returning a string
 * - `diagram.toSVG()` returning a DOM Element
 * - `diagram.toString()` fallback
 */
export function diagramToSvgString(diagram: any): string {
  if (!diagram) return "<!-- empty diagram -->";

  try {
    if (typeof diagram.toSVG === "function") {
      const svg = diagram.toSVG();
      if (typeof svg === "string") return svg;
      // If it's an Element/Node, serialize it.
      if (svg && typeof svg === "object" && "nodeType" in svg) {
        const el: Element = svg;
        return el.outerHTML ?? new XMLSerializer().serializeToString(el);
      }
      return "<!-- toSVG() returned unexpected value -->";
    }

    if (typeof diagram.toString === "function") {
      return String(diagram.toString());
    }

    return "<!-- Diagram does not support toSVG/toString -->";
  } catch (e: any) {
    return `<!-- Render error: ${e?.message ?? String(e)} -->`;
  }
}
