// The standing rigging, entered as "lines" so the shared drawings can show it.
// It is not a sail: the records below hang on pseudo-sails that differ only in
// how the view from astern is framed. A gang of like ropes (shrouds, bobstays)
// is drawn with `extra` polylines and described in `lead`. A single rope whose
// run is worth following (a stay, a backstay) has a numbered `path` from its
// masthead to where it sets up; its `belay` record says where that is.

(function () {
  const { MASTS, SAILS, shroudY } = window.RIGDATA;
  const fore = MASTS.fore, main = MASTS.main, mizen = MASTS.mizen;
  const ALL = [fore, main, mizen];

  // How many of each, and where they come down along the channel (feet abaft
  // the mast). The counts are Steel's deadeye counts; see the shrouds' notes.
  const RIG = {
    fore: { shrouds: 9, first: 1.8, gap: 1.25, topmast: 6, topgallant: 3, back: [12.9, 13.9, 14.9], tgBack: [16.3, 17.3] },
    main: { shrouds: 9, first: 2.4, gap: 1.75, topmast: 6, topgallant: 3, back: [19, 17.6, 20.4], tgBack: [22.2, 23.4] },
    mizen: { shrouds: 6, first: 1.8, gap: 1.5, topmast: 4, topgallant: 2, back: [10.6], tgBack: [12.2] },
  };

  const STEEL_TERMS = (word) => `X Steel 1794, rigging terms, ${word}|https://maritime.org/doc/steel/part6.htm`;
  const LEES = (pages) => `X Lees, The Masting and Rigging of English Ships of War (1979), ${pages}, seen as a snippet only`;
  const LEVER_APPENDIX = 'X Lever 1819, Appendix|https://archive.org/details/youngseaofficers00leve_0';
  const LONGRIDGE = 'X Longridge, The Anatomy of Nelson’s Ships (1955), seen in snippets only';

  const range = (n) => Array.from({ length: n }, (_, i) => i);
  // Half-breadth of the hull at this mast, z feet above the water.
  function hullY(m, z) {
    const k = m.hullScale;
    const side = [[0, 24.3 * k], [6, 24.7 * k], [12, 23.6 * k], [18, m.railHalf + 0.6], [m.railZ, m.railHalf]];
    for (let i = 1; i < side.length; i++) {
      if (z <= side[i][0]) {
        const [z0, y0] = side[i - 1], [z1, y1] = side[i];
        return y0 + ((z - z0) / (z1 - z0)) * (y1 - y0);
      }
    }
    return m.railHalf;
  }
  // The futtock staves, drawn eight feet below the top (see the notes there).
  const staveZ = (m) => m.topZ - 8;
  // A point on lower shroud i of mast m at height z.
  function onShroud(m, i, z) {
    const r = RIG[m.key];
    const t = (z - m.channelZ) / (m.topZ + 2 - m.channelZ);
    return [m.x + (r.first + i * r.gap) * (1 - t), shroudY(m, z), z];
  }
  // Where topmast shroud j meets the rim of the top, and a point on it at z.
  const rim = (m, j, dz) => [m.x + 0.8 + j * 1.15, m.topHalf - 0.3, m.topZ + dz];
  function onTopmastShroud(m, j, z) {
    const a = rim(m, j, 2.4), b = [m.x - 0.6, 1, m.crossZ + 0.8];
    const t = (z - a[2]) / (b[2] - a[2]);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z];
  }
  const each = (fn) => ALL.flatMap(fn);

  // --- Shrouds -------------------------------------------------------------
  const lowerShrouds = {
    id: 'lower-shrouds', group: 'yard', cls: 'standing-rig',
    name: 'Lower shrouds',
    does: 'Hold the lower mast from each side and, because the channels lie abaft the mast, from behind as well. A 74 has nine a side on the fore and main masts and six on the mizen.',
    extra: each((m) => range(RIG[m.key].shrouds).map((i) => [onShroud(m, i, m.channelZ + 3.6), [m.x, 1.5, m.topZ + 2]])),
    lead: 'Shrouds are made in pairs: one rope is middled and an eye seized in the bight to fit the masthead, so both legs come down the same side. The pairs go on alternately: “The first pair leads down on the starboard-side forward, the next pair forward on the larboard-side; then the second pair on the starboard, and the second on the larboard, and so on.” The odd shroud on each side, the swifter, is the aftermost and lies above all the rest. First over the masthead, under the shrouds, are the pendents of tackles; over the shrouds go the stay and then the preventer stay, and only then is the top got over.',
    worked: 'Not at all in working the ship. They are set up taut when she is rigged, and again when they stretch.',
    rope: 'Fore and main: 11 in., “cabled, fine”. Mizen: 7 in.',
    notes: [
      'How many: Steel’s table for a 74 contradicts itself. It prints “7 Pair” of shrouds and 14 lanyards for the fore and main masts but 18 deadeyes, and “5 Pair” with 12 deadeyes for the mizen. The same “7 Pair” is printed for every rate from 100 guns down to 28, while the deadeye count changes with the rate, and the length of rope allowed suits 18 shrouds, not 14. So the deadeyes are taken here as the true count. That is a reading of the table, not something a source states. Lees’s reference ship has at least eight a side on the foremast, and Longridge gives <i>Victory</i>, a first rate, eleven.',
      'Why the foremost pair goes on first: “By this method, the yards are braced to a greater degree of obliquity, when the sails are close hauled, which could not be, were the foremost shrouds last fitted on the mast-head” (Steel).',
      'Steel’s swifter has an eye spliced to fit the masthead. Lever says that in the navy the odd shroud is “hitched round the Mast-head, and seized”, and that merchant ships generally put it foremost.',
      '“The fore-leg of the foremost pair of shrouds is served the whole length”, against the chafe of the yard and the sail (Steel).',
      'Lees dates “all shrouds cable laid” to 1805. Steel’s table already has the lower shrouds of a 74 cabled in 1794.',
    ],
    sources: ['S 197', 'S 187', 'L 22', 'S74 32', 'S74 34', 'S74 36', LEES('pp. 159, 175'), LONGRIDGE],
  };

  const deadeyes = {
    id: 'deadeyes', group: 'yard', cls: 'standing-rig',
    name: 'Deadeyes, lanyards, channels and chains',
    also: 'dead-eyes; laniards; chain-wales; chain-plates',
    does: 'Give each shroud a wide base to pull from and a way of being hauled tight. The channel is a thick plank standing out from the ship’s side “to extend the shrouds from each other, and from the head of the masts”. Each shroud ends above it in a deadeye; Steel’s definition is “Round flat wooden blocks, with three holes instead of sheaves”. A second deadeye sits on the channel, iron-bound to a chain-plate that is bolted to the side below. A lanyard rove through the six holes joins the two.',
    extra: each((m) => range(RIG[m.key].shrouds).flatMap((i) => {
      const foot = onShroud(m, i, m.channelZ);
      const z = m.channelZ - 5.5;
      return [
        [onShroud(m, i, m.channelZ + 3.6), onShroud(m, i, m.channelZ + 0.8)],
        [foot, [foot[0] + 0.3, hullY(m, z) + 0.1, z]],
      ];
    })),
    lead: 'The upper deadeye is turned into the end of the shroud and seized. The lanyard has a wall knot inside the after hole of the upper deadeye, goes down through the after hole of the lower one, and so on through all three pairs of holes. It is hove tight with the runner and tackle from the masthead pendent and a luff tackle, the turns tallowed; then the end is hitched above the deadeye and expended in turns round the shroud.',
    worked: 'When the shrouds are set up. In the drawing the short length between each shroud and the channel is the lanyard, and the length below the channel is the chain.',
    rope: 'Deadeyes 17 in. for the fore and main shrouds, 11 in. for the mizen. Lanyards 5½ in.',
    sources: ['S 198', STEEL_TERMS('CHAINS, CHAIN-PLATES, DEAD-EYES'), 'S74 32'],
  };

  const ratlines = {
    id: 'ratlines', group: 'yard', cls: 'standing-rig',
    name: 'Ratlines',
    also: 'ratlings (Steel)',
    does: 'Make a ladder of the shrouds. Each is a light line clove-hitched to every shroud it crosses, with an eye spliced in each end.',
    extra: each((m) => {
      const n = RIG[m.key].shrouds, out = [];
      for (let z = m.channelZ + 7; z < staveZ(m) - 1; z += 3.25) out.push(range(n).map((i) => onShroud(m, i, z)));
      return out;
    }),
    views: ['side', 'plan'],
    lead: 'Thirteen inches apart, the first one thirteen inches below the futtock stave. The foremost and aftermost shrouds are left out for the top six ratlines and the bottom six. The topmast shrouds are rattled in the same way. Only one in three is drawn, and only on the lower shrouds.',
    sources: ['S 198', 'S 200'],
  };

  const futtocks = {
    id: 'futtock-shrouds', group: 'yard', cls: 'standing-rig',
    name: 'Futtock staves and futtock shrouds',
    also: 'futtock staff',
    does: 'Carry the pull of the topmast shrouds down into the lower shrouds. The topmast shrouds end at the rim of the top, and the top is only a platform. Under each of their deadeyes an iron futtock plate passes down through a mortise in the rim; a futtock shroud hooks to its lower end and leads down and inwards to the lower shrouds.',
    extra: each((m) => {
      const r = RIG[m.key], z = staveZ(m);
      const stave = [onShroud(m, 0, z), onShroud(m, r.shrouds - 1, z)];
      return [stave].concat(range(r.topmast).map((j) => [rim(m, j, 0), onShroud(m, Math.round((j * (r.shrouds - 2)) / (r.topmast - 1)) , z)]));
    }),
    lead: 'The futtock stave is a length of served rope seized across the lower shrouds. Each futtock shroud hooks to its plate, takes a round turn round the stave and a lower shroud, and is seized to that shroud. Lever prefers a lanyard through a thimble.',
    rope: 'Futtock shrouds 7 in.; “Plates with Dead Eyes”, 11 in., twelve for the fore topmast.',
    notes: [
      'Steel puts the stave “as much below the upper-side of the trestle-trees as the cap is above”, which on the mainmast of this ship would be about fifteen feet below the top. It is drawn eight feet below, to agree with the height at which the rest of this tutorial hangs the main yard. That height is an estimate, and one of the two is out.',
      'After 1811 some ships gave up catharpins and seized the futtock shrouds to bolts in an iron strap round the mast. Lever, in his 1819 appendix, believes Captain Tarbutt of the East Indiaman <i>Apollo</i> was the first. That is too late for this ship, and not naval.',
      'In heavy weather Bentinck shrouds could be added: legs seized to the futtock stave and shrouds on each side, gathered to a thimble, and set up in the channel on the opposite side of the ship. They take the upward pull of the futtock shrouds across to the other side.',
    ],
    sources: ['S 198', 'S 199', 'S 200', 'L 28', 'S 230', 'S74 33', LEVER_APPENDIX],
  };

  const catharpins = {
    id: 'catharpins', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Catharpins',
    also: 'cat-harpings; catharpin legs',
    does: 'Steel’s definition: “Short ropes, to keep the lower shrouds in tight, after they are braced in by swifters, and to afford room to brace the yards sharp.” They cross the ship from the futtock stave on one side to the stave on the other. That does two things: it pulls the shrouds inwards, out of the way of the lower yard, and it stops the upward pull of the futtock shrouds from spreading the lower shrouds apart.',
    extra: each((m) => {
      const n = RIG[m.key].shrouds, z = staveZ(m);
      return range(4).map((k) => {
        const p = onShroud(m, 1 + Math.round((k * (n - 3)) / 3), z);
        return [p, [p[0], -p[1], p[2]]];
      });
    }),
    lead: 'Four legs to each mast, the foremost the shortest and each one aft of it an inch longer; from four feet long in small ships to eight in large. Each has an eye in either end, seized round the futtock stave and a shroud. The shrouds are first hauled together with a swifting line rove through blocks on a spar lashed across them.',
    rope: '“Catharpin Legs, 4”, 7 in.',
    notes: [
      'The foremost shroud “formerly, was never catharpined in”, because the leg would chafe the mast (Lever). Merchant ships added cross catharpins, from the aftermost shroud on one side to the foremost on the other.',
      'Hauling the catharpins tighter was one of the ways of getting the yards to brace a little sharper. That is from a modern study (Willis, citing Harland), not from Steel or Lever.',
    ],
    sources: ['S 188', 'S 198', 'L 25', 'S74 32', STEEL_TERMS('CAT-HARPINS'), 'X Willis, “The Capability of Sailing Warships, Part 1”, The Northern Mariner XIII (2003), p. 32|https://www.cnrs-scrn.org/northern_mariner/vol13/tnm_13_4_29-39.pdf'],
  };

  const topmastShrouds = {
    id: 'topmast-shrouds', group: 'yard', cls: 'standing-rig',
    name: 'Topmast shrouds',
    does: 'Hold the topmast from each side as the lower shrouds hold the lower mast, but from the rim of the top instead of from the channel. Six a side on the fore and main topmasts, four on the mizen.',
    extra: each((m) => range(RIG[m.key].topmast).map((j) => [rim(m, j, 0.5), rim(m, j, 2.4), [m.x - 0.6, 1, m.crossZ + 0.8]])),
    lead: 'They go over the topmast head like the lower shrouds, starboard pair first, after the burton pendents. Deadeyes are turned into their lower ends and set up by lanyards to the deadeyes in the futtock plates, with the top burton tackles. They are rattled throughout. A sister block is seized into the foremost shroud on each side for the topsail lift and the reef-tackle pendent: below the futtock stave according to Steel, close under the seizing at the masthead according to Lever.',
    rope: '7 in.; deadeyes 11 in.',
    notes: ['The counts are again the deadeye counts in Steel’s table (12, 12 and 8). They match <i>Victory</i>’s topmasts as Longridge gives them: “six shrouds or three pairs on each side. The mizen has two pairs aside only”.'],
    sources: ['S 199', 'S 200', 'S 189', 'L 27', 'S74 33', LONGRIDGE],
  };

  const topgallantShrouds = {
    id: 'topgallant-shrouds', group: 'yard', cls: 'standing-rig',
    name: 'Topgallant shrouds',
    does: 'Hold the topgallant mast from each side. Three a side on the fore and main, two on the mizen. They have no deadeyes.',
    extra: each((m) => range(RIG[m.key].topgallant).map((j) => {
      const x = m.x - 0.4 + j * 1.4, z = m.crossZ - 6;
      const stave = onTopmastShroud(m, j + 1, z);
      return [[m.x - 1, 0.6, m.tgHoundZ], [x, 5.2, m.crossZ], [x, stave[1] + 0.2, z], [rim(m, j + 1, 0)[0] + 0.5, m.topHalf - 1.2, m.topZ + 1.4]];
    })),
    lead: 'Over the topgallant masthead, on a grommet that protects the hounds. Down through holes in the ends of the topmast crosstrees, then inwards between the topmast shrouds and over a futtock stave seized to them. A thimble in each end is set up by a lanyard to a thimble strapped round the futtock plates under the deadeyes, at the top. Thimbles are seized into the foremost pair for the topgallant lifts.',
    rope: '4 in.; “Shrouds, 3 Pair … Lanyards, 6”.',
    notes: [
      'That they come all the way down to the top is how the description reads: the futtock plates are at the rim of the top. The notes this page was written from do not say so in as many words.',
      'Lever gives an alternative with the shrouds crossed to the futtock plates on the opposite side.',
    ],
    sources: ['S 205', 'L 45', 'L 46', 'S74 34'],
  };

  // --- Stays ---------------------------------------------------------------
  const collar = 'The collar is made by reeving the stay through an eye in its own upper end; a mouse, a pear-shaped swelling worked on the rope a third of the way along, stops the eye from closing up.';

  const foreStay = {
    id: 'fore-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Fore stay and fore preventer stay',
    also: 'fore spring stay (Lever)',
    does: 'Hold the foremast from forward, from the bowsprit. The preventer stay runs just under the stay.',
    path: [
      { p: [fore.x, 0, fore.topZ + 2], mark: 'fast', step: 'The collar goes over the fore masthead, above the shrouds, and hangs before the mast. ' + collar },
      { p: [-27.4, 0, 41.7], mark: 'lead', step: 'Down and forward to the bowsprit. A heart, which does the work of a deadeye, is turned into the lower end.' },
      { p: [-30, 0, 40.2], mark: 'belay', step: 'A lanyard joins it to the heart in the fore-stay collar, which “stops against cleats, nailed to the bowsprit” and is lashed under it.' },
    ],
    extra: [[[fore.x, 0, fore.topZ + 0.6], [-25, 0, 40.4], [-27.4, 0, 38.9]]],
    belay: { short: 'Fore-stay collar', level: 'weather', status: 'period', text: 'The fore-stay collar on the bowsprit. The preventer stay sets up the same way to a collar of its own, lashed under the bowsprit next to it.' },
    rope: 'Stay 17½ in.; preventer stay 11½ in.',
    notes: [
      '“Spring stay” is Lever’s name for the preventer stay, not a third rope: “The Spring Stay and Fore Stay are next got overhead … The Spring Stay lies under, for the convenience of bending a Fore-stay Sail to it.”',
      'The 1843 American edition of Lever calls it the “better and most usual way” to pass both through the bees and set them up to the knight-heads. That sentence is not in the 1819 text.',
    ],
    sources: ['S 200', 'S 187', 'L 23', 'S74 32'],
  };

  const mainStay = {
    id: 'main-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Main stay',
    does: 'Holds the mainmast from forward. It runs over the waist and the forecastle, past the foremast, to the head of the ship.',
    path: [
      { p: [main.x, 0, main.topZ + 2], mark: 'fast', step: 'The collar goes over the main masthead, above the shrouds, made with an eye and a mouse like the fore stay’s.' },
      { p: [fore.x, 1.7, 33.1], step: 'Down and forward. It passes the foremast on one side. Which side is not said; it is drawn to starboard.' },
      { p: [7.5, 0.4, 25.8], mark: 'lead', step: 'A heart is turned into its end.' },
      { p: [2.5, 0, 23], mark: 'belay', step: 'A lanyard to the heart in the main-stay collar, “above the bowsprit-chock”. The collar reeves “through a large hole in the standard in the head” and is seized to itself.' },
    ],
    belay: { short: 'Main-stay collar, in the head', level: 'weather', status: 'period', text: 'A collar at the head of the ship, above the bowsprit. Lees says that from 1810 the main stay and its preventer stay were made fast on the forecastle instead.' },
    rope: '18½ in.',
    notes: ['The other pages of this tutorial draw the main stay ending at the foot of the foremast, which is a simplification. This page follows Steel.'],
    sources: ['S 200', 'S 201', 'S74 34', LEES('p. 159')],
  };

  const mainPreventerStay = {
    id: 'main-preventer-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Main preventer stay',
    also: 'main spring stay (Lever)',
    does: 'Backs up the main stay. Where its lower end went changed during the period, and the sources give three answers.',
    path: [
      { p: [main.x, 0, main.topZ + 0.4], mark: 'fast', step: 'Over the main masthead, after the stay.' },
      { p: [24.5, 0, 31.2], mark: 'lead', step: 'Down under the stay to a heart abaft the foremast.' },
      { p: [20.6, 0, 28.6], mark: 'belay', step: 'Steel (1794): a lanyard to the heart in the main-preventer-stay collar, “which lashes round the foremast, on the fore-side through two eyes, or through a large eye-bolt in the head, the same as the main-stay-collar”.' },
    ],
    belay: { short: 'Collar round the foremast', level: 'weather', status: 'period', text: 'Drawn as Steel has it, to a collar round the foremast. Lees says that in 1793 “by Admiralty order, it led, like the main stay, to the bowsprit”, and after 1810 to the bulwarks or the deck. Lever in 1808 still gives the “Main Spring Stay” a collar with the heart “laying abaft the Foremast”, or has the stay simply taken round the foremast. So both leads are attested for 1805, and Steel may be describing the practice from before the order.' },
    rope: '13 in.',
    sources: ['S 200', 'L 30', 'S74 34', LEES('pp. 46, 159')],
  };

  const mizenStay = {
    id: 'mizen-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Mizen stay',
    does: 'Holds the mizen mast from forward, from the mainmast.',
    path: [
      { p: [mizen.x, 0, mizen.topZ + 2], mark: 'fast', step: 'The collar goes over the mizen masthead.' },
      { p: [99.2, 0, 30], mark: 'lead', step: 'Forward and down, through a thimble in a collar lashed round the mainmast twelve feet above the deck.' },
      { p: [99.7, 0, 18.4], mark: 'belay', step: 'A thimble in its end is set up by a lanyard to an eyebolt in the deck.' },
    ],
    belay: { short: 'Eyebolt abaft the mainmast', level: 'weather', status: 'period', text: 'An eyebolt in the deck at the foot of the mainmast. Steel says “the deck”; that it is the quarterdeck is how it is drawn, and is my reading.' },
    rope: '8½ in.',
    notes: [
      'Steel’s table for a 74 has a mizen stay and a mizen staysail stay but no mizen preventer stay. Lees’s chronology has “1793 Mizen PREVENTER STAY authorised”, so a ship of 1805 may well have had one. It is not drawn.',
      'In large ships the mizen staysail sets on a lighter stay of its own, which follows the same line.',
    ],
    sources: ['S 201', 'S74 36', LEES('p. 159')],
  };

  const foreTopmastStays = {
    id: 'fore-topmast-stays', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Fore topmast stay and preventer stay',
    also: 'fore topmast spring stay (Lever)',
    does: 'Hold the fore topmast from forward, from the outer end of the bowsprit.',
    path: [
      { p: [fore.x - 0.6, 0.4, fore.crossZ + 0.6], mark: 'fast', step: 'The collar goes over the fore topmast head, after the shrouds and backstays.' },
      { p: [-38.6, 0.9, 45.6], mark: 'block', step: '“Through the bees of the bowsprit”: planks on each side of the bowsprit’s outer end, with a sheave under a hole in each.' },
      { p: [-6, 2.2, 28.2], mark: 'lead', step: 'In along the bowsprit. A long-tackle block is turned into the end of the stay.' },
      { p: [1.5, 3.4, 22.8], mark: 'belay', step: 'The fall of the tackle goes to a single block at an eyebolt in the bow.' },
    ],
    extra: [[[fore.x - 0.6, -0.4, fore.crossZ - 0.6], [-37.8, -0.9, 45.2], [-6, -2.2, 28.2], [1.5, -3.4, 22.8]]],
    belay: { short: 'Eyebolt in the bow', level: 'weather', status: 'period', text: 'An eyebolt in the bow on each side, one for the stay and one for the preventer stay. Which stay goes through which bee is not said; the stay is drawn to starboard.' },
    rope: 'Stay 8½ in.; preventer stay 6½ in.',
    notes: ['Lever wants the bee for the spring stay “well abaft the other … that the Fore Topmast Stay-sail may not be chafed by it”, and bends that sail to the spring stay. Steel gives the fore topmast staysail a stay of its own.'],
    sources: ['S 200', 'S 201', 'L 28', 'S74 33'],
  };

  const mainTopmastStay = {
    id: 'main-topmast-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Main topmast stay',
    does: 'Holds the main topmast from forward. It goes to the head of the foremast and from there down to the forecastle.',
    path: [
      { p: [main.x - 0.6, 0, main.crossZ + 0.5], mark: 'fast', step: 'The collar goes over the main topmast head.' },
      { p: [fore.x + 0.8, 0.5, fore.topZ + 11], mark: 'block', step: 'Forward and down to a block strapped round the foremast head, above the rigging.' },
      { p: [fore.x + 1.4, 0.5, fore.topZ - 6], step: 'Down between the catharpins and the mast.' },
      { p: [22, 0.5, 18.4], mark: 'belay', step: 'A thimble and a lanyard to an eyebolt in the deck, close abaft the foremast.' },
    ],
    belay: { short: 'Eyebolt abaft the foremast', level: 'weather', status: 'period', text: 'An eyebolt in the deck close abaft the foremast.' },
    sources: ['S 201'],
  };

  const mainTopmastPreventerStay = {
    id: 'main-topmast-preventer-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Main topmast preventer stay',
    does: 'Backs up the main topmast stay, and carries a sail: the main topmast staysail is bent to it.',
    path: [
      { p: [main.x - 0.6, 0, main.crossZ - 0.9], mark: 'fast', step: 'Over the main topmast head, after the stay.' },
      { p: [fore.x + 0.9, -0.5, fore.topZ - 3.5], mark: 'lead', step: 'To the foremast below the top: through a thimble in a collar lashed at the fore part of the mast, close up to the bibs.' },
      { p: [22, -0.5, 18.4], mark: 'belay', step: 'Down to an eyebolt in the deck, as the stay.' },
    ],
    belay: { short: 'Eyebolt abaft the foremast', level: 'weather', status: 'period', text: 'An eyebolt in the deck abaft the foremast, beside the stay’s.' },
    sources: ['S 201', 'S 214'],
  };

  const mizenTopmastStay = {
    id: 'mizen-topmast-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Mizen topmast stay',
    does: 'Holds the mizen topmast from forward. It never reaches the deck: both its collars are on the mainmast. The mizen topmast staysail sets on it.',
    path: [
      { p: [mizen.x - 0.6, 0, mizen.crossZ + 0.5], mark: 'fast', step: 'The collar goes over the mizen topmast head.' },
      { p: [99.1, 0, main.topZ - 3.5], mark: 'lead', step: 'Through a thimble in a collar on the mainmast, close up to the bibs.' },
      { p: [99, 0, staveZ(main) - 1.6], mark: 'belay', step: 'Set up to a second collar round the mainmast, just below the catharpins.' },
    ],
    belay: { short: 'Collar on the mainmast', level: 'aloft', status: 'period', text: 'A collar round the mainmast just below the catharpins.' },
    sources: ['S 201'],
  };

  const foreTopgallantStay = {
    id: 'fore-topgallant-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Fore topgallant stay',
    does: 'Holds the fore topgallant mast from forward. It goes to the end of the jibboom, so the jibboom has in turn to be held down and sideways: that is the work of the martingale and the guys.',
    path: [
      { p: [fore.x - 1, 0, fore.tgHoundZ], mark: 'fast', step: 'Over the fore topgallant masthead.' },
      { p: [-71.4, 0, 60], mark: 'lead', step: 'To the outer end of the jibboom, through the middle thimble of a strap of three. The outer two take the fore topgallant bowlines.' },
      { p: [-4, 0, 26], mark: 'belay', inferred: true, step: 'Back in along the boom. It is set up with a jigger and secured by a lanyard “to the gammoning, or to an eye-bolt in the head”. Steel allows either, so the exact place drawn is a guess.' },
    ],
    belay: { short: 'Gammoning, or the head', level: 'weather', status: 'period', text: 'A lanyard to the gammoning, or to an eyebolt in the head.' },
    rope: '4½ in.',
    sources: ['S 205', 'S 206', 'S74 34'],
  };

  const mainTopgallantStay = {
    id: 'main-topgallant-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Main topgallant stay',
    does: 'Holds the main topgallant mast from forward, from the head of the fore topmast.',
    path: [
      { p: [main.x - 1, 0, main.tgHoundZ], mark: 'fast', step: 'Over the main topgallant masthead.' },
      { p: [fore.x - 0.4, 0, fore.crossZ + 2], mark: 'block', step: 'Through a block at the fore topmast head.' },
      { p: [fore.x + 0.6, 0, fore.topZ + 0.8], mark: 'belay', step: 'Down to a thimble in a span at the foremast trestle-trees, in the fore top.' },
    ],
    belay: { short: 'Fore trestle-trees', level: 'aloft', status: 'period', text: 'A span at the foremast trestle-trees.' },
    notes: [
      'Lees describes a changed lead after 1805, through a sheave in the after fore topmast crosstree. The snippet seen is incomplete.',
      'The stay of the main topgallant staysail is spliced into this one below the rigging.',
    ],
    sources: ['S 205', 'S 206', 'S 215', LEES('p. 62')],
  };

  const mizenTopgallantStay = {
    id: 'mizen-topgallant-stay', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Mizen topgallant stay',
    does: 'Holds the mizen topgallant mast from forward, from the head of the main topmast.',
    path: [
      { p: [mizen.x - 1, 0, mizen.tgHoundZ], mark: 'fast', step: 'Over the mizen topgallant masthead.' },
      { p: [main.x - 0.4, 0, main.crossZ + 2], mark: 'block', step: 'To the main topmast head.' },
      { p: [main.x + 0.6, 0, main.topZ + 0.8], mark: 'belay', inferred: true, step: 'Steel says only that it is rigged as the main topgallant stay is to the fore. If so, it comes down to the main trestle-trees.' },
    ],
    belay: { short: 'Main trestle-trees', level: 'aloft', status: 'inferred', text: 'By analogy with the main topgallant stay. Steel does not describe it separately.' },
    sources: ['S 206'],
  };

  const flagstaffStays = {
    id: 'flagstaff-stays', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Flagstaff stays',
    also: 'royal stays',
    does: 'Steady the long pole heads of the topgallant masts, on which the royals are set. They are only 2-inch rope.',
    extra: [
      [[fore.x - 1, 0, fore.poleZ - 0.5], [-72, 0, 60.5], [-30.5, 0, 41.2]],
      [[main.x - 1, 0, main.poleZ - 0.5], [fore.x - 0.8, 0, fore.tgHoundZ + 1.5], [fore.x + 1.4, 0, fore.topZ + 0.8]],
      [[mizen.x - 1, 0, mizen.poleZ - 0.5], [main.x - 0.8, 0, main.tgHoundZ + 1.5], [main.x + 1.4, 0, main.topZ + 0.8]],
    ],
    views: ['side', 'plan'],
    lead: 'Each starts under the truck at the top of the pole. The fore one reeves through a thimble at the jibboom end and belays round the fore-stay collar. The main one goes through a thimble above the fore topgallant rigging and belays in the fore top. The mizen one does the same to the main topgallant rigging; that it then comes down to the main top is my assumption.',
    rope: '2 in.',
    notes: ['This is the only rope Steel’s table gives the pole: it lists no royal backstays. Lever puts a royal stay and backstays over the pole head above cleats, and says merchant ships lead the fall of the topgallant backstay up to the pole head to serve as one.'],
    sources: ['S 206', 'L 46', 'S74 34'],
  };

  // --- Backstays -------------------------------------------------------------
  // Numbered on the mainmast; the other masts' are drawn alongside.
  const backstayRuns = (m, offsets, head, top, foot) => offsets.map((d) => [head(m), [m.x + d, m.channelY - 0.35, m.channelZ + top], [m.x + d, m.channelY, m.channelZ + foot]]);
  const topmastHead = (m) => [m.x - 0.4, 1, m.crossZ + 0.5];
  const tgHead = (m) => [m.x - 1, 0.6, m.tgHoundZ];

  const standingBackstays = {
    id: 'standing-backstays', group: 'yard', cls: 'standing-rig',
    name: 'Standing backstays',
    also: 'after backstays (Falconer)',
    does: 'Hold the topmast from aft and from the side. Backstays “reach from the heads of the topmast and topgallant-mast to the channel on each side of the ship, and assist the shrouds when strained by a press of sail” (Steel). Three a side on the fore and main topmasts, one a side on the mizen.',
    path: [
      { p: topmastHead(main), mark: 'fast', step: 'Over the topmast head, after the shrouds and the breast backstay and before the stays. They are fitted like shrouds, in pairs, with the odd one tongued in.' },
      { p: [main.x + 19, main.channelY - 0.35, main.channelZ + 3.6], mark: 'lead', step: 'Down abaft the top and outside it, to a deadeye turned into the end.' },
      { p: [main.x + 19, main.channelY, main.channelZ + 0.6], mark: 'belay', step: 'Set up “the same as a shroud, to a small dead-eye in the after end of the channel”. Lever has the deadeye “in a stool”, a short channel of its own abaft the main one.' },
    ],
    extra: backstayRuns(main, RIG.main.back.slice(1), topmastHead, 3.6, 0.6).concat(backstayRuns(fore, RIG.fore.back, topmastHead, 3.6, 0.6), backstayRuns(mizen, RIG.mizen.back, topmastHead, 3.6, 0.6)),
    views: ['side', 'plan'],
    belay: { short: 'After end of the channel', level: 'weather', status: 'period', text: 'Small deadeyes in the after end of each channel, set up with lanyards like the shrouds.' },
    rope: '7 in.; deadeyes 11 in.',
    notes: [
      'Steel’s table says “Standing Backstays fine 3 Pr.” with six deadeyes and six lanyards, which is three a side. For the mizen topmast it has “1 No.”; Longridge: “The mizen topmast has a single standing backstay on each side”.',
      'Longridge gives <i>Victory</i> five backstays a side on the fore and main topmasts, presumably counting the breast and shifting ones.',
    ],
    sources: ['S 199', 'S 200', 'L 28', 'S74 33', 'S74 35', STEEL_TERMS('BACKSTAYS'), 'F BACK-STAYS', LONGRIDGE],
  };

  const breastBackstays = {
    id: 'breast-backstays', group: 'yard', cls: 'standing-rig',
    name: 'Breast backstays',
    does: 'Hold the topmast sideways, from abreast the mast. Lever: “for the lateral support of the Topmast … being for temporary use, they are not set up with Dead Eyes”. They end in a tackle, so that one can be set up and the other let go.',
    path: [
      { p: [main.x - 0.3, 1, main.crossZ + 0.2], mark: 'fast', step: 'Over the topmast head, the first of the backstays to go on.' },
      { p: [main.x + 1.4, main.channelY - 1.2, main.channelZ + 15], mark: 'block', step: 'Straight down outside the top to a single block turned into the lower end.' },
      { p: [main.x + 1.9, main.channelY - 0.5, main.channelZ + 7], mark: 'block', step: 'A runner reeves through that block. One of its ends is made fast to a chain-plate abreast the mast; the other carries a double block.' },
      { p: [main.x + 2, main.channelY, main.channelZ + 0.4], mark: 'block', step: 'The fall goes from the double block to a block on the next chain-plate.' },
      { p: [main.x + 3.4, main.railHalf - 0.7, main.deckZ + 1.6], mark: 'belay', inferred: true, step: 'And leads in on deck. Where it is made fast is not said.' },
    ],
    extra: [
      [[main.x + 1.4, main.channelY - 1.2, main.channelZ + 15], [main.x + 0.9, main.channelY, main.channelZ + 0.4]],
      [[fore.x - 0.3, 1, fore.crossZ + 0.2], [fore.x + 1.2, fore.channelY - 1.2, fore.channelZ + 15], [fore.x + 0.9, fore.channelY, fore.channelZ + 0.4]],
    ],
    views: ['side', 'plan'],
    belay: { short: 'On deck, abreast the mast', level: 'weather', status: 'inferred', text: 'Steel and Lever say only that the fall leads in on deck.' },
    worked: 'Lever says they are “only set up occasionally”, and Falconer that the breast backstay sustains the topmast “when the ship sails upon a wind”. The weather one would then be set up and the lee one let go, so that the lower yard can brace sharp up without bearing on it. That last sentence is my inference from the two, not something either says.',
    rope: '“Breast Backstay Runners, 2; Falls, 2”.',
    notes: ['Lees remarks that, on the evidence of models, very few English ships were fitted with breast backstays set up in the standing fashion, the standing backstay serving instead.'],
    sources: ['S 200', 'L 27', 'L 29', 'S74 33', 'F BACK-STAYS', LEES('p. 55')],
  };

  const shiftingBackstays = {
    id: 'shifting-backstays', group: 'occasional', cls: 'standing-rig',
    name: 'Shifting backstays',
    does: 'An extra backstay with no fixed place. “The shifting backstays change according to the action of the wind upon the sails, whether aft, or upon the quarter” (Steel).',
    path: [
      { p: [main.x - 0.4, 1, main.crossZ + 0.9], mark: 'fast', step: 'It is “clenched round the topmast-head”.' },
      { p: [main.x + 11.6, main.channelY - 2.2, main.channelZ + 13], mark: 'lead', step: 'It has “a thimble spliced in the lower end, to which is hooked a tackle”.' },
      { p: [main.x + 12.4, main.channelY + 0.2, main.channelZ - 0.8], mark: 'belay', inferred: true, step: 'The lower block of the tackle “is hooked to an eye-bolt without-board, and frequently shifted from place to place”. It is drawn abreast the after shrouds, which is a guess at one of its places.' },
    ],
    views: ['side', 'plan'],
    belay: { short: 'Eyebolt outboard, shifted as needed', level: 'weather', status: 'inferred', text: 'An eyebolt outside the ship. Steel does not say where the eyebolts were.' },
    worked: 'According to Lees they were used only “to give additional stay to the mast when sailing, and would be unrove in port”.',
    rope: 'Fore topmast: “Shifting Backstays, fine, 1 Pair”, 7 in., with four tackles. Topgallant mast: one pair, 4 in.',
    sources: ['S 200', 'S74 33', 'S74 34', STEEL_TERMS('BACKSTAYS'), LEES('p. 55')],
  };

  const topgallantBackstays = {
    id: 'topgallant-backstays', group: 'yard', cls: 'standing-rig',
    name: 'Topgallant backstays',
    does: 'Hold the topgallant mast from aft. “Men of War have two Top-gallant Backstays on each side” (Lever).',
    path: [
      { p: tgHead(main), mark: 'fast', step: 'Over the topgallant masthead.' },
      { p: [main.x + 22.2, main.channelY - 0.4, main.channelZ + 0.8], mark: 'belay', step: 'Set up like the topmast backstays, “to a small dead-eye in the aft-part of the channel, or in a stool abaft the channel”. They are drawn on a stool.' },
    ],
    extra: backstayRuns(main, RIG.main.tgBack.slice(1), tgHead, 2.2, 0.8).concat(backstayRuns(fore, RIG.fore.tgBack, tgHead, 2.2, 0.8), backstayRuns(mizen, RIG.mizen.tgBack, tgHead, 2.2, 0.8)),
    views: ['side', 'plan'],
    belay: { short: 'Stool abaft the channel', level: 'weather', status: 'period', text: 'Small deadeyes in the after part of the channel, or in a stool abaft it.' },
    rope: '4 in.; deadeyes 7 in.; “Standing Backstays, 2 Pair”.',
    notes: ['The mizen is drawn with one a side. No count for the mizen topgallant backstays was found.'],
    sources: ['S 206', 'L 45', 'S74 34'],
  };

  // --- Bowsprit and jibboom --------------------------------------------------
  const gammoning = {
    id: 'gammoning', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Gammoning',
    does: 'Lashes the bowsprit down to the stem. A 74 has two.',
    extra: [
      [[-5.4, 0.9, 27.9], [-7.5, 0, 17], [-6.6, -0.9, 28.5]],
      [[-6, 0.9, 28.2], [-7.5, 0, 17], [-7.2, -0.9, 28.9]],
      [[-10.4, 0.9, 30.7], [-11.6, 0, 19.8], [-11.6, -0.9, 31.4]],
      [[-11, 0.9, 31], [-11.6, 0, 19.8], [-12.2, -0.9, 31.7]],
    ],
    views: ['side', 'plan'],
    lead: 'Nine or eleven turns of rope over the bowsprit and through a hole in the knee of the head, every turn crossed: forward on the bowsprit, aft in the hole. Each turn is hove tight and nippered, and the whole is then frapped together in the middle with as many cross turns. “In the navy, the bowsprit is first heaved down by a chain-boat.”',
    rope: '“Gammonings, 2”, 8 in., 140 fathoms.',
    notes: ['Lever: ships with a projecting knee have two gammonings.'],
    sources: ['S 194', 'L 20', 'S74 31'],
  };

  const bobstays = {
    id: 'bobstays', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Bobstays',
    does: '“The use of the bobstay, is to draw down, and keep steady the bowsprit, to counteract the force of the stays of the fore-mast, which draw it upwards.”',
    extra: [
      [[-3.8, 0, 10.4], [-25.2, 0, 36.2], [-26.4, 0, 37.2]],
      [[-6.6, 0, 14.2], [-29.8, 0, 38.7], [-31, 0, 39.6]],
    ],
    views: ['side', 'plan'],
    lead: '“Kings ships have two pair of bob-stays, merchant ships commonly but one pair.” Each passes through a hole in the cutwater and is spliced end to end, “to make it twofold, or like the link of a chain”. A heart seized in the bight is joined by a lanyard to the heart in a collar under the bowsprit, and it is set up with a luff upon luff, the fall leading in on the forecastle. The bobstay collar is lashed “two-thirds out, or within the saddle for the spritsail slings”.',
    rope: '“Bobstays cabled fine, 2 Pair”, 8½ in.; hearts 14 in.',
    notes: [
      'Steel’s table lists three hearts for the two pair, and Lees mentions “when three bobstays were carried”. Two are drawn; a large ship may have had three.',
      'Chain bobstays are about 1850 (Lees).',
    ],
    sources: ['S 195', 'S74 31', LEES('pp. 158, 159')],
  };

  const bowspritShrouds = {
    id: 'bowsprit-shrouds', group: 'yard', cls: 'standing-rig',
    name: 'Bowsprit shrouds',
    does: 'Hold the bowsprit sideways, one on each side. “The shrouds are to fortify the bowsprit, as the fore-mast and upper part of the main-mast are stayed and supported by the bowsprit” (Steel).',
    extra: [[[6, 9, 13.5], [-28.8, 1.3, 39.5], [-30.2, 0.7, 40.3]]],
    views: ['side', 'plan'],
    lead: 'Hooked to an eyebolt in the bow; in the bends, according to Lever. A heart in the forward end is set up by a lanyard to the heart in a collar on the bowsprit.',
    rope: '“Shrouds fine, 1 Pair”, 8 in.',
    sources: ['S 195', 'L 21', 'S74 31'],
  };

  const jibboomGuys = {
    id: 'jibboom-guys', group: 'yard', cls: 'standing-rig',
    name: 'Jibboom guys',
    also: 'guy pendents',
    does: 'Hold the jibboom sideways. Lever: “these are for supporting the Boom to Windward”. The spritsail yard spreads them, which is why that yard outlived its sail.',
    path: [
      { p: [-71.2, 0.3, 59.7], mark: 'fast', step: 'The guy pendent goes over the end of the jibboom.' },
      { p: [-30, 15.5, 39], mark: 'lead', step: 'In and outwards: “the inner ends reeve through a thimble, on the quarters of the spritsail-yard”.' },
      { p: [-9, 16, 27.5], mark: 'block', step: 'And “turn into the strap of a double block”.' },
      { p: [7, 16.6, 21.7], mark: 'block', step: 'It is “connected, by its fall, to a single block, that hooks to an eye-bolt, near the cat-head”.' },
      { p: [11.5, 12.2, 19.6], mark: 'belay', inferred: true, step: 'The fall “leads in upon the fore-castle”. Where it is made fast is not said.' },
    ],
    views: ['side', 'plan'],
    belay: { short: 'Forecastle, by the cathead', level: 'weather', status: 'inferred', text: 'Somewhere on the forecastle near the cathead. Steel says only that the fall leads in there.' },
    rope: '“Guy Pendants, 1 Pair”, 4½ in.',
    notes: [
      'Lever adds travelling guys, spliced to the jib’s traveller and led through a second thimble on the spritsail yard, so that the tack of the jib is held up to windward wherever it is on the boom.',
      '“When no Spritsail Yard is carried, the Jib-boom may be equally secured by Guys to an Outrigger or Boomkin”, which Lever in 1819 presumes many naval ships have done “on account of the great weight of a Yard, equal in size to the Fore Topsail Yard, lying so far out when a Ship is pitching”. Lees has the yard “relegated to a spreader” between 1811 and 1830.',
    ],
    sources: ['S 195', 'L 31', 'S74 31', LEVER_APPENDIX, LEES('p. 159')],
  };

  const martingale = {
    id: 'martingale', group: 'yard', cls: 'standing-rig', mirror: false,
    name: 'Martingale stay and dolphin striker',
    also: 'martingal (Steel, for the bar); martingale (Moore, for the rope); dolphin-striker (Lever, for the bar)',
    does: 'Holds the jibboom down. “The Martingal-stay supports the jib-boom, as the bobstays support the bowsprit” (Steel); “the tendency of the Jib when set, is to lift the Boom upwards” (Lever). The bar under the bowsprit cap gives the stay something to pull down from.',
    path: [
      { p: [-71.2, 0, 59.4], mark: 'fast', step: 'The outer martingale stay goes over the end of the jibboom.' },
      { p: [-41.5, 0, 35.2], mark: 'lead', step: 'Down and in, through the lower sheave of the dolphin striker: “a Bar, called a Dolphin-striker”, stepped in two iron staples on the fore side of the bowsprit cap.' },
      { p: [-27.6, 0.6, 38.1], mark: 'block', step: 'Up to a block in a span on the bowsprit, just inside the fore-stay collar.' },
      { p: [5, 1.6, 19.6], mark: 'belay', inferred: true, step: 'In on the forecastle, to a gun-tackle or a whip. Where on the forecastle is not said.' },
    ],
    extra: [[[-55, 0, 51.6], [-41.3, 0, 37.6], [-27.6, -0.6, 38.1], [5, -1.6, 19.6]]],
    views: ['side', 'plan'],
    belay: { short: 'Forecastle', level: 'weather', status: 'inferred', text: 'Lever (1808) brings both martingale stays in on the forecastle, one on each side. Steel (1794) has a single stay which “leads in through a score, cut in the lower end of the martingal” and “sets up, by its fall, to a single-block hooked to an eye-bolt in the head”.' },
    notes: [
      'New in 1794, according to Lees: “When first introduced in 1794, the striker was a piece of wood nailed on the fore side of the bowsprit cap. Its sole use was to take the martingale stay”. Steel describes it that year, but among his miscellaneous “necessary ropes” and not in his rigging table for a 74, which suggests it was known and not yet standard issue. Falconer (1769) has no entry for it.',
      'The second line in the drawing is Lever’s inner martingale stay, from the jib’s traveller through the upper sheave. “Many Vessels have only the outer Martingale-Stay; but the inner one is very serviceable when the Jib is a third, or half in, as it acts immediately under the Stay.”',
      'Later still, and not drawn: Lees has the striker “fitted with a jaw” in 1815 and some ships trying double strikers; Lever’s 1819 appendix adds martingale guys and an after guy, or back rope, from the foot of the striker to the bows. A chain martingale is about 1840.',
      'John Harland (<i>Mariner’s Mirror</i>, 1977) questioned whether a dolphin striker and a sprit topsail yard could be used on the same bowsprit, “as the use of one would have compromised the other”. Steel and Lever describe both. Only the abstract of his note was read.',
    ],
    sources: ['S 233', 'L 60', 'X Moore, The Midshipman’s or British Mariner’s Vocabulary (1801), MARTINGALE|https://archive.org/details/midshipmansorbr00moorgoog', LEES('pp. 32, 159'), LEVER_APPENDIX, 'X Harland, “Victory’s Spritsail Topsail Yard and Dolphin Striker”, Mariner’s Mirror (1977), abstract|https://snr.org.uk/note-victorys-spritsail-topsail-yard-and-dolphin-striker/'],
  };

  const lines = [
    lowerShrouds, deadeyes, ratlines, futtocks, catharpins, topmastShrouds, topgallantShrouds,
    foreStay, mainStay, mainPreventerStay, mizenStay,
    foreTopmastStays, mainTopmastStay, mainTopmastPreventerStay, mizenTopmastStay,
    foreTopgallantStay, mainTopgallantStay, mizenTopgallantStay, flagstaffStays,
    standingBackstays, breastBackstays, shiftingBackstays, topgallantBackstays,
    gammoning, bobstays, bowspritShrouds, jibboomGuys, martingale,
  ];

  // The same lines under four framings. `standing` shows the whole mainmast
  // from astern; `-top` and `-chains` close in on parts of it; `-ship` is for
  // the profile and plan, and adds the spritsail yard that spreads the guys.
  // Standing rigging is set up, not belayed, so the headings are reworded.
  const labels = { lead: 'Its run, to where it is set up', fitted: 'How it is fitted', belay: 'Where it is set up', worked: 'When it is handled', more: 'Rope sizes, notes, dates and sources' };
  const base = { mast: 'main', title: 'Standing rigging', start: 'lower-shrouds', lines, labels };
  SAILS.push(
    { ...base, id: 'standing', views: ['aft'] },
    { ...base, id: 'standing-top', views: ['aft'], aftBox: [-19, -(main.capZ + 6), 38, 36] },
    { ...base, id: 'standing-chains', views: ['aft'], aftBox: [3, -40, 30, 34] },
    { ...base, id: 'standing-ship', views: ['side', 'plan'], spars: [{ a: [-30, -31, 39], b: [-30, 31, 39], w: 1 }] }
  );
})();
