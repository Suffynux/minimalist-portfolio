export type ProjectScreen = {
  title: string;
  description: string;
  image: string;
  href?: string;
  snapshot?: boolean;
};
export type ProjectModule = {
  title: string;
  description: string;
  href: string;
};
export type BackgroundJob = {
  title: string;
  cadence: string;
  description: string;
  group: string;
};
export type RecordModel = { title: string; fields: string[]; purpose: string };
export type ProjectShowcase = {
  screens: ProjectScreen[];
  modules?: ProjectModule[];
  reports?: ProjectModule[];
  jobs?: BackgroundJob[];
  records?: RecordModel[];
  source?: string;
  protected?: boolean;
};
const oms = (
  title: string,
  path: string,
  description: string,
): ProjectModule => ({
  title,
  href: `https://www.gomilaoms.com${path}`,
  description,
});
const cega = (
  title: string,
  path: string,
  description: string,
): ProjectModule => ({
  title,
  href: `https://cega-pi.vercel.app${path}`,
  description,
});
const screen = (
  title: string,
  image: string,
  description: string,
  href?: string,
  snapshot = false,
): ProjectScreen => ({ title, image, description, href, snapshot });

/** Public historical screenshots and current customer-free captures. No live records are fetched by the portfolio. */
export const projectShowcases: Record<string, ProjectShowcase> = {
  "gomila-oms": {
    source: "https://github.com/Suffynux/Unified-Inbox-Readme",
    protected: true,
    screens: [
      screen("Customer conversations", "/work/gomila-chat-current.jpg", "A shared inbox brings website, Facebook and Instagram conversations into a team workflow, with ownership, waiting-time indicators, follow-ups, attachments and AI assistance. WhatsApp has a separate workspace. Search filtered for privacy; customer messages and details are not displayed.", undefined, true),
      screen("Support analytics", "/work/gomila-chat-analytics-current.jpg", "Managers can filter by agent and period to review new conversations, replies, waiting customers and closed chats. The interface distinguishes first-response tracking from typical reply time. Aggregate live snapshot, not a claim of performance improvement. First-response tracking was marked pending migration.", undefined, true),
      screen("Finance & reconciliation", "/work/gomila-finance-current.jpg", "A dedicated accounting workspace includes vouchers, journals, customer ledgers, invoices, vendor bills, chart of accounts, general ledger and reporting. Different voucher types support everyday accounting tasks. Blank voucher interface; no transaction was saved or posted.", undefined, true),
      screen("Returns", "/work/gomila-returns-current.jpg", "A return is operational work with an owner and a next stage. Teams can switch between a list and board, then filter by branch, status or reason. Search filtered for privacy. Empty columns show the real workflow, not an absence of business activity.", undefined, true),
      screen("Exchanges", "/work/gomila-exchanges-current.jpg", "Exchanges have their own tracker and creation flow while sharing the wider ticket workspace. Branch and status filters keep after-sales work organised. Search filtered for privacy; no exchange was submitted.", undefined, true),
      screen(
        "Current made-to-order workflow",
        "/work/gomila-oms-mto-current.jpg",
        "Current order-entry interface captured on 29 October 2026, with customer fields empty. No order was created.",
        "https://www.gomilaoms.com/orders/mto/new",
        true,
      ),
      screen(
        "Historical refund dashboard",
        "/work/gomila-oms-dashboard.png",
        "Open work, overdue tickets, refund amounts and the stage-by-stage pipeline. Published refund-workspace snapshot; the current OMS contains the wider modules below.",
        undefined,
        true,
      ),
      screen(
        "Reporting & reconciliation",
        "/work/gomila-oms-reports.png",
        "Date-range reporting by branch, status and reason, with CSV and print/PDF exports. Figures belong to the published snapshot.",
        "https://www.gomilaoms.com/reports",
        true,
      ),
      screen(
        "Workflow configuration",
        "/work/gomila-oms-settings.png",
        "Configurable stages, role ownership and SLA hours rather than a hardcoded process.",
        "https://www.gomilaoms.com/settings",
        true,
      ),
      screen(
        "The workspace entrance",
        "/work/gomila-oms.png",
        "The current public sign-in experience, with the Gomi workspace character.",
        "https://www.gomilaoms.com",
      ),
    ],
    modules: [
      oms(
        "Orders & fulfilment",
        "/orders",
        "Order search, branch assignment, split orders and the fulfilment journey.",
      ),
      oms(
        "Made-to-order",
        "/orders/mto",
        "Custom order specifications, production handoffs and progress tracking.",
      ),
      oms(
        "Inventory",
        "/inventory",
        "Stock visibility, reconciliation and connections to the retail catalogue.",
      ),
      oms(
        "Production",
        "/production/dashboard",
        "Production tracking with quality, verification, packing and refurbishment workspaces.",
      ),
      oms(
        "Shipments & riders",
        "/shipments",
        "Courier tracking, dispatch ageing, delivery events and rider workflows.",
      ),
      oms(
        "Refunds & exchanges",
        "/dashboard",
        "Stage-owned tickets, evidence attachments, deadlines and resolution workflows.",
      ),
      oms(
        "Retail operations",
        "/retail",
        "Branch stock, demand, rotation, audits, invoices and retail insights.",
      ),
      oms(
        "Finance & accounts",
        "/accounts/accounting/dashboard",
        "Payment records, accounting dashboards and reconciliation reports.",
      ),
      oms(
        "Sales & team activity",
        "/operations/team-tracking",
        "Activity, calls, follow-ups and work ownership across the sales team.",
      ),
      oms(
        "Abandoned carts",
        "/abandoned-carts/dashboard",
        "A cohort-based view of cart recovery, outcomes and follow-up work.",
      ),
      oms(
        "Synchronization",
        "/synchronization",
        "Background jobs, integration history, webhook retries and issues requiring attention.",
      ),
      oms(
        "System monitoring",
        "/system/issues",
        "Operational issues and health signals surfaced for the owners of the system.",
      ),
    ],
    reports: [
      oms(
        "Refund reports",
        "/reports",
        "Date, branch, stage and reason breakdowns with exports.",
      ),
      oms(
        "Online sales",
        "/reporting/online-sales",
        "Sales reporting with consistent reporting windows and shared export logic.",
      ),
      oms(
        "Sales bookings",
        "/reporting/sales-booking",
        "Booking values and counts attributed to the responsible salesperson.",
      ),
      oms(
        "Logistics",
        "/logistics/report",
        "Dispatch, delivery, returns and cohort-based delivery rates.",
      ),
      oms(
        "Stock analysis",
        "/orders/stock-analysis",
        "Sales and historical stock snapshots for period comparisons.",
      ),
      oms(
        "Order ageing",
        "/reporting/order-aging",
        "Work waiting at each stage, so teams can identify delays.",
      ),
    ],
    jobs: [
      {
        title: "Shopify order reconciliation",
        group: "Orders",
        cadence: "Every 15 minutes",
        description:
          "Reconcile orders from Shopify with the operational workspace.",
      },
      {
        title: "Webhook replay",
        group: "Webhooks",
        cadence: "Every 5 minutes",
        description:
          "Retry failed deliveries with backoff; move exhausted attempts to a review queue.",
      },
      {
        title: "Candela inventory",
        group: "Inventory",
        cadence: "Every 10 minutes",
        description:
          "Synchronise stock from retail shops, recording per-shop progress and results.",
      },
      {
        title: "Shopify inventory",
        group: "Inventory",
        cadence: "Hourly",
        description:
          "Refresh product and stock-level data from the storefront.",
      },
      {
        title: "Shipment tracking",
        group: "Logistics",
        cadence: "Every 10 minutes",
        description:
          "Bring courier status changes back into the fulfilment workflow.",
      },
      {
        title: "Courier payouts",
        group: "Finance",
        cadence: "Hourly",
        description:
          "Synchronise PostEx and Trax payout information for reconciliation.",
      },
      {
        title: "Overdue notifications",
        group: "Alerts",
        cadence: "Hourly",
        description:
          "Find breached ticket deadlines and notify the responsible people.",
      },
      {
        title: "Stock snapshots",
        group: "Inventory",
        cadence: "Weekly",
        description:
          "Save historical stock so week-on-week comparisons have a reliable baseline.",
      },
      {
        title: "System health",
        group: "Monitoring",
        cadence: "Every 5 minutes",
        description:
          "Watch stopped jobs, timeouts and database health, with issue and recovery alerts.",
      },
    ],
    records: [
      {
        title: "Orders & parcels",
        fields: [
          "Order reference",
          "Branch",
          "Owner",
          "Stage",
          "Parent / child relation",
        ],
        purpose:
          "Keep customer orders linked to the operational parcels that move through branches and logistics.",
      },
      {
        title: "Refund & exchange tickets",
        fields: [
          "Ticket ID",
          "Reason",
          "Stage",
          "Responsible role",
          "Deadline",
          "Resolution",
        ],
        purpose:
          "Make ownership, deadlines and the final outcome visible throughout the workflow.",
      },
      {
        title: "Background job runs",
        fields: [
          "Job key",
          "Status",
          "Started at",
          "Finished at",
          "Summary",
          "Error",
        ],
        purpose:
          "Explain when a job ran, what it changed and why a failure needs attention.",
      },
      {
        title: "Webhook deliveries",
        fields: [
          "Topic",
          "Delivery ID",
          "Attempt count",
          "Next attempt",
          "Processing result",
        ],
        purpose:
          "Track retries and unresolved deliveries without silently losing integration events.",
      },
      {
        title: "Stock snapshots",
        fields: ["Snapshot date", "Shop", "Product", "Quantity"],
        purpose:
          "Compare historical stock with period sales rather than treating today’s stock as historical data.",
      },
    ],
  },
  cega: {
    source: "https://github.com/Suffynux/Cega-Readme",
    protected: true,
    screens: [
      screen("One staff workspace", "/work/cega-admin-hub.jpg", "A role-aware hub connects programme dashboards, application management, certificates, bookings, judging and governance. Public forms feed the protected backend. Live interface, reviewed 29 October 2026. No records were changed.", undefined, true),
      screen("Training & certificates", "/work/cega-training-analytics-current.jpg", "Training reporting combines cohort and legacy application records. Staff can compare batches, courses and centres, manage intake, and issue certificates with token-based retrieval. Current aggregate reporting. Manager-reported totals and portal records are distinct; student-level scores are excluded.", undefined, true),
      screen("Incubation & judging", "/work/cega-incubation-analytics-current.jpg", "Founder applications progress through cohort review and two judging phases. The source implements six criteria per phase, reviewer permissions and normalised scoring across multiple judges. Dashboard captured live; judging workflow verified in the repository. No private applicant scores are shown.", undefined, true),
      screen("Shared spaces", "/work/cega-coworking-analytics-current.jpg", "Co-working applications, meeting-room bookings and rendering-lab requests give staff a structured way to handle access to facilities. Live interface, reviewed 29 October 2026. No records were changed.", undefined, true),
      screen("Events & governance", "/work/cega-events-analytics-current.jpg", "Event dashboards separate the event catalogue from registrations. Governance modules organise KPI groups, partner entries and rollups; calendar reminders are scheduled every ten minutes. Live event aggregates. Registrations are not attendance; missing attendance remains distinct from zero.", undefined, true),
      screen(
        "CEGA · Main website",
        "/work/cega-home.png",
        "A public gateway to training, incubation, co-working and community programmes.",
        "https://www.cega.com.pk/",
      ),
      screen(
        "Karachi Frames",
        "/work/cega-frames.png",
        "An event identity, agenda, competitions and registration journey in one landing page.",
        "https://www.cega.com.pk/khi-frames",
      ),
      screen(
        "Training",
        "/work/cega-training.png",
        "Course discovery and a clear route into training applications.",
        "https://www.cega.com.pk/training",
      ),
      screen(
        "Startup incubation",
        "/work/cega-incubation.png",
        "Programme storytelling and an application journey for founders.",
        "https://www.cega.com.pk/incubation",
      ),
      screen(
        "FUTUREPLAY · Investor Summit",
        "/work/cega-summit.png",
        "An investor-focused event experience connecting capital and creative studios.",
        "https://www.cega.com.pk/investor-summit",
      ),
      screen(
        "Training analytics",
        "/case-studies/cega/training-overview.png",
        "Applicant and enrolment breakdowns by course, batch and geography. Published case-study figures.",
        "https://cega-pi.vercel.app/admin/training-analytics",
        true,
      ),
      screen(
        "Co-working analytics",
        "/case-studies/cega/coworking-lab.png",
        "Applications, occupancy and rendering-lab bookings in a published dashboard snapshot.",
        "https://cega-pi.vercel.app/admin/coworking-dashboard",
        true,
      ),
      screen(
        "Community reporting",
        "/case-studies/cega/community-events.png",
        "Event bookings, hosted events and participation in a published snapshot.",
        "https://cega-pi.vercel.app/admin/dashboard/events",
        true,
      ),
    ],
    modules: [
      cega(
        "Training applications",
        "/admin/trainingForm-latest",
        "Applicant records, courses, batches and enrolment administration.",
      ),
      cega(
        "Incubation applications",
        "/admin/incubation-applications",
        "Founder applications and cohort-specific review workflows.",
      ),
      cega(
        "Phase-one judging",
        "/admin/judge/phase1",
        "Assigned applicants and structured first-round scoring.",
      ),
      cega(
        "Phase-two judging",
        "/admin/judge/phase2",
        "Detailed review for the next evaluation stage.",
      ),
      cega(
        "Co-working & labs",
        "/admin/coworking-dashboard",
        "Booking and occupancy administration across centres.",
      ),
      cega(
        "Community & events",
        "/admin/dashboard/events",
        "Events, bookings and participation reporting.",
      ),
      cega(
        "Certificate communications",
        "/admin/certificates/email-template",
        "Templates used for certificate-related communications.",
      ),
    ],
    reports: [
      cega(
        "Training analytics",
        "/admin/training-analytics",
        "Course, enrolment and demographic breakdowns.",
      ),
      cega(
        "Incubation analytics",
        "/admin/incubation-analytics",
        "A view of applications across incubation cohorts.",
      ),
      cega(
        "Programme dashboard",
        "/admin/program-dashboard",
        "Programme-level reporting for the management team.",
      ),
      cega(
        "Co-working dashboard",
        "/admin/coworking-dashboard",
        "Space usage, applications and bookings.",
      ),
      cega(
        "Community dashboard",
        "/admin/dashboard/events",
        "Event activity and participation.",
      ),
    ],
    records: [
      {
        title: "Training applications",
        fields: [
          "Applicant",
          "Course",
          "Batch",
          "Centre",
          "Delivery mode",
          "Enrolment status",
        ],
        purpose:
          "Connect an application to the right programme and track its outcome.",
      },
      {
        title: "Incubation reviews",
        fields: [
          "Application",
          "Cohort",
          "Assigned judge",
          "Phase",
          "Scores",
          "Decision",
        ],
        purpose:
          "Keep evaluation structured and make each reviewer’s responsibilities clear.",
      },
      {
        title: "Bookings & participation",
        fields: ["Programme", "Centre", "Date", "Booking status", "Attendance"],
        purpose:
          "Turn public programme interest into operational records and reporting.",
      },
    ],
  },
  "gomila-intersole": {
    source: "https://github.com/Suffynux/Gomila-PK-Readme",
    screens: [
      screen(
        "Pakistan storefront",
        "/work/gomila-desktop.png",
        "The live collection and campaign experience.",
        "https://gomilaintersole.pk/",
      ),
      screen(
        "Product discovery",
        "/work/gomila-detail.png",
        "Shopping beyond the homepage, with a consistent storefront identity.",
        "https://gomilaintersole.pk/",
      ),
      screen(
        "Mobile storefront",
        "/work/gomila-mobile.png",
        "The shopping experience adapted to a smaller screen.",
        "https://gomilaintersole.pk/",
      ),
    ],
  },
  "gomila-international": {
    source: "https://github.com/Suffynux/Gomila-UK-Readme",
    screens: [
      screen(
        "International storefront",
        "/work/gomila-international.webp",
        "Published storefront design. The live domain routes visitors according to their market.",
        "https://www.gomilaintersole.com/",
        true,
      ),
      screen(
        "Country selector",
        "/work/gomila-country.webp",
        "A published snapshot of the region-selection experience.",
        "https://www.gomilaintersole.com/",
        true,
      ),
    ],
  },
  "centro-built": {
    source: "https://github.com/Suffynux/Centro-Readme",
    protected: true,
    screens: [
      screen(
        "Tender generator",
        "/work/centro-tender.webp",
        "A published view of the web tender-building workflow.",
        undefined,
        true,
      ),
      screen(
        "PDF generation",
        "/work/centro-pdf.webp",
        "Client-ready document generation from the same tender data.",
        undefined,
        true,
      ),
      screen(
        "Desktop pricelists",
        "/work/centro-pricelists.png",
        "Editable pricing and reference data in the offline desktop version.",
        undefined,
        true,
      ),
    ],
  },
  "jk-news-records": {
    source: "https://github.com/Suffynux/jk-new",
    protected: true,
    screens: [
      screen(
        "Production list",
        "/work/jk-news-list.png",
        "The published newsroom list view, with work organised by stage.",
        undefined,
        true,
      ),
      screen(
        "Activity log",
        "/work/jk-news-activity.png",
        "A published view of changes and turnaround timing.",
        undefined,
        true,
      ),
      screen(
        "Overdue alerts",
        "/work/jk-news-overdue.png",
        "Deadlines and unfinished work made visible.",
        undefined,
        true,
      ),
    ],
  },
};

export const sourceProjects = [
  {
    name: "macOS Battery Alert",
    repo: "mac-battery-full-alert",
    description: "A full-charge notification and voice reminder for macOS.",
  },
  {
    name: "AI Agent Skills",
    repo: "ai-agent-skills",
    description: "A collection of reusable skills for AI agents.",
  },
  {
    name: "Image Color Extractor",
    repo: "Image-Color-Extractor",
    description:
      "Upload an image and pick its colours with the browser Eyedropper API.",
    live: "https://suffynux.github.io/Image-Color-Extractor/",
  },
  {
    name: "Chatcord",
    repo: "chatcord",
    description: "A real-time chat application using Socket.IO.",
  },
  {
    name: "Deeniverse Backend",
    repo: "deeniverse-backend",
    description:
      "The backend repository supporting the learning-platform project.",
  },
  {
    name: "Scientific Calculator",
    repo: "scientific-cal",
    description: "Calculator source project.",
  },
  {
    name: "Weather App",
    repo: "Weather-APP",
    description: "Weather application source project.",
  },
  {
    name: "QR Code Generator",
    repo: "Qr-code-Generator-",
    description:
      "A Python utility for generating a QR code from entered details.",
  },
  {
    name: "Video Tube",
    repo: "Mern-Project-Video-Tube-",
    description: "A MERN application source project.",
  },
  {
    name: "Checkout Automation",
    repo: "Autocheckout-bot",
    description: "A browser checkout-automation experiment.",
  },
  {
    name: "Jailbot Inarah",
    repo: "Jailbot-inarah",
    description: "Bot source project.",
  },
];
