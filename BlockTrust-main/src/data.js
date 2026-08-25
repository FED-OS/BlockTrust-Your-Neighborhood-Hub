// ============================================================
// BLOCKTRUST — SEED DATA
// Initial posts, neighborhoods, and sample users.
// In a real deployment this would come from Supabase; here it
// is the local fallback so the app works fully offline.
// ============================================================

const SEED_USERS = {
  bt:   { id: "bt",   name: "BlockTrust Team", initials: "BT", role: "official",   neighborhood: "All Neighborhoods", verified: true },
  jess: { id: "jess", name: "Jessica Morales", initials: "JM", role: "member",     neighborhood: "Maplewood",        verified: false },
  mike: { id: "mike", name: "Mike Reynolds",   initials: "MR", role: "member",     neighborhood: "Oakwood",          verified: false },
  rob:  { id: "rob",  name: "Robert Chen",     initials: "RC", role: "verified_pro", neighborhood: "Riverside",      verified: true },
  laura:{ id: "laura",name: "Laura Nguyen",    initials: "LN", role: "member",     neighborhood: "Hillcrest",        verified: false },
  jane: { id: "jane", name: "Jane Miller",     initials: "JM", role: "moderator",  neighborhood: "Downtown",         verified: true },
};

// "me" — the current local user. Editable via Profile tab.
const DEFAULT_ME = {
  id: "me",
  name: "You",
  initials: "Y",
  role: "member",
  neighborhood: "Your Neighborhood",
  verified: false,
  bio: "New to BlockTrust. Love this neighborhood!",
  joined: Date.now(),
};

const SEED_POSTS = [
  {
    id: "p1",
    userId: "bt",
    category: "news",
    title: "Welcome to BlockTrust – Your Trusted Neighborhood Hub",
    content: "We built BlockTrust to help neighbors connect, share, and support each other. Whether you've lost a pet, need a reliable handyman, or want to know what's happening in your area, this is the place.\n\nWhat makes BlockTrust different?\n• Trust matters – we verify local pros so you can hire with confidence.\n• Urgent alerts – if your pet is missing, your neighbors know immediately.\n• No spam – just real posts from real neighbors.",
    location: "All Locations",
    tags: ["BlockTrust", "Community"],
    boosted: true,
    urgent: false,
    reward: 0,
    image: null,
    likes: 34,
    liked: false,
    createdAt: Date.now() - 3600000, // 1h ago
    comments: [
      { id: "c1", userId: "jess", text: "Love this! Exactly what our neighborhood needed.", createdAt: Date.now() - 3000000 },
      { id: "c2", userId: "rob",  text: "Proud to be a verified pro here.", createdAt: Date.now() - 2400000 },
    ],
  },
  {
    id: "p2",
    userId: "jess",
    category: "urgent",
    title: "Lost: Golden Retriever – \"Bailey\"",
    content: "Bailey ran out the back gate this morning around 9am. She's a 3-year-old Golden Retriever, very friendly, wearing a red collar. Last seen near Elm St & Oak Ave.\n\nREWARD: $100 – If you find her, the reward is yours.",
    location: "Maplewood",
    tags: ["LostDog"],
    boosted: true,
    urgent: true,
    reward: 100,
    rewardStatus: "open", // open | claimed | released
    image: null,
    likes: 47,
    liked: false,
    createdAt: Date.now() - 10800000, // 3h ago
    comments: [
      { id: "c3", userId: "mike", text: "I'll keep an eye out walking through Oakwood today.", createdAt: Date.now() - 9000000 },
      { id: "c4", userId: "laura",text: "Sharing on the Hillcrest group chat now!", createdAt: Date.now() - 7200000 },
    ],
  },
  {
    id: "p3",
    userId: "mike",
    category: "lost",
    title: "Found: Small Brown Terrier Mix",
    content: "Found this sweet little guy wandering around Chestnut Park this morning. No collar, very friendly. If this is your dog, please reach out.",
    location: "Oakwood",
    tags: ["FoundDog"],
    boosted: false,
    urgent: false,
    reward: 0,
    image: null,
    likes: 18,
    liked: false,
    createdAt: Date.now() - 3600000, // 1h ago
    comments: [
      { id: "c5", userId: "jess", text: "Could this be Bailey?? Message me!", createdAt: Date.now() - 3000000 },
    ],
  },
  {
    id: "p4",
    userId: "rob",
    category: "services",
    title: "Local Handyman – Trusted by Neighbors",
    content: "Licensed handyman with over 10 years of experience. Free estimates – message me anytime.\n\n🔹 Plumbing & electrical\n🔹 Drywall & painting\n🔹 General maintenance",
    location: "Riverside",
    tags: ["Handyman", "Verified"],
    boosted: false,
    urgent: false,
    reward: 0,
    image: null,
    likes: 27,
    liked: false,
    createdAt: Date.now() - 14400000, // 4h ago
    comments: [
      { id: "c6", userId: "jane", text: "Robert fixed our kitchen sink — highly recommend.", createdAt: Date.now() - 12000000 },
    ],
  },
  {
    id: "p5",
    userId: "laura",
    category: "events",
    title: "Hillcrest Block Party – This Saturday",
    content: "Annual block party this Saturday, 4pm–9pm on Maple Street! 🎶 Live music, 🌽 BBQ, 🎨 kids activities. Everyone welcome.",
    location: "Hillcrest",
    tags: ["BlockParty"],
    boosted: false,
    urgent: false,
    reward: 0,
    image: null,
    likes: 42,
    liked: false,
    createdAt: Date.now() - 18000000, // 5h ago
    comments: [
      { id: "c7", userId: "mike", text: "Will there be a vegan option? 🌱", createdAt: Date.now() - 16000000 },
      { id: "c8", userId: "laura",text: "Yes! We'll have veggie burgers too.", createdAt: Date.now() - 15000000 },
    ],
  },
  {
    id: "p6",
    userId: "jane",
    category: "news",
    title: "New Community Center – Share Your Ideas",
    content: "The city is planning a new community center on 5th and Main. Public meeting this Thursday at 7pm at the library. Your voice matters.",
    location: "Downtown",
    tags: ["Community"],
    boosted: false,
    urgent: false,
    reward: 0,
    image: null,
    likes: 33,
    liked: false,
    createdAt: Date.now() - 21600000, // 6h ago
    comments: [
      { id: "c9", userId: "bt",  text: "We'll be there. Great initiative!", createdAt: Date.now() - 20000000 },
    ],
  },
];

const CATEGORIES = [
  { id: "all",       label: "All",         icon: "fa-home" },
  { id: "urgent",    label: "Urgent",      icon: "fa-exclamation-triangle", urgent: true },
  { id: "lost",      label: "Lost & Found",icon: "fa-paw" },
  { id: "services",  label: "Services",    icon: "fa-tools" },
  { id: "events",    label: "Events",      icon: "fa-calendar-alt" },
  { id: "questions", label: "Questions",   icon: "fa-question-circle" },
  { id: "news",      label: "News",        icon: "fa-newspaper" },
];

const ROLE_BADGES = {
  official:     { label: "Official",     icon: "fa-check-circle",   cls: "badge-official" },
  moderator:    { label: "Moderator",    icon: "fa-gavel",          cls: "badge-moderator" },
  verified_pro: { label: "Verified Pro", icon: "fa-shield-alt",     cls: "badge-verified" },
  member:       { label: "",             icon: "",                  cls: "" },
};

const NEIGHBORHOODS = [
  "Your Neighborhood", "Maplewood", "Oakwood", "Riverside",
  "Hillcrest", "Downtown", "Cedar Hills", "Sunset Park", "Brookside", "Eastgate",
];
