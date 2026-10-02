// The three topsails. Their gear is the same in kind on every mast; what
// differs is where the braces, bowlines and sheets go, and where things belay.

(function () {
  const { G, MASTS, SAILS, shape, leechY, footZ, down, shroudY } = window.RIGDATA;

  function topsail(m) {
    const x0 = m.x, yx = m.x - 1.5, sx = m.x - 2, ty = m.tyZ;
    const S = shape(m, 'topsail');
    const main = m.key === 'main', fore = m.key === 'fore', mizen = m.key === 'mizen';
    const adj = m.key;
    const reefs = mizen ? 3 : 4;
    const reefZ = Array.from({ length: reefs }, (_, i) => down(S, (mizen ? 0.11 : 0.104) + i * (mizen ? 0.11 : 0.1)));
    const rtZ = down(S, 0.513);
    const b1 = down(S, 0.68), b2 = down(S, 0.82);
    const bridle = [sx - 4.3, leechY(S, (b1 + b2) / 2), (b1 + b2) / 2];
    const buntY = S.clewY * 0.26;
    const sideDeck = [x0 + 8.2, m.railHalf - 0.7, m.deckZ + 1.6];

    // --- Halliards ---------------------------------------------------------
    const flyZ = m.channelZ + (ty - m.channelZ) * 0.26;
    const hall = {
      fore: { chan: [34, 21, 17.2], lead: [56, 20.3, 19.6], belay: [59.5, 20.3, 19.6] },
      main: { chan: [x0 + 6.7, 25, 17.2], lead: sideDeck, belay: [x0 + 11.7, sideDeck[1], sideDeck[2]] },
      mizen: { chan: [x0 + 5, 23.5, 22.6], lead: [x0 + 7, 19, 26.6], belay: [x0 + 10, 19, 26.6] },
    }[adj];
    const fly = [(x0 + 5.7 + hall.chan[0]) / 2, m.channelY * 0.78, flyZ];
    const halliards = {
      id: 'halliards',
      group: 'yard',
      name: 'Tye and halliards',
      also: 'tie, tye; haliards (Steel), halliards (Lever), halyards (modern)',
      does: 'Hoist the yard up the topmast and lower it again. A lower yard stays where it is slung; a topsail yard travels every time sail is made, reefed or taken in, so this is the hardest-worked purchase on the mast. The tye is the thick rope that does the lifting aloft, and the halliard is the lighter tackle on its lower end, down where the men are.' + (mizen ? ' The fore and main topsail yards have a double tye and a halliard on each side. Steel’s table gives the mizen topsail yard a single tye and one halliard.' : ' There is one of each on each side.'),
      mirror: !mizen,
      path: [
        { p: [x0, 0.9, m.crossZ + 0.8], mark: 'fast', step: mizen ? 'The single tye is made fast at the middle of the yard and goes up to the topmast head. Steel does not describe the mizen’s separately; the upper part is drawn like the others.' : 'The standing part of the tye is clinched round the topmast head.' },
        { p: [x0 - 1.4, 0.7, ty + 1], mark: 'block', step: mizen ? 'The tye-block on the middle of the yard.' : 'Down through the double tye-block lashed to the middle of the yard.' },
        { p: [x0 + 0.1, 1.4, m.crossZ + 1.7], mark: 'block', step: 'Up through a block at the topmast head, “close up to the rigging, under the collar of the stay” (Lever).' },
        { p: fly, mark: 'block', inferred: mizen, step: 'Down abaft the top and outside it. The fly-block is spliced into the end of the tye.' + (mizen ? ' Which side it comes down is not recorded.' : '') },
        { p: hall.chan, mark: 'block', inferred: mizen, step: `The halliard is rove “like a luff tackle” between the fly-block and a single block on a long strap, hooked to a swivel eye-bolt in the ${adj} channel.` },
        { p: [fly[0] + 0.4, fly[1] + 0.4, fly[2]], inferred: mizen },
        { p: hall.lead, mark: 'lead', inferred: mizen, step: fore ? 'The hauling part comes in over the side through a leading block. Steel puts the fore topsail’s “abaft the forecastle”, at the fore end of the gangway.' : `The hauling part comes in over the side through a leading block lashed on the ${m.deckName}.` },
        { p: hall.belay, mark: 'belay', inferred: true, step: 'Belayed at the side. Neither Steel nor Lever names the fitting.' },
      ],
      purchase: mizen
        ? 'About 4 to 1 if the single tye is a plain runner with a luff purchase on its end. My arithmetic.'
        : 'About 8 to 1 on each side, before friction: the tye is a whip on the yard (2), and the halliard a luff purchase with the double block moving (4). The figure is my arithmetic from the blocks Steel lists, not a number he gives.',
      belay: {
        short: fore ? 'Gangway, at the side' : mizen ? 'Poop, at the side' : 'Quarterdeck, at the side', level: 'weather', status: 'inferred',
        text: fore
          ? 'At the ship’s side just abaft the forecastle. Steel says only that the leading part “comes in through a block lashed on each side; the foremost ones abaft the forecastle”. A modern kit plan of Victory uses the aftermost forecastle kevel.'
          : mizen
            ? 'Not described for the mizen. Drawn on the poop at the side by analogy with the other two masts; a modern kit plan of Victory uses a cleat on the poop.'
            : 'On the quarterdeck at the ship’s side, abaft the main shrouds. Steel says only that the leading part “comes in through a block lashed on each side … the after ones on the quarter-deck”. A modern kit plan of Victory uses the aftermost quarterdeck kevel, which is a guess for a 74.',
      },
      worked: 'Hoisted after the sail is sheeted home, until the leech is taut. To reef, “the Halliards are let fly” (Lever) and the yard comes down on the cap. The halliards come down outside the ship to the channels, well clear of everything at the foot of the mast, so a long line of men can walk away with them along the deck.',
      rope: main ? 'Tye 6 in., 46 fathoms; halliards 3½ in., 144 fathoms.' : null,
      notes: [
        'Steel recommends a whip-upon-whip for halliards that hoist with a single tye, because it “will overhaul with great facility”.',
        'With a single pair of halliards the working one was wanted on the weather side: Lever describes a short-tye variant “to avoid the necessity of shifting the Topsail Halliards over to windward, when there is but one pair”.',
      ],
      sources: mizen ? ['S 205', 'L 38', 'L 39', 'S74 38'] : ['S 205', 'L 38', 'L 39', 'S74 36', 'L 83'],
    };

    // --- Lifts -------------------------------------------------------------
    const lifts = {
      id: 'lifts',
      group: 'yard',
      name: 'Lifts',
      does: 'Hold the yardarms up. They keep the yard level, top one arm above the other when that is wanted, and carry the weight of the men when the yard is crowded for reefing or furling.',
      path: [
        { p: [x0, 1.2, m.tmCapZ], mark: 'fast', step: 'The standing part hooks to a becket round the topmast cap.' },
        { p: [yx, m.tyHalf, ty + 0.4], mark: 'block', step: 'Down to the lift block at the yardarm.' },
        { p: [x0 + 0.4, 2.2, ty + 2.5], mark: 'block', step: 'Up through the lower sheave of the sister block, which is seized between the two foremost topmast shrouds.' },
        { p: [x0 + 1.2, 3.6, m.topZ], mark: 'lead', inferred: true, step: 'It “leads down the side of the mast” (Steel). Neither source says whether that is inside the top or outside it; it is drawn through the lubber’s hole.' },
        { p: [x0 + 3.2, m.channelY - 0.4, m.channelZ + 1.4], mark: 'belay', step: 'Belays “to the dead-eyes in the lower shrouds”. Lever has it “hitched round one of the lower Shrouds, above the Dead Eye”.' },
      ],
      purchase: '2 to 1: a whip, with the moving block at the yardarm. Lever adds that large ships sometimes turn a block into the lower end and set it up with a second whip.',
      belay: { short: `Deadeyes, ${adj} shrouds`, level: 'weather', status: 'period', text: `At the deadeyes of the ${adj} lower shrouds, in the ${adj} channel. It is hitched there, not taken to a cleat or pin.` },
      worked: 'Seldom, once the yard is hoisted and squared. The lifts go slack when the yard is lowered, and are hauled taut again with the yard on the cap so the men can lay out.',
      rope: main ? '3½ in., 80 fathoms.' : null,
      notes: ['Until about 1790 the topsail lifts also served as the topgallant sheets (Falconer 1769). Steel and Lever give the topgallant sail sheets of its own. The date comes from Lees, at second hand.'],
      sources: ['S 204', 'L 38', 'S74 36', 'F LIFTS'],
    };

    // --- Braces ------------------------------------------------------------
    const arm = [yx + 1, m.tyHalf + 0.6, ty - 0.6];
    const pendent = 'Steel hangs it on a short pendent; Lever says “Brace Pendents are now seldom used” and lashes the block to the yardarm.';
    const braces = {
      main: {
        does: 'Swing the yard round the mast. Hauling the starboard brace and easing the larboard brings the starboard yardarm aft. Every yard is braced from the next mast aft, so the main topsail yard is worked from the mizen mast, on the poop.',
        path: [
          { p: [148.6, 0.8, 69.5], mark: 'fast', step: 'The standing part is made fast “to the collar of the mizen-stay”, at the mizen masthead.' },
          { p: arm, mark: 'block', step: 'Forward to the brace block at the yardarm. ' + pendent },
          { p: [149.2, 1.4, 63.5], mark: 'block', step: 'Aft again to “a block in the span round the mizen-mast-head below the hounds”.' },
          { p: [152.6, 1.6, 26.3], mark: 'belay', step: 'Down the mizen mast, “through a sheave-hole in the mizen-topsail-sheet-bits, abaft the mizen-mast, and belays there”.' },
        ],
        belay: { short: 'Mizen topsail-sheet bitts', level: 'weather', status: 'period', text: 'The mizen topsail-sheet bitts, abaft the mizen mast. Steel names the bitts. That they stand on the poop is my reading of the Admiralty draughts, where the mizen mast of a 74 comes up through the poop.' },
        notes: [
          'Lever thinks this lead a poor one. Taking the brace down to the mizen masthead “has the effect of canting the Yard when up at the Mast Head, particularly if the Main Tack be not on board”. He would rather the standing part went higher.',
        ],
        sources: ['S 204', 'L 49', 'S 202', 'L 33'],
      },
      fore: {
        does: 'Swing the yard round the mast. Every yard is braced from the next mast aft, so the fore topsail braces go to the main stay, which runs down from the main masthead towards the foot of the foremast. They follow it forward again and are hauled at the after end of the forecastle.',
        path: [
          { p: [93, 0.7, 76.4], mark: 'fast', step: 'The standing part is made fast “to the stay below the block”: the main stay, near the main masthead.' },
          { p: arm, mark: 'block', step: 'Forward to the brace block at the yardarm. ' + pendent },
          { p: [94, 1.1, 77.2], mark: 'block', step: 'Aft to a block “on each side the collar on the main-stay, a little below the fore-braces”.' },
          { p: [60, 0.8, 51], mark: 'block', step: 'Forward down the stay to “a block lashed on the stay abreast the fore hatchway”.' },
          { p: [51, 6.5, 19.2], mark: 'block', step: 'Down to “a block strapt with a thimble into an eye-bolt in the aft-part of the forecastle”.' },
          { p: [62, 9, 20.6], mark: 'belay', step: '“And belays round an iron pin in the boat-skid”: the foremost of the beams that cross the waist.' },
        ],
        belay: { short: 'Pin in the boat skid', level: 'weather', status: 'period', text: 'An iron belaying pin in the foremost boat skid, at gangway level just abaft the forecastle. This is one of the places Steel puts a belaying pin: they existed in this period, in skids, rails and racks, though not in a long rail along the bulwark.' },
        notes: [
          'Lever’s “better method” takes the standing part to the main topmast stay instead, so that “it does not pull the Yard so much down”.',
          'In merchant ships the fore, fore topsail and fore topgallant braces were “generally led down by the Mainmast, and belayed together there” (Lever). That is not the naval lead.',
        ],
        sources: ['S 204', 'L 48', 'S 202', 'L 33', 'S 171'],
      },
      mizen: {
        does: 'Swing the yard round the mast. There is no mast abaft the mizen, so with a standing gaff the mizen topsail braces go aft to its peak and come down at the taffrail.',
        path: [
          { p: [G.gaffPeak[0], 0.5, G.gaffPeak[1]], mark: 'fast', step: 'The standing part is made fast “round the peek-end”.' },
          { p: arm, mark: 'block', step: 'Forward to the brace block at the yardarm.' },
          { p: [G.gaffPeak[0] - 0.6, 0.9, G.gaffPeak[1] - 0.6], mark: 'block', step: 'Aft again through “single blocks at the peek”.' },
          { p: [186, 5, 26.6], mark: 'belay', step: '“And comes down to the fore-side of the taffarel.” The fitting is not named.' },
        ],
        belay: { short: 'Fore side of the taffrail', level: 'weather', status: 'period', text: 'On the poop at the fore side of the taffrail. Steel gives the place and not the fitting; the vangs nearby belay to “a cleat nailed on the taffarel fife-rail”.' },
        notes: [
          'This depends on the gaff. Lever: “When the Gaff hoists up and down, the Mizen Topsail and Top-gallant Braces are also led forwards, and commonly go single: the Topsail Brace is reeved through a double Block, strapped to an Eye-bolt in the after part of the Main Cap”. With the gaff or mizen yard slung, they go to the peak as drawn. A naval gaff of 1805 was usually a standing one.',
        ],
        sources: ['S 204', 'L 49'],
      },
    }[adj];
    const brace = Object.assign({
      id: 'braces',
      group: 'yard',
      name: 'Braces',
      purchase: '2 to 1 at the yardarm: the brace is a whip with its standing part fixed in the ship.',
      worked: main
        ? 'Whenever the yards are trimmed, and in every tack and wear. At “Main-sail haul!” the lee braces of the main and mizen yards are let go and the weather braces hauled, swinging the after yards round together while the head yards stay aback. The main topsail brace moves with the main brace: the topsail’s clews are sheeted to the main yardarms, so the two yards have to turn as one.'
        : fore
          ? 'Whenever the yards are trimmed. In tacking the head yards are left aback to push the bow round, and are swung last, at “Let go and haul!”.'
          : 'Whenever the yards are trimmed. In tacking the mizen topsail yard swings with the main yards at “Main-sail haul!”.',
    }, braces);
    brace.notes = brace.notes.concat(['The yards are drawn square. Braced sharp up for sailing close-hauled, the lee brace runs almost along the ship.']);

    const preventer = {
      id: 'preventer-braces',
      group: 'yard',
      name: 'Preventer braces',
      does: 'A second pair of braces rigged in wartime, “to supply the place of a brace, should that be shot away or damaged. They are led the contrary way, to be less liable to detriment at the same time” (Steel).',
      path: null,
      lead: 'Not drawn. Steel’s table lists preventer pendents for the fore and main topsail yards and marks the preventers “in War only”, but he describes the lead only for the lower yards, where they go forward. By analogy the topsail yard’s would lead forward too; that is a guess.',
      worked: 'Rigged when clearing for action.',
      sources: ['S 163', 'S 202', 'S74 36'],
    };

    const parrel = {
      id: 'parrel',
      group: 'yard',
      name: 'Parrel',
      also: 'parral (Steel, Lever)',
      does: 'Holds the yard in to the topmast while letting it slide up and down and swing. “The parral is fastened round the aftside of the mast, and round the yard” (Steel). On a topsail yard it is the ribs-and-trucks kind: wooden rollers threaded on ropes, kept apart by upright ribs.',
      path: null,
      extra: [[[x0 - 1.2, -1.7, ty], [x0 + 1.1, -1.7, ty], [x0 + 1.1, 1.7, ty], [x0 - 1.2, 1.7, ty]]],
      mirror: false,
      lead: 'It does not come down. “Sufficient play must be left for the Yards to brace sharp up” (Lever).' + (main ? ' A 74 has one 25-inch parrel on this yard.' : ''),
      worked: 'Left alone. In a seaway a rolling tackle is clapped on to save it from chafe.',
      sources: ['S 205', 'L 39', 'S 170'],
    };

    const h = m.tyHalf;
    const horses = {
      id: 'horses',
      group: 'yard',
      name: 'Horses, stirrups and Flemish horses',
      also: 'footropes (later). “Foot rope” in Lever means the bolt-rope along the foot of a sail.',
      does: 'What the men stand on. A horse hangs about three feet under each side of the yard, held up at intervals by stirrups. The Flemish horse is a short extra one at each yardarm for the man who passes the earing. Lower yards have none.',
      path: null,
      extra: [
        [[yx + 0.5, h - 1, ty - 0.4], [yx + 0.5, h * 0.8, ty - 2.8], [yx + 0.5, h * 0.57, ty - 3], [yx + 0.5, h * 0.34, ty - 3], [yx + 0.5, 4, ty - 2.7], [yx + 0.5, -2.5, ty - 0.8]],
        [[yx + 0.5, h * 0.8, ty - 0.4], [yx + 0.5, h * 0.8, ty - 2.8]],
        [[yx + 0.5, h * 0.57, ty - 0.3], [yx + 0.5, h * 0.57, ty - 3]],
        [[yx + 0.5, h * 0.34, ty - 0.2], [yx + 0.5, h * 0.34, ty - 3]],
        [[yx + 0.5, h, ty], [yx + 0.5, h - 2, ty - 1.7], [yx + 0.5, h - 4.5, ty - 0.3]],
      ],
      lead: 'Each horse goes over the yardarm with an eye and its inner end is lashed to the yard on the far side of the middle, so the two cross at the slings. The Flemish horse has “an eye spliced in each end; one eye is put over the eye-bolt in the yard-arm, and the other eye is seized round the yard within the arm-cleats” (Steel).',
      worked: 'Lever insists the horses be moused to the stirrups. Otherwise the horse runs through them under the first man out, and the lone man at the yardarm “can have but little hold”.',
      notes: ['Steel’s text gives four stirrups a side on a lower yard; his 74 table lists six for a whole topsail yard. Three a side are drawn.'],
      sources: ['S 204', 'S 202', 'L 38', 'L 83', 'S74 36'],
    };

    // --- Sheets ------------------------------------------------------------
    const sheetEnd = {
      main: { p: [93.2, 2, 12.5], short: 'Main topsail-sheet bitts', level: 'upper', text: 'The main topsail-sheet bitts on the upper deck, just before the mainmast, at the break of the quarterdeck. Steel’s glossary says they “tenon into the fore-mast-beam of the quarter-deck”. That is a deck below the forecastle and quarterdeck. The sheave-holes in the bitts are the last lead block; the sheet is held on a stopper while it is made fast.' },
      fore: { p: [17.4, 2, 19.5], short: 'Fore topsail-sheet bitts', level: 'weather', text: 'The fore topsail-sheet bitts on the forecastle. Steel says the fore jeer and topsail-sheet bitts stand “on the forecastle and round the fore-mast”, and that the sheets “come down before the mast”, so the pair before the mast is taken to be the sheet bitts. The sheet is held on a stopper while it is made fast.' },
      mizen: { p: [152.6, 2, 26.3], short: 'Mizen topsail-sheet bitts', level: 'weather', text: 'The mizen topsail-sheet bitts, which Steel places “abaft the mizen-mast”. He describes the mizen topsail’s sheets only as “as the fore-topsail”.' },
    }[adj];
    const sheets = {
      id: 'sheets',
      group: 'sail',
      name: 'Sheets',
      does: `Hold the two lower corners of the sail down and out to the arms of the ${m.lowerYard}. This is what separates a topsail from a course: a course’s clews go to the hull, a topsail’s go to the yard beneath it, and its sheets then run in along that yard and down the mast.` + (mizen ? ' It is the whole reason the mizen has a crossjack yard.' : ''),
      path: [
        { p: [sx, S.clewY, S.clewZ], mark: 'fast', step: 'The end is thrust through the clew and stopped with a knot. Lever: “a double walled Knot, double crowned … the Knot lying aft”.' },
        { p: [yx, m.yardHalf - 1.5, m.yardZ + 0.8], mark: 'block', step: mizen ? 'Through the sheet block at the crossjack yardarm.' : `Through the shoulder block at the arm of the ${m.lowerYard}.` },
        { p: [yx, 2, m.yardZ - 1.1], mark: 'block', step: mizen ? 'In along the crossjack yard to the quarter block lashed at its middle.' : `In along the underside of the ${m.lowerYard} to the quarter block, “lying under the Yard at the Sling Cleats”.` },
        { p: sheetEnd.p, mark: 'belay', step: mizen ? 'Down the mast to the bitts.' : 'Down before the mast, through a sheave-hole in the topsail-sheet bitts, “and are there belayed”.' },
      ],
      purchase: 'None. The sheet is a single rope from clew to bitts. It holds by being very thick and is hauled by a long line of men. Lever mentions a doubled variant with a block at the clew.',
      belay: { short: sheetEnd.short, level: sheetEnd.level, status: 'period', text: sheetEnd.text },
      worked: '“Sheet home!” hauls the clews down to the yardarms below before the yard is hoisted. The lee sheet goes first, “because the wind blowing the Sail over to leeward, the lee Sheet will almost come home of itself” (Lever). To take the sail in, the sheets are eased as the clewlines are hauled.',
      rope: main ? '8½ in., 60 fathoms, with two stoppers.' : mizen ? '5 in., against 8½ in. on the main.' : null,
      notes: [
        'The quarter block is a double block with one thick and one thin sheave. The thin one was meant for the clewline of the course below, but Steel says it “is seldom used … it being found to impede rather than facilitate”.',
        mizen ? '“The cross-jack-yard is used to expand the foot of the mizen topsail” (Steel).' : `The clew garnets and slablines of the ${adj} course belay at the same bitts.`,
      ],
      sources: mizen ? ['S 213', 'S 207', 'S 204', 'S 180', 'L 54', 'S74 38'] : ['S 212', 'L 54', 'S 203', 'S 162', 'S 235', 'S74 36', 'L 84'],
    };

    const clewlines = {
      id: 'clewlines',
      group: 'sail',
      name: 'Clewlines',
      also: 'clue-lines (Steel, Falconer), clew-lines (Lever). On a course the same job is done by clew garnets.',
      does: 'Haul the clews up and in to the quarters of the topsail yard, the opposite pull to the sheets. They take the sail in, and they pull the yard down when the halliards are let go.',
      path: [
        { p: [yx, 4.6, ty - 0.6], mark: 'fast', step: 'The standing part is hitched round the yard just outside its block.' },
        { p: [sx, S.clewY - 0.6, S.clewZ + 0.7], mark: 'block', step: 'Down to a block at the clew of the sail.' },
        { p: [yx, 3.6, ty - 0.8], mark: 'block', step: 'Back up to the clewline block, which hangs under the yard “three feet without the slings”.' },
        { p: [x0 - 0.4, 3.2, m.topZ], mark: 'lead', step: '“The leading parts go through Lubber’s Hole” (Lever).' },
        { p: [x0 + 1.8, 5, m.deckZ + 0.5], mark: 'belay', inferred: true, step: 'Steel says only that it “leads down upon the deck”. The fitting is not named; it is drawn at the foot of the mast.' },
      ],
      purchase: '2 to 1, with the moving block at the clew. Steel notes that clewlines “sometimes have no blocks, but bend to the clue of the sail”.',
      belay: { short: `Near the ${m.mastName} (not named)`, level: 'weather', status: 'inferred', text: `Not stated by Steel or Lever. Modern kit plans of Victory take the main topsail’s to a pin in the rail abreast the mainmast and the fore topsail’s to a shroud cleat. Drawn on the ${m.deckName} near the mast and marked as inferred.` },
      worked: 'Taking in a topsail, “the Weather Sheet is first clewed up, because the Sail naturally flies to leeward, and keeps full: then the Bowline, and lee Sheet, being let go, the Sail catches aback … and is taken in almost without a Shake: for if the lee Sheet were eased off first, the Sail might shake so violently as to split” (Lever). When the yard is hoisted again the men in the top overhaul the clewlines so they do not bind the sail.',
      rope: main ? '4 in., 108 fathoms.' : null,
      sources: ['S 205', 'S 212', 'L 54', 'L 86', 'L 84', 'S74 36'],
    };

    const buntZ = m.deckZ + 7;
    const buntlines = {
      id: 'buntlines',
      group: 'sail',
      name: 'Buntlines',
      does: 'Lift the foot of the sail straight up the fore side to the yard, spilling the wind out of the belly. A topsail has two, each a single rope. A course has four on legs and falls.',
      path: [
        { p: [sx - 0.2, buntY, footZ(S, buntY)], mark: 'fast', step: 'Clinched to a cringle in the foot of the sail.' },
        { p: [sx - 0.1, 1.6, ty + 0.6], mark: 'block', step: 'Up the fore side of the sail to a block spliced round the strap of the tye-block on the yard.' },
        { p: [x0 - 0.8, 2.6, m.crossZ - 0.9], mark: 'block', step: 'On up to “a single-block, lashed close under the topmast-cross-trees”.' },
        { p: [x0 - 0.5, 3.8, m.topZ], mark: 'lead', step: '“Leads down through the square of the top”.' },
        { p: [x0 + 2.7, shroudY(m, buntZ), buntZ], mark: 'belay', step: `“And belays to the shrouds”: the ${adj} lower shrouds, near the deck.` },
      ],
      purchase: 'None; a single rope.',
      belay: { short: `${adj[0].toUpperCase() + adj.slice(1)} shrouds`, level: 'weather', status: 'period', text: `The ${adj} lower shrouds, abreast the mast. Steel does not say whether to a shroud cleat or a pin rack seized across the shrouds; both existed.` },
      worked: '“If the Buntlines be kept fast when the Halliards are let go, they assist in spilling the Sail” (Lever). Overhauled from the top when the sail is set, so they hang slack down its face.',
      rope: main ? '3 in., 78 fathoms.' : null,
      notes: ['Lever notes a drawback of taking them to the masthead: “it is thought they prevent the Yard coming down readily”. Merchant ships led them through blocks on the yard instead, which makes them “act as down-haul Tackles”.'],
      sources: ['S 212', 'S 205', 'L 55', 'L 83', 'S74 36'],
    };

    const leechlines = {
      id: 'leechlines',
      group: 'sail',
      name: 'Leech-lines',
      does: 'On a course, leech-lines haul the side edge of the sail in and up to the yard. Whether a topsail had them is an open question.',
      path: null,
      lead: `Not drawn, because no lead is recorded. Steel’s table for a 74 lists “Leech-lines, 2” for each topsail (${main ? '2½ in., 36 fathoms' : fore ? '2½ in., 34 fathoms' : '2 in., 18 fathoms'} here). His text describes none, and neither does Lever. Lees would be the place to settle it.`,
      sources: ['S74 36', 'S 169'],
    };

    // --- Bowlines ----------------------------------------------------------
    const bow = {
      main: {
        path: [
          { p: [21.2, 1.6, 82.5], mark: 'block', step: 'Forward to a block at the foremast head, “close under the cap”. Lever seizes it “to an Eye-bolt in the after part of the Fore Cap”.' },
          { p: [21, 2.6, 70], mark: 'lead', step: '“Comes down through the square of the top”: the fore top.' },
          { p: [24.5, 2, 19.5], mark: 'belay', step: '“Reeves through a sheave-hole in the maintop-bowline-bitts upon the forecastle, and there belays”.' },
        ],
        belay: { short: 'Main-top-bowline bitts', level: 'weather', status: 'period', text: 'The “maintop-bowline-bitts upon the forecastle”. The Admiralty draughts show only two sets of bitts on a 74’s forecastle, one before the foremast and one abaft it, so this is probably a name for the after pair. That identification is inferred.' },
        tail: ' A main-mast sail trimmed from the forecastle: the belaying plan is not “each mast’s ropes round its own mast”.',
        bridles: 'Steel’s table gives two bridles a side. Lever says the main topsail “in Men of War and East Indiamen” has four bowline cringles, “consequently three Bridles”. Two are drawn.',
      },
      fore: {
        path: [
          { p: [G.bowspritCap[0] + 0.5, 1.2, G.bowspritCap[1]], mark: 'block', step: 'Forward “through the blocks at the bowsprit-cap”.' },
          { p: [17.4, 3.4, 19.5], mark: 'belay', step: 'It “comes upon the forecastle” and belays “to the topsail-sheet-bitts”.' },
        ],
        belay: { short: 'Fore topsail-sheet bitts', level: 'weather', status: 'period', text: 'The fore topsail-sheet bitts on the forecastle, taken to be the pair before the foremast.' },
        tail: '',
        bridles: 'Lever gives the fore topsail three bowline cringles and two bridles, which agrees with Steel’s table.',
      },
      mizen: {
        path: [
          { p: [100.6, -8.6, 62], mark: 'block', step: 'Forward and across to “a single-block seized to the main-shrouds on the opposite side near the futtock-staff”.' },
          { p: [105.5, -19.6, 30], mark: 'lead', step: 'Down the shroud “through a seizing-truck upon the quarter-deck”. A truck is a wooden fairlead seized to a shroud so the rope can always be found in the same place.' },
          { p: [107.5, -20.8, 22.6], mark: 'belay', step: '“And belay round a pin in the fife-rail.”' },
        ],
        belay: { short: 'Pin in the fife-rail', level: 'weather', status: 'period', text: 'A pin in the fife-rail on the quarterdeck, abreast the main shrouds, on the side opposite to the bowline’s own. In this period the fife-rail is the open rail along the top of the quarterdeck and poop sides, not a rail round the foot of a mast.' },
        tail: ' The mizen topsail’s bowlines cross: the starboard one belays to larboard.',
        bridles: 'Lever gives the mizen topsail three bowline cringles, or two.',
      },
    }[adj];
    const bowlines = {
      id: 'bowlines',
      group: 'sail',
      name: 'Bowlines and bridles',
      also: 'pronounced “bo-lin”',
      does: 'Pull the weather edge of the sail forward and hold it steady when the ship is close-hauled, so the leech does not curl back and shake. The bowline is one rope; the bridles are the short legs that spread its pull along the leech. Only the weather bowline is in use.',
      path: [{ p: bridle, mark: 'fast', step: 'The bridles are made fast to cringles on the leech, and the bowline to the bridles.' }].concat(bow.path),
      extra: [[bridle, [sx, leechY(S, b1), b1]], [bridle, [sx, leechY(S, b2), b2]]],
      purchase: 'None; a single rope.',
      belay: bow.belay,
      worked: 'Hauled last when the yards are braced up: “the Yards braced up, the Bowlines hauled” (Lever). “To check the Bowline, is to slacken it, when the wind becomes large” (Falconer). In tacking the bowlines are let go with the braces and hauled again on the new weather side.' + bow.tail,
      notes: [bow.bridles],
      sources: mizen ? ['S 213', 'S 169', 'L 58', 'L 57', 'F BOWLINE', 'S 179'] : ['S 212', 'S 169', 'L 57', 'L 54', 'F BOWLINE', 'L 84'],
    };

    const reefTackles = {
      id: 'reef-tackles',
      group: 'sail',
      name: 'Reef tackles',
      does: 'Haul the leech of the sail up to the yardarm, taking the weight off the reef cringle so the man at the yardarm can pass the earing. In this period only topsails have them.',
      path: [
        { p: [sx, leechY(S, rtZ), rtZ], mark: 'fast', step: 'The pendent is clinched to the reef-tackle cringle on the leech, “between the lower Reef and upper Bow-line Cringle” (Lever).' },
        { p: [yx, m.tyHalf - 0.7, ty], mark: 'lead', step: 'Up through the sheave-hole in the yardarm.' },
        { p: [x0 + 0.4, 2.2, ty + 4], mark: 'block', step: 'In along the yard and up through the upper sheave of the sister block in the topmast shrouds. The lift uses the lower sheave.' },
        { p: [x0 + 1.8, 3, m.topZ + 19], mark: 'block', step: 'A double block is turned into the lower end of the pendent.' },
        { p: [x0 + 2.8, 3, m.topZ - 0.8], mark: 'block', step: 'Its fall goes to a second double block “seized to the after part of the lower trestle-trees”. Lever has a single block here and calls it a luff-tackle purchase.' },
        { p: [x0 + 3, 5.5, m.deckZ + 0.5], mark: 'belay', inferred: true, step: '“The ends of the falls lead down upon deck.” The fitting is not named.' },
      ],
      purchase: 'About 4 or 5 to 1 from the two double blocks. My arithmetic; neither author gives a figure.',
      belay: { short: `Near the ${m.mastName} (not named)`, level: 'weather', status: 'inferred', text: `Not stated. Lever adds only “through a leading Block”. Drawn on the ${m.deckName} near the mast and marked as inferred.` },
      worked: 'In reefing, after the halliards are let go and the yard is down: “The Reef Tackles are hauled out, and the Men go on the Yard”. Let go again before the sail is hoisted. They are also used to haul the sail up to the yard for bending, and “when the Sail (after being close reefed) is handed, the Weather Reef-Tackle being boused taught, acts as a rolling Tackle” (Lever).',
      rope: main ? 'Pendents 4 in., 50 fathoms; falls 2½ in., 84 fathoms.' : null,
      sources: ['S 205', 'S 212', 'L 38', 'L 54', 'L 55', 'L 83', 'S 177', 'S74 36'],
    };

    const reefsText = {
      main: 'The main topsail “has sometimes four Reefs” (Lever); the lowest is the close reef.',
      fore: 'Four are drawn for the fore topsail, from the ten earings in Steel’s table: two for the head and two for each reef.',
      mizen: '“The mizen topsail has only two Reefs” (Lever). Steel’s table lists eight earings, which would be three; three are drawn.',
    }[adj];
    const reefs_ = {
      id: 'reefs',
      group: 'sail',
      name: 'Reef bands, points and earings',
      also: 'earing, earring',
      does: 'How the sail is shortened. Each reef band is a strip across the sail with a row of points: short plaited cords, knotted through the canvas, that are tied round the yard. A reef earing at each end of the band lashes the leech to the yardarm. ' + reefsText,
      path: null,
      extra: reefZ.map((z) => [[sx, -leechY(S, z), z], [sx, leechY(S, z), z]]),
      mirror: false,
      lead: 'Nothing leads to the deck. The earing is passed by the man at the yardarm: “he takes two outer turns, and expends the remainder of the Earings in inner ones”. The outer turns stretch the band along the yard, the inner turns hold it close, and “the inner turns have the whole strain of the Leech to bear when the Sail is hoisted, and the Bowline hauled” (Lever). Then the points are “made fast with Reef Knots”.',
      worked: 'The weather earing is hauled out first, “because the lee one is easily got out by the Sail blowing over to leeward” (Lever).',
      sources: ['S 172', 'S 184', 'S 211', 'L 54', 'L 57', 'L 83', 'S74 36'],
    };

    const robands = {
      id: 'robands',
      group: 'sail',
      name: 'Head earings, robands and gaskets',
      also: 'rope-bands (Steel), robins',
      does: 'What holds the sail to the yard. Head earings lash its two upper corners to the yardarms. Robands tie the head of the sail round the yard along its length. Gaskets are the long plaited cords that bind the furled sail to the yard.',
      path: null,
      extra: [[[sx + 0.2, -S.headY, S.headZ], [sx + 0.2, S.headY, S.headZ]]],
      mirror: false,
      lead: 'Each roband has a long and a short leg through an eyelet in the head of the sail: “The long legs come over the yard from the foreside … the short leg comes up the aft side, and makes fast with a reef-knot upon the yard” (Steel). The sail is bent round the yard itself. Jackstays along the top of the yard, which every later ship has, date from about 1811 and appear in Lever only as a novelty in his 1819 appendix.',
      worked: 'In furling, the sail is tossed on top of the yard with a smooth “skin” outermost and the gaskets passed, “taken clear of the top-sail sheets” (Lever).',
      sources: ['S 211', 'S 212', 'S 172', 'S 167', 'L 53', 'L 54'],
    };

    const rolling = {
      id: 'rolling-tackle',
      group: 'occasional',
      name: 'Rolling tackle',
      does: 'Steadies the topsail yard in a seaway so it does not saw at the mast and wear out the parrel.',
      path: null,
      lead: 'Not drawn. A luff tackle hooked to a strap round the lower cap and to another “round the inner quarter of the yard”, bowsed tight in the top (Steel). Lever claps one on to windward with “the Fall leading down upon Deck: when the Ship rolls over to leeward, this Tackle is bowsed taught and belayed, which confines the Yard so that it has no play to chafe the Mast”.',
      purchase: 'A luff tackle: 3 or 4 to 1.',
      worked: 'With the topsail reefed and the ship rolling.',
      sources: ['S 233', 'S 177', 'L 86'],
    };

    const spilling = {
      id: 'spilling-lines',
      group: 'occasional',
      name: 'Spilling lines',
      does: 'Pass right round the sail and gather it bodily, to spill it in heavy weather.',
      path: null,
      lead: 'Not drawn. “Spilling-lines of topsails have two legs, which are each made fast with a timber-hitch round the quarters of the topsail yards, then lead down on the aftside, return upwards under the foot of the sail, and reeve through a block on the fore-side, lashed to the tye-block on the yard, and then lead upon deck abaft the mast” (Steel). They are in his glossary but not in his rigging sequence or his 74 table, and Lever spills a topsail with the buntlines, clewlines and weather brace instead.',
      worked: 'Heavy weather only; that they were rigged for the occasion is my inference from their absence elsewhere.',
      sources: ['S 169', 'L 83', 'L 86'],
    };

    const lines = [halliards, lifts, brace].concat(mizen ? [] : [preventer], [parrel, horses, sheets, clewlines, buntlines, leechlines, bowlines, reefTackles, reefs_, robands], mizen ? [] : [rolling, spilling]);

    const notice = {
      main: `
        <h2>What to notice</h2>
        <h3>The sail is worked from four different places</h3>
        <p>Nothing about a topsail is handled from one spot. The halliards come down outside the ship to the main channels and are hauled along the quarterdeck. The sheets come down the mast to the bitts on the upper deck, a level below the quarterdeck. The braces go aft to the mizen mast and are worked on the poop. The bowlines go forward to the foremast and are worked on the forecastle. An order like “let go and haul” sets men moving at three masts at once.</p>
        <h3>Some lines pass through the top and some go round it</h3>
        <p>Clewlines, buntlines and the bowline come down through the lubber’s hole, the opening in the top beside the masthead, which Steel calls “the square of the top”. The halliards go down abaft the top and outside it, to the channels. That keeps the heaviest purchase on the mast clear of the light gear at its foot.</p>
        <h3>The sheet has no purchase at all</h3>
        <p>Almost every heavy line aloft is a thick pendent or tye with a lighter tackle on its lower end. The topsail sheet is the exception: one rope, eight and a half inches round, from the clew to the bitts. It is held by a stopper while it is made fast.</p>
        <h3>The topsail hangs on the yard below it</h3>
        <p>The clews are sheeted to the main yardarms, and the sheets run in under the main yard to the quarter block before they turn down. So the main yard is the spreader for the topsail’s foot, and the two yards have to be braced round together.</p>
        <h3>The lighter the job, the higher the line stops</h3>
        <p>The sheets and halliards, which need many men, come to the deck. The lifts and buntlines, which one or two men can handle, stop at the shrouds. On the topgallant sail above, the lifts and the buntline go no lower than the top.</p>
        <h2>Where the sources disagree or go quiet</h2>
        <ul>
          <li><b>Belaying points.</b> Steel and Lever leave the clewlines and the reef-tackle falls at “upon deck”, and the halliards at “on the quarter-deck”. Those three are drawn at inferred positions and marked. James Lees’s <i>Masting and Rigging of English Ships of War</i> has belaying plans that would settle them; I could not read it.</li>
          <li><b>Leech-lines.</b> Steel’s table of rigging for a 74 lists a pair for each topsail. His own text and Lever’s describe none.</li>
          <li><b>Bowline bridles.</b> Two a side in Steel’s table, three in Lever for men-of-war.</li>
          <li><b>Brace pendents.</b> Steel hangs the brace block on a pendent; Lever, fourteen years later, says they “are now seldom used”.</li>
          <li><b>Stirrups.</b> Steel’s text and Steel’s table give different numbers.</li>
          <li><b>The brace lead.</b> Lever describes the lead to the mizen masthead and then says what is wrong with it.</li>
          <li><b>How many men.</b> Neither book says how many hands went to any rope.</li>
        </ul>`,
      fore: `
        <h2>What to notice</h2>
        <h3>The same gear as the main topsail, led to different places</h3>
        <p>Line for line the fore topsail matches the main. Steel describes the fore topsail’s gear and then says of the main, “as the fore-topsail”. The differences are all in where things go.</p>
        <h3>Its braces come back to the forecastle</h3>
        <p>The fore yard’s own braces are hauled from the quarterdeck, abaft the mainmast. The fore topsail’s go to the same main stay but then follow it forward again, to a pin in the boat skid at the after end of the forecastle. The fore topgallant’s stop at the belfry. So on this mast the higher the sail, the further <i>forward</i> its brace is worked, which is the opposite of the rule often quoted for later ships.</p>
        <h3>Its bowlines go out to the bowsprit</h3>
        <p>There is no mast ahead of the foremast, so the bowsprit does the job: the fore course’s bowlines go to the fore stay collar on the bowsprit, the fore topsail’s to the bowsprit cap, and the fore topgallant’s right out to the jibboom end.</p>
        <h3>Everything of the sail lands on the forecastle</h3>
        <p>Sheets, clewlines, bowlines and buntlines all come down around the foremast. The forecastle men handle the fore topsail more or less on their own; only the halliards, which come in abaft the forecastle, and the braces need hands from elsewhere.</p>
        <h2>Where the sources go quiet</h2>
        <ul>
          <li><b>Which bitts are which.</b> The draughts show one pair of bitts before the foremast and one abaft it. Steel names fore jeer bitts, fore topsail-sheet bitts and “main-top-bowline bitts” on the forecastle without saying which pair is which.</li>
          <li><b>Belaying points</b> for the halliards, clewlines and reef-tackle falls are not named, as on the main.</li>
        </ul>`,
      mizen: `
        <h2>What to notice</h2>
        <h3>The crossjack yard exists for this sail</h3>
        <p>The mizen carries no square course. Its lower yard, the crossjack, is there only because a topsail’s clews have to be sheeted to something: “The cross-jack-yard is used to expand the foot of the mizen topsail” (Steel).</p>
        <h3>The braces have nowhere aft to go</h3>
        <p>Every other yard is braced from the next mast aft. The mizen has none, so its topsail braces go to the peak of the gaff and come down at the taffrail. Where the gaff hoists and lowers they cannot, and Lever leads them forward to the main cap instead. The crossjack yard below always braces forward, to the main shrouds.</p>
        <h3>The bowlines cross</h3>
        <p>The mizen topsail’s bowlines lead forward to the main shrouds on the opposite side and belay to pins in the fife-rail on the quarterdeck. The main course’s bowlines and the crossjack braces cross in the same way.</p>
        <h3>Everything is lighter</h3>
        <p>The mizen topsail’s sheets are 5 inches round against 8½ on the main; it has a single tye and one halliard where the others have two; and Lever gives it only two reefs.</p>
        <h2>Where the sources go quiet</h2>
        <ul>
          <li><b>Steel barely describes this sail.</b> Its sheets, clewlines and buntlines are “as the fore-topsail”. The single halliard’s lead and belaying point are not given at all and are drawn by analogy.</li>
          <li><b>Reefs.</b> Two in Lever; the earings in Steel’s table suggest three.</li>
          <li><b>Preventer braces, rolling tackles and spilling lines</b> are not listed for the mizen topsail yard and are left out.</li>
        </ul>`,
    }[adj];

    return { id: `${adj}-topsail`, mast: adj, tier: 'topsail', title: `The ${adj} topsail`, lines, start: 'sheets', notice };
  }

  SAILS.push(topsail(MASTS.fore), topsail(MASTS.main), topsail(MASTS.mizen));
})();
