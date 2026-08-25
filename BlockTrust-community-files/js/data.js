// ============================================================
// BLOCKTRUST — SEED DATA & DATA LAYER
// ============================================================

const HOODS = [
  'Maplewood', 'Oakwood', 'Riverside', 'Hillcrest', 'Downtown',
  'Sunset Hills', 'Cedar Park', 'Brookside'
];

const CATEGORIES = [
  { id: 'all',      label: 'All',          icon: 'fa-th-large' },
  { id: 'urgent',   label: 'Urgent',       icon: 'fa-exclamation-triangle' },
  { id: 'lost',     label: 'Lost Pets',    icon: 'fa-paw' },
  { id: 'found',    label: 'Found',        icon: 'fa-search' },
  { id: 'services', label: 'Local Pros',   icon: 'fa-tools' },
  { id: 'events',   label: 'Events',       icon: 'fa-calendar-alt' },
  { id: 'news',     label: 'News',         icon: 'fa-newspaper' },
  { id: 'recommend',label: 'Recommend',    icon: 'fa-thumbs-up' },
];

const CAT_META = {
  urgent:    { icon: 'fa-exclamation-triangle', emoji: '🚨', label: 'Urgent' },
  lost:      { icon: 'fa-paw',                  emoji: '🐾', label: 'Lost Pet' },
  found:     { icon: 'fa-search',               emoji: '🔍', label: 'Found' },
  services:  { icon: 'fa-tools',                emoji: '🛠️', label: 'Local Pro' },
  events:    { icon: 'fa-calendar-alt',         emoji: '🎉', label: 'Event' },
  news:      { icon: 'fa-newspaper',            emoji: '📰', label: 'News' },
  recommend: { icon: 'fa-thumbs-up',            emoji: '⭐', label: 'Recommend' },
};

const PROS = [
  { id:'p1', name:'Robert Chen',     trade:'Handyman & Repairs',  initials:'RC', g:'g5', rating:4.9, reviews:127, tags:['Licensed','Background-checked','Same-day'], hood:'Riverside' },
  { id:'p2', name:'Maria Santos',    trade:'Licensed Plumber',   initials:'MS', g:'g4', rating:4.8, reviews:94,  tags:['Licensed','Emergency'],          hood:'Maplewood' },
  { id:'p3', name:'David Okonkwo',   trade:'Electrician',         initials:'DO', g:'g2', rating:5.0, reviews:211, tags:['Licensed','Insured','24/7'],     hood:'Downtown' },
  { id:'p4', name:'Emily Carter',    trade:'Landscape & Garden',   initials:'EC', g:'g8', rating:4.7, reviews:68,  tags:['Insured','Free estimate'],       hood:'Cedar Park' },
  { id:'p5', name:'James Patel',     trade:'Roofing & Gutters',    initials:'JP', g:'g6', rating:4.9, reviews:153, tags:['Licensed','Insured'],            hood:'Hillcrest' },
  { id:'p6', name:'Sophia Lin',      trade:'House Cleaning',       initials:'SL', g:'g7', rating:4.8, reviews:189, tags:['Background-checked','Eco'],      hood:'Brookside' },
];

const EVENTS = [
  { id:'e1', month:'SEP', date:'14', title:'Hillcrest Block Party', time:'4:00 PM – 9:00 PM', loc:'Maple Street, Hillcrest', going:42, host:'Laura Nguyen' },
  { id:'e2', month:'SEP', date:'18', title:'Community Center Town Hall', time:'7:00 PM', loc:'Central Library, Downtown', going:128, host:'City of Brookside' },
  { id:'e3', month:'SEP', date:'21', title:'Neighborhood Cleanup Day', time:'9:00 AM – 12:00 PM', loc:'Cedar Park Pavilion', going:57, host:'Green Team' },
  { id:'e4', month:'OCT', date:'05', title:'Fall Farmers Market Opening', time:'8:00 AM – 1:00 PM', loc:'Riverside Square', going:230, host:'Riverside Association' },
  { id:'e5', month:'OCT', date:'12', title:'Pet Adoption & Vaccine Clinic', time:'10:00 AM – 3:00 PM', loc:'Brookside Community Hall', going:88, host:'Paws & Partners' },
];

const NOTIFICATIONS_SEED = [
  { id:'n1', type:'urgent', title:'Urgent alert near you', text:'Jessica posted a lost pet alert in Maplewood — 0.4 mi away.', time:'12m ago', unread:true },
  { id:'n2', type:'reply',  title:'New comment on your post', text:'Mike replied: "I think I saw Bailey near the park!"', time:'35m ago', unread:true },
  { id:'n3', type:'found',  title:'Good news 🎉', text:'The brown terrier you reported has been reunited with its owner.', time:'2h ago', unread:true },
  { id:'n4', type:'event',  title:'Event reminder', text:'Hillcrest Block Party is this Saturday at 4 PM.', time:'5h ago', unread:false },
  { id:'n5', type:'pro',    title:'New verified pro', text:'David Okonkwo (Electrician) is now verified in Downtown.', time:'1d ago', unread:false },
  { id:'n6', type:'reply',  title:'2 new comments', text:'Neighbors are discussing the new community center.', time:'1d ago', unread:false },
];

// ---- Seed posts (rendered into feed) ----
const SEED_POSTS = [
  {
    id:'post-1', author:'BlockTrust Team', initials:'BT', avatarG:'g1', role:'official',
    hood:'All Neighborhoods', time:'1h ago', timestamp: Date.now()-3600000,
    title:'Welcome to BlockTrust — Your Trusted Neighborhood Hub',
    content:'Thanks for joining! BlockTrust is a free-speech community where neighbors connect, share alerts, find trusted local pros, and support each other. Post your first message, say hi, or report something happening on your block.',
    category:'news', tags:['Welcome','#NewHere'], likes:184, comments:12, saved:false, liked:false,
    commentList:[
      { user:'Tom B.', initials:'TB', g:'g4', text:'Glad this exists! Way better than the other apps.', time:'45m ago' },
      { user:'Priya S.', initials:'PS', g:'g7', text:'Excited to connect with neighbors 🙌', time:'22m ago' },
    ]
  },
  {
    id:'post-2', author:'Jessica Morales', initials:'JM', avatarG:'g5', role:'urgent',
    hood:'Maplewood', time:'3h ago', timestamp: Date.now()-10800000,
    title:'Lost: Golden Retriever — "Bailey" 🐾',
    content:'Bailey slipped out of our yard near 4th & Oak around 2 PM. Friendly, wearing a red collar with tags. Family is heartbroken. Please call or message if you see him!',
    category:'urgent lost', tags:['#LostDog','#GoldenRetriever'], likes:96, comments:23, saved:false, liked:false,
    reward: 250, boosted:true, image:'🐕', imageBg:'urgent-bg',
    commentList:[
      { user:'Mike R.', initials:'MR', g:'g8', text:'I think I saw a golden retriever near the creek trail about an hour ago!', time:'2h ago' },
      { user:'Karen L.', initials:'KL', g:'g3', text:'Sharing to my group chat now. Praying for Bailey 🙏', time:'1h ago' },
    ]
  },
  {
    id:'post-3', author:'Mike Reynolds', initials:'MR', avatarG:'g8', role:'found',
    hood:'Oakwood', time:'1h ago', timestamp: Date.now()-3600000,
    title:'Found: Small Brown Terrier Mix 🐕',
    content:'Found this sweet pup wandering near Oakwood Park. No collar, but very friendly. Currently safe at my place with food and water. DM if this is yours or know the owner!',
    category:'found', tags:['#FoundDog','#Oakwood'], likes:54, comments:8, saved:false, liked:false,
    image:'🐶', imageBg:'found-bg',
    commentList:[
      { user:'Anna K.', initials:'AK', g:'g2', text:'Have you taken it to the vet to check for a microchip?', time:'40m ago' },
    ]
  },
  {
    id:'post-4', author:'Robert Chen', initials:'RC', avatarG:'g5', role:'pro',
    hood:'Riverside', time:'4h ago', timestamp: Date.now()-14400000,
    title:'Local Handyman — Trusted by 127 Neighbors 🛠️',
    content:'Licensed, background-checked, and proud to serve our community. Drywall, fixtures, mounting, minor electrical, furniture assembly. Free estimates for BlockTrust neighbors!',
    category:'services', tags:['#Handyman','#Riverside'], likes:71, comments:14, saved:false, liked:false,
    commentList:[
      { user:'Greg M.', initials:'GM', g:'g6', text:'Robert fixed my leaky faucet last week — fast and fair price. Recommend!', time:'3h ago' },
      { user:'Lisa T.', initials:'LT', g:'g7', text:'Do you do weekend calls?', time:'2h ago' },
    ]
  },
  {
    id:'post-5', author:'Laura Nguyen', initials:'LN', avatarG:'g4', role:'event',
    hood:'Hillcrest', time:'5h ago', timestamp: Date.now()-18000000,
    title:'Hillcrest Block Party — This Saturday 🎉',
    content:'Annual block party this Saturday, 4 PM–9 PM on Maple Street! Live music, BBQ, kids activities, and a neighbor bake-off. Everyone welcome — bring a dish to share!',
    category:'events', tags:['#BlockParty','#Hillcrest'], likes:142, comments:18, saved:false, liked:false,
    image:'🎊', imageBg:'event-bg',
    commentList:[
      { user:'Bob W.', initials:'BW', g:'g1', text:'We\'ll bring the speakers and playlist!', time:'4h ago' },
      { user:'Dana F.', initials:'DF', g:'g3', text:'Bake-off count me in — my brownies are legendary.', time:'3h ago' },
    ]
  },
  {
    id:'post-6', author:'Jane Miller', initials:'JM2', avatarG:'g3', role:'moderator',
    hood:'Downtown', time:'6h ago', timestamp: Date.now()-21600000,
    title:'New Community Center — Share Your Ideas 📰',
    content:'The city is planning a new community center on 5th and Main. Public meeting this Thursday at 7 PM at the library. Your voice matters — come share what amenities you want!',
    category:'news', tags:['#Community','#Downtown'], likes:88, comments:27, saved:false, liked:false,
    commentList:[
      { user:'Sam P.', initials:'SP', g:'g2', text:'A makerspace and teen room would be huge for the area.', time:'5h ago' },
      { user:'Renee V.', initials:'RV', g:'g8', text:'Affordable childcare space please!', time:'4h ago' },
    ]
  },
  {
    id:'post-7', author:'Tom Becker', initials:'TB', avatarG:'g6', role:'user',
    hood:'Sunset Hills', time:'8h ago', timestamp: Date.now()-28800000,
    title:'Recommend: Best pizza spot on the block? 🍕',
    content:'New to Sunset Hills and looking for the best local pizza. Sit-down, not a chain. What does the neighborhood swear by?',
    category:'recommend', tags:['#Food','#SunsetHills'], likes:39, comments:31, saved:false, liked:false,
    commentList:[
      { user:'Nina O.', initials:'NO', g:'g7', text:'Nonna\'s on 3rd. End of discussion.', time:'7h ago' },
      { user:'Carl D.', initials:'CD', g:'g5', text:'Sal\'s slice shop is a hidden gem, cash only though.', time:'6h ago' },
    ]
  },
  {
    id:'post-8', author:'Diana Wells', initials:'DW', avatarG:'g7', role:'urgent',
    hood:'Cedar Park', time:'2h ago', timestamp: Date.now()-7200000,
    title:'⚠️ Suspicious car circling Cedar Park at night',
    content:'A dark sedan has been slowly circling Cedar Park the last two nights around 11 PM, headlights off. Neighbors — keep porch lights on and report anything to non-emergency line. Stay safe.',
    category:'urgent news', tags:['#Safety','#CedarPark'], likes:203, comments:44, saved:false, liked:false, boosted:true,
    commentList:[
      { user:'Mark S.', initials:'MS', g:'g2', text:'Saw it too. Got a partial plate — DM me.', time:'1h ago' },
      { user:'Olivia R.', initials:'OR', g:'g4', text:'Reported to non-emergency, they\'re sending a patrol.', time:'45m ago' },
    ]
  },
  {
    id:'post-9', author:'Maria Santos', initials:'MS', avatarG:'g4', role:'pro',
    hood:'Maplewood', time:'10h ago', timestamp: Date.now()-36000000,
    title:'Licensed Plumber — Emergency & Same-Day 🔧',
    content:'Local, licensed, and insured. Burst pipe? Water heater? Drain backup? I\'m available 7 days and offer neighbor discounts. Mention BlockTrust for $25 off your first service.',
    category:'services', tags:['#Plumber','#Emergency'], likes:62, comments:9, saved:false, liked:false,
    commentList:[]
  },
  {
    id:'post-10', author:'Green Team', initials:'GT', avatarG:'g8', role:'event',
    hood:'Cedar Park', time:'1d ago', timestamp: Date.now()-86400000,
    title:'🌳 Neighborhood Cleanup Day — Sept 21',
    content:'Join us Sept 21, 9 AM–12 PM at Cedar Park Pavilion. Gloves, bags, and coffee provided. Let\'s keep our neighborhood beautiful! Sign up in comments.',
    category:'events', tags:['#Cleanup','#Volunteer'], likes:117, comments:22, saved:false, liked:false,
    commentList:[
      { user:'Pat K.', initials:'PK', g:'g3', text:'Family of 4 in!', time:'20h ago' },
    ]
  },
  {
    id:'post-11', author:'Priya Sharma', initials:'PS', avatarG:'g7', role:'user',
    hood:'Brookside', time:'14h ago', timestamp: Date.now()-50400000,
    title:'Free: Kids bike (12"), good condition 🚲',
    content:'My daughter outgrew it. Pink, training wheels included, works great. Free to a good home — first to comment picks up in Brookside. 🙌',
    category:'news', tags:['#Free','#Brookside'], likes:48, comments:11, saved:false, liked:false,
    commentList:[]
  },
  {
    id:'post-12', author:'Officer Reyes', initials:'OR', avatarG:'g2', role:'official',
    hood:'All Neighborhoods', time:'1d ago', timestamp: Date.now()-90000000,
    title:'🐾 Free Pet Vaccination Clinic — Oct 12',
    content:'Paws & Partners is hosting a free vaccination & microchip clinic Oct 12, 10 AM–3 PM at Brookside Community Hall. Rabies, distemper, and microchipping at no cost. First come, first served.',
    category:'events news', tags:['#Pets','#Free','#Health'], likes:261, comments:33, saved:false, liked:false,
    commentList:[]
  },
];

// Exposed on window for non-module usage
window.BT_DATA = { HOODS, CATEGORIES, CAT_META, PROS, EVENTS, NOTIFICATIONS_SEED, SEED_POSTS };
