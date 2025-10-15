import { getPicnicClient } from "../lib/picnic.js";
import { z } from "zod";

export const getUserDetailsTool = {
  name: "get_picnic_user_details",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const user = await picnicClient.getUserDetails();

    const userText = `
# User Details

## Personal Information
- User ID: ${user.user_id}
- Name: ${user.firstname} ${user.lastname}
- Email: ${user.contact_email}
- Phone: ${user.phone}
- Customer type: ${user.customer_type}

## Address
- Street: ${user.address.street} ${user.address.house_number}${user.address.house_number_ext || ""}
- City: ${user.address.city}
- Postcode: ${user.address.postcode}

## Delivery Statistics
- Total deliveries: ${user.total_deliveries}
- Completed deliveries: ${user.completed_deliveries}
- Placed order: ${user.placed_order ? "Yes" : "No"}
- Received delivery: ${user.received_delivery ? "Yes" : "No"}

## Household
- Adults: ${user.household_details.adults}
- Children: ${user.household_details.children}
- Cats: ${user.household_details.cats}
- Dogs: ${user.household_details.dogs}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: userText,
        },
      ],
    };
  },
};

export const getUserInfoTool = {
  name: "get_picnic_user_info",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const userInfo = await picnicClient.getUserInfo();

    const infoText = `
# User Information

- User ID: ${userInfo.user_id}
- Redacted phone: ${userInfo.redacted_phone_number}
- Feature toggles: ${userInfo.feature_toggles.length}
${userInfo.feature_toggles.map((toggle) => `  - ${toggle.name}`).join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: infoText,
        },
      ],
    };
  },
};

export const getProfileMenuTool = {
  name: "get_picnic_profile_menu",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const profile = await picnicClient.getProfileMenu();

    const profileText = `
# Profile Menu

## User
- Address: ${profile.user.address.street} ${profile.user.address.house_number}, ${profile.user.address.city}
- Avatar type: ${profile.user.avatar.type}
- Avatar URL: ${profile.user.avatar.image_url}

## MGM (Referral)
- Code: ${profile.user.mgm.mgm_code}
- Share URL: ${profile.user.mgm.share_url}
- Amount earned: ${profile.user.mgm.amount_earned / 100}€
- Invitee value: ${profile.user.mgm.invitee_value / 100}€
- Inviter value: ${profile.user.mgm.inviter_value / 100}€

## Highlights
${profile.highlights.length > 0 ? profile.highlights.map((h) => `- ${JSON.stringify(h)}`).join("\n") : "No highlights"}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: profileText,
        },
      ],
    };
  },
};

export const getMgmDetailsTool = {
  name: "get_picnic_mgm_details",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const mgm = await picnicClient.getMgmDetails();

    const mgmText = `
# MGM (Member Get Member) Details

- Referral code: ${mgm.mgm_code}
- Share URL: ${mgm.share_url}
- Amount earned: ${mgm.amount_earned / 100}€
- Value for invitee: ${mgm.invitee_value / 100}€
- Value for inviter: ${mgm.inviter_value / 100}€
`;

    return {
      content: [
        {
          type: "text" as const,
          text: mgmText,
        },
      ],
    };
  },
};

export const getConsentSettingsTool = {
  name: "get_picnic_consent_settings",
  schema: { general: z.boolean().optional().default(false) },
  handler: async ({ general }: { general?: boolean }) => {
    const picnicClient = await getPicnicClient();
    const settings = await picnicClient.getConsentSettings(general || false);

    const settingsText = `
# Consent Settings

${settings
  .map(
    (setting) =>
      `\n## ${setting.text.title}\n- ID: ${setting.id}\n- Type: ${setting.type}\n- Established: ${setting.established_decision ? "Yes" : "No"}\n- Initial state: ${setting.initial_state ? "Agreed" : "Disagreed"}\n\n${setting.text.text}`,
  )
  .join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: settingsText,
        },
      ],
    };
  },
};

export const setConsentSettingsTool = {
  name: "set_picnic_consent_settings",
  schema: {
    consentDeclarations: z.array(
      z.object({
        consent_request_text_id: z.string(),
        consent_request_locale: z.string(),
        agreement: z.boolean(),
      }),
    ),
  },
  handler: async ({
    consentDeclarations,
  }: {
    consentDeclarations: Array<{
      consent_request_text_id: string;
      consent_request_locale: string;
      agreement: boolean;
    }>;
  }) => {
    const picnicClient = await getPicnicClient();
    const result = await picnicClient.setConsentSettings({
      consent_declarations: consentDeclarations,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Consent settings updated. Text IDs: ${result.consent_request_text_ids.join(", ")}`,
        },
      ],
    };
  },
};

export const getCustomerServiceContactInfoTool = {
  name: "get_picnic_customer_service_contact_info",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const info = await picnicClient.getCustomerServiceContactInfo();

    const contactText = `
# Customer Service Contact Information

## Contact Details
- Email: ${info.contact_details.email}
- Phone: ${info.contact_details.phone}
- WhatsApp: ${info.contact_details.whatsapp}

## Opening Times
${Object.entries(info.opening_times)
  .map(([date, times]) => `- ${date}: ${times.start.join(":")} - ${times.end.join(":")}`)
  .join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: contactText,
        },
      ],
    };
  },
};

