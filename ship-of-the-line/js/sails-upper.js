// Topgallant sails and royals. Lighter gear, single where the topsail's is
// doubled, and much of it stops in the top instead of coming to the deck.

(function () {
  const { G, MASTS, SAILS, shape, footZ, down, leechY, shroudY } = window.RIGDATA;
  const AFT = { fore: MASTS.main, main: MASTS.mizen };

  function topgallant(m) {
    const x0 = m.x, yx = m.x - 1.5, sx = m.x - 2, tz = m.tgZ, h = m.tgHalf;
    const S = shape(m, 'topgallant');
    const adj = m.key, main = adj === 'main', fore = adj === 'fore', mizen = adj === 'mizen';
    const bittsAbaft = { fore: [24.5, 0.8, 19.5], main: [102.6, 0.8, 19.5], mizen: [152.6, 0.8, 26.3] }[adj];
    const inTop = (dx, y) => [x0 + dx, y, m.topZ + 1.2];
    const arm = [yx + 0.6, h + 0.3, tz - 0.3];

    const halliards = {
      id: 'halliards',
      group: 'yard',
      name: 'Tye and halliards',
      also: 'tie, tye; haliards, halliards, halyards',
      does: 'Hoist the yard up the topgallant mast. A single tye, where the topsail yard has two.',
      mirror: false,
      path: [
        { p: [yx, 0.2, tz + 0.3], mark: 'fast', step: 'The tye “clinches round the yard in the slings or middle”.' },
        { p: [x0 - 0.9, 0.3, m.tgHoundZ], mark: 'lead', step: 'Up through “the sheave-hole in the hounds of the topgallant-mast”.' },
        { p: [x0 + 2.4, 1.4, m.topZ + 15], mark: 'block', step: 'Down abaft the mast. It “has a double-block turned in the lower end”.' },
        { p: [x0 + 3, 1.5, m.topZ - 0.8], mark: 'block', step: 'The halliards connect it “to a single-block lashed to the after-part of the lower trestle-trees, under the top”.' },
        { p: bittsAbaft, mark: 'belay', step: '“The lower end of the haliards belays round the cross-piece of the bits abaft the mast.”' },
      ],
      purchase: 'About 3 to 1: a double and a single block on the end of a plain tye.',
      belay: {
        short: 'Bitts abaft the mast', level: 'weather', status: 'period',
        text: { fore: 'The cross-piece of the bitts abaft the foremast, on the forecastle.', main: 'The cross-piece of the bitts abaft the mainmast: on a 74 these are the fore-brace bitts on the quarterdeck.', mizen: 'The cross-piece of the bitts abaft the mizen mast: the mizen topsail-sheet bitts.' }[adj],
      },
      worked: 'Hoisted after the sheets are home. Before the topsails are reefed “the Top Gallant Sails are lowered and clewed” up (Lever).',
      notes: ['“Frequently the Tye and Halliards are in one” (Lever), toggled so the same rope can be unrove and used as the yard-rope to send the yard down.'],
      sources: ['S 206', 'L 47', 'L 83'],
    };

    const lifts = {
      id: 'lifts',
      group: 'yard',
      name: 'Lifts',
      does: 'Hold the yardarms up. They “are single, and go over the yard-arm with an eye spliced in one end” (Steel): no block, no purchase.',
      path: [
        { p: [yx, h, tz + 0.2], mark: 'fast', step: 'An eye over the yardarm.' },
        { p: [x0 + 0.3, 1.2, m.tgHoundZ - 3.5], mark: 'lead', step: 'Up through “a thimble in the topgallant-shrouds”. Lever puts it “between the two foremost Top-gallant Shrouds”.' },
        { p: inTop(1.5, m.topHalf - 1.2), mark: 'belay', step: 'It “leads down into the top, and belays round the dead-eyes”.' },
      ],
      purchase: 'None.',
      belay: { short: `In the ${adj} top`, level: 'aloft', status: 'period', text: 'In the top, round the deadeyes of the topmast shrouds. It never reaches the deck. Lever makes the ends fast “round the Cross-trees” instead, higher still.' },
      sources: ['S 207', 'L 47', 'L 48'],
    };

    const braceLead = {
      fore: {
        does: 'Swing the yard. The fore topgallant braces go to the main topmast stay, come back to the fore top and down to the belfry.',
        path: [
          { p: [96.8, 0.6, 137.6], mark: 'fast', step: 'The standing part is made fast “round the collar of the main-topmast-stay”, at the main topmast head.' },
          { p: arm, mark: 'block', step: 'Forward to the block at the yardarm.' },
          { p: [97, 1, 136.4], mark: 'block', step: 'Aft to a block “round the collar, a little below the standing-part”.' },
          { p: [27.5, 6, 70.6], mark: 'block', step: 'It “then leads through a block at the aft-part of the fore-top”.' },
          { p: [51.6, 1.6, 21], mark: 'belay', step: 'And belays “to a cleat on each side the bellfry”.' },
        ],
        belay: { short: 'Cleat on the belfry', level: 'weather', status: 'period', text: 'A cleat on the side of the belfry, at the after edge of the forecastle on the centreline.' },
        sources: ['S 206', 'L 48'],
      },
      main: {
        does: 'Swing the yard. The main topgallant braces go to the mizen topmast stay and come down in the mizen shrouds.',
        path: [
          { p: [148.8, 0.6, 112.4], mark: 'fast', step: 'The standing part is made fast to the collar of the mizen topmast stay, at the mizen topmast head.' },
          { p: arm, mark: 'block', step: 'Forward to the block at the yardarm.' },
          { p: [149, 1, 111.4], mark: 'block', step: 'Aft to a block on the same collar. Lever adds one “seized to the upper part of the foremost Mizen Topmast Shroud”.' },
          { p: [152, shroudY(MASTS.mizen, 31), 31], mark: 'belay', step: 'They “lead down into the mizen-shrouds”.' },
        ],
        belay: { short: 'Mizen shrouds', level: 'weather', status: 'period', text: 'In the mizen lower shrouds. Steel gives the place and not the fitting; a shroud cleat or a pin in a shroud-rack is implied, and he names “a pin in the shroud-rack” in the mizen shrouds for another line.' },
        sources: ['S 206', 'L 49', 'S 216'],
      },
      mizen: {
        does: 'Swing the yard. They are single, spliced over the yardarm, and go aft to the peak of the gaff.',
        path: [
          { p: [yx, h, tz - 0.2], mark: 'fast', step: 'Spliced over the yardarm with an eye.' },
          { p: [G.gaffPeak[0] - 0.5, 0.6, G.gaffPeak[1] - 0.4], mark: 'lead', step: '“Aft through a thimble at the mizen-peek.”' },
          { p: [186, 6.5, 26.6], mark: 'belay', step: 'They “come down on the fore-side of the taffarel”.' },
        ],
        belay: { short: 'Fore side of the taffrail', level: 'weather', status: 'period', text: 'On the poop at the fore side of the taffrail. The fitting is not named.' },
        sources: ['S 206', 'L 49'],
      },
    }[adj];
    const braces = Object.assign({
      id: 'braces',
      group: 'yard',
      name: 'Braces',
      purchase: mizen ? 'None; single.' : '2 to 1. Steel’s text and his table for a 74 give a pendent and block at the yardarm. Falconer’s rule of 1769 was that topgallant braces are single, and Lever still has them single with an eye in smaller ships.',
      notes: mizen ? ['With a gaff that hoists, Lever leads the mizen topgallant brace forward instead, “through a Block seized to the aftermost Main Topmast Shroud”.'] : [],
    }, braceLead);

    const horses = {
      id: 'horses',
      group: 'yard',
      name: 'Parrel and horses',
      does: 'The parrel holds the yard to the mast: “as the topsail-yard” in Steel, a lighter one “of two straps with eyes” in Lever. The yard has horses for the men, but Steel’s table lists no stirrups for it and it has no Flemish horses.',
      path: null,
      extra: [
        [[yx + 0.5, h - 0.8, tz - 0.3], [yx + 0.5, h * 0.6, tz - 2.4], [yx + 0.5, 3, tz - 2.4], [yx + 0.5, -2, tz - 0.6]],
        [[x0 - 1.2, 1.2, tz], [x0 + 0.8, 1.2, tz]],
      ],
      lead: 'Nothing comes down.',
      sources: ['S 206', 'L 47', 'S74 36'],
    };

    const tyx = m.x - 1.5;
    const sheets = {
      id: 'sheets',
      group: 'sail',
      name: 'Sheets',
      does: 'Hold the clews down to the arms of the topsail yard, as the topsail’s sheets hold its clews to the lower yard.',
      path: [
        { p: [sx, S.clewY, S.clewZ], mark: 'fast', step: 'Bent to the clew “with a Sheet Bend” (Lever).' },
        { p: [tyx, m.tyHalf - 0.6, m.tyZ + 0.5], mark: 'lead', step: 'Through a sheave-hole in the topsail yardarm, or a block strapped under the lift block there.' },
        { p: [tyx, 2.8, m.tyZ - 0.7], mark: 'block', step: 'In along the topsail yard to the topgallant sheet block, lashed “close within the clue-line-blocks on each side”.' },
        { p: [x0 - 0.3, 2.9, m.topZ], mark: 'lead', inferred: true, step: 'Down the mast. Whether through the top is not stated.' },
        { p: [x0 + 1.4, 4.2, m.deckZ + 0.5], mark: 'belay', inferred: true, step: 'They “lead upon deck, as the fore-topsail”. The fitting is not named.' },
      ],
      purchase: 'None; a single rope.',
      belay: { short: `Near the ${m.mastName} (not named)`, level: 'weather', status: 'inferred', text: 'Not stated. Steel’s table for a 74 has no entry for topgallant sheets that I could read.' },
      worked: '“The lee Sheets of either Topsails or Top-Gallant Sails, are always hauled home first” (Lever).',
      notes: ['Before about 1790 the topsail lifts did this job: “The lifts of the top-sail-yards … are also used as sheets to extend the bottom of the top-gallant-sail above” (Falconer 1769). Lever describes a half-way stage in which “the Top-gallant Sheet Block is strapped into the Lift”.'],
      sources: ['S 205', 'S 213', 'L 38', 'L 56', 'L 84', 'F LIFTS'],
    };

    const clewZ = m.deckZ + 8;
    const clewlines = {
      id: 'clewlines',
      group: 'sail',
      name: 'Clewlines',
      also: 'clue-lines',
      does: 'Haul the clews up to the yard to take the sail in.',
      path: [
        { p: [sx, S.clewY - 0.4, S.clewZ + 0.5], mark: 'fast', step: 'A single clewline is “bent to the Clew” (Lever).' },
        { p: [yx, 3.4, tz - 0.6], mark: 'block', step: 'Up to the block on the yard, “three feet without the slings”.' },
        { p: [x0 + 0.2, 3.3, m.topZ], mark: 'lead', step: '“The leading-part leads down the mast.” Lever takes it “up through the Top”.' },
        { p: [x0 + 2.7, shroudY(m, clewZ), clewZ], mark: 'belay', step: '“And into the lower shrouds.”' },
      ],
      purchase: 'None when single. Lever allows a doubled one.',
      belay: { short: `${adj[0].toUpperCase() + adj.slice(1)} shrouds`, level: 'weather', status: 'period', text: `In the ${adj} lower shrouds; a shroud cleat or pin rack is implied.` },
      worked: 'Lever and Steel disagree about the order. Lever clews up the weather side first, as with a topsail; Steel’s seamanship eases the lee sheet first.',
      sources: ['S 206', 'S 213', 'L 56', 'L 86'],
    };

    const fy = S.clewY * 0.3;
    const thimble = [yx - 0.3, 0.3, tz + 0.7];
    const buntline = {
      id: 'buntline',
      group: 'sail',
      name: 'Buntline',
      does: 'Lifts the foot of the sail. One rope, with two legs to the foot, worked from the top.',
      mirror: false,
      path: [
        { p: [sx - 0.2, fy, footZ(S, fy)], mark: 'fast', step: 'It “bends, with legs, to the cringles in the foot of the sail”.' },
        { p: thimble, mark: 'lead', step: 'Up the fore side “through a thimble seized to the tye, close down upon the yard”.' },
        { p: [x0 - 0.9, 0.4, m.tgHoundZ + 0.6], mark: 'block', step: 'Up to “a small-block seized to the topgallant-mast-head”.' },
        { p: inTop(2, 3), mark: 'belay', step: '“The leading-part comes down into the top.”' },
      ],
      extra: [[[sx - 0.2, -fy, footZ(S, fy)], thimble]],
      purchase: 'None.',
      belay: { short: `In the ${adj} top`, level: 'aloft', status: 'period', text: 'In the top. It does not come to the deck.' },
      notes: ['Described by both Steel and Lever, but absent from Steel’s table for a 74. Lever complains that “many Vessels in the coasting Trade have no Buntlines to their Top Gallant Sails”, which is hard on the boys sent up to hand them.'],
      sources: ['S 213', 'L 56', 'L 84'],
    };

    const bz1 = down(S, 0.55), bz2 = down(S, 0.8);
    const bridle = [sx - 3, leechY(S, (bz1 + bz2) / 2), (bz1 + bz2) / 2];
    const bowLead = {
      fore: {
        path: [
          { p: [G.jibboomEnd[0] + 0.5, 0.6, G.jibboomEnd[1]], mark: 'lead', step: 'Forward “through the thimbles at the jib-boom-end”.' },
          { p: [7, 1.6, 20], mark: 'belay', step: 'It “comes upon the forecastle” and belays “to a pin in the breast-hook”.' },
        ],
        belay: { short: 'Pin, fore end of forecastle', level: 'weather', status: 'period', text: 'A pin at the very fore end of the forecastle.' },
      },
      main: {
        path: [
          { p: [22.6, 2, MASTS.fore.crossZ], mark: 'lead', step: 'Forward “through the sheave-holes in the after part of the fore-topmast-cross-trees”.' },
          { p: [26, 4.5, 19], mark: 'belay', inferred: true, step: '“Leading down upon deck.” The fitting is not named.' },
        ],
        belay: { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'On the forecastle. The fitting is not named.' },
      },
      mizen: {
        path: [
          { p: [100.8, 2, MASTS.main.crossZ], mark: 'lead', step: 'Forward “through the sheave-holes in the aft part of the main-topmast-cross-trees”.' },
          { p: [104, 5.5, 18.5], mark: 'belay', inferred: true, step: 'Down to the deck. The fitting is not named.' },
        ],
        belay: { short: 'Quarterdeck (not named)', level: 'weather', status: 'inferred', text: 'On the quarterdeck near the mainmast. Neither the place nor the fitting is stated.' },
      },
    }[adj];
    const bowlines = {
      id: 'bowlines',
      group: 'sail',
      name: 'Bowlines',
      does: 'Steady the weather leech when close-hauled. Topgallant sails have two bowline cringles a side.',
      path: [{ p: bridle, mark: 'fast', step: 'Bridles to the cringles on the leech. The bowline is fitted “with a toggle to cast off the bowline for sending the yard down”.' }].concat(bowLead.path),
      extra: [[bridle, [sx, leechY(S, bz1), bz1]], [bridle, [sx, leechY(S, bz2), bz2]]],
      purchase: 'None.',
      belay: bowLead.belay,
      sources: ['S 213', 'L 56', 'L 57', 'L 58'],
    };

    const bending = {
      id: 'bending',
      group: 'sail',
      name: 'Earings, robands and gaskets',
      does: 'Hold the sail to its yard. A topgallant sail “bends or laces to the yard” (Steel) and has “one long gasket on each side, and another shorter in the bunt” (Lever). It has no reef bands, no reef tackles and no leech-lines: when there is too much wind for it, it comes in.',
      path: null,
      extra: [[[sx + 0.2, -S.headY, S.headZ], [sx + 0.2, S.headY, S.headZ]]],
      mirror: false,
      lead: 'Nothing comes down.',
      rope: main ? 'Four earings in Steel’s table.' : null,
      sources: ['S 213', 'L 56', 'S74 36'],
    };

    const yardRope = {
      id: 'yard-rope',
      group: 'occasional',
      name: 'Yard-rope and jack-block',
      does: 'Send the yard down on deck and up again. This is routine for a topgallant yard, and the real difference between it and the yards below.',
      path: null,
      lead: 'Not drawn. The yard travels on a yard-rope rove through a jack-block buttoned round the topgallant mast, and is kept to windward on the way by a traveller on the weather topmast backstay. It is rigged and unrigged aloft by men on the crosstrees and in the topmast shrouds, canted by a clewline and a lift.',
      sources: ['S 213', 'S 214', 'S 179', 'L 47', 'L 48', 'L 86'],
    };

    const where = {
      fore: 'The fore topgallant’s braces come down to the belfry and its bowlines go right out to the jibboom end.',
      main: 'The main topgallant’s braces come down in the mizen shrouds and its bowlines go through the fore topmast crosstrees.',
      mizen: 'The mizen topgallant’s braces are single and go to the peak of the gaff.',
    }[adj];
    const notice = `
      <h2>What to notice</h2>
      <h3>A topsail in miniature, with everything single</h3>
      <p>One tye where the topsail has two. Single lifts with an eye over the yardarm. One buntline. No reefs, no reef tackles, no leech-lines. ${where}</p>
      <h3>Half its gear stops in the top</h3>
      <p>The lifts and the buntline belay in the top, and the clewlines in the lower shrouds. Only the halliards, sheets, braces and bowlines reach the deck.</p>
      <h3>The yard comes down</h3>
      <p>Lower and topsail yards stay aloft. A topgallant yard is sent down and up as a matter of routine, on a yard-rope through a jack-block, which is why its bowlines are toggled and its tye is often made to double as the yard-rope.</p>
      <h2>Where the sources disagree or go quiet</h2>
      <ul>
        <li><b>Sheets.</b> Described in the text; no entry in Steel’s table for a 74; belaying point not given.</li>
        <li><b>Buntline.</b> In both texts; not in the table.</li>
        <li><b>Braces.</b> Single in Falconer (1769) and in Lever for smaller ships; with a pendent and block in Steel’s text and table.</li>
        <li><b>Clewing up.</b> Weather side first in Lever; lee sheet first in Steel.</li>
      </ul>`;

    return {
      id: `${adj}-topgallant`, mast: adj, tier: 'topgallant', title: `The ${adj} topgallant sail`, start: 'halliards', notice,
      lines: [halliards, lifts, braces, horses, sheets, clewlines, buntline, bowlines, bending, yardRope],
    };
  }

  function royal(m) {
    const x0 = m.x, yx = m.x - 1.5, sx = m.x - 2, rz = m.ryZ;
    const S = shape(m, 'royal');
    const adj = m.key;
    const aft = AFT[adj];
    const halliards = {
      id: 'halliards',
      group: 'yard',
      name: 'Halliards',
      does: 'The only rope the sail needs. The royal is “set flying”: yard and sail are hoisted from the deck together by the halliards.',
      mirror: false,
      path: [
        { p: [yx, 0.2, rz], mark: 'fast', step: '“The haliards hitch round the slings of the yard.”' },
        { p: [x0 - 0.9, 0.3, m.poleZ - 1.5], mark: 'lead', step: 'Up “through the sheave-hole in the topgallant-mast-head”: the long pole head above the topgallant rigging.' },
        { p: [x0 + 2, 4.5, m.deckZ + 0.5], mark: 'belay', inferred: true, step: 'They “lead down upon deck”. Neither the place nor the fitting is given.' },
      ],
      purchase: 'None.',
      belay: { short: `Near the ${m.mastName} (not named)`, level: 'weather', status: 'inferred', text: 'Not stated beyond “upon deck”.' },
      sources: ['S 214', 'S 166', 'L 58'],
    };

    const clews = {
      id: 'clews',
      group: 'sail',
      name: 'Clews lashed to the yard below',
      does: 'The royal has no sheets. “The Clews are lashed to the Top-Gallant Yard Arms” (Lever). Steel defines flying a sail as “setting them in [a] loose manner; as royal sails without lifts, or sheets, the clues being lashed”.',
      path: null,
      extra: [[[sx, S.clewY, S.clewZ], [yx, m.tgHalf, m.tgZ + 0.3]]],
      lead: 'Nothing comes down. The sail is bent to its yard with sennit rope-bands.',
      sources: ['L 58', 'S 166'],
    };

    const braceEnd = aft
      ? [{ p: [aft.x - 0.6, 0.6, aft.tgHoundZ + 0.5], mark: 'block', step: 'Aft through “single-blocks at the next topgallant-mast-head aft”.' }, { p: [aft.x + 2.5, 6, aft.deckZ + 0.5], mark: 'belay', inferred: true, step: 'They “lead down upon deck”. The fitting is not named.' }]
      : [{ p: [G.gaffPeak[0] - 0.5, 0.6, G.gaffPeak[1] - 0.4], mark: 'block', step: 'Aft to a single block at the “mizen-peek”.' }, { p: [186, 7.5, 26.6], mark: 'belay', inferred: true, step: 'They “lead down upon deck”. The fitting is not named.' }];
    const braces = {
      id: 'braces',
      group: 'occasional',
      name: 'Braces',
      does: 'Sometimes fitted. Lever says a flying royal has “neither Lifts nor Braces, (though sometimes the latter)”. Steel gives single braces.',
      path: [{ p: [yx, m.ryHalf, rz], mark: 'fast', step: 'An eye over the yardarm.' }].concat(braceEnd),
      purchase: 'None; single.',
      belay: { short: 'On deck (not named)', level: 'weather', status: 'inferred', text: 'Not stated beyond “upon deck”.' },
      sources: ['S 214', 'L 58'],
    };

    const notice = `
      <h2>What to notice</h2>
      <h3>Almost no gear at all</h3>
      <p>No lifts, no sheets, no clewlines, no buntlines, no bowlines, no parrel worth the name. The yard goes up on its halliards with the sail already bent, and the clews are lashed to the topgallant yardarms. A royal drawn with the full gear of the sails below it is a later ship, or an East Indiaman.</p>
      <h3>It sets on the topgallant mast</h3>
      <p>There is no separate royal mast. The topgallant mast has a long pole head above its rigging, and the royal hoists on that. Steel says separate royal masts “are seldom used”; Lever says “the Royal Yards are seldom rigged across”.</p>
      <h3>It comes in with the sail below</h3>
      <p>When the royal is taken in it is furled in with the topgallant sail under it. Lever says of the flying sprit topsail that “it is furled in with the Spritsail, as the Royal is with the Top-Gallant Sail”.</p>
      <h2>Where the sources go quiet</h2>
      <ul>
        <li><b>Steel’s table for a 74 has no royal gear at all.</b> Everything here is from his general text and Lever’s.</li>
        <li><b>Braces.</b> Given by Steel, optional in Lever.</li>
        <li><b>Where the halliards belay</b> is not stated.</li>
        <li>Royals on the fore and main date from 1779 and on all three masts from about 1790, according to Lees at second hand.</li>
      </ul>`;

    return { id: `${adj}-royal`, mast: adj, tier: 'royal', title: `The ${adj} royal`, start: 'halliards', notice, lines: [halliards, clews, braces] };
  }

  for (const key of ['fore', 'main', 'mizen']) SAILS.push(topgallant(MASTS[key]), royal(MASTS[key]));
})();
