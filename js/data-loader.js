/* data-loader.js
   Single place that fetches labs.json and caches it in-memory
   so every page (lab.js, radiology.js, compare.js) reuses one fetch.
*/

let cachedData = null;

async function loadLabData() {
    if (cachedData) return cachedData;

    try {
        const res = await fetch("data/labs.json");
        if (!res.ok) throw new Error("Failed to load labs.json");
        cachedData = await res.json();
        return cachedData;
    } catch (err) {
        console.error("Error loading lab data:", err);
        return { labs: {}, radiology: {} };
    }
}