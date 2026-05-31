/**
 * Wix Velo Page Code - Patina Design Studio
 * 
 * Instructions:
 * 1. Enable Velo Dev Mode in the top bar of your Wix Editor / Wix Studio.
 * 2. Add an "HTML Embed" element to your page.
 * 3. Change its ID to #htmlEmbed in the Properties panel (or update it in this code).
 * 4. Paste the compiled content of dist/wix-embed.html into the HTML Embed's code settings.
 * 5. Paste this entire JavaScript code into the Page Code panel at the bottom of the editor.
 * 6. Create Wix collections named "Hero", "Studio", "Projects", "Services", and "Settings"
 *    using the Content Manager, and populate them with your content.
 */

import wixData from 'wix-data';

$w.onReady(function () {
    console.log("[Wix Velo] Page code initialized.");

    // Define the HTML Embed element ID (default is "#htmlEmbed")
    const HTML_EMBED_ID = '#htmlEmbed';

    // ── Function to Fetch and Send Data ─────────────────────────
    async function sendCmsDataToIframe() {
        console.log("[Wix Velo] Fetching latest content from Wix collections...");
        try {
            // Fetch all collections concurrently for speed
            const [
                heroResult,
                studioResult,
                projectsResult,
                servicesResult,
                settingsResult
            ] = await Promise.all([
                wixData.query("Hero").find(),
                wixData.query("Studio").find(),
                wixData.query("Projects").find(),
                wixData.query("Services").ascending("number").find(), // Sorted by service number
                wixData.query("Settings").find()
            ]);

            // Package the data structure to match what Patina expects
            const cmsData = {
                hero: heroResult.items[0] || null,
                studio: studioResult.items[0] || null,
                projects: projectsResult.items || [],
                services: servicesResult.items || [],
                settings: settingsResult.items[0] || null
            };

            console.log("[Wix Velo] CMS Data fetched successfully:", cmsData);

            // Post message to the HTML Embed iframe
            $w(HTML_EMBED_ID).postMessage({
                type: 'WIX_CMS_UPDATE',
                data: cmsData
            });
            console.log("[Wix Velo] CMS Data sent to HTML Embed!");

        } catch (error) {
            console.error("[Wix Velo] Error fetching or sending CMS data:", error);
        }
    }

    // ── Handshake: Listen for IFRAME Ready signal ───────────────
    // This fires as soon as the HTML element inside the iframe loaded,
    // ensuring we never send data before the script is ready to receive it.
    $w(HTML_EMBED_ID).onMessage((event) => {
        const message = event.data;
        if (message && message.type === 'WIX_IFRAME_READY') {
            console.log("[Wix Velo] HTML Embed iframe reported ready. Pushing data...");
            sendCmsDataToIframe();
        }
    });

    // ── Redundant/Initial Push ─────────────────────────────────
    // Just in case the iframe was already loaded before this script ran,
    // we also trigger an initial push.
    setTimeout(() => {
        sendCmsDataToIframe();
    }, 1500);
});
