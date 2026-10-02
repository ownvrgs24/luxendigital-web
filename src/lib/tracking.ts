// Form tracking helper — fires CRM lead event on form submission.
// Used by the Contact form. Standard fields go in formData; custom fields
// go through customFields using the id returned by register_custom_field.

type StandardTrackingFieldKey = string;
type RegisteredCustomFieldId = string;
type TrackingCustomField = { value?: unknown; label: string };
type TrackingFileField = { file?: File; label: string };
type TrackingImageDataField = { dataUrl?: string; label: string };

export const TRACKING = {
  trackingId: "tk_d763d62c1c924b1fb3171833017ece9c",
  locationId: "myHH3DWgv1jOQx1drQO9",
  projectId: "1788847884528312040",
} as const;

/** LeadConnector inbound webhook — triggers the CRM workflow for site forms. */
const LEAD_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/myHH3DWgv1jOQx1drQO9/webhook-trigger/3e7fbc1c-ae0b-4c8c-b847-3eb9c67ec032";

/**
 * Sends a form submission to the lead webhook as flat JSON, so each key can be
 * mapped directly in the workflow's trigger. Unlike the tracking event this
 * is awaited: the form only shows success once the webhook has accepted it.
 */
export async function postLeadWebhook(
  fields: Record<string, string | undefined>,
): Promise<void> {
  const res = await fetch(LEAD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...fields,
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export const postTrackingEvent = (
  trackingPayload: Record<string, unknown> & {
    formData: Record<StandardTrackingFieldKey, unknown>;
    formLabels: Record<StandardTrackingFieldKey, string>;
  },
  options: {
    customFields?: Record<RegisteredCustomFieldId, TrackingCustomField>;
    fileFields?: Record<RegisteredCustomFieldId, TrackingFileField>;
    imageDataFields?: Record<RegisteredCustomFieldId, TrackingImageDataField>;
  } = {},
) => {
  const { customFields = {}, fileFields = {}, imageDataFields = {} } = options;
  const eventPayload = {
    ...trackingPayload,
    formData: { ...trackingPayload.formData },
    formLabels: { ...trackingPayload.formLabels },
  };
  const body = new FormData();

  for (const [key, field] of Object.entries(customFields)) {
    if (field.value === undefined) continue;
    eventPayload.formData[key] = field.value;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(imageDataFields)) {
    const dataUrl = field.dataUrl;
    if (!dataUrl) continue;
    if (!dataUrl.startsWith("data:image/")) {
      throw new Error("Image data field must be a data:image/* base64 string");
    }
    eventPayload.formData[key] = dataUrl;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(fileFields)) {
    const file = field.file;
    if (!file) continue;
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File must be 50 MB or smaller");
    }
    eventPayload.formData[key] = {
      filename: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };
    eventPayload.formLabels[key] = field.label;
    body.append(key, file, file.name);
  }

  for (const key of Object.keys(eventPayload.formData)) {
    eventPayload.formLabels[key] ||= key;
  }

  body.append("event", JSON.stringify(eventPayload));

  fetch("https://backend.leadconnectorhq.com/external-tracking/events", {
    method: "POST",
    headers: {
      version: "2021-07-28",
    },
    body,
  }).catch(() => {}); // Fire-and-forget — don't block form UX
};
