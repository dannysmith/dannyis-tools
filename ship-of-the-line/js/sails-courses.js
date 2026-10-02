// The two courses (foresail and mainsail) and the crossjack yard, which
// carries no sail. A course differs from the sails above it in kind: its yard
// stays where it is slung, and its clews are held down to the hull.

(function () {
  const { G, MASTS, SAILS, shape } = window.RIGDATA;

  function course(m) {
    const x0 = m.x, yx = m.x - 1.5, sx = m.x - 2, yz = m.yardZ, h = m.yardHalf;
    const S = shape(m, 'course');
    const main = m.key === 'main';
    const adj = m.key;
    const Adj = adj[0].toUpperCase() + adj.slice(1);
    const sheetBitts = main ? [93.2, 3.2, 12.5] : [17.4, 3.2, 19.5];
    const sheetBittsBelay = main
      ? { short: 'Main topsail-sheet bitts', level: 'upper', status: 'period', text: 'The main topsail-sheet bitts on the upper deck before the mainmast, the same bitts the topsail sheets come to.' }
      : { short: 'Fore topsail-sheet bitts', level: 'weather', status: 'period', text: 'The fore topsail-sheet bitts on the forecastle, taken to be the pair before the foremast.' };
    const breast = main ? [95.4, 8, 21.6] : [52.6, 8, 21.6];

    const jeerBitts = main ? [91.4, 3, 12.5] : [24.5, 3.2, 19.5];
    const jeers = {
      id: 'jeers',
      group: 'yard',
      name: 'Jeers',
      also: 'jears (Steel, Lever, Falconer)',
      does: 'Hoist the lower yard into place and lower it again. “Jears, in large ships, are two large tackle” (Steel), one each side of the mast. Once the yard is up it hangs on the slings and the jeers are eased, so in ordinary sailing they carry nothing. “Jeer tackle” is not a kind of tackle: jeers are this one purchase.',
      path: [
        { p: [x0 - 1, 2.4, m.topZ + 3], mark: 'block', step: 'A treble block is lashed each side of the lower masthead, over a cleat.' },
        { p: [yx, 2.6, yz + 1.3], mark: 'block', step: 'A double block is lashed on the yard, “one on each side of the Strap for the Slings” (Lever). The fall goes “up abaft, through the outer Sheave-hole of the treble or upper Block, then before through the outer Sheave-hole of the double Block, and so on alternately: the end is hitched, or spliced, to the strap of the block”.' },
        { p: [x0 - 1.1, 2.7, m.topZ + 3] },
        { p: jeerBitts, mark: 'belay', inferred: true, step: '“The blocks, at the mast-head and on the yard, are connected by their falls, which lead upon deck” (Steel). That they are made fast at the jeer bitts is my reading of the name.' },
      ],
      purchase: 'About 5 to 1 on each side: five parts of the fall at the yard block. My arithmetic from Lever’s description of the reeving.',
      belay: {
        short: `${Adj} jeer bitts`, level: main ? 'upper' : 'weather', status: 'inferred',
        text: main
          ? 'Steel’s glossary puts “the main-jeer and topsail-sheet-bitts” at the foremost beam of the quarterdeck, on the upper deck, and his winding-tackle entry mentions “the jear-capstan” nearby in the waist. He does not say in so many words that the falls belay there.'
          : 'Steel’s glossary puts the fore jeer and topsail-sheet bitts “on the forecastle and round the fore-mast”. The pair abaft the mast is taken to be the jeer bitts; which pair carries which name is not established.',
      },
      worked: '“When Jears are carried, their Falls are stretched aft: and the Yard is swayed up by them” (Lever). After that only when a lower yard is struck or sent down. The table lists two stoppers for them.',
      rope: main ? '8 in., 148 fathoms; two treble and two double blocks of 28 in.' : null,
      notes: ['Small ships use a tye through single blocks, with a tackle on each end at the deck, instead of jeers.'],
      sources: ['S 203', 'L 34', 'L 35', 'S 162', 'S 235', 'S74 34'],
    };

    const slings = {
      id: 'slings',
      group: 'yard',
      name: 'Slings',
      does: 'Carry the yard once it is up. A strap with a thimble is lashed round the middle of the yard; the slings go round the masthead and hang a second thimble before the mast; a laniard is rove between the two. “The Jears or Tackles, are then eased off, and the Yard hangs by the Slings” (Lever).',
      path: null,
      extra: [[[x0 - 0.5, -1.7, m.topZ + 5], [yx, 0, yz + 1.2], [x0 - 0.5, 1.7, m.topZ + 5]]],
      mirror: false,
      lead: 'They do not come down. In ordinary service they are rope. “In time of action, the yards are slung with chains” (Steel); Lever has “Sometimes the lower Yards are slung with Chains”. So chain is the fitting for action, and this is what “slinging the yards” means when a ship clears for action.',
      worked: 'Under the yard, round the mast, is the puddening and dolphin: a thick wreath of rope “to sustain the weight of the yards, if an accident happens to the rigging” (Steel).',
      sources: ['S 204', 'L 35', 'L 36', 'S 233', 'L 37'],
    };

    const trussDeck = [x0 + 1.2, 3.2, m.deckZ + 0.5];
    const trusses = {
      id: 'trusses',
      group: 'yard',
      name: 'Truss pendents and nave-line',
      does: 'Hold the yard in to the mast, doing for a lower yard what a parrel does for a topsail yard. Slackened, they let the yard stand away from the mast so it can be braced sharp up; hauled taut, they pin it steady.',
      path: [
        { p: [yx, 1.3, yz - 0.7], mark: 'fast', step: '“One end passes over the yard, the other under, and both ends round the mast. The starboard end reeves through the larboard thimble, and the larboard end through the starboard thimble” (Steel).' },
        { p: [x0 + 1.2, 2.2, m.deckZ + (yz - m.deckZ) * 0.5], mark: 'block', step: 'A double block is turned into the lower end of each pendent.' },
        { p: trussDeck, mark: 'belay', step: 'Its fall goes to a double block that “hooks to an eye-bolt in the deck, on each side the mast, by which the truss-pendent is slackened or straightened”.' },
      ],
      purchase: '4 or 5 to 1 from the two double blocks. My arithmetic.',
      belay: { short: 'Eye-bolt by the mast', level: 'weather', status: 'period', text: `The tackle hooks to an eye-bolt in the ${m.deckName} each side of the mast. Where its fall is made fast is not stated.` },
      worked: 'Eased before bracing up; “the trusses hauled taught” in heavy weather (Lever).',
      rope: main ? 'Pendents 8 in.; falls 3 in., with four double 11-in. blocks.' : null,
      notes: [
        'This is Steel’s lead of 1794, and the one drawn. Lever, in 1808, says “this Method of the Truss Tackles leading below, is generally exploded: they now lead up to the lower Tressle-trees or Topmast-Cap”, and gives four other ways. A ship of 1805 could have had either.',
        'The nave-line holds the pendents up level with the yard: it “reeves through a single block, lashed under the aftside of the top, and through a block or thimble seized to the truss-pendents … The leading-part goes down upon deck” (Steel).',
      ],
      sources: ['S 204', 'L 36', 'L 37', 'L 88', 'S74 35'],
    };

    const liftSide = [x0 + 4, m.railHalf - 0.4, m.deckZ + 4];
    const lifts = {
      id: 'lifts',
      group: 'yard',
      name: 'Lifts',
      does: 'Hold the yardarms up, square the yard, and carry the weight of the men on it. “Topping” is “drawing one of the yard-arms higher than the other, by slackening one lift, and pulling upon the other” (Steel).',
      path: [
        { p: [x0, 1.5, m.capZ], mark: 'fast', step: 'Lever makes the end fast “to the Eye-bolt in the Cap”.' },
        { p: [yx, h - 0.5, yz + 0.6], mark: 'block', step: 'Down to the lift block at the yardarm, which is spliced into the strap of the topsail-sheet block.' },
        { p: [x0, 2.2, m.capZ - 0.6], mark: 'block', step: 'Up through “the block in the span round the mast-head”, at the cap.' },
        { p: liftSide, mark: 'lead', step: 'They “then lead down abreast the shrouds, and reeve through a block fastened to the side”.' },
        { p: [x0 + 6.5, m.railHalf - 0.6, m.deckZ + 2.5], mark: 'belay', step: '“And are there belayed.”' },
      ],
      purchase: '2 to 1, a whip at the yardarm. When the yard has to be topped a jigger tackle is clapped on: Steel’s table lists two for the main lifts.',
      belay: { short: 'At the side, by the shrouds', level: 'weather', status: 'period', text: `At the ship’s side on the ${m.deckName}, abreast the ${adj} shrouds. Steel gives the place; a modern kit plan of Victory uses the foremost kevel.` },
      worked: 'Set up when the yard is squared.',
      rope: main ? '4½ in., 128 fathoms.' : null,
      notes: ['Steel takes the lift down outside, “abreast the shrouds”. Lever’s single lift goes “down through the square, or Lubbers hole, in the top” to a tackle hooked “to a bolt in the Channel”. Both are period.'],
      sources: ['S 203', 'L 34', 'S 177', 'S 179', 'S74 34'],
    };

    const arm = [yx + 1, h + 0.3, yz - 0.5];
    const brace = main
      ? {
        does: 'Swing the yard round the mast. The main yard is the largest in the ship and its braces lead right aft, to the quarter.',
        path: [
          { p: [183, 16.6, 27.5], mark: 'fast', step: 'The standing part is made fast “with a clench round an eye-bolt in the upper part of the quarter-piece”, at the corner of the stern.' },
          { p: arm, mark: 'block', step: 'Forward to the brace block at the yardarm.' },
          { p: [176, 17.2, 30.4], mark: 'lead', step: 'Aft again to “a snatch-block close aft upon the gunwale”.' },
          { p: [171, 16.9, 27], mark: 'belay', step: '“And belays round a cleat on the inside.”' },
        ],
        belay: { short: 'Cleat at the quarter', level: 'weather', status: 'period', text: 'A cleat inside the bulwark, right aft. Steel gives the cleat; that it is on the poop of a 74 is from the draughts. Lever instead reeves the brace “through a Sheave-hole in the side of the Quarter Deck”.' },
        worked: 'Hauled at “Main-sail haul!” in tacking. A span with two thimbles, hitched to the mizen shrouds, gathers the standing and leading parts so they do not sag across the quarterdeck.',
        sources: ['S 202', 'L 49', 'L 33'],
      }
      : {
        does: 'Swing the yard round the mast. The fore braces go aft to the main stay, close under the main top, and come down by the mainmast: the fore yard is worked from the quarterdeck.',
        path: [
          { p: [94.5, 0.8, 78.4], mark: 'fast', step: 'The standing part is made fast “round the collar of the main stay, on each side”.' },
          { p: arm, mark: 'block', step: 'Forward to the brace block at the fore yardarm.' },
          { p: [95.2, 1.3, 79], mark: 'block', step: 'Aft to a block “lashed on each side the main-stay-collar, close up to the rigging”.' },
          { p: [102.6, 2, 19.5], mark: 'belay', step: 'It “then leads down, and passes through a sheave-hole in the bitts, at the fore part of the quarter-deck, and there belays”.' },
        ],
        belay: { short: 'Fore-brace bitts', level: 'weather', status: 'period', text: 'The fore-brace bitts: a cross-piece on two posts on the quarterdeck, a few feet abaft the mainmast. Steel calls them “the fore-brace-bitts abaft the main-mast”, and the Admiralty draughts show them there. Lever leads the brace through “a leading Block … strapped to an Eye-bolt in the Deck” by the mainmast.' },
        worked: 'In tacking the head yards are left aback while the after yards are swung, then hauled round last at “Let go and haul!” by men on the quarterdeck.',
        sources: ['S 202', 'S 216', 'L 48', 'L 33'],
      };
    const braces = Object.assign({
      id: 'braces',
      group: 'yard',
      name: 'Braces',
      purchase: '2 to 1 at the yardarm: the brace is a whip with its standing part fixed in the ship.',
      notes: ['Steel hangs the brace block on a pendent at the yardarm; “Sometimes, in the navy, and oftener in the merchant service the block is lashed to the yard-arm without a pendent”.', 'The yards are drawn square.'],
    }, brace);

    const prevent = main
      ? {
        path: [
          { p: [21.6, 4.2, 63.5], mark: 'fast', step: '“The standing-part makes fast to the shrouds above the block”: the fore shrouds.' },
          { p: [yx - 0.5, h + 0.1, yz + 0.4], mark: 'block', step: 'Aft to “the block on the yard-arm”.' },
          { p: [21.8, 4.7, 61.5], mark: 'block', step: 'Forward to “a block lashed to the fore-shrouds, close below the catharpins”.' },
          { p: [26, 14.5, 19], mark: 'belay', inferred: true, step: '“They then lead down upon the fore-castle.” The fitting is not named.' },
        ],
        belay: { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'On the forecastle abreast the fore shrouds. The fitting is not named.' },
      }
      : {
        path: [
          { p: [G.bowspritCap[0], 0.6, G.bowspritCap[1] + 0.6], mark: 'fast', step: '“The standing parts make fast round the cap”: the bowsprit cap.' },
          { p: [yx - 0.5, h + 0.1, yz + 0.4], mark: 'block', step: 'Aft to “a block lashed round the yard-arm”.' },
          { p: [G.bowspritCap[0] + 0.8, 1.1, G.bowspritCap[1] - 0.4], mark: 'block', step: 'Forward to “a block in a span, round the bowsprit-cap”.' },
          { p: [8, 5, 19.5], mark: 'belay', inferred: true, step: '“They then lead in upon the fore-castle.” The fitting is not named.' },
        ],
        belay: { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'At the fore end of the forecastle. The fitting is not named.' },
      };
    const preventer = Object.assign({
      id: 'preventer-braces',
      group: 'yard',
      name: 'Preventer braces',
      does: 'A second pair of braces rigged in wartime, “to supply the place of a brace, should that be shot away or damaged. They are led the contrary way, to be less liable to detriment at the same time” (Steel). The working braces lead aft; these lead forward, and are hauled from the forecastle.',
      purchase: '2 to 1, like the brace.',
      worked: 'Rigged “in War only”, so on a ship of 1805 they are there. In heavy weather the yard tackles could also be “carried aft and hooked to eye-bolts in the side, and used to prevent too great a strain on the braces” (Steel).',
      rope: main ? '3½ in., 96 fathoms.' : null,
      notes: ['Steel’s sentence runs the two yards together and is muddled. The sense taken here: fore preventer to the bowsprit cap, main preventer to the fore shrouds.'],
      sources: ['S 163', 'S 202', 'S 235', 'S74 35'],
    }, prevent);

    const yardTackles = {
      id: 'yard-tackles',
      group: 'yard',
      name: 'Yard tackles',
      does: 'Hoist the boats and heavy stores in and out. A pendent hangs from each lower yardarm with “a double block, connected by its fall to a single one, strapped with a hook and thimble, to hoist in the boats, &c.” (Steel). Not a sail-handling line, but it is on the yardarm in every picture of the ship.',
      path: null,
      extra: [[[yx + 0.4, h - 1, yz - 0.5], [yx + 0.4, h * 0.6, yz - 1.6], [x0 + 1, 5.3, m.topZ - 8]]],
      lead: 'When idle the tackle is triced up along the yard by two lines. The inner tricing-line “reeves through a block lashed to the futtock-staff … and the leading part belays to the shrouds”. The outer one runs from the tackle block through a block on the yard and “into the shrouds … near the futtock-staff, and down upon deck”.',
      rope: main ? 'Pendents 7 in.; falls 3½ in., 110 fathoms.' : null,
      sources: ['S 202', 'L 33', 'S 235', 'S74 34'],
    };

    const horses = {
      id: 'horses',
      group: 'yard',
      name: 'Horses and stirrups',
      also: 'footropes (later)',
      does: 'What the men stand on. “Horses go over the yard-arms with an eye in their outer ends … and hang about three feet below the yard” (Steel), held up by stirrups nailed to the yard. A lower yard has no Flemish horses.',
      path: null,
      extra: [
        [[yx + 0.5, h - 1.5, yz - 0.6], [yx + 0.5, h * 0.8, yz - 3], [yx + 0.5, h * 0.4, yz - 3.2], [yx + 0.5, 5, yz - 3], [yx + 0.5, -2.5, yz - 1]],
      ].concat([0.8, 0.6, 0.4, 0.2].map((f) => [[yx + 0.5, h * f, yz - 0.6], [yx + 0.5, h * f, yz - 3.1]])),
      lead: 'The inner end of each horse is lashed to the yard on the far side of the middle. The stirrups “are four on each side, and hang three feet below the yard, and the upper ends are opened, plaited, and fastened to the yard with three round turns and nails”.',
      sources: ['S 202', 'L 33', 'L 83'],
    };

    // --- On the sail -------------------------------------------------------
    const clew = [sx, S.clewY, S.clewZ];
    const tack = main
      ? {
        path: [
          { p: clew, mark: 'fast', step: 'A single tack is “a thick rope tapering to the end, and having a knot wrought upon the largest end, by which it is firmly retained in the clue of the sail” (Falconer).' },
          { p: [52, 22.8, 16.5], mark: 'lead', step: 'Forward and down, “through the sheave-hole in the chest-tree”: a timber on the ship’s side abaft the fore channels, with a sheave in its upper end.' },
          { p: [53.5, 21.6, 12.6], mark: 'lead', step: '“And through a sheave-hole in the side.”' },
          { p: [86, 20.8, 11.5], mark: 'belay', step: '“And belay round a large range-cleat in the aft part of the waist.”' },
        ],
        belay: { short: 'Range cleat, upper deck', level: 'upper', status: 'period', text: 'A range cleat on the upper deck in the after part of the waist: one of the “large cleats, with two arms, bolted in the waist of ships, to belay the tacks and sheets to”. The tack is held on a stopper hooked “to a ring-bolt in the side” while it is belayed.' },
        rope: '“Taper and cabled”, 9½ in., 48 fathoms, with two stoppers: the thickest running rope on the mast.',
        notes: ['The yards are drawn square, so the tack is shown running forward from a clew that has not moved. Braced up, the weather clew is hauled right down to the chess-tree.', 'When it will not come down in a blow, “a Luff-tackle is hooked to the lower Bowline Cringle” (Lever).', 'Steel also gives a double tack: standing part clinched to an eye-bolt before the chess-tree, leading part through a block at the clew. Lees is reported as dating double tacks from 1796.'],
        sources: ['S 211', 'S 164', 'S 176', 'S 235', 'F TACK', 'F CHESTREES', 'L 87', 'S74 35'],
      }
      : {
        path: [
          { p: clew, mark: 'fast', step: 'A single tack is a thick tapered rope with a knot on its largest end, held in the clew of the sail.' },
          { p: [-6, 9, 20], mark: 'block', step: 'Forward and down “through the block lashed round the outer end of the boomkin”: a short spar that sticks out from each bow for exactly this.' },
          { p: [10, 16, 21.5], mark: 'belay', step: 'They “then lead upon the forecastle, and belay round a large cleat upon the cat-head, or to the topsail-sheet-bitts”.' },
        ],
        belay: { short: 'Cleat on the cathead', level: 'weather', status: 'period', text: 'A large cleat on the cathead, or the topsail-sheet bitts. But Steel adds that “in large ships the fore-tacks lead in under the forecastle”, with the stopper rove round the topsail-sheet bitts, so on a 74 the tack may well have come in to the upper deck. The cathead is drawn.' },
        notes: ['The yards are drawn square. Braced up, the weather clew is hauled down to the boomkin.', 'Steel also gives a double tack, with the standing part round the boomkin end and a block at the clew.', 'A passaree is “any rope fastened round the cat-head and fore-tack, to keep tight the leech of the sail in light winds”.'],
        sources: ['S 210', 'S 176', 'S 235', 'S 171', 'F TACK', 'L 52', 'L 57'],
      };
    const tacks = Object.assign({
      id: 'tacks',
      group: 'sail',
      name: 'Tacks',
      does: 'Hold the weather clew of the course forward and down. Of the square sails only the courses have tacks. “One tack is always fastened to windward, at the same time that the sheet extends the sail to leeward” (Falconer). When the ship goes about, the tacks change sides.',
      purchase: 'None when single; 2 to 1 when double.',
      worked: 'Hauled “on board” on the weather side when the ship comes on the wind. In tacking the order for them comes just after the helm is put down: “Off Tacks and Sheets!” in Lever, “raise tacks and sheets” in Steel.',
    }, tack);

    const sheet = main
      ? {
        path: [
          { p: [150, 20.2, 17], mark: 'fast', step: '“The standing-part is seized to an eye-bolt with a thimble on the quarters.”' },
          { p: [sx + 0.3, S.clewY - 0.4, S.clewZ - 0.6], mark: 'block', step: 'Forward to the sheet block in the clew of the sail.' },
          { p: [122, 21.2, 13], mark: 'lead', step: 'Aft again, and in “through a sheave-hole on the same side under the half-deck”.' },
          { p: [90, 20.6, 11.5], mark: 'belay', step: '“And belays to a range-cleat in the waist.”' },
        ],
        belay: { short: 'Range cleat, upper deck', level: 'upper', status: 'period', text: 'A range cleat on the upper deck in the waist. A modern reading of Lees, and the restored Victory, take the main sheet to a staghorn on the quarterdeck instead; Steel and the draught of Elephant, which shows the sheave-hole in the side, are followed here.' },
        rope: '“Cabled”, 7½ in., 90 fathoms; four 24-in. blocks and two stoppers.',
        sources: ['S 211', 'S 174', 'S 235', 'S74 35'],
      }
      : {
        path: [
          { p: [50, 21.4, 16], mark: 'fast', step: 'The standing part is “seized to a thimble, in an eye-bolt, a little before the gangway”.' },
          { p: [sx + 0.3, S.clewY - 0.4, S.clewZ - 0.6], mark: 'block', step: 'Forward to the sheet block in the clew of the sail.' },
          { p: [56, 21.4, 13], mark: 'lead', step: 'Aft, and in “through a sheave-hole in the side, a little before the gangway-ladder”.' },
          { p: [46, 20.4, 11.5], mark: 'belay', step: 'It “then leads forward, and belays round a large cleat in the side”.' },
        ],
        belay: { short: 'Large cleat, upper deck', level: 'upper', status: 'period', text: 'A large cleat inside the ship’s side on the upper deck, under the after end of the forecastle. Lever puts the sheave-hole “at the after part of the waist”.' },
        sources: ['S 210', 'S 174', 'S 235', 'L 57'],
      };
    const sheets = Object.assign({
      id: 'sheets',
      group: 'sail',
      name: 'Sheets',
      does: 'Hold the lee clew of the course aft. The sheet is a whip: it starts at the ship’s side, runs through a large block in the clew and comes back to the side. With the tacks, it is the heaviest gear on the sail, and it is worked a deck down, on the upper deck.',
      purchase: '2 to 1.',
      worked: 'The lee sheet is hauled aft as the weather tack is got down. Tacks and sheets are let go together when the ship goes about. Both are held on stoppers, “for securing the tacks and sheets, till belayed” (Steel).',
    }, sheet);

    const garnets = {
      id: 'clew-garnets',
      group: 'sail',
      name: 'Clew garnets',
      also: 'clue-garnets (Steel). The same line on any other square sail is a clewline.',
      does: 'Haul the clews of the course up to the yard. “Tackles connected to the clues of main and fore courses, to truss the sail up to the yard” (Steel).',
      path: [
        { p: [yx, 6.6, yz - 0.6], mark: 'fast', step: '“The standing-part is carried up, and made fast round the yard by its block with a timber hitch.”' },
        { p: [sx, S.clewY - 0.6, S.clewZ + 0.7], mark: 'block', step: 'Down to a block seized into the clew of the sail.' },
        { p: [yx, 5.6, yz - 1], mark: 'block', step: 'Up to the block that hangs under the yard, “four feet without the middle-cleats on each side”.' },
        { p: sheetBitts, mark: 'belay', step: '“The leading-part comes upon deck, and reeves through the sheave-hole in the topsail-sheet-bitts, and there belays.”' },
      ],
      purchase: '2 to 1.',
      belay: sheetBittsBelay,
      worked: 'To haul the mainsail up: “the weather Clew-garnet hauled up … the Main Sheet is then eased off, the lee Clew-garnet hauled up, and the Buntlines and Leechlines” (Lever).',
      rope: main ? '4 in., 84 fathoms.' : null,
      sources: ['S 210', 'S 211', 'S 203', 'S 164', 'L 52', 'L 87', 'S74 35'],
    };

    // Buntlines: two legs a side, joined at a shoe-block that the fall hauls down.
    const bLeg = (y) => [[sx - 0.2, y, S.clewZ + 1.2], [sx, y + 1, yz + 0.8], [x0 - 6, 5, m.topZ - 1]];
    const shoe = main ? [62, 5, 40] : [x0 + 12, 5, 45];
    const buntEnd = main ? [54.5, 5, 21.6] : [52.6, 5, 21.6];
    const outer = bLeg(S.clewY * 0.5), inner = bLeg(S.clewY * 0.2);
    const buntlines = {
      id: 'buntlines',
      group: 'sail',
      name: 'Buntlines',
      does: 'Lift the foot of the sail up its fore side to the yard. A course has four, worked in pairs: in men-of-war the two legs on a side are one rope, joined at a shoe-block, and a single fall hauls both up together.',
      path: [
        { p: outer[0], mark: 'fast', step: 'Each leg is clinched to a cringle in the foot of the sail and leads up its fore side.' },
        { p: outer[1], mark: 'block', step: 'Through its own buntline block on the yard, between the leech-line block and the slings.' },
        { p: outer[2], mark: 'block', step: 'Up to “a double-block under the fore part of the top”.' },
        { p: [x0 + 6, 5, m.topZ - 1], mark: 'block', step: 'Aft to “a double-block at the aft part of the top”.' },
        { p: shoe, mark: 'block', inferred: main, step: main ? 'The two legs meet in the upper sheave of the shoe-block. For the mainsail Steel says only that they “reeve as for the fore-sail, and lead forward upon the forecastle”; where the shoe-block hangs is my guess.' : 'The two legs are one rope, rove through the upper sheave of the shoe-block (the “leg and fall block”).' },
        { p: buntEnd, mark: 'belay', inferred: main, step: main ? 'The fall comes down on the forecastle. The fitting is not named; the breast-rail at its after end is drawn, by analogy with the foresail.' : 'The fall is rove through the lower sheave: “the standing-part makes fast round the breast-rail, and the leading-part through a sheave-hole in the breast-work, and belays round the rail”.' },
      ],
      extra: [inner],
      purchase: '2 to 1 on the pair: the fall is a whip on the shoe-block. My reading of the reeving.',
      belay: main
        ? { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'On the forecastle. Both Steel and Lever say the main buntlines lead forward: “In Men of War, where the Main Bunt-lines go with Shoe-Blocks, they lead forwards” (Lever). Neither names the fitting.' }
        : { short: 'Forecastle breast-rail', level: 'weather', status: 'period', text: 'The breast-rail across the after end of the forecastle, which Steel elsewhere calls “the breast-work at the aft part of the fore-castle”. It has sheave-holes in it for exactly this.' },
      worked: 'Hauled with the leech-lines once the clew garnets have the clews up.',
      rope: main ? 'Legs 3 in., 54 fathoms; falls 3 in., 62 fathoms.' : null,
      notes: ['Lever dislikes the arrangement: “In the Merchant Service, two single bunt-lines are preferred to the leg and fall, the shoe-block scarcely permitting the foot of the sail to be hauled close up”.'],
      sources: ['S 210', 'S 211', 'S 203', 'S 199', 'L 52', 'L 57', 'L 33', 'S74 35'],
    };

    const leechMid = S.clewZ + (S.headZ - S.clewZ) * 0.42;
    const leechlines = {
      id: 'leechlines',
      group: 'sail',
      name: 'Leech-lines',
      does: 'Haul the side edge of the sail in and up to the yard. “Leech-lines are ropes used to truss up the sails” (Steel).',
      path: [
        { p: [sx - 0.2, S.clewY - 0.2, leechMid], mark: 'fast', step: 'The outer end “makes fast with a clinch to the upper bowline-bridle”, on the leech.' },
        { p: [sx, h - 10.5, yz + 0.6], mark: 'block', step: 'Up to the leech-line block on the fore part of the yard, “ten feet within the cleats on each yard-arm”.' },
        main
          ? { p: [x0 - 6, 6.2, m.topZ - 1], mark: 'block', step: 'In to “the double-block at the forepart of the top”.' }
          : { p: [x0 - 6, 6.2, m.topZ - 1], mark: 'block', step: 'On the foremast Steel reeves it first “through the spritsail-brace-block, under the top”.' },
        { p: [x0 + 6, 6.2, m.topZ - 1], mark: 'block', step: 'Aft to “a double-block at the aft-part of the top”.' },
        main
          ? { p: [x0 + 2, 7.5, 40], mark: 'block', step: '“A single block is turned into the lower end, and a whip-fall reeved through it.”' }
          : { p: [x0 + 14, 7.5, 40], mark: 'lead', inferred: true, step: 'Then “upon the forecastle”.' },
        { p: breast, mark: 'belay', inferred: !main, step: main ? '“The standing-part makes fast to the breast-rail, and the leading-part through a block under the breast-rail, and belays round the rail.”' : 'The fitting is not named; the breast-rail is drawn, by analogy with the main leech-lines.' },
      ],
      purchase: main ? '2 to 1 on the whip-fall.' : null,
      belay: main
        ? { short: 'Quarterdeck breast-rail', level: 'weather', status: 'period', text: 'The breast-rail across the fore end of the quarterdeck. Steel does not say which breast-rail; his glossary defines breast-work as “the rails and stantions on the foremost end of the quarter-deck and poop”, so the quarterdeck’s is the natural reading.' }
        : { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'On the forecastle. The fitting is not named.' },
      worked: 'Hauled with the buntlines when the course is hauled up.',
      rope: main ? 'Legs 2½ in., 56 fathoms; falls 52 fathoms.' : null,
      notes: ['Lever clinches them “to the upper bow-line cringles” and runs them through “the outer sheave-holes of the outer blocks, under the top”.'],
      sources: ['S 211', 'S 210', 'S 203', 'S 169', 'S 163', 'L 53', 'S74 35'],
    };

    const slabBlock = [yx, 2.4, yz - 1.4];
    const slablines = {
      id: 'slablines',
      group: 'sail',
      name: 'Slab-line',
      does: 'Lifts the middle of the foot of the course a little, “for the pilot or master to look forward underneath, as the ship advances” (Steel). It is the one hauling-up line that runs up the after side of the sail.',
      mirror: false,
      path: [
        { p: [sx + 0.3, S.clewY * 0.2, S.clewZ + 1.2], mark: 'fast', step: '“The standing-part clinches with two legs to the middle buntline-cringles.”' },
        { p: slabBlock, mark: 'block', step: 'Up abaft the sail to “a small block lashed to the strap of the quarter-block”, under the yard.' },
        { p: [sheetBitts[0], 0.5, sheetBitts[2]], mark: 'belay', step: '“The leading-part leads to the topsail-sheet-bitts, and belays round the middle of the cross-pieces.”' },
      ],
      extra: [[[sx + 0.3, -S.clewY * 0.2, S.clewZ + 1.2], slabBlock]],
      purchase: 'None.',
      belay: Object.assign({}, sheetBittsBelay, { text: 'Round the middle of the cross-piece of the topsail-sheet bitts.' }),
      worked: 'In pilotage, or whenever whoever is conning the ship cannot see ahead under the sail.',
      rope: main ? '2½ in., 44 fathoms.' : null,
      sources: ['S 210', 'S 169', 'L 52', 'S74 35'],
    };

    const bz1 = S.clewZ + (S.headZ - S.clewZ) * 0.42, bz2 = S.clewZ + (S.headZ - S.clewZ) * 0.2;
    const bridle = [sx - 5, S.clewY + 0.5, (bz1 + bz2) / 2 - 1];
    const bow = main
      ? {
        path: [
          { p: [21.6, 0.9, 23.2], mark: 'block', step: 'Forward to “a double-block that, with a strap, lashes round the foremast five feet above the forecastle”.' },
          { p: [24.5, -3, 19.5], mark: 'belay', step: 'It crosses the deck: “The starboard-bowline belays on the larboard, and the larboard-bowline leads over and belays on the starboard side.”' },
        ],
        belay: { short: 'Bitts abaft the foremast', level: 'weather', status: 'period', text: 'The bitts on the forecastle abaft the foremast, on the opposite side. It is hove taut with the bowline tackle: “Four feet from the bridle is a thimble, spliced and pointed on each bowline, called a lizard, to which is hooked a bowline-tackle that makes fast to the bitts, and is bowsed upon until the bowline is made fast”.' },
        sources: ['S 211', 'S 212', 'S 169', 'S 177', 'L 57', 'F BOWLINE'],
      }
      : {
        path: [
          { p: [-29, 1, 40.5], mark: 'block', step: 'Forward to “a single-block lashed round the collar of the fore-stay, on the bowsprit”.' },
          { p: [17.4, 4.4, 19.5], mark: 'belay', step: 'It “leads upon the forecastle” and “belays to the foretopsail-sheet-bitts”.' },
        ],
        belay: { short: 'Fore topsail-sheet bitts', level: 'weather', status: 'period', text: 'The fore topsail-sheet bitts on the forecastle.' },
        sources: ['S 210', 'S 169', 'L 57', 'F BOWLINE'],
      };
    const bowlines = {
      id: 'bowlines',
      group: 'sail',
      name: 'Bowlines and bridles',
      also: 'pronounced “bo-lin”',
      does: 'Pull the weather leech of the course forward and hold it steady when the ship is close-hauled. Only the weather bowline is in use. On a course the lower bridle is the longer: it clinches to the lower cringle and has a thimble in its other end, through which the upper leg runs.',
      path: [{ p: bridle, mark: 'fast', step: 'The bridles are made fast to two cringles on the leech, and the bowline to the bridles.' }].concat(bow.path),
      extra: [[bridle, [sx, S.clewY - 0.2, bz1]], [bridle, [sx, S.clewY - 0.1, bz2]]],
      purchase: main ? 'None in the bowline itself; the bowline tackle, a long-tackle block and a single, is clapped on to haul it.' : 'None; a single rope.',
      belay: bow.belay,
      worked: '“Haul the bowlines” comes last when the yards are braced up. “To check the Bowline, is to slacken it, when the wind becomes large” (Falconer).',
      sources: bow.sources,
    };

    const reefZ = S.headZ - 6.5;
    const bending = {
      id: 'bending',
      group: 'sail',
      name: 'Reef band, earings, robands and gaskets',
      also: 'rope-bands (Steel)',
      does: 'What holds the course to its yard, and the means of reefing it. Head earings lash the upper corners to the yardarms, robands tie the head round the yard, and gaskets bind the sail when it is furled: “two on each quarter, and one on each yardarm, with a bunt-gasket in the middle” (Steel). The course has a reef band with points like a topsail’s, but no reef tackles.',
      path: null,
      extra: [[[sx + 0.2, -S.headY, S.headZ], [sx + 0.2, S.headY, S.headZ]], [[sx, -S.headY - 0.3, reefZ], [sx, S.headY + 0.3, reefZ]]],
      mirror: false,
      lead: 'Nothing leads to the deck. The head earing is passed “over the yard-arm without the rigging, through the cringle, alternately, two or three times, and is passed round the yard within the rigging … The outer turns are to stretch the upper edge of the sail tight along the yard, and the inner turns to draw it close” (Steel).',
      worked: 'Courses were reefed far less than topsails. Lever speaks of “double reefed Courses” as a habit of the coasting trade, an alternative to handing the topsails.',
      rope: main ? 'Six earings in Steel’s table, which fits two head earings and two reefs.' : null,
      notes: ['One reef band is drawn, as in Lever’s figure of a foresail. The six earings in Steel’s table would allow two.'],
      sources: ['S 210', 'S 211', 'S 184', 'L 51', 'L 53', 'L 87', 'S74 35'],
    };

    const spilling = {
      id: 'spilling-lines',
      group: 'occasional',
      name: 'Spilling lines',
      does: 'Pass right round the sail and gather it bodily, to spill it in heavy weather.',
      path: null,
      lead: 'Not drawn. “Ropes reeved through blocks, lashed on each side of the quarter-blocks of the lower yards, then lead down before the sail, return upwards under the foot, and make fast round the yard with a timber hitch” (Steel). They are in his glossary but not in his rigging sequence or his 74 table.',
      worked: 'Heavy weather only; that they were rigged for the occasion is my inference.',
      sources: ['S 169'],
    };

    const notice = main
      ? `
        <h2>A course against a topsail</h2>
        <h3>The yard stays put</h3>
        <p>The main yard is hoisted once by the jeers and then hangs on its slings, held to the mast by the truss pendents. A topsail yard goes up and down the topmast on its tye and halliards every time sail is made or reefed. So a course has no halliards, and is set by letting it fall and taken in by hauling it up to a yard that never moves.</p>
        <h3>The clews go to the hull</h3>
        <p>A topsail’s clews are sheeted to the yard below. A course has no yard below, so each clew has two ropes to the ship’s side: a tack leading forward and a sheet leading aft. On any one tack the weather clew is held by its tack and the lee clew by its sheet, and the other two hang slack.</p>
        <h3>Four different lines haul it up</h3>
        <p>Clew garnets lift the corners, buntlines the foot, leech-lines the sides, and the slab-line the middle of the foot for a look ahead. A topsail has only clewlines and two buntlines.</p>
        <h3>The heavy work is a deck down</h3>
        <p>The tacks and sheets come in through sheave-holes in the ship’s side to range cleats on the upper deck, and the clew garnets to the bitts there. That is under the gangways and the quarterdeck, among the guns. The deck plan marks those points with squares.</p>
        <h3>Half its gear is worked from the forecastle</h3>
        <p>The main bowlines cross to the opposite side at the foot of the foremast, the main buntlines lead forward to the forecastle, and in wartime so do the preventer braces. Meanwhile the main brace is as far aft as a rope can go.</p>
        <h2>Where the sources disagree or go quiet</h2>
        <ul>
          <li><b>Truss tackles.</b> Led to the deck in Steel (1794); led aloft in Lever (1808), who calls the deck lead “generally exploded”.</li>
          <li><b>Lifts.</b> Outside the top in Steel; through the lubber’s hole in Lever’s single lift.</li>
          <li><b>The main sheet.</b> To a range cleat on the upper deck in Steel; to the quarterdeck in a modern reading of Lees and in the restored Victory.</li>
          <li><b>The main brace.</b> A snatch-block on the gunwale and a cleat in Steel; a sheave-hole in the quarterdeck side in Lever.</li>
          <li><b>Buntline falls.</b> Both say the main buntlines lead forward to the forecastle. Neither says where they belay.</li>
          <li><b>Jeer falls.</b> “Upon deck”; the jeer bitts are an inference from their name.</li>
        </ul>`
      : `
        <h2>What to notice</h2>
        <h3>The same sail as the mainsail, with the bow in the way</h3>
        <p>The foresail’s gear matches the mainsail’s line for line; Steel describes the foresail and then says of the main, “as for the foresail”. What changes is forced by where the mast stands.</p>
        <h3>The tack goes outside the ship</h3>
        <p>The fore yard is wider than the bow under it, so there is nothing to haul the weather clew down to. The boomkins, two short spars angled out from the bows, carry a block for the tack. The main tack has the ship’s side and its chess-tree.</p>
        <h3>The braces are worked from the quarterdeck</h3>
        <p>The fore braces go aft to the main stay under the main top and come down to their own bitts just abaft the mainmast. So at “Let go and haul!” the head yards are swung by men standing on the quarterdeck.</p>
        <h3>The sheet is a deck down, the rest is on the forecastle</h3>
        <p>The fore sheet comes in through the side to a cleat on the upper deck. The clew garnets, bowlines, buntlines and leech-lines all land on the forecastle, at the bitts or the breast-rail.</p>
        <h2>Where the sources disagree or go quiet</h2>
        <ul>
          <li><b>The tack.</b> To a cleat on the cathead, or the topsail-sheet bitts, or “in large ships” in under the forecastle. Steel gives all three.</li>
          <li><b>Leech-line falls</b> are left at “upon the forecastle”.</li>
          <li><b>Which bitts are which</b> on the forecastle is not established.</li>
        </ul>`;

    return {
      id: `${adj}-course`, mast: adj, tier: 'course', title: main ? 'The main course' : 'The fore course', start: 'tacks', notice,
      lines: [jeers, slings, trusses, lifts, braces, preventer, yardTackles, horses, tacks, sheets, garnets, buntlines, leechlines, slablines, bowlines, bending, spilling],
    };
  }

  function crossjack() {
    const m = MASTS.mizen;
    const x0 = m.x, yx = m.x - 1.5, yz = m.yardZ, h = m.yardHalf;
    const lines = [
      {
        id: 'slings',
        group: 'yard',
        name: 'Slings',
        does: 'Carry the yard. The crossjack is slung like the other lower yards but has no jeers.',
        path: null,
        extra: [[[x0 - 0.5, -1.4, m.topZ + 4], [yx, 0, yz + 1], [x0 - 0.5, 1.4, m.topZ + 4]]],
        mirror: false,
        lead: 'They do not come down. Steel’s table lists no truss for the crossjack yard.',
        sources: ['S 207', 'L 37', 'S74 37'],
      },
      {
        id: 'lifts',
        group: 'yard',
        name: 'Lifts',
        does: 'Hold the yardarms up. Steel gives two kinds: running lifts through a block in a span round the mizen cap, or standing lifts, single, “hitched and seized to an eye-bolt on each side the mizen-cap”. His table for a 74 has running lifts.',
        path: [
          { p: [yx, h - 0.5, yz + 0.5], mark: 'fast', step: 'From the yardarm.' },
          { p: [x0, 1.6, m.capZ - 0.5], mark: 'block', step: 'Up through a block in a span round the mizen cap.' },
          { p: [x0 + 2, 5, m.deckZ + 0.5], mark: 'belay', inferred: true, step: 'It “leads upon deck”. The fitting is not named.' },
        ],
        purchase: 'Not stated.',
        belay: { short: 'Near the mizen mast (not named)', level: 'weather', status: 'inferred', text: 'On the poop near the mizen mast. The fitting is not named.' },
        sources: ['S 207', 'S74 37'],
      },
      {
        id: 'braces',
        group: 'yard',
        name: 'Braces',
        does: 'Swing the yard. These are the only braces in the ship that lead forward, and they cross: the starboard yardarm is braced from the larboard main shrouds.',
        path: [
          { p: [100.9, -8.4, 62], mark: 'fast', step: '“The standing-part of the starboard brace makes fast to one of the middle shrouds on the larboard side”: the main shrouds.' },
          { p: [yx - 0.6, h + 0.3, yz - 0.4], mark: 'block', step: 'Aft and across to the block at the starboard yardarm.' },
          { p: [101.2, -8.9, 60.5], mark: 'block', step: 'Forward again to “a single-block lashed to the same shroud a little below the catharpins”.' },
          { p: [105.5, -19.6, 30], mark: 'lead', step: '“It then leads through a truck or double-block seized to the middle shroud.”' },
          { p: [107.5, -20.8, 22.6], mark: 'belay', step: '“And belays round a pin in the fife-rail, and the larboard braces the contrary.”' },
        ],
        purchase: '2 to 1 at the yardarm.',
        belay: { short: 'Pin in the fife-rail', level: 'weather', status: 'period', text: 'A pin in the fife-rail on the quarterdeck, abreast the main shrouds: the open rail along the top of the quarterdeck side. Lever has them “belayed to a Cleat on the Shroud” or the fife-rail.' },
        worked: 'With the main and main topsail braces, when the after yards are swung.',
        notes: ['Lever’s 1819 text agrees: “led across forwards”, to “the after Main Shroud”. The 1843 American edition changes them to lead on the same side, which is later practice.'],
        sources: ['S 207', 'L 49', 'S 179'],
      },
      {
        id: 'horses',
        group: 'yard',
        name: 'Horses',
        does: 'For the men who work on the yard.',
        path: null,
        extra: [[[yx + 0.5, h - 1.5, yz - 0.5], [yx + 0.5, h * 0.7, yz - 2.8], [yx + 0.5, h * 0.3, yz - 3], [yx + 0.5, -2.5, yz - 0.8]]],
        lead: 'As on the other lower yards.',
        sources: ['S 207'],
      },
      {
        id: 'sheet-blocks',
        group: 'yard',
        name: 'Mizen topsail sheet blocks',
        does: 'The reason the yard is there. A sheet block at each yardarm and a quarter block lashed at the middle carry the mizen topsail’s sheets in along the yard and down the mast.',
        path: null,
        extra: [[[yx, h - 1.5, yz + 0.8], [yx, 2, yz - 1.1], [152.6, 2, 26.3]]],
        lead: 'See the sheets of the mizen topsail.',
        sources: ['S 207', 'S 180'],
      },
    ];
    const notice = `
      <h2>What to notice</h2>
      <h3>A yard with no sail</h3>
      <p>“The cross-jack-yard is used to expand the foot of the mizen topsail” (Steel). It is rigged with slings, lifts, braces, horses and the topsail’s sheet blocks, and nothing else. Neither Steel nor Lever’s 1819 text describes any sail or sail gear for it. A square sail on the crossjack belongs to later merchant ships.</p>
      <h3>Its braces lead forward and cross</h3>
      <p>There is no mast abaft the mizen to brace it from, so the crossjack braces go forward to the main shrouds, each to the opposite side, and belay to pins in the fife-rail on the quarterdeck.</p>
      <h3>Below it is the fore-and-aft sail</h3>
      <p>The space a mizen course would fill is taken by the gaff sail, which Lever in 1808 still calls the mizen. That sail has its own page to come.</p>`;
    return { id: 'crossjack', mast: 'mizen', tier: 'course', title: 'The crossjack yard', noSail: true, start: 'braces', notice, lines };
  }

  SAILS.push(course(MASTS.fore), course(MASTS.main), crossjack());
})();
