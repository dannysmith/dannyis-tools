// The reading order for the studding sails page. Same format as story.js:
// chapters of steps, each step a line of a sail or a piece of prose, with the
// pinned drawing following whichever is being read.

(function () {
  const { SAILS, MASTS } = window.RIGDATA;
  const LS = 'fore-lower-studding-sail', TS = 'fore-topmast-studding-sail', TG = 'fore-topgallant-studding-sail';
  const MTS = 'main-topmast-studding-sail', MTG = 'main-topgallant-studding-sail';
  const byId = (id) => SAILS.find((s) => s.id === id);
  const lines = (sail, ...ids) => ids.map((id) => [sail, id]);

  // All three fore studding sails at once, for the opening chapter. It has no
  // lines of its own and exists only on this page.
  const three = [LS, TS, TG].map(byId);
  const m = MASTS.fore;
  SAILS.push({
    id: 'fore-studding-sails',
    mast: 'fore',
    title: 'The fore studding sails',
    views: ['aft'],
    aftBox: [-(m.yardHalf + 3), -(m.tgHoundZ + 7), m.yardHalf + 3 + 77, m.tgHoundZ + 7],
    cloth: three.flatMap((s) => s.cloth.slice(0, 1)).concat(three.flatMap((s) => s.cloth.slice(1))),
    spars: three.flatMap((s) => s.spars),
    lines: [],
    start: null,
  });
  const ALL = 'fore-studding-sails';
  const SAIL_GEAR = lines(LS, 'outer-halliards', 'inner-halliards', 'tack', 'sheets')
    .concat(lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler'), lines(TG, 'halliards', 'tack', 'sheets'));

  const order = (words, who) => `<p class="order"><b>${words}</b><span>${who}</span></p>`;
  const TOTTEN = 'Totten, US Navy, 1862';
  const NARES = 'Nares, Royal Navy, 1860s';
  const LUCE = 'Luce, US Navy, 1877 printing';

  // Seen from above: the weather studding sail lies abaft the topsail's edge,
  // the lee one before it.
  const WEATHER_LEE = `
    <svg class="sketch" viewBox="0 0 340 172" role="img" aria-label="Seen from above: the weather studding sail abaft the topsail, the lee one before it">
      <path class="sk-ship" d="M170 8 C 196 40 200 96 192 164 L 148 164 C 140 96 144 40 170 8 Z"/>
      <line class="sk-yard" x1="92" y1="92" x2="248" y2="92"/>
      <line class="sk-sail" x1="100" y1="84" x2="240" y2="84"/>
      <line class="sk-stun" x1="226" y1="89" x2="306" y2="80"/>
      <line class="sk-stun" x1="34" y1="72" x2="114" y2="79"/>
      <line class="sk-wind" x1="318" y1="160" x2="262" y2="118"/>
      <path class="sk-head" d="M262 118 l 12 3 l -6 8 z"/>
      <text x="322" y="150" text-anchor="end" dy="18">wind</text>
      <text x="170" y="60" text-anchor="middle">topsail</text>
      <text x="306" y="70" text-anchor="end">weather: abaft it</text>
      <text x="34" y="62">lee: before it</text>
      <text x="170" y="24" text-anchor="middle" dy="14">bow</text>
    </svg>`;

  window.RIGDATA.STORY = [
    {
      id: 'what',
      title: 'A sail hung outside a sail',
      sail: ALL,
      intro: `
        <p>A square sail can be no wider than its yard. In a light, steady wind from abaft the beam a ship can carry more canvas than her yards will spread, and the way to get it is to hang another sail outside the end of each yard. Falconer calls them “certain light sails extended, in moderate and steady breezes, beyond the skirts of the principal sails, where they appear as wings upon the yard-arms”. Steel says when: “These sails are set in favourable winds and moderate weather, or in chacing.”</p>
        <p>They are fiddly because nothing about them is permanent. The sails are kept below or in the tops, the booms are lashed along the yards, and most of the ropes are not even rove until the order comes. This page takes them in the order they have to be understood: what they are, the booms that spread them, then each sail’s ropes, then the business of setting one and getting it in again.</p>
        <p>The drawings show the starboard side, with the wind on the starboard quarter, so these are the weather studding sails.</p>`,
      groups: [
        {
          title: 'Three sails, each hung from the yard above',
          rest: SAIL_GEAR,
          steps: [
            {
              html: `
                <h4>The head goes up to a yardarm and the foot goes out on a boom</h4>
                <p>Every studding sail is built the same way. Its head is bent to a short yard of its own. A halliard hoists that yard to the very end of a yard of the ship. Its foot is spread outwards by a boom.</p>
                <p>The three in the drawing are the fore lower, fore topmast and fore topgallant studding sails. They “derive their Names from the Masts to which they belong. Thus the lower Studding Sails from the lower Masts, the Top-mast Studding Sails from the Topmasts, and the Top-Gallant Studding Sails from the Top-Gallant Masts” (Lever). So the topmast studding sail is the one beside the topsail.</p>`,
            },
            {
              html: `
                <h4>A 74 of 1805 carried ten</h4>
                <p>Lower, topmast and topgallant on the foremast; topmast and topgallant on the mainmast; each on both sides. There are none on the mizen.</p>
                <p>Steel in 1794 also rigs a main lower studding sail, which makes twelve. James Lees dates its end to an Admiralty order of 1801, after which “the main stunsail was no longer issued”. I have that from Lees at second hand, not from the order. The topgallant studding sails were the newest of the set; Lees puts their introduction at about 1773.</p>`,
            },
            {
              html: `
                <h4>They are not all the same shape</h4>
                <p>“The lower studding sails are square at the Head, Foot and Leech” (Lever). The topmast and topgallant studding sails are gored: wider at the foot than the head, with the outer edge sloping, because the yard below is longer than the yard above and the sail has to fit between a short spar at the top and a boom end a long way out at the bottom.</p>
                <p>The topmast studding sail “has sometimes a Reef-band in it”. Steel puts it an eighth of the way down, so the sail can still be set when the topsail beside it has a reef in.</p>`,
            },
            {
              html: `
                <h4>A note on the word</h4>
                <p>Steel, Lever, Falconer and Moore print “studding sail”, “studding-sail” or “studdingsail”. The contraction “stun’-sail” is in the later manuals, and Lees writes “stunsail” throughout. Nothing I read from before 1815 spells it short, though no doubt it was said that way. The Americans also called them steering sails.</p>`,
            },
          ],
        },
        {
          title: 'When they are set',
          rest: SAIL_GEAR,
          steps: [
            {
              html: `
                <h4>With the wind free, and steady</h4>
                <p>Lever’s ship runs out her booms when the wind has come round to one point abaft the beam. The later manuals put numbers on it. Totten (US Navy, 1862): the topmast and topgallant studding sails “may be set with the wind one point free”, but “the lower studding-sail can only be used to advantage with the wind abaft the beam”.</p>
                <p>With the wind on one side they are set on that side only, the weather side. With the wind right aft and the yards square they go on both sides.</p>
                <p>The usual order is topgallant or topmast studding sail first and the lower one last, and they come in the other way round, with the royals and topgallant studding sails first.</p>`,
            },
            {
              html: `
                <h4>The weather one goes abaft the topsail, the lee one before it</h4>
                <p>The inner edge of a studding sail overlaps the edge of the square sail beside it. Which is in front depends on the side.</p>
                ${WEATHER_LEE}
                <p>Lever: “A Topmast Studding Sail is set abaft the Topsail when to windward, and before it when to leeward; because to windward the outer Yard Arm must incline rather forwards, to make the Sail stand fair; which could not be the case if the Sail were set before the Topsail, for the pressure of the inner Yard Arm would prevent it, and might injure the Topsail.”</p>
                <p>Put simply: the wind should press the studding sail away from the topsail’s edge, not into it. The passage is damaged in the scan of the 1819 text that I read; the research notes completed it from the 1843 edition, where the wording is the same. Dana (1841, American merchant service) gives the same rule.</p>`,
            },
            {
              html: `
                <h4>They come in before the ship does anything else</h4>
                <p>Steel, on working ships: “If you have studding sails set, they must be hauled down, particularly the lower ones; because, should the wind take them a-back, their power on the boom might bring the ship round entirely.” A studding sail is a long way from the mast and has a long lever on the ship. Before tacking, or coming to the wind, or when it freshens, they are taken in.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'booms',
      title: 'Three booms, on three different things',
      sail: TS,
      intro: `
        <p>The booms are where most of the confusion starts. There are three, they are rigged in three different ways, and each is named for the sail whose foot it spreads, not for where it lives.</p>
        <p>The topmast studding sail boom slides out along the lower yard. The topgallant studding sail boom slides out along the topsail yard. The lower studding sail boom is not on a yard at all: it hooks to the ship’s side.</p>`,
      groups: [
        {
          title: 'The topmast studding sail boom, on the lower yard',
          intro: 'This is the one that matters most, because two sails depend on it. On Steel’s 74 the fore one is 42 feet 6 inches long, half the length of the fore yard it lies on, and 8½ inches thick.',
          rest: lines(TS, 'boom-tackle', 'heel-lashing', 'boom-topping-lift', 'boom-brace', 'yard-burton', 'tack'),
          steps: [
            { line: 'heel-lashing', title: 'Two iron rings and a lashing hold it on the yard' },
            { line: 'boom-tackle', title: 'A tackle runs it out' },
            {
              mark: lines(TS, 'tack', 'boom-topping-lift', 'boom-brace').concat(lines(LS, 'outer-halliards')),
              rest: lines(TS, 'tack', 'boom-topping-lift', 'boom-brace', 'heel-lashing').concat(lines(LS, 'outer-halliards')),
              html: `
                <h4>Four things go on its end before it is run out</h4>
                <p>Once the boom is out, its end is beyond anyone’s reach. So everything that has to be at the end is put there first, while the end is still at the yardarm. Lever lists them:</p>
                <p>A block on the upper side for the topmast studding sail’s tack. A block “hanging underneath, for the outer Halliards of the lower Studding Sail”. A pendent with a block in it for a brace. And a topping-lift pendent with a thimble. The ropes are rove through the blocks at the same time, so that each already runs out to the boom end and back.</p>`,
            },
            { line: 'boom-topping-lift' },
            { line: 'boom-brace' },
            { line: 'yard-burton', title: 'And the topsail yard needs holding up too' },
          ],
        },
        {
          title: 'The topgallant studding sail boom, on the topsail yard',
          intro: 'The same idea a size smaller: 31 feet long on the fore topsail yard, and 6¼ inches thick. It is light enough for the men on the yard to handle.',
          steps: [{ sail: TG, line: 'heel-lashing', title: 'Run out by hand and lashed' }],
        },
        {
          title: 'The lower studding sail boom, at the ship’s side',
          intro: 'The longest of the three, 53 feet 9 inches and 10¾ inches thick. The fore yard already carries a boom for the sail above, and there is no yard below the course. So the foot of the lower studding sail is spread by a boom rigged out from the hull.',
          steps: [
            {
              sail: LS,
              mark: lines(LS, 'topping-lift', 'martingale'),
              html: `
                <h4>It hooks to the side by a goose-neck</h4>
                <p>The boom has “a large iron Hook, called a Goose Neck, driven into the inner End, which is hooked to an Eye-bolt in the side, between the fore Chains and the Cat-head” (Lever). Steel puts the eye-bolt “in the aftside of the cathead”. On that hook it can swing fore and aft and up and down.</p>
                <p>When it is not in use it lies alongside the ship, lashed in the fore chains. Rigged out, it stands square to the side, parallel to the fore yard, held in place by four ropes from its middle: one up, one down, one forward and one aft.</p>
                <p>Steel and Lever both call it the lower studding sail boom. “Swinging boom” is not in Steel, Lever, Falconer or Moore; it is in Dana in 1841 and in modern books.</p>`,
            },
            { sail: LS, line: 'topping-lift' },
            { sail: LS, line: 'fore-guy' },
            { sail: LS, line: 'after-guy' },
            { sail: LS, line: 'martingale' },
            {
              sail: LS,
              views: ['side', 'plan'],
              mark: lines(LS, 'topping-lift', 'fore-guy', 'after-guy'),
              html: `
                <h4>Three ropes swing it out and in</h4>
                <p>Out: “Hoist upon the Topping Lift, haul [out] the fore Guy, and ease the after one, when it will come across” (Lever).</p>
                <p>In: “The Boom is then swung fore and aft, by easing off the fore Guy, and hauling in upon the after one: it is then lashed in the Chains, the Geer coiled upon it, and secured. The Block is taken off the Spritsail Yard.”</p>
                <p>The deck plan cuts the boom off short of its end; the plan is drawn to the width of the yards.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'topmast',
      title: 'The topmast studding sail, rope by rope',
      sail: TS,
      intro: `
        <p>This is the studding sail that was set most, and the one to learn. It has five ropes. One holds it up, two hold its lower corners out, and two exist to get it down again.</p>`,
      groups: [
        {
          title: 'Holding it up',
          intro: 'The sail hangs from the end of the topsail yard by a single rope.',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler'),
          steps: [{ line: 'halliards' }],
        },
        {
          title: 'Spreading the foot',
          intro: 'The foot has two corners. The outer one is hauled out to the boom end by the tack. The inner one is held down to the lower yard by the yard sheet.',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler'),
          steps: [{ line: 'tack' }, { line: 'yard-sheet' }],
        },
        {
          title: 'Getting it down',
          intro: 'A sail that hangs from one rope at the end of a yard, well outside the ship, cannot simply be lowered. If the halliards are let go it streams out to leeward from the boom end. Two ropes are fitted to prevent that.',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler'),
          steps: [
            { line: 'downhauler', title: 'The downhauler folds the sail at the boom end' },
            { line: 'deck-sheet', title: 'The deck sheet brings it inboard' },
          ],
        },
        {
          title: 'What that adds up to',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler'),
          steps: [
            {
              views: ['side', 'plan'],
              mark: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler'),
              html: `
                <h4>It is set and taken in from the forecastle and the gangway</h4>
                <p>On the deck plan, the halliards come to the bitts abaft the foremast. The sheets come to the forecastle, where the sail is bent before it goes up and gathered in when it comes down. The tack and the downhauler go aft to the gangway, because they lead from the boom end and need to pull from abaft it.</p>
                <p>Only two of those points are named in the sources. The hollow markers are guesses.</p>
                <p>The plan is drawn to the width of the yards, so the boom end, 69 feet out, is off the bottom of it.</p>`,
            },
            {
              html: `
                <h4>Every rope is single</h4>
                <p>There is not a tackle in the sail’s own gear. The main topsail needs an eight-to-one purchase on its halliards and has sheets 8½ inches round. The studding sail’s halliards are 3½ inches and its downhauler 2. It is light canvas for light winds, and a few men can handle it.</p>
                <h4>The tack leads to the ship, and that is its weakness</h4>
                <p>The sheet goes to the yard, so it moves when the yard is braced. The tack goes to a timber-head at the gangway and does not. Brace the yard forward without easing the tack and the boom end is being pulled two ways. Lever’s remedy is in the notes under the tack.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'lower',
      title: 'The lower studding sail: two halliards and a boom of its own',
      sail: LS,
      intro: `
        <p>The lower studding sail is the biggest of the three and the last to be set. It hangs outside the foresail, between the end of the topmast studding sail boom above and its own boom below. The boom and its four ropes are in the part above; these are the ropes on the sail.</p>`,
      groups: [
        {
          title: 'Two sets of halliards',
          intro: 'The sail is square and wide. One halliard lifts its yard from outside. Another pulls the inner corner of the head towards the fore yard.',
          steps: [{ line: 'outer-halliards' }, { line: 'inner-halliards' }],
        },
        {
          title: 'The foot',
          intro: 'The same pair as on the topmast studding sail: a tack to the boom end, a sheet at the inner corner.',
          steps: [{ line: 'tack' }, { line: 'sheets' }],
        },
        {
          title: 'Setting it and taking it in',
          steps: [
            {
              mark: lines(LS, 'tack', 'outer-halliards', 'inner-halliards', 'sheets'),
              html: `
                <h4>Tack, outer halliards, inner halliards, sheet</h4>
                <p>With the boom out, the sail is brought on to the forecastle and its four ropes bent. Then, Lever: “First, haul out the Tack, then hoist up the Yard with the outer Halliards, and when they are belayed, hoist on the inner ones (which stretch the Head of the Sail), and haul taught the Sheet.”</p>
                <p>The first words are damaged in the scan I read and are given as the research notes have them.</p>
                <h4>Taking it in is the same list backwards, with one change</h4>
                <p>Steel: “To haul in a lower-studding sail, blowing fresh, lead one of the sheets clear aft, and man it well; then lower away briskly the outer haliards, to spill the sail; ease off the tack, run in upon the sheet, and lower away the inner haliards as required.”</p>
                <p>Lever agrees: “the Sheet is stretched aft, the outer Halliards are lowered, the Tack eased off, the Sail is gathered in on the Forecastle, and the inner Halliards lowered.”</p>
                <p>The order has a reason. Lowering the outer halliards first drops the outer half of the head and spills the wind. The inner halliards are kept fast to the end, holding the sail up clear of the sea until the sheet has dragged it in over the forecastle.</p>`,
            },
            {
              html: `
                <h4>The later manuals add a rope</h4>
                <p>Dana (1841) has a “clewline” and Nares (1860s) a “tripping line” on the lower studding sail, to haul the outer clew up to the yard before the sail is lowered. Steel and Lever do not mention one, and it is not drawn.</p>
                <h4>It could be set without a boom</h4>
                <p>“The lower Studding-sail is often set flying, that is, without a Boom” (Lever). The foot is then lashed to a small yard with a span, and a single guy from the span leads aft “through a block lashed to the main chains, comes in through a port, and belays round a cleat in the waist. The sail, thus rigged, has no tacks” (Steel). The drawings here show the boom.</p>
                <h4>The main lower studding sail</h4>
                <p>Until 1801 there was one on the mainmast as well. Its boom hooked “to an eye in the iron strap on the fore part of the main channel” and was lashed down to the chain-plates (Steel). It is not drawn.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'topgallant',
      title: 'The topgallant studding sail stops in the top',
      sail: TG,
      intro: `
        <p>The topgallant studding sail is the topmast studding sail made small enough for the topmen to manage on their own. Its ropes are 2 inches round or less. The sail lives in the top, made up in the topmast rigging, and almost none of its gear comes lower than that.</p>`,
      groups: [
        {
          title: 'Its ropes',
          intro: 'A halliard, a tack and a sheet, and sometimes a downhauler. Follow each to where it ends.',
          steps: [{ line: 'halliards' }, { line: 'tack' }, { line: 'sheets' }, { line: 'downhauler' }],
        },
        {
          title: 'Setting it and taking it in',
          steps: [
            {
              mark: lines(TG, 'halliards', 'tack', 'sheets'),
              html: `
                <h4>The topmen do all of it</h4>
                <p>Lever: the boom “is rigged out by Hand, by Men on the Topsail Yard”. The tack, already rove through the thimble at the boom end, is hauled into the top and bent to the sail there, with the halliards. “In large Ships the Sail is stopped”, that is, tied up to its yard with rope-yarns, and hoisted like that, and a man on the topsail yard “guys it abaft the Top Gallant Sail”, as the man on the fore yard does for the sail below.</p>
                <p>They are the first studding sails to come in, with the royals. They “are taken in by lowering the Halliards, hauling down upon the Sheet, and easing off the Tack: when in the Top, they are made up, the Booms run in and lashed to the Topsail Yards by the Heel lashing, or lowered down on Deck”.</p>
                <p>Totten, half a century on, adds a warning: ease the tack before lowering, and rouse the sail well abaft the topgallant sail, “or it will fly forward of the top-gallant sail”.</p>`,
            },
          ],
        },
        {
          title: 'The same sails on the mainmast',
          intro: 'The main topmast and topgallant studding sails are rigged like the fore ones. Lever: “The Main Top-mast, and Main Top-gallant Studding Sail Booms are rigged as the Fore ones.” What changes is where the tacks go, since there is more ship abaft the mainmast to lead them to.',
          steps: [
            { sail: MTS, line: 'tack', title: 'The main topmast studding sail tack goes to the quarter' },
            { sail: MTS, line: 'halliards', title: 'Its halliards: Steel names bitts that are on the forecastle' },
            { sail: MTG, line: 'tack', title: 'The main topgallant studding sail tack' },
          ],
        },
      ],
    },
    {
      id: 'setting',
      title: 'Setting a topmast studding sail, and taking it in',
      sail: TS,
      intro: `
        <p>Here is the whole evolution for the fore topmast studding sail on the weather side, in order. The actions are Lever’s (1808) and Steel’s (1794).</p>
        <p>The words of command are not. I found no orders for studding sails in any source from 1790 to 1815: Lever narrates what is done and Steel gives only the taking in. The orders below are from Totten and Luce (US Navy, 1862 and 1877) and Nares (Royal Navy, 1860s), and each is labelled. Their common core is a warning, then “Haul taut”, “Rig out”, “Hoist away”, and to take in “Lower away”, “Haul down”, “Rig in”. It is likely that the words of 1805 were close to these. It is not known.</p>`,
      groups: [
        {
          title: 'Getting ready',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler', 'boom-tackle', 'boom-topping-lift', 'yard-burton'),
          steps: [
            {
              mark: lines(TS, 'halliards', 'tack', 'yard-burton', 'boom-topping-lift'),
              html: `
                <h4>1. Reeve the gear and support the spars</h4>
                ${order('“Stand by to set the topmast studding-sail!”', TOTTEN)}
                ${order('“The starboard fore topmast, and the top-gallant studding sails ready for setting.” “Topmen aloft.”', NARES)}
                <p>The yards are already trimmed for a wind abaft the beam. Men go aloft and reeve the halliards “through the Span-Blocks at the Mast Heads, and through the Jewel Blocks at the Yard Arms”, and the tack “through the Block at the Boom End” (Lever).</p>
                <p>Two burtons are hooked on. One goes from the topmast cap to the topsail yard, the other to the topping-lift pendent on the boom. Nares has the same: “burtons on the topsail yards”.</p>`,
            },
            {
              mark: lines(TS, 'boom-tackle', 'heel-lashing'),
              html: `
                <h4>2. Rig out the boom</h4>
                ${order('“Haul taut! Rig out!”', 'Totten; Nares has “Haul taut”, “Rig out”; Luce “Set taut! Rig out!”')}
                <p>The heel lashing is cast off and the boom is launched out by its tackle. When it is out the heel is lashed to the yard again. In a small ship the yard sheet, made fast to the heel lashing, does the launching.</p>`,
            },
            {
              mark: lines(TS, 'halliards', 'tack', 'downhauler', 'deck-sheet'),
              html: `
                <h4>3. Bend the gear to the sail on the forecastle</h4>
                <p>The sail is brought up on the forecastle already bent to its yard. The ends of the ropes are waiting there. The halliards are bent to the yard a third of the way from its inner end, the tack to the outer clew and the sheet to the inner clew. The downhauler is rove “through the Block seized to the Tack Clew, through the Cringle, and bent to the outer Yard Arm” (Lever).</p>
                <p>The sail is made up along its yard and stopped with rope-yarns so that it goes up as a bundle. The halliards are also stopped out to the outer yardarm, which makes the yard go up end first instead of swinging across.</p>
                <p>The page of Lever that describes this is torn in the scan I read. The outline is from the research notes, which had the 1843 text beside it.</p>`,
            },
          ],
        },
        {
          title: 'Setting',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler', 'boom-brace'),
          steps: [
            {
              mark: lines(TS, 'halliards', 'yard-sheet'),
              html: `
                <h4>4. Hoist the bundle to the man on the fore yard</h4>
                ${order('“Trice to hand”', 'Nares, who splits the hoist in two')}
                <p>“The Halliards are hoisted on”, and the sail goes up until it reaches a man out on the fore yard. He bends the yard sheet “to the Thimble in the short Leg of the Sheet” and cuts the stops.</p>`,
            },
            {
              mark: lines(TS, 'tack'),
              html: `
                <h4>5. Haul out the tack</h4>
                <p>The tack is “hauled out to the Boom End” (Lever) before the sail is hoisted any further. Nares gives the rule and the reason: “The tack is hauled out first, as the sail then holding less wind brings less strain on the boom.”</p>`,
            },
            {
              mark: lines(TS, 'halliards'),
              html: `
                <h4>6. Hoist away</h4>
                ${order('“Hoist away!”', 'Totten, Luce and Nares')}
                <p>The yard goes up to the jewel block. As it goes, the man on the fore yard keeps the sail abaft the leech of the topsail, since this is the weather side.</p>`,
            },
            {
              mark: lines(TS, 'yard-sheet', 'boom-brace'),
              html: `
                <h4>7. Trim the yard sheet and the boom brace</h4>
                <p>The yard sheet is hauled to bring the inner clew down to the fore yard, and the boom brace is set taut. The sail is set.</p>
                <p>The later manuals add a last step: pass the downhauler and the deck sheet down clear, ready for taking in (Nares).</p>`,
            },
          ],
        },
        {
          title: 'Taking in',
          rest: lines(TS, 'halliards', 'tack', 'deck-sheet', 'yard-sheet', 'downhauler', 'boom-tackle', 'yard-burton'),
          steps: [
            {
              mark: lines(TS, 'deck-sheet', 'downhauler'),
              html: `
                <h4>1. Man the downhauler and the deck sheet</h4>
                ${order('“Stand by to take in the topmast studding-sail!”', TOTTEN)}
                <p>“A hand is sent on the Fore Yard to pass the Deck Sheet abaft the Yard: the Down-hauler is then manned” (Lever). Steel: “Man well the deck sheet and downhaul”.</p>
                <p>The sail is to come down abaft the yard, on the side away from the foresail. With the wind very far aft it is taken down before the yard instead, and both ropes are passed before it.</p>`,
            },
            {
              mark: lines(TS, 'halliards', 'yard-sheet', 'downhauler'),
              html: `
                <h4>2. Lower the halliards and haul the yard down to the boom end</h4>
                ${order('“Lower away!”', 'Totten: “Lower away, haul down, rig in!”')}
                <p>“The Halliards are lowered, the Yard Sheet eased, and the Down-hauler hauled on, till the Yard Arm comes down to the Tack Clew” (Lever). Steel: “ease off the yard sheet, and haul the yard close out to the tack block”.</p>
                <p>This is the step the downhauler is for. Follow it on the drawing: it is made fast at the outer end of the yard, runs down the outer edge of the sail through the thimble, and turns at the block on the tack clew. Shorten it and the outer yardarm has to travel down that edge to the clew. With the inner clew let go by the yard sheet, the whole sail ends up as a bundle hanging at the boom end, still held there by the tack. Dana calls this boom-ending the sail.</p>`,
            },
            {
              mark: lines(TS, 'tack', 'deck-sheet', 'downhauler'),
              html: `
                <h4>3. Ease the tack and haul down</h4>
                ${order('“Haul down!”', 'Totten')}
                <p>“The Tack is then eased off, and the Sail hauled down, gathering it on the Forecastle by the Deck Sheet” (Lever). Steel: “then ease away the tack; and haul down both upon the deck sheet and downhaul”.</p>
                <p>The tack is the last thing let go. Until then the bundle cannot blow away.</p>`,
            },
            {
              mark: lines(TS, 'boom-tackle', 'heel-lashing', 'halliards', 'yard-burton'),
              html: `
                <h4>4. Rig in and clear away</h4>
                ${order('“Rig in!” “Take the burton off the topsail yard!”', TOTTEN)}
                <p>“The Topmast Studding Sail Boom is rigged in; the Geer coiled, and stopped on the Yard Arm; the Halliards are unreeved from the Jewel Blocks, a Figure of Eight Knot cast on the end, and rounded up to the Span Block at the Topmast Cap … that they may not prevent the Topsail Yard’s coming down” (Lever).</p>
                <p>That last point matters. A topsail yard is lowered every time the sail is reefed, and a rope left through the jewel block at its end would foul it. So the studding sail’s gear is cleared off the yards as soon as the sail is in.</p>`,
            },
          ],
        },
        {
          title: 'The orders for the other two',
          intro: 'From the same later manuals, for comparison. None is from the period.',
          steps: [
            {
              sail: LS,
              mark: lines(LS, 'tack', 'outer-halliards', 'inner-halliards'),
              html: `
                <h4>Lower studding sail</h4>
                ${order('“Stand by to set the lower studding-sail!” “Hoist away, haul out!”', TOTTEN)}
                ${order('“Rig out!” “Haul taut! Hoist away, haul out!”', LUCE)}
                ${order('“Lower studding sail ready for setting.” “Haul taut.”', NARES)}
                <p>To take in:</p>
                ${order('“Stand by to take in the lower studding-sail!” “Clew up!” “Lower away, haul in!” “Lower away the inner halyards!”', TOTTEN)}
                ${order('“Ease away the outhaul! Clew up!” “Lower away, haul in!”', LUCE)}
                <p>“Haul out” is the tack, which the Americans call the outhaul. “Clew up” is the later clewline that Steel and Lever do not have. The inner halliards are still let go last, as in Steel.</p>`,
            },
            {
              sail: TG,
              mark: lines(TG, 'halliards', 'tack', 'sheets'),
              html: `
                <h4>Topgallant studding sail</h4>
                ${order('“Stand by to set the top-gallant studding-sail!” “Haul taut! Rig out! Hoist away!”', TOTTEN)}
                ${order('“Stand by to set the top-gallant stun’-sails!” “Haul taut! Rig out! Hoist away!”', LUCE)}
                <p>To take in:</p>
                ${order('“Stand by to take in the top-gallant studding-sail!” “Lower away! haul down! rig in!”', TOTTEN)}`,
            },
          ],
        },
      ],
    },
  ];
})();
