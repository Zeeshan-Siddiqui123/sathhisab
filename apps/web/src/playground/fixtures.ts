import type { Member } from "@/types/ui";
export const members: Member[] = [
 { id: "zeeshan", name: "Zeeshan", role: "OWNER" },
 { id: "ali", name: "Ali", role: "MEMBER" },
 { id: "ahmed", name: "Ahmed", role: "MEMBER" },
];
export const groups = [{ id: "flat", name: "Gulshan Flat 402" }, { id: "trip", name: "Weekend trip" }];
export const splitOptions = [{ value: "equal", label: "Equal" }, { value: "custom", label: "Custom" }];
export const rows = members.map((member, index) => ({ ...member, balance: [300000, 0, -300000][index] }));
export const demoImage = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="white"/><text x="40" y="90" font-size="24">SaathHisab sample receipt</text><text x="40" y="150" font-size="20">Grocery: Rs 6,000</text></svg>');
export const copy = {
 title: "Made for sharing.", subtitle: "A calm, consistent home for every shared expense.",
 eyebrow: "SAATHHISAB / DESIGN SYSTEM", sample: "Interactive sample data · Phase 1",
 sections: ["Overview", "Controls", "Overlays", "Data", "Layouts"],
 overview: "A little more clarity.", overviewText: "Reusable building blocks for balances, everyday expenses and the people you share them with.",
 controls: "Form controls", controlsText: "Accessible inputs with clear labels, helpful errors and predictable keyboard behavior.",
 overlays: "Actions & feedback", overlaysText: "Dialogs, menus and feedback that keep the next step clear.",
 data: "People & spending", dataText: "Consistent presentation for members, amounts and activity.",
 layouts: "Spaces that adapt", layoutsText: "Responsive shells and explicit loading, error and access states.",
 buttons: "Buttons", fields: "Inputs", selection: "Selection", dates: "Dates & search", money: "Amount in rupees",
 paisa: "Integer paisa", name: "Expense title", placeholder: "e.g. Weekly groceries", helper: "A short description helps everyone remember.",
 invalid: "Please enter a title.", password: "Password", notes: "Notes", notesHint: "Optional details", disabled: "Disabled", loading: "Loading",
 shapes: "Typography & layout", typography: "Clear type. Clear numbers.", body: "Shared costs, without the guesswork.", small: "Secondary context and helpful captions.",
 dialogs: "Dialogs & panels", modal: "Open modal", drawer: "Open drawer", confirm: "Confirm payment", confirmTitle: "Record this payment?",
 confirmMessage: "This is a playground preview. No payment will be saved.", confirmLabel: "Record payment", confirmation: "Payment preview confirmed.",
 failing: "Try failed action", failTitle: "Failure preview", failMessage: "This demonstrates an action that can be retried.", failError: "Demo failure. Your changes were not saved.",
 modalTitle: "A little more detail", modalText: "This dialog traps keyboard focus and returns it to its trigger when closed.",
 drawerTitle: "Expense details", menu: "Expense actions", menuTrigger: "Open menu", edit: "Edit preview", archive: "Archive preview",
 popover: "Why suggested payments?", popoverText: "Suggested payments help members settle their balances.", tooltip: "Helpful context",
 notices: "Notices", success: "Changes saved.", error: "Something needs attention.", warning: "Waiting for confirmation.", info: "Only confirmed payments affect balances.",
 successToast: "Success toast", errorToast: "Error toast", infoToast: "Info toast", toastMessage: "This is an example notification.",
 badges: "Statuses & identities", metrics: "Balance summary", total: "Group spending", paid: "You paid", share: "Your share", monthHint: "October · sample data",
 table: "Member balances", member: "Member", balance: "Balance", empty: "No expenses yet", emptyHint: "Your first shared expense will appear here.",
 action: "Add an expense", errorState: "Could not load expenses.", retry: "Retry preview", retried: "Retry requested",
 loadingStates: "Loading states", chart: "Spending by category", chartEmpty: "An empty chart", chartLabel: "Grocery spending",
 activity: "Recent activity", activityText: "Zeeshan added Monthly Grocery.", filters: "Find an expense",
 copy: "Invite link", inviteValue: "https://example.com/join/sample", upload: "Receipt images", image: "View sample receipt",
 auth: "Auth layout", authTitle: "Welcome back", authButton: "Sign in preview", groups: "Group layout", groupContent: "Group content goes here.",
 guards: "Route boundaries", allowed: "Member content is visible.", loadingGuard: "Checking session", deniedGuard: "Access denied",
 nav: "Sidebar and bottom navigation are shown by this playground's AppShell.", tokenNote: "Light and dark themes use the same semantic tokens.",
 savedQuery: "Debounced query", result: "Last action", noAction: "None yet", tabOne: "Suggested", tabTwo: "Pending", tabThree: "History",
};
