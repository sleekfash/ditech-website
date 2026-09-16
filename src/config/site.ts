// ============================================================================
// SITE CONFIG — edit this file to rebrand a deployment.
// All copy, contact details, and social links flow from here.
// ============================================================================

export const site = {
  brand: {
    name: "DiTech",
    fullName: "DiTech Solutions & Services",
    tagline: "Engineered intelligence, coastal-luxury craft.",
    description:
      "A boutique studio building bespoke AI, automation and legal-tech systems for firms that don't do generic.",
  },
  contact: {
    email: "info@ditechsolutions.com",
    phone: "+1 (555) 123-4567",
    address: {
      line1: "123 Tech Drive",
      line2: "Innovation City, TC 12345",
    },
    hours: "Mon–Fri · 9am–6pm EST",
  },
  socials: {
    linkedin: "#",
    twitter: "#",
    github: "#",
    facebook: "#",
  },
  commerce: {
    currency: "NGN",
    currencySymbol: "₦",
    locale: "en-NG",
    // Shown at checkout so customers know what happens after they order.
    fulfilmentNote:
      "We confirm stock and delivery by phone or email within one business day, then share payment details.",
  },
  legal: {
    privacyHref: "/privacy",
    termsHref: "/terms",
    copyright: (year: number) =>
      `© ${year} DiTech Solutions & Services. All rights reserved.`,
  },
} as const;
