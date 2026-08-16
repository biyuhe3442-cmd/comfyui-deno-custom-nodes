import { app } from "../../../scripts/app.js";

// Display-only localization.  Never replace widget.name, slot.name, widget.value,
// combo option values, node.type, or serialized workflow data in this module.
const CATALOG_URL = new URL("./locales/zh-CN.json", import.meta.url);
let catalog = {};

function map(section, key, fallback = key) {
    const value = catalog?.[section]?.[key];
    return typeof value === "string" && value ? value : fallback;
}

function isDenoNode(node) {
    return String(node?.comfyClass || node?.type || "").startsWith("Deno");
}

function localizeNode(node) {
    if (!isDenoNode(node)) return;
    for (const widget of node.widgets || []) {
        // `name` is the workflow key. `label` is only what the canvas renders.
        if (widget?.name) widget.label = map("labels", widget.name, widget.label || widget.name);
    }
    for (const slot of node.inputs || []) {
        if (slot?.name) slot.label = map("labels", slot.name, slot.label || slot.name);
    }
    for (const slot of node.outputs || []) {
        if (slot?.name) slot.label = map("socket_labels", slot.name, slot.label || slot.name);
    }
    node.setDirtyCanvas?.(true, true);
    app.graph?.setDirtyCanvas?.(true, true);
}

function localizeElement(element) {
    if (!element || element.nodeType !== 1) return;
    for (const attribute of ["title", "aria-label", "placeholder"]) {
        const current = element.getAttribute?.(attribute);
        if (current) element.setAttribute(attribute, map("ui", current, current));
    }
    // Only translate leaf elements. This avoids altering user prompt text,
    // technical reports, select values, and application-controlled markup.
    if (element.tagName === "OPTION") {
        // Keep the option's value untouched; only its rendered label changes.
        const current = element.textContent?.trim();
        const translated = current && map("enum_labels", current, map("ui", current, current));
        if (translated && translated !== current) element.textContent = translated;
        return;
    }
    if (element.children?.length === 0 && !/^(INPUT|TEXTAREA|SELECT)$/i.test(element.tagName || "")) {
        const current = element.textContent?.trim();
        const translated = current && map("ui", current, current);
        if (translated && translated !== current) element.textContent = translated;
    }
    element.querySelectorAll?.("option,[title],[aria-label],[placeholder]").forEach((child) => {
        if (child.tagName === "OPTION") {
            localizeElement(child);
            return;
        }
        for (const attribute of ["title", "aria-label", "placeholder"]) {
            const current = child.getAttribute(attribute);
            if (current) child.setAttribute(attribute, map("ui", current, current));
        }
    });
}

function localizeExisting() {
    const nodes = app.graph?._nodes || app.canvas?.graph?._nodes || [];
    nodes.forEach(localizeNode);
    document.querySelectorAll?.("body *").forEach(localizeElement);
}

async function loadCatalog() {
    try {
        const response = await fetch(CATALOG_URL, { cache: "no-store" });
        if (response.ok) catalog = await response.json();
    } catch (error) {
        // English labels remain available through the fallback path.
        console.debug("[DENO] Simplified-Chinese catalog unavailable:", error);
    }
    localizeExisting();
}

app.registerExtension({
    name: "Deno.SimplifiedChineseDisplay",
    nodeCreated(node) {
        localizeNode(node);
        queueMicrotask(() => localizeNode(node));
    },
    setup() {
        loadCatalog();
        const observer = new MutationObserver((changes) => {
            for (const change of changes) change.addedNodes.forEach(localizeElement);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    },
});
