import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "7642199477181662226", // Get this from tina.io
  token: process.env.TINA_TOKEN || "7642199477181662226", // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: ".",
  },
  media: {
    tina: {
      mediaRoot: "assets/images",
      publicFolder: ".",
    },
  },
  schema: {
    collections: [
      {
        name: "hero",
        label: "Hero Section",
        path: "_data",
        match: {
          include: "hero",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "headline_em", label: "Headline Italic Part" },
          { type: "string", name: "subheadline", label: "Subheadline" },
          { type: "image", name: "background_image", label: "Background Image" },
        ],
      },
      {
        name: "studio",
        label: "About - The Studio",
        path: "_data",
        match: {
          include: "studio",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: "string", name: "title", label: "Section Title" },
          { type: "string", name: "lead", label: "Lead Paragraph", ui: { component: "textarea" } },
          { type: "string", name: "body", label: "Body Paragraph", ui: { component: "textarea" } },
          { type: "string", name: "cta_label", label: "CTA Label" },
          { type: "string", name: "cta_href", label: "CTA Link" },
          { type: "image", name: "image", label: "Studio Image" },
          { type: "string", name: "image_alt", label: "Image Alt Text" },
        ],
      },
      {
        name: "projects",
        label: "Projects",
        path: "_data",
        match: {
          include: "projects",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            list: true,
            name: "projects",
            label: "Projects",
            ui: {
              itemProps: (item) => {
                return { label: item?.name };
              }
            },
            fields: [
              { type: "string", name: "name", label: "Project Name" },
              { type: "string", name: "category", label: "Category" },
              { type: "image", name: "image", label: "Image" },
              { type: "string", name: "image_alt", label: "Image Alt Text" },
              { type: "boolean", name: "featured", label: "Featured" },
            ],
          },
        ],
      },
      {
        name: "services",
        label: "Services",
        path: "_data",
        match: {
          include: "services",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            list: true,
            name: "services",
            label: "Services",
            ui: {
              itemProps: (item) => {
                return { label: item?.title };
              }
            },
            fields: [
              { type: "string", name: "number", label: "Number" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
        ],
      },
      {
        name: "settings",
        label: "Site Settings",
        path: "_data",
        match: {
          include: "settings",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: "string", name: "studio_name", label: "Studio Name" },
          { type: "string", name: "tagline", label: "Tagline" },
          { type: "string", name: "location", label: "Location" },
          { type: "string", name: "email", label: "Email Address" },
          { type: "string", name: "instagram_url", label: "Instagram URL" },
          { type: "string", name: "pinterest_url", label: "Pinterest URL" },
          { type: "string", name: "cta_heading", label: "CTA Heading" },
          { type: "string", name: "cta_subheading", label: "CTA Subheading" },
          { type: "string", name: "cta_button_label", label: "CTA Button Label" },
          { type: "image", name: "cta_background_image", label: "CTA Background Image" },
          { type: "string", name: "copyright_year", label: "Copyright Year" },
        ],
      },
    ],
  },
});
