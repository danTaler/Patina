# Wix CMS Integration Guide — Patina Design Studio

This guide explains how to set up Wix Content Manager, insert the custom Patina frontend, and connect them together using Wix Velo. This allows you to manage all content dynamically inside Wix, with the page updating in real-time.

---

## Step 1: Create Wix Content Manager Collections

In the Wix Editor, open the **Content Manager** (on the left panel) and create five collections with the following exact names and field keys.

> [!NOTE]
> Make sure to matching the **Field Key** (lowercase, e.g. `headline`) and not just the display name, as Velo queries use the Field Keys!

### Collection 1: `Hero` (Single Item)
*   **headline** (Text) — *Main headline text (e.g. "Timeless. Bespoke.")*
*   **headline_em** (Text) — *Italicized secondary part of headline (e.g. "Interior Architecture.")*
*   **subheadline** (Text) — *Supporting paragraph text*
*   **background_image** (Image) — *Large background photo*

### Collection 2: `Studio` (Single Item)
*   **title** (Text) — *Section title (e.g. "The Studio")*
*   **lead** (Long Text) — *Main bold paragraph*
*   **body** (Long Text) — *Supporting descriptive text*
*   **cta_label** (Text) — *Button label (e.g. "Our Process →")*
*   **cta_href** (Text) — *Target anchor link (e.g. "#process")*
*   **image** (Image) — *Studio photograph*
*   **image_alt** (Text) — *Accessible text description for the image*

### Collection 3: `Projects` (Multi Item)
*   **name** (Text) — *Project Name (e.g. "Vaucluse Residence")*
*   **category** (Text) — *Category tag (e.g. "Residential Architecture")*
*   **image** (Image) — *Project cover image*
*   **image_alt** (Text) — *Accessible text description*
*   **featured** (Boolean) — *Check true to display this project in double width (large card)*

### Collection 4: `Services` (Multi Item)
*   **number** (Text) — *Display number (e.g. "01", "02")*
*   **title** (Text) — *Service Title (e.g. "Interior Architecture")*
*   **description** (Long Text) — *Descriptive text for the service*

### Collection 5: `Settings` (Single Item)
*   **studio_name** (Text) — *Studio name (e.g. "Patina Design Studio")*
*   **tagline** (Text) — *Tagline (e.g. "Bespoke Interior Architecture")*
*   **location** (Text) — *Physical studio location (e.g. "Sydney, Australia")*
*   **email** (Text) — *Contact email address*
*   **instagram_url** (Text) — *Link to Instagram (optional)*
*   **pinterest_url** (Text) — *Link to Pinterest (optional)*
*   **cta_heading** (Text) — *Footer CTA Title (e.g. "Start Your Journey")*
*   **cta_subheading** (Text) — *Footer CTA Subtext (e.g. "Begin your bespoke design...")*
*   **cta_button_label** (Text) — *CTA Button text (e.g. "ENQUIRE NOW")*
*   **cta_background_image** (Image) — *Footer CTA background photo*
*   **copyright_year** (Text) — *Copyright year (e.g. "2026")*

---

## Step 2: Add the HTML Embed Element to Wix

1.  Open your page in the Wix Editor / Wix Studio.
2.  Click **Add Elements (+)** > **Embed & Social** > **Embed Code** > Select **HTML Embed**.
3.  Stretch the HTML Embed component to be full-width and full-height (or set width: `100vw`, height: `100vh` in Wix Studio for a true full-bleed hero).
4.  Open the properties panel for the HTML Embed element, and change its **ID** to `htmlEmbed`.

---

## Step 3: Bundle and Paste the Frontend Code

We have created an automated bundler script that combines `index.html`, `styles.css`, and `script.js` into one copy-pasteable file.

1.  Open your terminal in this project directory and run:
    ```bash
    node build-wix.js
    ```
2.  This creates a single file `dist/wix-embed.html` in your workspace.
3.  Open the newly generated [wix-embed.html](file:///c:/Users/Idan/Documents/projects/New%20folder/dist/wix-embed.html) file, copy the entire file contents.
4.  In the Wix Editor, click on your HTML Embed element, select **Enter Code**, paste the code you just copied, and click **Update / Apply**.

---

## Step 4: Add the Wix Velo Page Code

1.  Turn on **Velo Developer Mode** from the top menu bar of the Wix Editor.
2.  Open the **Page Code** editor panel at the bottom of the screen.
3.  Open the [wix-velo-code.js](file:///c:/Users/Idan/Documents/projects/New%20folder/wix-velo-code.js) file, copy its contents.
4.  Paste it directly into the Wix Page Code panel.
5.  **Publish** your website!

---

## How It Works Under the Hood

1.  When a visitor lands on your Wix page, the Wix Velo page code fetches the latest data from the Wix Content Manager databases.
2.  At the same time, the embedded custom HTML finishes loading and broadcasts a `WIX_IFRAME_READY` message.
3.  Wix Velo receives this, packages the database contents, and sends them into the iframe sandbox via a secure `postMessage` API call.
4.  The custom JavaScript inlines this data directly into the beautiful, high-performance visual layout and triggers all scroll animations smoothly.
5.  **Bonus**: To edit any text, image, or project in the future, you do not need to touch the code anymore! Just open the Wix Content Manager dashboard and edit the values. The changes will update immediately!
