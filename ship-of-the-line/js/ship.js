// The reference at the top of ship.html: a sail plan in which every spar and
// sail can be pointed at, and the two tables under it. Runs after reader.js,
// so it also draws the close-up sketches that the standing-rigging chapters
// ask for with <svg data-inset="…">, and adjusts a few of the reading page's
// headings, which speak of belaying, to suit rigging that is set up instead.

(function () {
  const { MASTS, SAILS, shape, yard } = window.RIGDATA;
  const { svg, draw } = window.RIGVIEWS;
  const T = window.RIGTEXT;
  const $ = (id) => document.getElementById(id);
  const NAME = { fore: 'Fore', main: 'Main', mizen: 'Mizen' };
  const ALL = [MASTS.fore, MASTS.main, MASTS.mizen];

  // --- Sources ---------------------------------------------------------------
  const steel = (page, part) => `X Steel 1794, p. ${page}|https://maritime.org/doc/steel/part${part}.htm#pg${page}`;
  const P49 = 'X Steel 1794, p. 49, “Dimensions of Masts and Yards in the Royal Navy”|https://maritime.org/doc/steel/large/pg049.htm';
  const TERMS = (word) => `X Steel 1794, rigging terms, ${word}|https://maritime.org/doc/steel/part6.htm`;
  const lees = (pages) => `X Lees, The Masting and Rigging of English Ships of War (1979), ${pages}, seen as a snippet only`;
  const MOORE = (word) => `X Moore, The Midshipman’s or British Mariner’s Vocabulary (1801), ${word}|https://archive.org/details/midshipmansorbr00moorgoog`;
  const APPENDIX = 'X Lever 1819, Appendix|https://archive.org/details/youngseaofficers00leve_0';

  // --- Spars -------------------------------------------------------------------
  // Steel's lengths and diameters for a 74 of 1799 tons (p. 49).
  const SIZE = {
    fore: { mast: ['98 ft 6 in', '32¼ in'], topmast: ['58 ft 8 in', '19¾ in'], tg: ['29 ft 4 in', '9¾ in'], course: ['85 ft', '20 in'], topsail: ['62 ft', '13 in'], topgallant: ['40 ft 6 in', '8¼ in'], royal: ['31 ft', '6½ in'] },
    main: { mast: ['111 ft', '37 in'], topmast: ['66 ft', '19¾ in'], tg: ['33 ft', '11¼ in'], course: ['97 ft', '23 in'], topsail: ['70 ft', '15 in'], topgallant: ['46 ft 6 in', '9½ in'], royal: ['35 ft', '7½ in'] },
    mizen: { mast: ['95 ft', '22¼ in'], topmast: ['49 ft', '13½ in'], tg: ['24 ft 6 in', '8⅛ in'], course: ['62 ft', '13 in'], topsail: ['47 ft', '9¾ in'], topgallant: ['31 ft 6 in', '6⅛ in'], royal: ['23 ft', '4⅞ in'] },
  };
  // Outboard reach of a studding sail boom: Steel puts the inner boom iron a
  // third of the boom's length in from the yardarm; the rest of the heel is a guess.
  const REACH = 0.6;
  const BOOM = { fore: { topmast: 42.5, topgallant: 31, yards: [31, 24.5, 17.75] }, main: { topmast: 48.5, topgallant: 35, yards: [31, 27.25, 20] } };
  // Square sails are laid flat about the mast; studding sails are drawn on
  // the forward side of the foremast and the after side of the mainmast.
  const centre = (m) => m.x - 1.5;
  const SIDE = { fore: -1, main: 1 };

  const SPARS = [];
  const spar = (o) => SPARS.push(o);

  for (const m of ALL) {
    const k = m.key, N = NAME[k], c = centre(m), mz = k === 'mizen';
    spar({
      id: `${k}-mast`, group: 'Masts', name: `${N} lower mast`, also: k === 'mizen' ? 'mizen mast' : `${k}mast`, size: SIZE[k].mast,
      text: [
        k === 'mizen' ? 'A fir stick about three-fifths the thickness of the mainmast.' : 'A made mast: built up of several trees, hooped and woolded.',
        'Steel’s length is the whole stick from its step to the top of the head, not the height above the deck. The diameter is taken at the partners.',
        k === 'main' ? 'By his rule the mainmast is half the sum of the lower deck’s length and the ship’s breadth, the foremast eight-ninths of it and the mizen six-sevenths. Lees dates iron hoops in place of rope wooldings to 1800.' : '',
      ],
      sources: [P49, steel(39, 1)].concat(k === 'main' ? [lees('p. 159')] : []),
      segs: [[[m.x, 8], [m.x, m.capZ], mz ? 2 : 3]], label: { at: [m.x + 2.6, 46], anchor: 'end' },
    });
    spar({
      id: `${k}-topmast`, group: 'Masts', name: `${N} topmast`, size: SIZE[k].topmast,
      text: ['Fidded on the trestle-trees of the lower mast and held to its head by the lower cap. Its own head carries the crosstrees and a cap for the topgallant mast.'],
      sources: [P49],
      segs: [[[m.x - 0.6, m.topZ], [m.x - 0.6, m.tmCapZ], 1.7]], label: { at: [m.x + 2.2, (m.topZ + m.crossZ) / 2 + 9], anchor: 'end' },
    });
    spar({
      id: `${k}-tgmast`, group: 'Masts', name: `${N} topgallant mast`, size: SIZE[k].tg,
      text: [
        'Fidded on the topmast trestle-trees. Above its rigging it runs on as a long pole head, and the royal is set flying on that.',
        'There is no royal mast. Steel’s table gives a 74 royal yards on all three masts and nothing under royal masts: “Royal masts … are seldom used.” Lever, 1808: “The Royal Yards are seldom rigged across. When they are, they have a Royal Mast fidded on the Tressle-trees at the Top Gallant Mast Heads.” A separate fidded royal mast on this ship would be an anachronism.',
        'A long pole head is “two-thirds the length to the stop”.',
      ],
      sources: [P49, steel(206, 7), 'L 58', 'X Steel 1794, mastmaking|https://maritime.org/doc/steel/part1.htm'],
      segs: [[[m.x - 1, m.crossZ], [m.x - 1, m.poleZ], 0.9]], label: { at: [m.x + 1.8, (m.crossZ + m.tgHoundZ) / 2 + 5], anchor: 'end' },
    });
    spar({
      id: `${k}-top`, name: `${N} top`,
      text: ['The platform at the head of the lower mast, resting on the trestle-trees and crosstrees. Its rim spreads the topmast shrouds.', k === 'main' ? 'By Steel’s rule its breadth is a third of the topmast’s length and its fore-and-aft depth three-quarters of that: about 22 ft by 16 ft 6 in.' : ''],
      sources: [steel(37, 1)],
      segs: [[[m.x - 7, m.topZ], [m.x + 8, m.topZ], 0.8]], label: k === 'main' ? { at: [m.x + 9.5, m.topZ - 1], anchor: 'end', text: 'Top' } : null,
    });
    spar({
      id: `${k}-cap`, name: `${N} lower cap`,
      text: ['Joins the head of the lower mast to the topmast, which passes up through it. The topsail yard comes down on to it when the sail is reefed or furled.'],
      sources: [P49],
      segs: [[[m.x - 2.2, m.capZ], [m.x + 1.6, m.capZ], 1.1]], label: k === 'main' ? { at: [m.x + 3.2, m.capZ - 1], anchor: 'end', text: 'Cap' } : null,
    });
    spar({
      id: `${k}-crosstrees`, name: `${N} topmast crosstrees`,
      text: ['At the head of the topmast, on its trestle-trees. They spread the topgallant shrouds as the top spreads the topmast shrouds.'],
      sources: [steel(205, 7)],
      segs: [[[m.x - 3.4, m.crossZ], [m.x + 3.6, m.crossZ], 0.6], [[m.x - 2, m.tmCapZ], [m.x + 0.6, m.tmCapZ], 0.8]], label: k === 'main' ? { at: [m.x - 5, m.crossZ + 2.4], anchor: 'start', text: 'Crosstrees' } : null,
    });

    const yards = {
      course: {
        name: mz ? 'Crossjack yard' : `${N} yard`,
        text: mz
          ? ['It carries no sail. “The CROSS-JACK-YARD is used to expand the foot of the mizen topsail” (Steel), and his table for a 74 gives it braces, lifts and slings but no sheets, tacks or clue-garnets.', 'Falconer in 1769 already says of the crossjack sail that it “has generally been found of little service, and is therefore very seldom used”. By Steel’s rule the yard is the same length as the fore topsail yard.']
          : ['Slung once and left there: a lower yard is not hoisted and lowered in working the ship.', k === 'main' ? 'By Steel’s rule it is eight-ninths of the mainmast.' : 'By Steel’s rule it is seven-eighths of the main yard.'],
        sources: mz ? [P49, TERMS('YARDS'), 'S 207', 'S74 37', 'F CROSS-JACK'] : [P49, steel(40, 1)],
      },
      topsail: { name: `${N} topsail yard`, text: ['Travels up and down the topmast every time the sail is set, reefed or taken in.'], sources: [P49] },
      topgallant: { name: `${N} topgallant yard`, text: ['Two-thirds of its topsail yard in a 74 by Steel’s rule; three-fifths in smaller ships.'], sources: [P49, steel(40, 1)] },
      royal: { name: `${N} royal yard`, text: ['Not kept aloft. It is sent up from the deck by its halliards with the sail bent to it each time the royal is set, and a boy at the masthead lashes the clews.', 'Half the length of its topsail yard.'], sources: [P49, 'L 58', 'L 82'] },
    };
    for (const tier of Object.keys(yards)) {
      const y = yard(m, tier), d = yards[tier];
      spar({
        id: `${k}-${tier}-yard`, group: 'Yards', name: d.name, size: SIZE[k][tier], text: d.text, sources: d.sources,
        segs: [[[c - y.half, y.z], [c + y.half, y.z], { course: 1.5, topsail: 1.2, topgallant: 0.8, royal: 0.6 }[tier]]],
        label: { at: [c - 3.5, y.z + 2.2], anchor: 'start', text: mz && tier === 'course' ? 'Crossjack yard (no sail)' : null },
      });
    }

    // Studding sail booms: none on the mizen.
    if (BOOM[k]) {
      const s = SIDE[k], at = (y) => c + s * y;
      const low = yard(m, 'course'), top = yard(m, 'topsail');
      const b1 = BOOM[k].topmast, b2 = BOOM[k].topgallant;
      spar({
        id: `${k}-topmast-boom`, cls: 'boom', group: 'Studding sail booms and yards', name: `${N} topmast studding sail boom`, size: k === 'fore' ? ['42 ft 6 in', '8½ in'] : ['48 ft 6 in', '9¾ in'],
        text: [`Lies on the ${m.lowerYard} and slides out through two boom irons to spread the foot of the topmast studding sail. Run in along the yard and lashed when not in use. Half the length of the yard it lies on.`, 'How far it reaches beyond the yardarm is a guess from where Steel puts the inner boom iron. <a href="studding-sails.html">Studding sails</a> have a page of their own.'],
        sources: [P49, steel(35, 1)],
        segs: [[[at(low.half - (1 - REACH) * b1), low.z + 1], [at(low.half + REACH * b1), low.z + 1], 0.6]], label: k === 'fore' ? { at: [at(low.half + REACH * b1), low.z + 2.6], anchor: 'start', text: 'Topmast studding sail boom' } : null,
      });
      spar({
        id: `${k}-topgallant-boom`, cls: 'boom', group: 'Studding sail booms and yards', name: `${N} topgallant studding sail boom`, size: k === 'fore' ? ['31 ft', '6¼ in'] : ['35 ft', '7 in'],
        text: [`Lies on the ${k} topsail yard and spreads the foot of the topgallant studding sail.`],
        sources: [P49],
        segs: [[[at(top.half - (1 - REACH) * b2), top.z + 0.8], [at(top.half + REACH * b2), top.z + 0.8], 0.45]], label: k === 'fore' ? { at: [at(top.half + REACH * b2), top.z + 2.4], anchor: 'start', text: 'Topgallant studding sail boom' } : null,
      });
    }
  }
  spar({
    id: 'lower-boom', cls: 'boom', group: 'Studding sail booms and yards', name: 'Lower studding sail boom', also: 'swinging boom', size: ['53 ft 9 in', '10¾ in'],
    text: ['Swings out from the ship’s side to spread the foot of the lower studding sail. Five-ninths of the main yard by Steel’s rule.'],
    sources: [P49, steel(40, 1)],
    segs: [[[centre(MASTS.fore) - 21, 19.5], [centre(MASTS.fore) - 74.75, 19.5], 0.7]], label: { at: [centre(MASTS.fore) - 74.75, 15.4], anchor: 'start' },
  });

  spar({
    id: 'bowsprit', group: 'Bowsprit and mizen', name: 'Bowsprit', size: ['67 ft 6 in', '35 in'],
    text: ['Two inches thinner than the mainmast and thicker than the foremast: the stays of the foremast and fore topmast all end on it. Three-fifths of the mainmast by Steel’s rule.', 'Steel says it steeves “nearly thirty-six degrees above a horizontal line”. It is drawn at about thirty, which is this tutorial’s estimate. Its squared outer end carries the cap and the bees.'],
    sources: [P49, steel(2, 1)],
    segs: [[[4, 21], [-40, 46], 2.6]], label: { at: [-14, 26.5], anchor: 'start' },
  });
  spar({
    id: 'jibboom', group: 'Bowsprit and mizen', name: 'Jibboom', also: 'jib-boom', size: ['50 ft 4 in', '14½ in'],
    text: ['Runs out through the bowsprit cap “as a Topmast does through the lower Cap” (Lever). Its heel rests in a saddle on the bowsprit and is lashed.', 'Steel’s list of proportions calls this spar the “flying jib boom, 5/7 of the bowsprit”, meaning a boom that is run out. It is not evidence of the later flying jibboom.'],
    sources: [P49, 'L 31', steel(40, 1)],
    segs: [[[-27, 40], [-72, 60], 1.1]], label: { at: [-58, 58], anchor: 'end' },
  });
  spar({
    id: 'flying-jibboom', group: 'Bowsprit and mizen', name: 'Flying jibboom', size: ['not in Steel', ''], dashed: true,
    text: ['Introduced in 1794, according to Lees. Steel’s table of that year gives a 74 none; Moore in 1801 calls the flying jib “a sail sometimes set upon a boom, rigged out beyond the Jib-Boom”; Lever mentions the boom only in his 1819 appendix. So it is right for about 1800 onwards and optional before.', 'Lees has it lying on the starboard upper side of the jibboom. Its length and how far it reaches are guesses, so it is drawn dashed.'],
    sources: [lees('pp. 11, 32, 159'), MOORE('JIB, BOOM'), APPENDIX],
    segs: [[[-50, 51.2], [-92, 69.9], 0.7]], label: { at: [-93, 73], anchor: 'end' },
  });
  spar({
    id: 'dolphin-striker', group: 'Bowsprit and mizen', name: 'Dolphin striker', also: 'martingale, martingal', size: ['not in Steel', ''],
    text: ['A bar under the bowsprit cap that gives the martingale stay a downward lead, to hold the jibboom down as the bobstays hold the bowsprit.', 'Lees dates it to 1794. Steel describes it that year as the “martingal” but leaves it out of his table for a 74. In Moore (1801) “martingale” is the rope. Lever (1808) calls the bar the dolphin-striker.'],
    sources: ['S 233', 'L 60', lees('p. 32'), MOORE('MARTINGALE')],
    segs: [[[-40, 46], [-41.5, 35], 0.5]], label: { at: [-43.5, 36.4], anchor: 'start' },
  });
  spar({
    id: 'spritsail-yard', group: 'Yards', name: 'Spritsail yard', size: ['62 ft', '13 in'], dot: [-30, 38.6, 1],
    text: ['Slung under the bowsprit and here seen end-on. It is as long as the fore topsail yard.', 'By 1805 it matters more as the spreader of the jibboom guys than for its sail. Lever in 1819 presumes many naval ships have landed it “on account of the great weight of a Yard … lying so far out when a Ship is pitching”, and Lees has it “relegated to a spreader” between 1811 and 1830.'],
    sources: [P49, 'S 196', APPENDIX, lees('p. 159')],
    segs: [], label: { at: [-31.5, 31.5], anchor: 'start' },
  });
  spar({
    id: 'sprit-topsail-yard', group: 'Yards', name: 'Sprit topsail yard', also: 'spritsail topsail yard', size: ['40 ft 6 in', '8¼ in'], dot: [-51, 49.2, 0.7],
    text: ['Slung under the jibboom on a parrel, and seen end-on. The same length as the fore topgallant yard.', 'The sprit topmast that once stood on the end of the bowsprit is long gone: Falconer in 1769 says that method “has of late been justly rejected”.'],
    sources: [P49, 'S 197', 'F SPRITSAIL'],
    segs: [], label: { at: [-53, 45.5], anchor: 'start' },
  });
  spar({
    id: 'gaff', group: 'Bowsprit and mizen', name: 'Gaff', size: ['not for a 74 in Steel', ''],
    text: ['Spreads the head of the mizen and of the driver. It replaced the mizen yard in ships of the line between about 1790 and 1805.', 'Steel (1794) defines a gaff as “A short pole projecting from the mizenmast of ships, except those of the line”. His table gives one, with a driver boom, to ships of 50 guns and under; his rule makes it five-eighths of the boom. The length drawn is an estimate.'],
    sources: [steel(2, 1), P49, 'L 42'],
    segs: [[[151, 60], [178, 80], 0.9]], label: { at: [171, 78.5], anchor: 'start' },
  });
  spar({
    id: 'driver-boom', group: 'Bowsprit and mizen', name: 'Driver boom', also: 'spanker boom', size: ['none for a 74 in Steel', ''],
    text: ['Lees’s chronology has the mizen sail “fitted with a BOOM” in 1793. Steel’s table of 1794 still gives a 74 no driver boom: the driver was then set flying, with a small yard of its own at the head.', 'The length drawn is an estimate.'],
    sources: [P49, lees('p. 159'), 'L 66'],
    segs: [[[151, 33], [193, 37], 1.1]], label: { at: [194, 39.5], anchor: 'start' },
  });
  spar({
    id: 'mizen-yard', cls: 'old', group: 'Bowsprit and mizen', name: 'Mizen yard', also: 'lateen yard', size: ['84 ft', '15½ in'], dashed: true,
    text: ['The long yard that the gaff replaced, drawn dashed. In Steel’s table of 1794 it is still the official fit for a 74, with the sail set only abaft the mast: “The mizen-yard is not often used, except in ships above 50 guns, and in East-India ships.”', '<i>Vanguard</i> is said to have still had hers at the Nile in 1798. By 1808 Lever writes that such yards “are now entirely laid aside”. It lingered because it was a spare spar that could be made into a jury fore yard. No single date or order for the change was found.'],
    sources: [P49, 'S 207', 'L 42', 'X Longridge, The Anatomy of Nelson’s Ships (1955), seen in snippets only'],
    segs: [[[110.5, 30], [151, 60], 0.8]], label: { at: [119, 33.5], anchor: 'end', text: 'Mizen yard (to about 1800)' },
  });
  spar({
    id: 'ensign-staff', group: 'Staffs', name: 'Ensign staff', size: ['40 ft', '6½ in'],
    text: ['At the taffrail.'], sources: [P49],
    segs: [[[188.6, 31.5], [194, 71], 0.5]], label: { at: [195.5, 62], anchor: 'start' },
  });
  spar({
    id: 'jack-staff', group: 'Staffs', name: 'Jack staff', size: ['18 ft', '4½ in'],
    text: ['On the bowsprit cap.'], sources: [P49],
    segs: [[[-40, 46.5], [-40.6, 64.5], 0.4]], label: { at: [-38.6, 61], anchor: 'end' },
  });

  // Rows of the table that have nothing to point at in the drawing.
  const TABLE_ONLY = [
    { group: 'Studding sail booms and yards', name: 'Studding sail yards', size: ['17 ft 9 in to 31 ft', '3½ to 6¼ in'], note: 'One at the head of each studding sail; four-sevenths of its boom.' },
    { group: 'Staffs', name: 'Boomkins', also: 'bumkins', size: ['', ''], note: 'Short spars at the bows for the fore tacks. Steel’s table has “Gammoning the Bumkin”.' },
  ];

  // --- Sails -------------------------------------------------------------------
  const STATUS = [
    ['routine', 'Routine'],
    ['fair', 'Fair weather or occasional'],
    ['light', 'Light airs'],
    ['going', 'Going out of use'],
  ];
  const SAIL_LIST = [];
  const sail = (o) => SAIL_LIST.push(o);

  function squarePath(m, tier) {
    const S = shape(m, tier), c = centre(m);
    return `M ${-(c - S.headY)} ${-S.headZ} L ${-(c + S.headY)} ${-S.headZ} L ${-(c + S.clewY)} ${-S.clewZ} Q ${-c} ${-S.footCtrlZ} ${-(c - S.clewY)} ${-S.clewZ} Z`;
  }
  const poly = (points) => 'M ' + points.map(([x, z]) => `${-x} ${-z}`).join(' L ') + ' Z';
  const mid = (m, tier) => { const S = shape(m, tier); return [centre(m), (S.headZ + S.clewZ) / 2 - 1]; };

  const ROYAL = 'Set flying on the pole head of the topgallant mast: “ROYALS are set flying. The haliards hitch round the slings of the yard, and through the sheave-hole in the topgallant-mast-head, and lead down upon deck” (Steel). No lifts or sheets, braces only sometimes, and the clews lashed to the topgallant yardarms.';
  const SQUARE = {
    fore: {
      course: ['Foresail', 'fore course', 'routine', ['One of the ordinary working sails.']],
      topsail: ['Fore topsail', '', 'routine', ['With the main topsail, the principal working sail of the ship.']],
      topgallant: ['Fore topgallant', 'fore topgallant sail', 'routine', ['Routine in moderate weather.']],
      royal: ['Fore royal', '', 'light', [ROYAL, 'Lees’s chronology has fore and main royals introduced in 1779.']],
    },
    main: {
      course: ['Mainsail', 'main course', 'routine', ['One of the ordinary working sails.']],
      topsail: ['Main topsail', '', 'routine', ['With the fore topsail, the principal working sail of the ship.']],
      topgallant: ['Main topgallant', 'main topgallant sail', 'routine', ['Routine in moderate weather.']],
      royal: ['Main royal', '', 'light', [ROYAL, 'Falconer already defines the royal in 1769 as “the highest sail which is extended in any ship”, used only “in light and favourable breezes”.']],
    },
    mizen: {
      topsail: ['Mizen topsail', '', 'routine', ['Its foot is spread by the crossjack yard, which carries no sail of its own.']],
      topgallant: ['Mizen topgallant', 'mizen topgallant sail', 'routine', ['Set in moderate weather.']],
      royal: ['Mizen royal', '', 'light', [ROYAL, 'Royals on all three masts are general from about 1790, according to Lees.']],
    },
  };
  for (const m of ALL) {
    for (const tier of Object.keys(SQUARE[m.key])) {
      const [name, also, status, text] = SQUARE[m.key][tier];
      sail({
        id: `${m.key}-${tier}`, mast: m.key, kind: 'square', name, also, status, text,
        sources: tier === 'royal' ? ['S 214', steel(84, 4), 'L 58', lees('p. 159')] : ['S 219'],
        d: squarePath(m, tier), label: { at: mid(m, tier) },
      });
    }
  }

  // Studding sails, laid flat outside the leeches on one side only.
  for (const k of ['fore', 'main']) {
    const m = MASTS[k], N = NAME[k], c = centre(m), s = SIDE[k], at = (y) => c + s * y;
    const low = yard(m, 'course'), top = yard(m, 'topsail'), tg = yard(m, 'topgallant');
    const [y1, y2, y3] = BOOM[k].yards;
    const quad = (a, b, z1, e, f, z2) => poly([[at(a), z1], [at(b), z1], [at(f), z2], [at(e), z2]]);
    const src = ['S 218', 'L 64'];
    sail({
      id: `${k}-lower-stunsail`, mast: k, kind: 'studding', name: `${N} lower studding sail`, also: 'lower stunsail',
      status: k === 'main' ? 'going' : 'fair',
      text: k === 'main'
        ? ['Withdrawn in 1801. Lees: “By Admiralty Order in 1801, the main stunsail was no longer issued.” After that a lower studding sail means the foremast’s. Steel (1794) and Lever (1808) both still rig it.']
        : ['Set with the wind abaft the beam, its foot spread by the swinging boom. After 1801 this is the only lower studding sail.', 'Its depth here is from Steel’s sailmaking rule: two or three yards deeper than the main course.'],
      sources: k === 'main' ? [lees('pp. 117, 159')].concat(src) : src.concat([steel(113, 4)]),
      d: quad(low.half + 0.8, low.half + 33, low.z - 1, low.half + 0.8, low.half + 33, 20), label: { at: [at(low.half + (k === 'fore' ? 25 : 15)), k === 'fore' ? 33 : 43], text: 'Lower\nstudding sail' },
    });
    sail({
      id: `${k}-topmast-stunsail`, mast: k, kind: 'studding', name: `${N} topmast studding sail`, also: 'topmast stunsail', status: 'fair',
      text: [k === 'fore' ? 'Fair weather. The fore topmast studding sail is the most used of them all.' : 'Fair weather, with the wind well aft.', `Its head is on a yard of its own hoisted to the topsail yardarm, and its foot is spread by the boom on the ${m.lowerYard}.`],
      sources: src,
      d: quad(top.half + 0.8, top.half + 0.8 + y2, top.z - 1, low.half - 3, low.half + REACH * BOOM[k].topmast, low.z + 2.2), label: { at: [at((top.half + low.half) / 2 + 14), (top.z + low.z) / 2 - 5], text: 'Topmast\nstudding sail' },
    });
    sail({
      id: `${k}-topgallant-stunsail`, mast: k, kind: 'studding', name: `${N} topgallant studding sail`, also: 'topgallant stunsail', status: 'light',
      text: ['Light airs. Lees dates topgallant studding sails to about 1773.', 'Its foot is spread by the boom on the topsail yard.'],
      sources: src.concat([lees('p. 118')]),
      d: quad(tg.half + 0.6, tg.half + 0.6 + y3, tg.z - 0.8, top.half - 2, top.half + REACH * BOOM[k].topgallant, top.z + 2), label: { at: [at((tg.half + top.half) / 2 + 9.5), k === 'fore' ? (tg.z + top.z) / 2 : tg.z - 6], text: 'Topgallant\nstudding sail' },
    });
  }

  // Fore-and-aft sails in true profile. Their outlines are sketched to fit
  // the stays; none is taken from a sail table.
  const fa = (o) => sail(Object.assign({ kind: 'foreaft', d: poly(o.points) }, o));
  fa({
    id: 'spritsail', mast: 'bowsprit', name: 'Spritsail', also: 'spritsail course', status: 'going', edge: [[-30, 38.4], [-30, 19]],
    text: ['“This Sail, as well as the Yard, are now in many Ships laid aside; but they would be found most essential, to wear a Ship, should any Accident happen to the Foremast” (Lever, 1808). It was still made, issued and rigged throughout the period.', 'It is square and hangs across the ship, so here it is seen edge-on. Its depth is a guess.'],
    sources: ['L 58', 'S 219', 'S74 31'], points: [], label: { at: [-32, 21], anchor: 'start' },
  });
  fa({
    id: 'sprit-topsail', mast: 'bowsprit', name: 'Sprit topsail', also: 'spritsail topsail', status: 'light', edge: [[-50.6, 49], [-30.4, 39.2]],
    text: ['It survives to 1815, when by Lees’s account it “was no longer issued to HM ships”. A small square sail on its own yard under the jibboom, its clews spread to the spritsail yardarms, so in profile it lies along the underside of the jibboom, edge-on.', 'Lever still has a ship “set the Spritsail and Spritsail Topsail” when making sail with the wind abaft the beam. Whether it could be used on a bowsprit that also had a dolphin striker has been doubted: see the martingale, below.'],
    sources: ['S 197', 'S 219', 'L 59', 'L 80', lees('pp. 103, 159')], points: [], label: { at: [-53, 44.5], anchor: 'start' },
  });
  fa({
    id: 'flying-jib', mast: 'bowsprit', name: 'Flying jib', status: 'light', points: [[-90, 70.5], [-28, 116.4], [-50, 78]],
    text: ['From 1794, with the flying jibboom, according to Lees. It sets on a stay from the fore topgallant masthead to the flying jibboom end. Steel does not rig one; Moore (1801) says “sometimes set”.'],
    sources: [lees('pp. 126, 148'), MOORE('JIB')], label: { at: [-60, 86] },
  });
  fa({
    id: 'jib', mast: 'bowsprit', name: 'Jib', status: 'routine', points: [[-68, 58.4], [-6, 104.4], [-17, 52]],
    text: ['“A sail of great command with any side-wind” (Falconer). Its tack is not fixed: it hooks to a traveller, an iron ring on the jibboom, so the whole sail can be hauled out to the boom end or brought part of the way in as it blows.'],
    sources: ['F JIB', steel(116, 4), 'L 60'], label: { at: [-33, 68] },
  });
  fa({
    id: 'fore-topmast-staysail', mast: 'bowsprit', name: 'Fore topmast staysail', status: 'routine', points: [[-37, 48.6], [-4, 92], [-5, 50]],
    text: ['The heavy-weather headsail. Its foot is spread along the bowsprit.', 'Steel gives it a stay of its own; Lever bends it to the fore topmast spring stay.'],
    sources: ['S 209', 'L 59'], label: { at: [-13, 58] },
  });
  fa({
    id: 'fore-staysail', mast: 'bowsprit', name: 'Fore staysail', status: 'fair', points: [[-25, 40.6], [8, 62.8], [7, 36]],
    text: ['Sets on the fore preventer stay. “This Sail is seldom used in any Ships but Men of War” (Lever). Lees dates its introduction to 1773.'],
    sources: ['L 59', 'S74 32', lees('pp. 148, 159')], label: { at: [-1, 44] },
  });
  fa({
    id: 'main-staysail', mast: 'main', name: 'Main staysail', status: 'fair', points: [[26, 31.5], [74, 63.2], [74, 27]],
    text: ['“Seldom used in large vessels” and “seldom bent in ships but at sea” (Steel); a sail for lying to. Triangular in the navy.', 'In 1805 it has a stay of its own under the main stay. Lees says that stay was given up in 1810 and the sail itself ousted by the trysail in 1815.'],
    sources: [steel(106, 4), 'S 214', 'L 61', lees('pp. 119, 148')], label: { at: [60, 38] },
  });
  fa({
    id: 'main-topmast-staysail', mast: 'main', name: 'Main topmast staysail', status: 'routine', points: [[27, 50], [27, 72.4], [70, 111], [78, 47]],
    text: ['Routine with the wind forward of the beam. It is bent to the main topmast preventer stay and taken in with brails.', 'Like every staysail between the masts except the main staysail it is four-sided, with a short fore leech called the bunt or nock. Lees dates the four-sided form to 1760.'],
    sources: ['S 214', 'L 61', steel(106, 4), lees('p. 148')], label: { at: [53, 68] },
  });
  fa({
    id: 'middle-staysail', mast: 'main', name: 'Middle staysail', status: 'fair', points: [[24, 90], [24, 103.8], [72, 125.9], [82, 92]],
    text: ['Fair weather. It has a stay of its own from the main topmast head to the fore topmast, and the forward end of that stay is triced up the fore topmast to set the sail and lowered to take it in.'],
    sources: ['S 215', 'L 61'], label: { at: [52, 103] },
  });
  fa({
    id: 'main-topgallant-staysail', mast: 'main', name: 'Main topgallant staysail', status: 'light', points: [[25, 112], [25, 125.5], [66, 150.3], [76, 118]],
    text: ['Light airs. Its stay is spliced into the main topgallant stay and comes down to the fore topmast crosstrees.'],
    sources: ['S 215', 'L 62'], label: { at: [50, 128] },
  });
  fa({
    id: 'driver', mast: 'mizen', name: 'Driver or spanker', status: 'fair', points: [[151.4, 60.9], [178.8, 81.2], [193, 37.8], [151.4, 31.6]],
    text: ['In 1805 these are two names for one sail: “the driver, or spanker” (Steel); “SPANKER, a name sometimes given to a ship’s Driver” (Moore, 1801). It is a larger sail with a boom, set in place of the mizen in fair weather.', 'It became the permanent sail in 1806 or 1810; Lees gives both. The modern rule that a driver is temporary and a spanker permanent is Lees’s own convention, adopted for clarity. An officer of the time could say either.'],
    sources: ['S 217', steel(118, 4), 'L 66', MOORE('SPANKER'), lees('pp. 114, 154, 159')], label: { at: [189, 91], text: 'Driver or\nspanker' },
  });
  fa({
    id: 'mizen', mast: 'mizen', name: 'Mizen', also: 'mizen course', status: 'routine', points: [[151, 60], [178, 80], [186.5, 34], [151, 33]],
    text: ['The standing sail abaft the mizen mast, and what “the mizen” means as a sail in 1805: loose-footed, with no boom, its clew sheeted to the taffrail and the whole taken in by brails.', 'Replaced by the boomed driver, or spanker, as the permanent sail in 1806–10.'],
    sources: ['S 217', 'S74 36', lees('p. 159')], label: { at: [169, 58] },
  });
  fa({
    id: 'mizen-staysail', mast: 'mizen', name: 'Mizen staysail', status: 'routine', points: [[103, 22], [103, 33], [136, 58.5], [138, 27]],
    text: ['Routine. In large ships it has its own stay beside the mizen stay; in small ones it is bent to the mizen stay itself. Taken in with brails.'],
    sources: ['S 215', 'L 62', 'S74 36'], label: { at: [124, 35] },
  });
  fa({
    id: 'mizen-topmast-staysail', mast: 'mizen', name: 'Mizen topmast staysail', status: 'fair', points: [[103, 62], [103, 77.4], [134, 100.7], [140, 64]],
    text: ['Fair weather. Sets on the mizen topmast stay.'],
    sources: ['S 216'], label: { at: [122, 75] },
  });
  fa({
    id: 'mizen-topgallant-staysail', mast: 'mizen', name: 'Mizen topgallant staysail', status: 'light', points: [[103, 121], [103, 137.7], [138, 136], [142, 112]],
    text: ['Light airs, and only “sometimes” (Steel). Sets on the mizen topgallant stay.'],
    sources: ['S 216', steel(85, 4)], label: { at: [123, 127] },
  });

  const BY_ID = {};
  for (const s of SPARS) BY_ID[s.id] = Object.assign(s, { type: 'spar' });
  for (const s of SAIL_LIST) BY_ID[s.id] = Object.assign(s, { type: 'sail' });
  const statusName = Object.fromEntries(STATUS);

  // --- The drawing -------------------------------------------------------------
  const BOX = [-202, -197, 304, 210];
  // Keeps labels a constant size on screen, as the shared drawings do.
  function fit(el, box) {
    el.setAttribute('viewBox', box.join(' '));
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width) el.style.setProperty('--u', Math.max(box[2] / r.width, box[3] / r.height));
    };
    new ResizeObserver(measure).observe(el);
    measure();
  }
  function text(parent, [x, z], str, anchor, cls) {
    const t = svg('text', { x: -x, y: -z, class: cls || 'lbl', 'text-anchor': anchor || 'middle' }, parent);
    const rows = str.split('\n');
    rows.forEach((row, i) => {
      const span = svg('tspan', { x: -x, dy: i ? '1.15em' : 0 }, t);
      span.textContent = row;
    });
    return t;
  }

  const state = { mode: 'sails', pinned: null, hidden: new Set() };
  const nodes = {};   // id -> elements that light up together

  function describe(item) {
    if (!item) {
      return '<p class="hint">Point at a spar or a sail, or tap it, for its name and what is worth knowing about it. A tap keeps it selected.</p>';
    }
    const size = item.size && item.size[0] ? `<p class="size"><b>Steel, for a 74:</b> ${item.size[0]}${item.size[1] ? ` long, ${item.size[1]} in diameter` : ''}.</p>` : '';
    const status = item.type === 'sail' ? `<p><span class="status s-${item.status}">${statusName[item.status]}</span></p>` : '';
    return `<h2>${item.name}</h2>${item.also ? `<p class="also">Also ${item.also}</p>` : ''}${status}${size}` +
      item.text.filter(Boolean).map((p) => `<p>${p}</p>`).join('') + T.sources(item);
  }
  function show(id) {
    for (const key in nodes) for (const el of nodes[key]) el.classList.toggle('on', key === id);
    $('info').innerHTML = describe(BY_ID[id]);
  }
  function bind(el, id) {
    (nodes[id] = nodes[id] || []).push(el);
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(id); });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') show(state.pinned); });
    el.addEventListener('focus', () => show(id));
    el.addEventListener('blur', () => show(state.pinned));
    el.addEventListener('click', () => { state.pinned = state.pinned === id ? null : id; show(id); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new MouseEvent('click')); } });
  }

  function buildPlan() {
    const el = $('plan');
    fit(el, BOX);
    svg('rect', { x: BOX[0], y: 0, width: BOX[2], height: 13, class: 'sea' }, el);
    draw.side(svg('g', { class: 'context' }, el), { mast: 'main' });

    const sparLayer = svg('g', { class: 'spars-layer' }, el);
    const sailLayer = svg('g', { class: 'sails-layer' }, el);
    const sparLabels = svg('g', { class: 'spar-labels' }, el);
    const sailLabels = svg('g', { class: 'sail-labels' }, el);

    for (const s of SPARS) {
      const g = svg('g', { class: `item spar-item ${s.cls || ''} ${s.dashed ? 'dashed' : ''}`, tabindex: 0, role: 'button', 'aria-label': s.name }, sparLayer);
      for (const [a, b, w] of s.segs) {
        svg('line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'hit' }, g);
        svg('line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'spar-seg', 'stroke-width': w }, g);
      }
      if (s.dot) {
        svg('circle', { cx: -s.dot[0], cy: -s.dot[1], r: 3, class: 'hit-dot' }, g);
        svg('circle', { cx: -s.dot[0], cy: -s.dot[1], r: s.dot[2], class: 'spar' }, g);
      }
      bind(g, s.id);
      if (s.label) {
        const t = text(sparLabels, s.label.at, s.label.text || s.name, s.label.anchor, `lbl pick ${s.cls || ''}`);
        bind(t, s.id);
      }
    }

    // Studding sails first, so that the sails they overlap stay within reach.
    const order = { studding: 0, square: 1, foreaft: 2 };
    for (const s of SAIL_LIST.slice().sort((a, b) => order[a.kind] - order[b.kind])) {
      const g = svg('g', { class: `item sail-item s-${s.status} k-${s.kind}`, tabindex: 0, role: 'button', 'aria-label': s.name }, sailLayer);
      if (s.edge) {
        const [a, b] = s.edge;
        svg('line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'hit' }, g);
        svg('line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'cloth edge-on' }, g);
      } else {
        svg('path', { d: s.d, class: 'cloth' }, g);
      }
      bind(g, s.id);
      const t = text(sailLabels, s.label.at, s.label.text || s.name, s.label.anchor, `lbl pick s-${s.status}`);
      bind(t, s.id);
    }
    return el;
  }

  function buildControls(plan) {
    const modes = $('plan-mode'), filters = $('plan-filter');
    modes.insertAdjacentHTML('beforeend', [['spars', 'Masts and spars'], ['sails', 'Sails']].map(([id, name]) => `<button type="button" data-mode="${id}">${name}</button>`).join(''));
    filters.insertAdjacentHTML('beforeend', STATUS.map(([id, name]) => `<button type="button" data-status="${id}" aria-pressed="true"><i class="swatch s-${id}"></i>${name}</button>`).join(''));

    const apply = () => {
      plan.dataset.mode = state.mode;
      for (const b of modes.querySelectorAll('button')) b.setAttribute('aria-pressed', b.dataset.mode === state.mode);
      filters.toggleAttribute('hidden', state.mode !== 'sails');
      for (const [id] of STATUS) plan.classList.toggle('hide-' + id, state.hidden.has(id));
      for (const b of filters.querySelectorAll('button')) b.setAttribute('aria-pressed', !state.hidden.has(b.dataset.status));
    };
    modes.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      state.mode = b.dataset.mode;
      state.pinned = null;
      show(null);
      apply();
    });
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const id = b.dataset.status;
      if (state.hidden.has(id)) state.hidden.delete(id); else state.hidden.add(id);
      apply();
    });
    apply();
    return apply;
  }

  // --- The tables --------------------------------------------------------------
  function buildTables(apply) {
    const row = (cells, id) => `<tr${id ? ` data-id="${id}" tabindex="0"` : ''}>${cells}</tr>`;
    const groups = ['Masts', 'Yards', 'Bowsprit and mizen', 'Studding sail booms and yards', 'Staffs'];
    let spars = '';
    for (const group of groups) {
      spars += `<tr class="group"><th colspan="3" scope="colgroup">${group}</th></tr>`;
      for (const s of SPARS.filter((x) => x.group === group)) spars += row(`<th scope="row">${s.name}</th><td>${s.size[0]}</td><td>${s.size[1]}</td>`, s.id);
      for (const s of TABLE_ONLY.filter((x) => x.group === group)) spars += row(`<th scope="row">${s.name}<span class="note">${s.note}</span></th><td>${s.size[0]}</td><td>${s.size[1]}</td>`);
    }
    $('spar-table').innerHTML = `<thead><tr><th scope="col">Spar</th><th scope="col">Length</th><th scope="col">Diameter</th></tr></thead><tbody>${spars}</tbody>`;

    const masts = [['bowsprit', 'Bowsprit and jibboom'], ['fore', 'Foremast'], ['main', 'Mainmast'], ['mizen', 'Mizen mast']];
    const dated = {
      'flying-jib': 'from 1794', spritsail: '“in many Ships laid aside” by 1808', 'sprit-topsail': 'not issued after 1815', 'fore-staysail': 'from 1773; men of war only',
      'main-lower-stunsail': 'not issued after 1801', 'main-staysail': 'seldom; for lying to', mizen: 'until 1806–10', driver: 'the permanent sail from 1806–10',
      'fore-topmast-stunsail': 'the most used studding sail', 'mizen-topgallant-staysail': '“sometimes”', 'fore-lower-stunsail': 'wind abaft the beam',
    };
    let sails = '';
    for (const [key, title] of masts) {
      sails += `<tr class="group"><th colspan="2" scope="colgroup">${title}</th></tr>`;
      const rank = (s) => ['square', 'foreaft', 'studding'].indexOf(s.kind) * 10 + STATUS.findIndex(([id]) => id === s.status);
      const list = SAIL_LIST.filter((s) => s.mast === key).sort((a, b) => rank(a) - rank(b));
      for (const s of list) sails += row(`<th scope="row">${s.name}</th><td><span class="status s-${s.status}">${statusName[s.status]}</span>${dated[s.id] ? `<span class="note">${dated[s.id]}</span>` : ''}</td>`, s.id);
      if (key === 'mizen') sails += row('<th scope="row">Crossjack</th><td><span class="status s-none">Not carried</span><span class="note">the yard only spreads the mizen topsail</span></td>', 'mizen-course-yard');
    }
    $('sail-table').innerHTML = `<thead><tr><th scope="col">Sail</th><th scope="col">How often set, 1790–1815</th></tr></thead><tbody>${sails}</tbody>`;

    // A row picks its spar or sail out in the drawing.
    const pick = (e) => {
      const tr = e.target.closest('tr[data-id]');
      if (!tr || (e.type === 'keydown' && e.key !== 'Enter')) return;
      const item = BY_ID[tr.dataset.id];
      state.mode = item.type === 'spar' ? 'spars' : 'sails';
      if (item.type === 'sail') state.hidden.delete(item.status);
      state.pinned = item.id;
      apply();
      show(item.id);
      $('plan').scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    for (const id of ['spar-table', 'sail-table']) {
      $(id).addEventListener('click', pick);
      $(id).addEventListener('keydown', pick);
    }
  }

  // --- Close-up sketches for the chapters ------------------------------------------
  const sketch = (parent, name, attrs) => svg(name, attrs, parent);
  const note = (g, x, y, str, anchor) => {
    const t = svg('text', { x, y, class: 'lbl', 'text-anchor': anchor || 'start' }, g);
    t.textContent = str;
    return t;
  };
  const leader = (g, x1, y1, x2, y2) => svg('line', { x1, y1, x2, y2, class: 'leader' }, g);

  const INSETS = {
    // Three shrouds where they meet the channel, from outboard. Not to scale.
    deadeye(el) {
      fit(el, [0, 0, 430, 236]);
      sketch(el, 'rect', { x: 0, y: 150, width: 300, height: 86, class: 'hull' });
      sketch(el, 'rect', { x: 14, y: 142, width: 216, height: 9, class: 'spar' });
      const xs = [52, 112, 172];
      for (const y of [30, 62]) sketch(el, 'line', { x1: xs[0] + (150 - y) * 0.02 - 2, y1: y, x2: xs[2] + (150 - y) * 0.14 + 2, y2: y, class: 'ink thin' });
      xs.forEach((x, i) => {
        const lean = 0.02 + i * 0.06;
        const topX = x + 100 * lean;
        sketch(el, 'line', { x1: x + 142 * lean, y1: 0, x2: topX - 14 * lean, y2: 100, class: 'ink thick' });
        for (const dx of [-5, 0, 5]) sketch(el, 'line', { x1: topX - 14 * lean + dx, y1: 100, x2: x + dx, y2: 133, class: 'ink thin' });
        sketch(el, 'circle', { cx: topX - 14 * lean, cy: 100, r: 10, class: 'eye' });
        sketch(el, 'circle', { cx: x, cy: 133, r: 10, class: 'eye' });
        for (const [cx, cy] of [[topX - 14 * lean, 100], [x, 133]]) for (const [dx, dy] of [[-4, 2], [0, -4], [4, 2]]) sketch(el, 'circle', { cx: cx + dx, cy: cy + (cy === 100 ? dy : -dy), r: 1.3, class: 'hole' });
        sketch(el, 'line', { x1: x, y1: 143, x2: x - 3, y2: 196, class: 'iron' });
        sketch(el, 'circle', { cx: x - 3, cy: 196, r: 2.4, class: 'hole' });
        sketch(el, 'circle', { cx: x - 2.2, cy: 180, r: 2.4, class: 'hole' });
      });
      const L = [
        ['Shroud', 240, 22, 190, 22],
        ['Ratline', 240, 46, 190, 31],
        ['Upper deadeye, turned into the shroud', 240, 82, 196, 97],
        ['Lanyard', 240, 118, 180, 118],
        ['Lower deadeye', 240, 136, 184, 134],
        ['Channel', 240, 168, 226, 148],
        ['Chain-plate, bolted to the side', 240, 190, 174, 188],
      ];
      for (const [str, x, y, tx, ty] of L) {
        leader(el, x - 3, y - 3, tx, ty);
        note(el, x, y, str);
      }
    },

    // The head in profile, using the coordinates of the standing-rigging lines.
    head(el) {
      const box = [-18, -78, 118, 80];
      fit(el, box);
      const P = ([x, , z]) => [-x, -z];
      sketch(el, 'rect', { x: box[0], y: 0, width: box[2], height: 4, class: 'sea' });
      sketch(el, 'polygon', { points: [[2, 0], [-4, 10], [-9, 17], [-13, 21], [3, 23], [18, 22.8], [18, 0]].map(([x, z]) => `${-x},${-z}`).join(' '), class: 'hull' });
      const sparLine = (a, b, w, cls) => sketch(el, 'line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'sparline ' + (cls || ''), 'stroke-width': w });
      sparLine([4, 21], [-40, 46], 2.6);
      sparLine([-27, 40], [-72, 60], 1.1);
      sparLine([-50, 51.2], [-92, 69.9], 0.7, 'guess');
      sparLine([-40, 46], [-41.5, 35], 0.5);
      sparLine([-39.2, 44.6], [-40.8, 47.6], 1.4);
      sketch(el, 'circle', { cx: 30, cy: -38.6, r: 1, class: 'spar' });
      sketch(el, 'circle', { cx: 51, cy: -49.2, r: 0.7, class: 'spar' });

      const standing = SAILS.find((s) => s.id === 'standing');
      const runs = (id) => {
        const l = standing.lines.find((x) => x.id === id);
        return (l.path ? [l.path.map((n) => n.p)] : []).concat(l.extra || []);
      };
      for (const id of ['fore-stay', 'fore-topmast-stays', 'fore-topgallant-stay', 'gammoning', 'bobstays', 'bowsprit-shrouds', 'jibboom-guys', 'martingale']) {
        for (const run of runs(id)) sketch(el, 'polyline', { points: run.map((p) => P(p).join(',')).join(' '), class: 'ink' });
      }
      // Labels are placed in drawing units: x to the right, y upwards.
      const L = [
        ['Fore stay and preventer stay', [-17, 47], 'start', [0, 59.5]],
        ['Gammoning', [-17, 39.5], 'start', [6.2, 28.2]],
        ['Bowsprit shroud', [-16, 6], 'start', [-2, 16.3]],
        ['Bobstays', [17, 11], 'start', [12, 20]],
        ['Fore topmast stays,', [16.5, 73], 'end', null],
        ['through the bees', [19.5, 68.5], 'end', [24.6, 64.4]],
        ['Cap', [36, 52], 'end', [39.6, 47.2]],
        ['Jibboom', [54, 59], 'end', [56, 53.4]],
        ['Fore topgallant stay', [58, 74], 'end', [63, 68.8]],
        ['Flying jibboom, from 1794', [99, 74], 'end', [84, 66.8]],
        ['Jibboom guy, to the spritsail yardarm', [56, 40], 'start', [52, 50]],
        ['Martingale stay', [56, 34], 'start', [52, 43.8]],
        ['Inner martingale stay', [56, 28], 'start', [46, 42.3]],
        ['Dolphin striker', [56, 22], 'start', [41.8, 35.6]],
        ['Spritsail yard, end-on', [30, 23], 'start', [30.3, 37.4]],
      ];
      for (const [str, at, anchor, to] of L) {
        if (to) leader(el, at[0] + (anchor === 'end' ? 0.6 : -0.6), -at[1] - 1.2, to[0], -to[1]);
        note(el, at[0], -at[1], str, anchor);
      }
    },

    // A slice across the mast at the height of the lower yard. Not to scale.
    brace(el) {
      fit(el, [0, 0, 460, 250]);
      const cx = 215, cy = 125;
      sketch(el, 'line', { x1: 20, y1: cy, x2: 380, y2: cy, class: 'axis' });
      note(el, 22, cy - 6, 'Keel line; the bow is to the right');
      // Shrouds, cut through: a row each side, abaft the mast.
      const shroudX = (i) => cx - 46 - i * 13;
      for (const s of [-1, 1]) for (let i = 0; i < 6; i++) sketch(el, 'circle', { cx: shroudX(i), cy: cy + s * 46, r: 3.2, class: 'cut' });
      sketch(el, 'circle', { cx, cy, r: 13, class: 'spar' });
      sketch(el, 'circle', { cx: cx + 30, cy, r: 3.6, class: 'cut' });
      // The yard, slung before the mast: square, braced to 40 degrees, and to 30.
      const px = cx + 17;
      const yardAt = (deg, cls, len) => {
        const a = (deg * Math.PI) / 180, dx = Math.cos(a) * len, dy = Math.sin(a) * len;
        return sketch(el, 'line', { x1: px - dx, y1: cy + dy, x2: px + dx, y2: cy - dy, class: cls });
      };
      yardAt(90, 'yard ghost', 118);
      yardAt(30, 'yard ghost', 120);
      yardAt(40, 'yard', 120);
      sketch(el, 'path', { d: `M ${px + 52} ${cy} A 52 52 0 0 0 ${px + 52 * Math.cos(0.698)} ${cy - 52 * Math.sin(0.698)}`, class: 'leader' });
      note(el, px + 56, cy - 14, '40°');
      // Wind, from before the larboard beam.
      sketch(el, 'path', { d: 'M 352 12 L 330 65 M 330 65 l -1 -13 M 330 65 l 10 -8', class: 'wind' });
      note(el, 344, 18, 'Wind, six points on the bow', 'end');
      // Each label: text, where it sits, anchor, then the two ends of its leader.
      const L = [
        ['Mast', cx - 4, cy - 24, 'end', cx - 8, cy - 21, cx - 6, cy - 12],
        ['Stay', cx + 38, cy + 20, 'start', cx + 37, cy + 15, cx + 31, cy + 5],
        ['Weather shrouds', shroudX(5), 58, 'start', shroudX(4), 61, shroudX(3), cy - 51],
        ['Lee shrouds: the foremost stops the yard', 14, 238, 'start', shroudX(1) + 2, 229, shroudX(1), cy + 51],
        ['30°, as Bourdé wanted', px - 112, cy + 74, 'end', px - 112, cy + 68, px - 100, cy + 59],
        ['Yard, braced sharp up', 300, 44, 'start', 298, 41, px + 80, cy - 62],
        ['Yard square', px + 6, 240, 'start', px + 5, 237, px + 1, 232],
      ];
      for (const [str, x, y, anchor, lx, ly, tx, ty] of L) {
        leader(el, lx, ly, tx, ty);
        note(el, x, y, str, anchor);
      }
    },
  };

  // --- Run -------------------------------------------------------------------------
  const plan = buildPlan();
  const apply = buildControls(plan);
  buildTables(apply);
  show(null);

  for (const el of document.querySelectorAll('svg[data-inset]')) INSETS[el.dataset.inset](el);
})();
