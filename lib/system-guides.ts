export type GuideStep = { title:string; image:string; description:string; flow:string[]; note:string };
export type SystemGuideData = {title:string; intro:string; steps:GuideStep[]};
export const systemGuides: Record<string,SystemGuideData> = {
  "gomila-oms": {
    "title": "A guided look inside the operation.",
    "intro": "Follow the work across customer support, production, finance and after-sales. These are connected parts of the same business system.",
    "steps": [
      {
        "title": "Customer conversations",
        "image": "/work/gomila-chat-current.jpg",
        "description": "A shared inbox brings website, Facebook and Instagram conversations into a team workflow, with ownership, waiting-time indicators, follow-ups, attachments and AI assistance. WhatsApp has a separate workspace.",
        "flow": [
          "Customer asks a question",
          "Agent takes ownership and uses customer/order context",
          "Follow-up stays visible to the team"
        ],
        "note": "Search filtered for privacy; customer messages and details are not displayed."
      },
      {
        "title": "Support analytics",
        "image": "/work/gomila-chat-analytics-current.jpg",
        "description": "Managers can filter by agent and period to review new conversations, replies, waiting customers and closed chats. The interface distinguishes first-response tracking from typical reply time.",
        "flow": [
          "Choose period and team",
          "Review workload and response measures",
          "Find where attention is needed"
        ],
        "note": "Aggregate live snapshot, not a claim of performance improvement. First-response tracking was marked pending migration."
      },
      {
        "title": "Custom production",
        "image": "/work/gomila-oms-mto-current.jpg",
        "description": "A structured order brief captures the booking branch, owner, target date and item specifications before production handoffs.",
        "flow": [
          "Capture requirements",
          "Verify, produce and check quality",
          "Pack and dispatch"
        ],
        "note": "Blank order form; no customer record was created."
      },
      {
        "title": "Finance & reconciliation",
        "image": "/work/gomila-finance-current.jpg",
        "description": "A dedicated accounting workspace includes vouchers, journals, customer ledgers, invoices, vendor bills, chart of accounts, general ledger and reporting. Different voucher types support everyday accounting tasks.",
        "flow": [
          "Select voucher and cost centre",
          "Enter balanced accounting details",
          "Draft or post into the ledger"
        ],
        "note": "Blank voucher interface; no transaction was saved or posted."
      },
      {
        "title": "Returns",
        "image": "/work/gomila-returns-current.jpg",
        "description": "A return is operational work with an owner and a next stage. Teams can switch between a list and board, then filter by branch, status or reason.",
        "flow": [
          "Submitted",
          "Verify and receive",
          "Close the return"
        ],
        "note": "Search filtered for privacy. Empty columns show the real workflow, not an absence of business activity."
      },
      {
        "title": "Exchanges",
        "image": "/work/gomila-exchanges-current.jpg",
        "description": "Exchanges have their own tracker and creation flow while sharing the wider ticket workspace. Branch and status filters keep after-sales work organised.",
        "flow": [
          "Find the original order",
          "Create and track the exchange",
          "Resolve the customer request"
        ],
        "note": "Search filtered for privacy; no exchange was submitted."
      }
    ]
  },
  "cega": {
    "title": "From an application to a whole programme.",
    "intro": "CEGA connects public applications with the staff tools needed to run training, incubation, shared spaces and events.",
    "steps": [
      {
        "title": "One staff workspace",
        "image": "/work/cega-admin-hub.jpg",
        "description": "A role-aware hub connects programme dashboards, application management, certificates, bookings, judging and governance. Public forms feed the protected backend.",
        "flow": [
          "Public application or booking",
          "Authorised staff workspace",
          "Programme-specific action"
        ],
        "note": "Live interface, reviewed 29 October 2026. No records were changed."
      },
      {
        "title": "Training & certificates",
        "image": "/work/cega-training-analytics-current.jpg",
        "description": "Training reporting combines cohort and legacy application records. Staff can compare batches, courses and centres, manage intake, and issue certificates with token-based retrieval.",
        "flow": [
          "Apply to a course",
          "Review applications and track cohort progress",
          "Issue and retrieve certificates"
        ],
        "note": "Current aggregate reporting. Manager-reported totals and portal records are distinct; student-level scores are excluded."
      },
      {
        "title": "Incubation & judging",
        "image": "/work/cega-incubation-analytics-current.jpg",
        "description": "Founder applications progress through cohort review and two judging phases. The source implements six criteria per phase, reviewer permissions and normalised scoring across multiple judges.",
        "flow": [
          "Founder submits an application",
          "Authorised judges score in two phases",
          "Staff review cohort outcomes"
        ],
        "note": "Dashboard captured live; judging workflow verified in the repository. No private applicant scores are shown."
      },
      {
        "title": "Shared spaces",
        "image": "/work/cega-coworking-analytics-current.jpg",
        "description": "Co-working applications, meeting-room bookings and rendering-lab requests give staff a structured way to handle access to facilities.",
        "flow": [
          "Request a workspace or resource",
          "Review availability and booking details",
          "Manage the facility workflow"
        ],
        "note": "Live interface, reviewed 29 October 2026. No records were changed."
      },
      {
        "title": "Events & governance",
        "image": "/work/cega-events-analytics-current.jpg",
        "description": "Event dashboards separate the event catalogue from registrations. Governance modules organise KPI groups, partner entries and rollups; calendar reminders are scheduled every ten minutes.",
        "flow": [
          "Register or submit a programme entry",
          "Staff review reports and KPI records",
          "Coordinate the next activity"
        ],
        "note": "Live event aggregates. Registrations are not attendance; missing attendance remains distinct from zero."
      }
    ]
  },
  "uk-medical-aid": {
    "title": "A website the team can run. An audience they can reach.",
    "intro": "The public website, custom CMS and email engine form one platform for publishing the charity’s work and keeping supporters informed.",
    "steps": [
      {
        "title": "Public discovery",
        "image": "/work/ukmedicalaid-home-current.jpg",
        "description": "Visitors explore programmes, appeals, events and impact reports, with clear routes to donate or hear more. Donation buttons hand off to the external fundraising service.",
        "flow": [
          "Discover the cause",
          "Explore programmes and appeals",
          "Donate or subscribe"
        ],
        "note": "Live interface, reviewed 29 October 2026. No records were changed."
      },
      {
        "title": "Custom content management",
        "image": "/work/ukmedicalaid-cms-current.jpg",
        "description": "Editors manage homepage sections, pages, appeals, team profiles, blogs, images and site settings through a custom admin interface. MongoDB stores content and Cloudinary supports media.",
        "flow": [
          "Edit copy and imagery",
          "Review publishing status",
          "Publish through the CMS"
        ],
        "note": "Live CMS editor captured without saving any changes."
      },
      {
        "title": "Campaign engine",
        "image": "/work/ukmedicalaid-campaigns-current.jpg",
        "description": "A built-in email platform manages contacts, audiences, templates, campaigns, events and analytics. Engagement reporting includes opens, clicks and unsubscribes.",
        "flow": [
          "Build a subscribed audience",
          "Design and schedule a campaign",
          "Review sending and engagement"
        ],
        "note": "Live aggregate snapshot. SMTP acceptance is not guaranteed inbox delivery; opens are tracking signals, not confirmed reading."
      },
      {
        "title": "Compose & schedule",
        "image": "/work/ukmedicalaid-campaign-builder-current.jpg",
        "description": "Start blank, use a saved template or duplicate a campaign. The source supports audience selection, previews, scheduling, batched delivery, retries, pause/resume and provider quota handling.",
        "flow": [
          "Choose content and recipients",
          "Schedule eligible sending",
          "Process queue and track results"
        ],
        "note": "Composer entry screen captured live. Queue and scheduling behaviour verified in source; no campaign was created or sent."
      },
      {
        "title": "Supporter lifecycle",
        "image": "/work/ukmedicalaid-newsletter-current.jpg",
        "description": "Newsletter signups join the supporter workflow. CSV imports validate and deduplicate contacts; unsubscribed recipients are excluded and subscription status is checked again before sending.",
        "flow": [
          "Newsletter signup or validated import",
          "Audience segmentation and campaign",
          "One-click unsubscribe and suppression"
        ],
        "note": "Campaign cron is configured every five minutes. Scheduled time determines eligibility; exact-second delivery is not guaranteed."
      }
    ]
  },
  "bangrila-motors": {
    "title": "From choosing a car to a useful WhatsApp enquiry.",
    "intro": "A focused booking journey helps the customer provide the details the business needs, before the conversation starts.",
    "steps": [
      {
        "title": "Plan the journey",
        "image": "/work/bangrila-home-current.jpg",
        "description": "Customers choose pickup and destination, one-way or return travel, dates and driver or self-drive options. Location search supports places and hotels, with manual entry as a fallback.",
        "flow": [
          "Choose route and dates",
          "Add travel preferences",
          "Review the enquiry"
        ],
        "note": "Live interface, reviewed 29 October 2026. No records were changed."
      },
      {
        "title": "Choose a vehicle",
        "image": "/work/bangrila-fleet-current.jpg",
        "description": "A filterable fleet presents vehicle categories, seating and travel use cases. Selecting a car carries that context into the booking form.",
        "flow": [
          "Browse sedans, SUVs or group travel",
          "Inspect the vehicle",
          "Prefill the enquiry with that car"
        ],
        "note": "Live interface, reviewed 29 October 2026. No records were changed."
      },
      {
        "title": "Continue on WhatsApp",
        "image": "/work/bangrila-home-current.jpg",
        "description": "The form prepares a message for the owner containing the route, dates, selected car, notes and location links. The customer reviews the draft in WhatsApp and taps Send.",
        "flow": [
          "Complete the trip details",
          "Open a prefilled WhatsApp draft",
          "Agree availability and price with the owner"
        ],
        "note": "This is a car-enquiry workflow, including hotel pickup/location search. It does not confirm availability, take payment or reserve hotel rooms."
      }
    ]
  }
};
