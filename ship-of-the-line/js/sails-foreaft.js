// The fore-and-aft sails: headsails, the staysails between the masts, the
// mizen and driver, and the two square sails under the bowsprit. Each is a
// record on RIGDATA.SAILS with its own outline (`cloth`) and spars.
//
// These sails lie along the centreline, so every lead is drawn in the profile
// and the deck plan. Leads are entered a foot or so off the centreline so that
// the two sides, and neighbouring ropes, separate in the plan. A single rope
// that Steel puts on the larboard side has negative y and `mirror: false`.

(function () {
  const { SAILS } = window.RIGDATA;
  const VIEWS = ['side', 'plan'];

  // Nodes of a lead. `guess` marks a position the sources do not give.
  const fast = (p, step) => ({ p, mark: 'fast', step });
  const block = (p, step) => ({ p, mark: 'block', step });
  const lead = (p, step) => ({ p, mark: 'lead', step });
  const belay = (p, step) => ({ p, mark: 'belay', step });
  const bend = (p, step) => (step ? { p, step } : { p });
  const guess = (node) => Object.assign(node, { inferred: true });

  const period = (short, text, level) => ({ short, level: level || 'weather', status: 'period', text });
  const inferred = (short, text, level) => ({ short, level: level || 'weather', status: 'inferred', text });

  // Half-breadth of the ship at rail level (as drawn in the deck plan), less a
  // little, for fittings at the ship's side.
  const side = (x) => Math.round((window.RIGDATA.halfBreadth(x) - 0.6) * 10) / 10;

  // A point a fraction t of the way from a to b.
  const along = (a, b, t) => a.map((v, i) => Math.round((v + (b[i] - v) * t) * 10) / 10);
  // The same point moved off the centreline.
  const off = (p, y) => [p[0], y, p[2]];

  function add(sail) {
    for (const l of sail.lines) if (!l.views) l.views = VIEWS;
    SAILS.push(Object.assign({ views: VIEWS }, sail));
  }

  const LEES = 'X James Lees, The Masting and Rigging of English Ships of War (1979), seen only as search snippets';
  const MOORE = 'X J. J. Moore, The Midshipman’s or British Mariner’s Vocabulary (1801)|https://archive.org/details/midshipmansorbr00moorgoog';
  // Steel pages outside the two rigging parts that an 'S n' reference links to.
  const steel = (page, part, what) => `X Steel 1794, p. ${page} (${what})|https://maritime.org/doc/steel/part${part}.htm#pg${page}`;
  const BITTS = 'The “main-top-bowline-bitts”. The draughts show one pair of bitts before the foremast and one abaft it; taking the after pair for these is an inference.';

  // ===== Headsails ==========================================================

  // --- Fore staysail ----------------------------------------------------------
  {
    const foot = [-27.5, 0, 39], masthead = [19.6, 0, 70.5];
    const head = along(foot, masthead, 0.78), tack = along(foot, masthead, 0.02), clew = [12, 0, 27];
    add({
      id: 'fore-staysail', mast: 'fore', title: 'The fore staysail', start: 'halliard',
      cloth: [[tack, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'The stay it sets on', also: 'fore preventer stay (Steel); fore spring stay (Lever)',
          does: 'A staysail has no yard. Its leading edge, the luff, is held by rings called hanks that slide on a stay, so the stay does for it what a yard does for a square sail. The fore staysail uses a stay that is there anyway: the fore preventer stay, the second and lighter of the two stays that hold the foremast forward. Lever says it “lies under” the fore stay “for the convenience of bending a Fore-stay Sail to it”.',
          lead: 'From the foremast head to its own collar on the bowsprit, lashed next to the fore stay’s collar, and set up there with a heart and lanyard. It is standing rigging and nothing about it is worked.',
          extra: [[masthead, foot]], cls: 'standing-rig', mirror: false,
          rope: 'Fore preventer stay 11½ in.',
          notes: ['Steel’s running text does not rig a fore staysail; he lists its halliards, downhauler and sheets in the key to his plate, and the table for a 74 has a row for it. The leads here are Lever’s. The sail came in in 1773 according to Lees, and Lever says “This Sail is seldom used in any Ships but Men of War”.'],
          sources: ['L 23', 'L 59', 'S 200', 'S74 32', LEES + ' (pp. 148, 159)'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard', also: 'haliard (Steel), halliards (Lever), halyard (modern)',
          does: 'Hoists the head of the sail up the stay. That is all there is to setting a staysail: the hanks run up the stay as the head goes up.',
          mirror: false,
          path: [
            fast([19.6, 0.7, 72.5], 'The end is clinched round the foremast head.'),
            block(off(head, 0.5), 'Down through a block at the peak of the sail.'),
            block([19.2, 0.9, 71.3], 'Back up through a block lashed round the foremast head above the rigging or under the fore stay collar.'),
            guess(block([22.5, 8, 42], 'A single block is turned into the hauling end, with a whip rove through it. Where the block hangs is not stated.')),
            guess(belay([27, side(27), 22], 'The whip’s fall goes “to the side”. Lever names neither the side of the ship nor the fitting. Drawn to starboard.')),
          ],
          extra: [[[22.5, 8, 42], [24, side(24) + 0.3, 21.5]]],
          purchase: 'About 4 to 1: the halliard is doubled at the peak, and the whip on its end doubles it again. My arithmetic from Lever’s description.',
          belay: inferred('Forecastle, at the side', 'At the ship’s side on the forecastle, abreast the foremast. Lever says only that the whip’s fall goes to the side.'),
          worked: 'Hauled to set the sail, let go to take it in. The downhauler is its opposite.',
          rope: '4 in., 30 fathoms.',
          sources: ['L 59', 'S74 32'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler', also: 'downhaul; down-hauler; “downhaller” in Steel’s table',
          does: 'Pulls the head of the sail down the stay when the halliard is let go. A staysail will not come down by its own weight with wind in it: the hanks bind on the stay. The downhauler runs from the head down through the hanks to the tack, so hauling it gathers the luff down the stay.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'Made fast to the peak.'),
            block(off(tack, 0.5), 'Down through a few hanks to a block at the tack.'),
            guess(belay([12, 2, 19.2], 'In to the forecastle. Lever does not say where it belays.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle. The place and fitting are not given; drawn at the fore end, where the men hauling it would stand.'),
          worked: 'Manned before the halliard is let go, and hauled as the sheet is eased.',
          rope: '2½ in.',
          sources: ['L 59', 'S74 32'],
        },
        {
          id: 'tack', group: 'sail', name: 'Tack',
          does: 'Holds the lower forward corner of the sail down at the foot of the stay. On a staysail the tack is a fixed point, not a working rope: the name is the same as the tack of a course, but nobody hauls on it.',
          lead: 'A lanyard passed through the tack of the sail and through the heart of the stay’s collar on the bowsprit.',
          sources: ['L 59'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Hold the after corner, the clew, down and aft, and set the angle of the sail to the wind. There is one each side. Only the lee sheet is working; the weather one lies slack across the stay until the ship goes about.',
          path: [
            guess(fast([20, side(20), 21], 'The standing part of the sheet is made fast to an eyebolt in the side. Where along the side is not stated.')),
            block([14, 3, 27.5], 'Through a single block in the end of a pendent. The pendent is a short rope middled and bent to the clew, with a block in each end, one for each side.'),
            guess(lead([24, side(24), 21], 'Back to a leading block at the side.')),
            guess(belay([27.5, side(27.5), 21.5], 'And to a cleat.')),
          ],
          extra: [[clew, [14, 3, 27.5]]],
          purchase: '2 to 1: a whip, with the moving block on the pendent.',
          belay: inferred('Cleat, forecastle side', 'A cleat at the side of the forecastle. Lever gives the eyebolt, the leading block and the cleat but not their positions; drawn abreast the foremast.'),
          worked: 'The lee sheet is hauled aft once the sail is hoisted and eased when it is hauled down. In tacking the old lee sheet is let go and the new one hauled as the ship comes round.',
          rope: '4 in.',
          sources: ['L 59', 'S74 32'],
        },
      ],
    });
  }

  // --- Fore topmast staysail --------------------------------------------------
  {
    const foot = [-34, 0, 42.8], masthead = [19.6, 0, 123];
    const head = along(foot, masthead, 0.72), tack = [-34.4, 0, 43.5], clew = [0, 0, 40];
    add({
      id: 'fore-topmast-staysail', mast: 'fore', title: 'The fore topmast staysail', start: 'halliard',
      cloth: [[tack, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'Staysail stay', also: 'fore topmast staysail stay',
          does: 'Steel gives this sail a stay of its own, a 4-inch rope beside the fore topmast stay, with a tackle on its upper end so that it can be set up taut from the deck. It is the first sign of something that matters for all the headsails: the stay a sail sets on may itself be a working rope.',
          cls: 'standing-rig', mirror: false,
          path: [
            fast(off(foot, -0.4), 'It “reeves through the hanks, then makes fast with a running eye round the bowsprit, between the collars and spritsail-yard”.'),
            lead([19.6, -1, 123.8], 'Up through “the upper sheave of the cheek-block, at the fore-topmast-head, on the larboard side”.'),
            block([20.4, -1, 93], 'It “has a double-block turned into the lower end”. How far down the mast that block hangs is not stated.'),
            block([21.2, -1, 71], 'The fall connects it to “a single block lashed to the after-part of the foremast trestle-trees”.'),
            belay([24.5, -1.4, 19.5], 'It “leads upon deck, and belays to the main-top-bowline-bitts”.'),
          ],
          purchase: 'A double and a single block: 3 to 1 as Steel describes it.',
          belay: period('Main-top-bowline bitts', BITTS),
          worked: 'Set up once and left. It is eased to send the sail down for repair and when the topmast is struck.',
          rope: '4 in., 25 fathoms, with its tackle.',
          notes: ['Lever does without it. He bends the sail to hanks on the fore topmast spring stay (Steel’s preventer stay), which is rove through the hanks before it goes through the bee on the bowsprit.'],
          sources: ['S 209', 'L 59', 'L 28', 'S74 32'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard', also: 'haliards (Steel)',
          does: 'Hoists the head of the sail up its stay. It is rove on the larboard side of the topmast head, and the jib’s on the starboard, so the two never share a sheave or a side of the deck.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'Bent to the head of the sail.'),
            lead([19.8, -1.3, 122.4], 'Through the lower sheave of the cheek-block at the fore-topmast-head, on the larboard side.'),
            bend([28.5, -6, 69.5], 'The leading part “reeves abaft the top”, clear of everything at the foot of the mast.'),
            belay([50, -side(50), 21.5], 'It goes “to the after-part of the forecastle, and belays to a cleat in the side”.'),
          ],
          purchase: 'None: a single rope.',
          belay: period('Cleat in the side, larboard', 'A cleat in the larboard side at the after part of the forecastle (Steel).'),
          worked: 'This is the headsail that stays set longest as the wind rises, so its halliard is let go less often than the jib’s.',
          rope: '3½ in.',
          sources: ['S 209', 'S74 32'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay when the halliard is let go.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'Bent to the head of the sail.'),
            block(off(tack, -0.6), 'Down through the hanks to a small block at the tack.'),
            bend([-10, -1.2, 30.5]),
            guess(belay([12, -1.5, 19.2], 'In on the forecastle. The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). He does not name the fitting; drawn at the fore end.'),
          worked: 'Manned before the halliard is let go.',
          rope: '2½ in.',
          sources: ['S 209', 'S74 32'],
        },
        {
          id: 'outhauler', group: 'sail', name: 'Outhauler: a tack that is hauled out', also: 'out-hauler',
          does: 'The fore staysail’s tack is lashed in place. This sail’s tack is hauled out along the bowsprit by a rope, so that the foot is stretched along the spar: “the foot is spread on the bowsprit” (Steel). The outhauler is the tack.',
          mirror: false,
          path: [
            fast(off(tack, -0.5), '“The standing part makes fast to the tack of the sail.”'),
            block([-39, -0.7, 46.4], 'Out through “a block lashed at the outer end of the bowsprit”.'),
            bend([-10, -3, 30.5]),
            guess(belay([12, -4.5, 19.2], '“And the leading-part comes in upon the forecastle.” The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). He does not name the fitting.'),
          worked: 'Hauled out before the sail is hoisted. Steel does not say how far the tack travels; the stay’s eye is round the bowsprit only a few feet inside the block.',
          rope: '2½ in.',
          sources: ['S 210', steel(109, 4, 'sailmaking'), 'S74 32'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Hold the clew aft and trim the sail, one each side. The clew lies under the fore stay, so the sheet not in use has to lie over that stay, ready for the other tack: Lever leads them “clear over the Fore Stay”.',
          path: [
            fast(off(clew, 0.5), 'The bight of the sheet is bent to the clew, giving a leg for each side.'),
            guess(block([19, side(19), 20], 'Each leads “through a single-block on each side upon the forecastle”. Where on the forecastle is not stated.')),
            guess(belay([23, side(23), 21.5], 'Belayed near the block. The fitting is not named.')),
          ],
          purchase: 'None as Steel rigs them. Lever gives large ships pendents with a whip, as on the jib.',
          belay: inferred('Forecastle side', 'At the side of the forecastle near the leading block. Steel gives the block and no belaying point.'),
          worked: 'The lee sheet is hauled aft when the sail is hoisted. In tacking, this sail and the jib are let fly as the ship comes head to wind and sheeted on the new side as she pays off.',
          rope: '4 in.',
          sources: ['S 210', 'L 59', 'S74 32'],
        },
      ],
    });
  }

  // --- Jib --------------------------------------------------------------------
  {
    const traveller = [-70, 0, 59.6], boomEnd = [-72, 0, 60], masthead = [19.6, 0, 123.5], cap = [-39.6, 0, 47.3];
    const head = along(traveller, masthead, 0.78), clew = [-16, 0, 50];
    const pendentBlock = [-9, 3, 44];
    add({
      id: 'jib', mast: 'fore', title: 'The jib', start: 'outhauler',
      cloth: [[traveller, head, clew]],
      lines: [
        {
          id: 'tack', group: 'sail', name: 'Tack and traveller',
          does: 'The jib’s tack is not fixed to the ship at all. It hooks to the traveller, “a circular iron hoop, with a hook and shackle, used to haul out the tack of the jib” (Steel), which slides along the jibboom. The whole sail can be set right out at the boom end in light winds, or part of the way in as it blows harder: “The Jib is hauled one-third in” is Lever’s first step in shortening sail on a wind.',
          lead: 'The traveller is put over the jibboom end before anything else is rigged on it, with “the hook is kept inwards to hook the tack of the jib to”. The hook goes through a thimble in the tack of the sail.',
          sources: ['S 195', 'L 60', 'L 83'],
        },
        {
          id: 'stay', group: 'sail', name: 'Jib stay',
          does: 'The stay the jib’s hanks run on. Its lower end is clinched to the traveller, so the stay moves in and out along the boom with the sail’s tack, and its other end comes down to the deck through a tackle so that it can be slacked as the traveller comes in and set up again when it is in place.',
          cls: 'standing-rig', mirror: false,
          path: [
            fast(off(traveller, 0.4), 'It “clinches to the traveller upon the boom”, after reeving through the hanks.'),
            lead([19.6, 1, 123.8], 'Up through “the sheeve in the cheek-block at the fore-topmast-head from aft on the starboard-side”.'),
            block([20.4, 1, 93], 'A double block is turned into its other end. How far down that block hangs is not stated.'),
            block([21.2, 1, 71], 'Its fall goes to a single block at the after part of the foremast trestle-trees.'),
            belay([24.5, 1.4, 19.5], 'It “leads upon deck, and belays to the main-top-bowline bitts”.'),
          ],
          purchase: 'A double and a single block: 3 to 1 as Steel describes it.',
          belay: period('Main-top-bowline bitts', BITTS),
          worked: 'Eased as the traveller is hauled out or in, then set taut before the sail is hoisted. A slack stay lets the luff sag to leeward and the sail will not stand close to the wind.',
          rope: '4½ in., 33 fathoms.',
          notes: ['Lever gives another way. With a roller shackle on the traveller, the stay is made fast at the masthead, rove through the shackle and through the sheave-hole in the boom end, and set up by a tackle to the bowsprit cap or the bows. “In this Case, there is no occasion for an Out-Hauler, this answering the Purpose of both Stay and Out-hauler.”'],
          sources: ['S 209', 'L 60', 'S74 31'],
        },
        {
          id: 'outhauler', group: 'sail', name: 'Outhauler', also: 'out-hauler',
          does: 'Hauls the traveller, and with it the tack of the jib and the foot of the jib stay, out along the jibboom.',
          mirror: false,
          path: [
            fast(off(traveller, 1), 'It “clinches to the span-tackle of the traveller”.'),
            lead(off(boomEnd, 1), 'Out through “a sheave-hole at the outer end of the jib-boom”.'),
            block([-50, 1.6, 49.2], 'Back in along the boom. “The other end has a double-block turned in.” Where the block lies depends on how far out the traveller is.'),
            block([-40.6, 1.6, 46.6], 'Its fall goes to “a single-block hooked to an eye-bolt in the fore part of the bowsprit-cap”.'),
            bend([-10, 3.2, 30.5]),
            guess(belay([10, 3.5, 19.2], '“And the fall leads in on the forecastle.” The fitting is not named.')),
          ],
          purchase: 'A double and a single block on the end of the rope: 3 to 1 as described.',
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). The fitting is not named; drawn at the fore end beside the bowsprit.'),
          worked: 'Hauled to run the jib out, with the inhauler and the stay’s fall eased. Eased to bring it in.',
          rope: '4 in.; tackle fall 3½ in.',
          sources: ['S 209', 'S74 31'],
        },
        {
          id: 'inhauler', group: 'sail', name: 'Inhauler', also: 'in-hauler',
          does: 'Pulls the traveller back in along the boom, against the outhauler.',
          mirror: false,
          path: [
            fast([-40, -1.2, 46.6], '“The standing-part makes fast to an eye-bolt in the side of the bowsprit-cap.” Which side is not stated; drawn to larboard.'),
            block(off(traveller, -0.8), 'Out to “a small block lashed on the traveller”.'),
            bend(off(cap, -1.6)),
            bend([-10, -3.2, 30.5]),
            guess(belay([10, -3.5, 19.2], '“And the leading-part comes in upon the forecastle.” The fitting is not named.')),
          ],
          purchase: '2 to 1: a whip with its block on the traveller.',
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). Neither the side nor the fitting is given.'),
          worked: 'Hauled as the outhauler is eased.',
          notes: ['“Small Ships have no In-hauler, the Down-hauler answering both purposes” (Lever).'],
          sources: ['S 209', 'L 60'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard', also: 'haliards (Steel)',
          does: 'Hoists the head of the jib up its stay. It is rove on the starboard side of the topmast head, opposite the fore topmast staysail’s.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'Bent to the head of the sail.'),
            lead([19.8, 1.3, 122.4], 'Through “the lower sheave of the cheek-block at the fore-topmast-head, from aft on the starboard-side”.'),
            bend([28.5, 6, 69.5], '“The leading-part leads abaft the top.”'),
            block([43, 13, 42], '“Large ships have a single-block turned into the haliards, and a whip-fall.” The block rises and falls with the sail; it is drawn part-way.'),
            guess(belay([50, side(50), 21.5], 'The whip’s hauling part comes “to the after-part of the forecastle”, its standing part “making fast into the side”. The fitting is not named.')),
          ],
          extra: [[[43, 13, 42], [46, side(46) + 0.3, 21.5]]],
          purchase: '2 to 1 from the whip.',
          belay: inferred('After part of forecastle, starboard', 'At the starboard side of the after part of the forecastle. Steel gives the place and not the fitting.'),
          worked: 'Hoisted when the traveller is out and the stay taut. To take the jib in, the halliard is let go and the downhauler hauled.',
          rope: '4 in., 46 fathoms.',
          notes: ['Lever doubles it another way in large ships: the halliard reeves through a block at the peak of the sail and is clinched round the masthead.'],
          sources: ['S 209', 'L 60', 'S74 31'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head of the jib down its stay to the traveller.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'It “bends to the head of the jib”.'),
            block(off(traveller, 0.3), 'Down through the hanks to “a small block that lashes to the traveller on the jib-boom”.'),
            bend(off(cap, 0.5)),
            bend([-10, 1, 30.5]),
            guess(belay([10, 1, 19.2], '“The leading-part leads in upon the forecastle.” The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). The fitting is not named.'),
          worked: '“Man well the down-haul, let go the haliards, ease off the sheet, and haul down briskly” (Steel).',
          rope: '2½ in., 40 fathoms.',
          sources: ['S 209', steel(335, 10, 'working ships'), 'S74 31'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Hold the clew aft and trim the sail. The jib is a big sail a long way forward, with great leverage on the ship’s head, so its sheets have a purchase where a smaller staysail’s have none.',
          path: [
            fast([9.5, side(9.5), 22.3], '“The standing-part makes fast to a timber-head.”'),
            block(pendentBlock, 'Through the single block in the end of the pendent. The bight of the pendent is bent to the clew, with a block in each end, one for each side.'),
            belay([17, side(17), 22.3], 'The leading part “leads in upon the forecastle, and belays to a timber-head before the shrouds on each side”.'),
          ],
          extra: [[clew, pendentBlock]],
          purchase: '2 to 1: a whip, with the moving block on the pendent.',
          belay: period('Timber-head before the fore shrouds', 'A timber-head at the side of the forecastle, before the fore shrouds, on each side (Steel).'),
          worked: 'The lee sheet is trimmed when the sail is hoisted. In tacking the jib sheet is let fly as the ship comes to the wind, and the other hauled aft once she is round.',
          rope: 'Pendents 4½ in.; sheets 3½ in.',
          notes: ['“These Sheets are passed clear over the Fore-Topmast Stay” (Lever): the jib sets outside the fore topmast stay, so the sheet not in use lies over it.'],
          sources: ['S 209', 'L 60', 'S74 31'],
        },
      ],
    });
  }

  // --- Flying jib -------------------------------------------------------------
  {
    const boomHeel = [-40, 0.8, 47], boomEnd = [-77, 0.8, 63.4], masthead = [18.6, 0, 152];
    const tack = [-76.5, 0, 63.6], head = along(tack, masthead, 0.6), clew = [-40, 0, 62];
    const thin = 'Nothing read for this page describes it. Drawn like the jib’s, lighter.';
    add({
      id: 'flying-jib', mast: 'fore', title: 'The flying jib', start: 'stay',
      cloth: [[tack, head, clew]],
      spars: [{ a: boomHeel, b: boomEnd, w: 0.7 }],
      lines: [
        {
          id: 'boom', group: 'sail', name: 'Flying jibboom',
          does: 'A second, lighter boom run out beyond the jibboom, to carry one more headsail in light weather. Lees dates it, and the sail, to 1794. Steel’s table for a 74 of that year has no gear for either. Moore’s dictionary of 1801 calls the flying jib “a sail sometimes set upon a boom, rigged out beyond the Jib-Boom”. Lever’s text of 1808 rigs the jib only, and the flying jibboom appears in his 1819 appendix.',
          lead: 'It lies on the starboard upper side of the jibboom with its heel in a socket in the bowsprit cap (Lees, seen as a snippet). The drawing shows it only as far as the edge of the sheet: its real length for a 74 is not in anything read here.',
          mirror: false,
          notes: ['A trap in Steel: his list of proportions has a “Flying jib boom, 5/7 of the bowsprit”. That is his name for the ordinary jibboom, which comes out to about the 50 feet of his table. It is not evidence of a flying jibboom in 1794.'],
          sources: [LEES + ' (pp. 11, 32, 126, 159)', MOORE, steel(40, 1, 'mastmaking'), 'S74 31'],
        },
        {
          id: 'stay', group: 'sail', name: 'Flying jib stay',
          does: 'The stay the sail’s hanks run on.',
          lead: 'From the fore topgallant masthead to the flying jibboom end (Lees, seen as a snippet). How it is set up is not in the snippets.',
          extra: [[masthead, boomEnd]], cls: 'standing-rig', mirror: false,
          sources: [LEES + ' (p. 125)'],
        },
        {
          id: 'tack', group: 'sail', name: 'Tack and traveller',
          does: 'As on the jib, the tack is hauled out to the boom end on a traveller.',
          lead: 'A small split-ring traveller, “only used on the flying jibboom” (Lees, a snippet). Its outhauler is not described in anything read here.',
          sources: [LEES + ' (p. 37)'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'Bent to the head of the sail.'),
            lead([18.6, 0.6, 169.5], 'Lees: at first rove “through a hole above the royal rigging” in the pole head of the fore topgallant mast; a sheave there “was only fitted after 1800”.'),
            guess(belay([26, 3, 19.2], 'Down to the deck. Where it belays is not in anything read here.')),
          ],
          belay: inferred('Forecastle, abaft the foremast', 'Unknown. Drawn on the forecastle abaft the foremast, where the other light halliards of this mast come down.'),
          sources: [LEES + ' (pp. 8, 125)'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay. ' + thin,
          mirror: false,
          path: [
            guess(fast(off(head, 0.5), 'To the head of the sail.')),
            guess(block(off(tack, 0.4), 'Through a block at the tack.')),
            bend([-39.6, 0.6, 47.6]),
            guess(belay([10, 2, 19.2], 'In to the forecastle.')),
          ],
          belay: inferred('Forecastle, fore end', 'Unknown. Drawn by analogy with the jib’s downhauler.'),
          sources: [LEES + ' (p. 125, not read)'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Trim the sail, one each side. ' + thin,
          path: [
            guess(fast(off(clew, 0.5), 'Bent to the clew.')),
            guess(belay([13, side(13), 22.3], 'To the side of the forecastle.')),
          ],
          belay: inferred('Forecastle side', 'Unknown. Drawn by analogy with the jib’s sheets.'),
          sources: [LEES + ' (p. 125, not read)'],
        },
      ],
    });
  }

  // ===== Staysails between the masts =========================================

  // --- Main topmast staysail --------------------------------------------------
  {
    const foot = [20.8, 0, 66], masthead = [97.8, 0, 136];
    const nock = along(foot, masthead, 0.042), head = along(foot, masthead, 0.7), tack = [24, 0, 50], clew = [80, 0, 48];
    const cringle = along(head, clew, 0.5);
    const stayBlock = [23.5, 0.5, 68.2], bowlineBlock = [20.9, 0.5, 23.2], sheetBlock = [84.5, 5, 41];
    add({
      id: 'main-topmast-staysail', mast: 'main', title: 'The main topmast staysail', start: 'halliard',
      cloth: [[tack, nock, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'The stay it sets on', also: 'main topmast preventer stay; spring stay (Lever)',
          does: 'The sail bends to the main topmast preventer stay, which runs from the main topmast head down to the foremast just under the fore top. The sail is four-sided: its fore edge is a short upright side, the nock or bunt, so that it fills the space abaft the foremast instead of tapering to a point there.',
          lead: 'From the main topmast head, through a thimble in a collar lashed to the fore part of the foremast close up to the bibs, and set up to an eyebolt in the deck abaft the foremast.',
          extra: [[masthead, foot]], cls: 'standing-rig', mirror: false,
          notes: ['The height of the nock is not given for a 74 in anything read here; the outline is drawn to look right, and Lever complains these sails had been made very deep.'],
          sources: ['S 214', 'S 201', 'L 61'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head, or peak, of the sail up the preventer stay towards the main topmast head.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'Bent to the head of the sail.'),
            lead([98, -1.2, 136.6], 'From aft through the cheek block at the main topmast head, on the larboard side. Lever says the starboard side.'),
            bend([105.5, -8, 77]),
            block([108, -side(108), 20], 'Down to “a block in the side”.'),
            belay([110.5, -20.8, 22.6], '“And belays to a pin in the fife-rail.”'),
          ],
          purchase: 'None: a single rope.',
          belay: period('Pin in the fife-rail, larboard', 'A belaying pin in the quarterdeck fife-rail, the open rail along the ship’s side, abreast the mainmast (Steel). Larboard in Steel; Lever reeves it to starboard.'),
          worked: 'Hauled to set the sail, with the downhauler and brails let go.',
          sources: ['S 214', 'L 61'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head of the sail down the stay to the foremast.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'To the head of the sail, up through the hanks.'),
            block(stayBlock, 'Through a block on the preventer stay at the catharpins, that is, where the stay meets the foremast under the top.'),
            block(bowlineBlock, 'Down the foremast to a block seized to the strap of the main bowline block, which Steel puts “five feet above the forecastle”.'),
            guess(belay([24.5, 0.8, 19.5], 'Belayed at the foot of the foremast. The fitting is not named.')),
          ],
          belay: inferred('Abaft the foremast', 'On the forecastle at the foot of the foremast. Steel gives the lead to the main bowline block and stops there; drawn at the bitts abaft the mast.'),
          worked: '“Man well the lee brail and downhaul … then let go the haliards, ease off the sheet, and haul down and brail up as briskly as possible” (Steel).',
          sources: ['S 214', steel(335, 10, 'working ships'), 'L 61'],
        },
        {
          id: 'brails', group: 'sail', name: 'Brails',
          does: 'Gather the after edge of the sail forward to the stay, one each side of it. A staysail this size cannot be smothered by the downhauler alone, so it is brailed up as it comes down.',
          path: [
            fast(off(cringle, 0.6), 'From a cringle on the after leech. How far down the leech is not stated.'),
            block(off(stayBlock, 0.9), 'Forward to a block on the preventer stay at the catharpins.'),
            block(off(bowlineBlock, 1.1), 'Down to a block at the main bowline block strap.'),
            guess(belay([24.5, 2.6, 19.5], 'Belayed at the foot of the foremast. The fitting is not named.')),
          ],
          belay: inferred('Abaft the foremast', 'On the forecastle at the foot of the foremast, as the downhauler. The fitting is not named.'),
          worked: 'The lee brail is the one that is manned, with “a few hands to gather in the slack of the weather brail”. Lever gives the reason: “if the weather one were hauled up first, the sail catching a-back would hold so much wind as, in a heavy squall, to prevent its being taken in”.',
          sources: ['S 214', steel(335, 10, 'working ships'), 'L 85'],
        },
        {
          id: 'tacks', group: 'sail', name: 'Tacks',
          does: 'Hold down the lower fore corner of the sail. A four-sided staysail has two fore corners. The upper one, at the top of the nock, is made fast to the stay’s collar on the foremast. The lower one has a tack led to each side, so that it can be hauled to windward.',
          path: [
            fast(off(tack, 0.5), 'Doubled: a leg from the tack of the sail to each side.'),
            lead([22.8, 10.5, 46.5], 'Through a thimble on the lower shrouds, the fore shrouds.'),
            belay([24, 18.6, 24], 'Down the shroud to “a cleat lashed to the shrouds near the deck”.'),
          ],
          belay: period('Cleat on the fore shrouds', 'A cleat lashed to the fore shrouds near the deck, each side (Steel).'),
          worked: 'The weather tack is hauled down when the sail is set. When it is taken in, “let go the tack, and stop the sail over to the lee fore rigging” (Steel); it is stowed on the fore catharpins.',
          sources: ['S 215', steel(335, 10, 'working ships'), 'L 61'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Hold the clew aft and trim the sail, one each side. The clew hangs below the main stay, so to change tacks the sheet has to be got over that stay.',
          path: [
            fast([86, 9.5, 20.6], 'The standing part is made fast to “a boatskid next the quarter-deck”, the aftermost of the beams across the waist.'),
            block(sheetBlock, 'Through a block on the end of the sheet. The sheet is doubled, a leg to each side, with a block and fall on each.'),
            block([96.5, side(96.5), 22.3], 'The hauling part goes through “a block on the gunwale … abaft the gangway”.'),
            belay([86, 12, 20.6], '“And belay to a pin in the boatskid.”'),
          ],
          extra: [[clew, sheetBlock]],
          purchase: '2 to 1 from the fall.',
          belay: period('Pin in the after boat skid', 'A belaying pin in the boat skid next the quarterdeck, each side (Steel).'),
          worked: 'In tacking the sheet is let go, the clew is got over the main stay, and the other sheet is hauled aft. Lever says the sails had been made so deep “that it is sometimes difficult in working, to get the sheets over the Main Stay”, and gives a downhauler led to the clew that trices it up for shifting over.',
          sources: ['S 215', 'L 61'],
        },
      ],
    });
  }

  // --- Main staysail ----------------------------------------------------------
  {
    const foot = [21, 0, 27], masthead = [97.8, 0, 83];
    const head = along(foot, masthead, 0.72), tack = along(foot, masthead, 0.042), clew = [82, 0, 30];
    const sheetBlock = [88, 6, 28];
    add({
      id: 'main-staysail', mast: 'main', title: 'The main staysail', start: 'halliard',
      cloth: [[tack, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'Main staysail stay',
          does: 'The main staysail is three-sided in the navy and sets on a stay of its own, rigged close above the main stay. It is a heavy-weather sail and not an everyday one: Steel says it is “seldom bent in ships but at sea”.',
          lead: '“The upper end clinches round the main-mast-head above the rigging, and the lower end sets up with a luff-tackle round the foremast.” How high on the foremast is not stated; drawn just above the forecastle.',
          extra: [[masthead, foot]], cls: 'standing-rig', mirror: false,
          notes: ['Lees: after 1810 the separate stay was given up and the sail hoisted on the main stay, and in 1815 the sail itself was replaced by a trysail. Both from snippets.'],
          sources: ['S 214', steel(106, 4, 'sailmaking'), 'L 61', LEES + ' (pp. 119, 148)'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail up its stay. This is a heavy sail, so the halliard is doubled at the head and has a tackle on its end.',
          mirror: false,
          path: [
            fast([97.8, 0.7, 82], 'The standing part goes round the main masthead.'),
            block(off(head, 0.5), 'Through a single block bent to the head of the sail.'),
            block([99, 3, 75.5], 'Back to a block on the rigging under the top.'),
            block([102.5, 10, 48], 'Down abaft the mast to the upper block of a double-and-single purchase. Its height is not stated.'),
            block([106, side(106), 19.8], 'The purchase is hooked to “an eye-bolt in the sides abaft the main-mast”.'),
            guess(belay([108.5, side(108.5), 20.5], 'Belayed at the side. The fitting is not named, nor the side of the ship; drawn to starboard.')),
          ],
          purchase: 'About 6 to 1: doubled at the head (2), and a double-and-single purchase on the end (3). My arithmetic.',
          belay: inferred('Quarterdeck side, abaft the mainmast', 'At the ship’s side on the quarterdeck abaft the mainmast, where the purchase hooks (Steel). The fitting and the side are not given.'),
          sources: ['S 214', 'L 61'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay to the foremast.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'To the head of the sail, up through the hanks.'),
            guess(lead(off(tack, -0.6), 'Down the stay to its foot. Steel does not mention a block there.')),
            belay([24.5, -2, 19.5], 'It “belays to the main-top-bowline-bitts”.'),
          ],
          belay: period('Main-top-bowline bitts', BITTS),
          sources: ['S 214'],
        },
        {
          id: 'tack', group: 'sail', name: 'Tack',
          does: 'Holds the fore corner down at the foot of the stay.',
          lead: 'Lashed to the foremast or to the bitts.',
          sources: ['S 214', 'L 61'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Hold the clew aft, one each side. They come to the fore part of the quarterdeck.',
          path: [
            fast([97, side(97), 22.5], 'The standing part goes “round a timber-head on each side the fore part of the quarter-deck”.'),
            block(sheetBlock, 'Through a single block on the end of the sheet. The sheet is doubled, a leg and a fall to each side.'),
            block([100, side(100), 22.3], 'The hauling part comes back through a snatch block.'),
            belay([103, side(103), 22.5], 'And belays to “the next timber-head”.'),
          ],
          extra: [[clew, sheetBlock]],
          purchase: '2 to 1 from the fall. “Sometimes a luff-tackle is clapt on to bowse the sheets aft.”',
          belay: period('Timber-head, fore part of quarterdeck', 'A timber-head at the side of the quarterdeck, at its fore end, each side (Steel).'),
          sources: ['S 214', 'L 61'],
        },
      ],
    });
  }

  // --- Middle staysail --------------------------------------------------------
  {
    const grommet = [20.2, 0, 108], masthead = [97.8, 0, 138];
    const nock = along(grommet, masthead, 0.025), head = along(grommet, masthead, 0.72), tack = [22.2, 0, 93], clew = [79, 0, 90];
    add({
      id: 'middle-staysail', mast: 'main', title: 'The middle staysail', start: 'stay',
      cloth: [[tack, nock, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'Middle staysail stay',
          does: 'The middle staysail fills the gap above the main topmast staysail. Its stay is rigged only for it, and both ends move: the after end comes down to a tackle, and the fore end rides up and down the fore topmast on a rope ring.',
          cls: 'standing-rig', mirror: false,
          path: [
            fast(off(grommet, 0.5), 'The standing part goes up through the hanks to a thimble in a grommet round the fore topmast under the parral of the fore topsail yard.'),
            lead([97.8, 0.8, 138.2], 'The hauling part reeves through the upper sheave at the main topmast head.'),
            block([98.8, 0.8, 102], 'Down to a tackle. The height of its upper block is not stated.'),
            block([99, 0.8, 79], 'The tackle’s lower block is at the main trestle-trees.'),
            guess(belay([102.6, 1, 19.5], 'The fall comes on deck abaft the mast. The fitting is not named.')),
          ],
          belay: inferred('Abaft the mainmast', 'On the quarterdeck abaft the mainmast (Steel). The fitting is not named; drawn at the bitts there.'),
          worked: 'Set up taut once the fore end has been triced up, and eased before it is lowered.',
          notes: ['Lever: the grommet “is now seldom used, but a Jack Stay” up the after side of the fore topmast, for the stay’s thimble to travel on. This jack stay is a rope on a mast and is in the 1819 text; it is not the later jackstay along a yard.'],
          sources: ['S 215', 'L 61'],
        },
        {
          id: 'tricing-line', group: 'sail', name: 'Tricing line',
          does: 'Hauls the grommet, and so the fore end of the stay, up the fore topmast to set the sail, and lets it down again so the sail can be stowed in the fore top.',
          mirror: false,
          path: [
            fast(off(grommet, -0.5), 'From the grommet round the fore topmast.'),
            block([20, -0.8, 121], 'Up through a block under the fore topmast cross-trees.'),
            belay([22, -3, 70.6], 'And down into the fore top, where it is worked.'),
          ],
          belay: period('In the fore top', 'In the fore top (Steel).', 'aloft'),
          sources: ['S 215', 'L 61'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail up its stay to the main topmast head.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'Bent to the head of the sail.'),
            lead([98, -1, 136.4], 'Through the lower sheave of the cheek block at the main topmast head.'),
            guess(belay([102.6, -1.6, 19.5], 'It “leads upon deck abaft the mast”. The fitting is not named.')),
          ],
          belay: inferred('Abaft the mainmast', 'On the quarterdeck abaft the mainmast (Steel). The fitting is not named; drawn at the bitts there.'),
          sources: ['S 215', 'L 61'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay to the fore topmast.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'To the head of the sail, up through the hanks.'),
            block(off(nock, 0.5), 'Through a block on the stay at the nock.'),
            guess(belay([24.5, 0.8, 19.5], '“Upon deck abaft the foremast.” The fitting is not named.')),
          ],
          belay: inferred('Abaft the foremast', 'On the forecastle abaft the foremast (Steel). The fitting is not named.'),
          sources: ['S 215'],
        },
        {
          id: 'tacks', group: 'sail', name: 'Tacks',
          does: 'Hold down the lower fore corner, with a leg to each side so it can be hauled to windward.',
          path: [
            fast(off(tack, 0.5), 'Doubled, from the tack of the sail.'),
            lead([21.2, 6.2, 92.5], 'Through thimbles in the fore topmast shrouds.'),
            belay([22.5, 8, 70.6], '“Belaying in the top.”'),
          ],
          belay: period('In the fore top', 'In the fore top, each side (Steel).', 'aloft'),
          sources: ['S 215'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Trim the sail, one each side. They come all the way down to the gunwale abaft the gangways.',
          path: [
            fast(off(clew, 0.5), 'Doubled, a leg from the clew to each side.'),
            block([98, side(98), 22.3], 'Through a block on the gunwale abaft the gangways.'),
            belay([86, 7, 20.6], '“And belay round a boatskid.”'),
          ],
          belay: period('After boat skid', 'Round the boat skid next the quarterdeck, each side (Steel).'),
          worked: 'Shifted over the main topmast stays when the ship goes about.',
          sources: ['S 215'],
        },
      ],
    });
  }

  // --- Main topgallant staysail -----------------------------------------------
  {
    const splice = [95.5, 0, 168.5], thimble = [21, 0, 122.5];
    const nock = along(thimble, splice, 0.04), head = along(thimble, splice, 0.7), tack = [24, 0, 113], clew = [77, 0, 118];
    add({
      id: 'main-topgallant-staysail', mast: 'main', title: 'The main topgallant staysail', start: 'stay',
      cloth: [[tack, nock, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'Main topgallant staysail stay',
          does: 'The highest of the four, a light-weather sail. Its stay is a branch of the main topgallant stay, and its lower end is left long so that sail and stay together can be hauled down into the fore top.',
          cls: 'standing-rig', mirror: false,
          path: [
            fast(off(splice, 0.4), 'The upper end is spliced into the main topgallant stay below the rigging.'),
            lead(off(thimble, 0.4), 'The lower end reeves through a thimble at the fore topmast cross-trees.'),
            belay([22, 3, 70.6], 'And is made fast in the fore top, with enough length to overhaul.'),
          ],
          belay: period('In the fore top', 'In the fore top (Steel).', 'aloft'),
          worked: 'To take the sail in, Lever lets go the halliards, eases the sheet, hauls the downhauler until the peak is down to the thimble on the cross-trees, casts off the upper tack, eases the stay, and hauls the sail and the bight of the stay down into the fore top to stow.',
          sources: ['S 215', 'L 62'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'Bent to the head of the sail.'),
            lead([96.8, -0.6, 171], 'Through a sheave-hole in the main topgallant mast a little above the hounds.'),
            belay([102.6, -2, 19.5], 'It “belays to the bitts on the quarter-deck abaft the mast”.'),
          ],
          belay: period('Bitts abaft the mainmast', 'The bitts on the quarterdeck abaft the mainmast (Steel). Those are the fore-brace bitts.'),
          sources: ['S 215', 'L 62'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay to the fore topmast cross-trees.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'To the head of the sail, up through the hanks.'),
            guess(lead(off(nock, 0.5), 'Down the stay to the nock. No block is mentioned.')),
            belay([22.5, -3, 70.6], 'Lever leads it into the fore top.'),
          ],
          belay: period('In the fore top (Lever)', 'In the fore top, according to Lever. Steel has it “upon deck abaft the main-mast”, which is at the other end of the stay; the drawing follows Lever because he explains how the sail is stowed from the fore top.', 'aloft'),
          notes: ['The two authors disagree, and Steel does not give the route by which a downhauler would reach the deck abaft the mainmast.'],
          sources: ['S 215', 'L 62'],
        },
        {
          id: 'tacks', group: 'sail', name: 'Tacks',
          does: 'Hold down the lower fore corner, a leg to each side. Steel says only that they are as the middle staysail’s.',
          path: [
            fast(off(tack, 0.5), 'Doubled, from the tack of the sail.'),
            guess(lead([21, 2.8, 112.5], 'Through thimbles in the fore topmast shrouds, as the middle staysail’s. The height is a guess.')),
            belay([22.5, 6, 70.6], 'Belayed in the fore top.'),
          ],
          belay: period('In the fore top', 'In the fore top, as the middle staysail’s (Steel).', 'aloft'),
          sources: ['S 215'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Trim the sail, one each side.',
          path: [
            fast(off(clew, 0.5), 'Doubled, a leg from the clew to each side.'),
            block([99.5, side(99.5), 22.3], 'As the middle staysail’s: through a block on the gunwale abaft the gangways.'),
            belay([86, 4.5, 20.6], 'And round a boat skid.'),
          ],
          belay: period('After boat skid (Steel)', 'As the middle staysail’s in Steel: round the boat skid next the quarterdeck. Lever has them “belaying to a pin in the fife rail”.'),
          sources: ['S 215', 'L 62'],
        },
      ],
    });
  }

  // --- Mizen staysail ---------------------------------------------------------
  {
    const collar = [99, 0, 29], masthead = [149.6, 0, 70.5], eyebolt = [100.6, 0, 18.3];
    const nock = along(collar, masthead, 0.08), head = along(collar, masthead, 0.72), tack = [103, 0, 21], clew = [131, 0, 28];
    const cringle = along(head, clew, 0.5);
    add({
      id: 'mizen-staysail', mast: 'mizen', title: 'The mizen staysail', start: 'halliard',
      cloth: [[tack, nock, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'Mizen staysail stay',
          does: 'In large ships the mizen staysail has a stay of its own, beside the mizen stay. “In small ships, the mizen-staysail bends to the mizen-stay.”',
          lead: 'Clinched round the mizen masthead, down through a thimble in a collar on the mainmast, and set up to an eyebolt in the deck abaft the mainmast.',
          extra: [[masthead, collar, eyebolt]], cls: 'standing-rig', mirror: false,
          rope: 'Staysail stay, worn, 5 in., 16 fathoms, with collar and lanyard. “Worn” means made from used rope.',
          sources: ['S 215', 'S 216', 'L 62', 'S74 36'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail up its stay to the mizen masthead.',
          mirror: false,
          path: [
            fast([149.6, 0.7, 70.5], 'The standing part goes round the mizen masthead.'),
            block(off(head, 0.5), 'Through a block at the head of the sail.'),
            block([149, 1.2, 66], 'Back to a block at the mizen trestle-trees.'),
            guess(lead([151.5, side(151.5), 26.5], 'Down to “a leading-block in the side”. Steel’s ship has no poop; on a 74 the side abreast the mizen mast is the poop, and it is drawn there.')),
            guess(belay([154, side(154), 28.5], 'It “belays round a timber-head”.')),
          ],
          purchase: '2 to 1: doubled at the head of the sail.',
          belay: inferred('Timber-head abreast the mizen', 'A timber-head in the side abreast the mizen mast (Steel). Which deck that is on a 74, and which side, are my reading.'),
          rope: '3 in.',
          sources: ['S 216', 'L 62', 'S74 36'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay to the mainmast.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'To the head of the sail, up through the hanks.'),
            block([99.6, -0.5, 29.5], 'Through a block at the stay’s collar on the mainmast.'),
            belay([102.6, -1.2, 19.5], 'It “belays round the fore-brace-bitts abaft the main-mast”.'),
          ],
          belay: period('Fore-brace bitts', 'The fore-brace bitts on the quarterdeck, abaft the mainmast (Steel).'),
          rope: '2 in.',
          sources: ['S 216', 'S74 36'],
        },
        {
          id: 'brails', group: 'sail', name: 'Brails',
          does: 'Gather the after edge forward to the stay, one each side of the sail.',
          path: [
            fast(off(cringle, 0.6), 'From a cringle on the after leech, through thimbles on the sail.'),
            block([99.8, 0.9, 29.2], 'To blocks each side of the collar on the mainmast.'),
            belay([95.8, 3, 21.5], 'They belay at “the breast-rail on the quarter-deck”.'),
          ],
          belay: period('Quarterdeck breast-rail', 'The breast-rail at the fore end of the quarterdeck (Steel).'),
          worked: 'The lee brail is hauled first, as on the main topmast staysail.',
          rope: '2 in.',
          sources: ['S 216', 'S74 36'],
        },
        {
          id: 'tack', group: 'sail', name: 'Tack',
          does: 'Holds the lower fore corner down. The upper corner of the nock is made fast to the stay’s collar.',
          lead: 'Lashed to an eyebolt in the deck abaft the mainmast.',
          rope: '2½ in.',
          sources: ['S 216', 'S74 36'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Trim the sail, one each side. Each sheet has a long leg and a short one, and the long leg is rove back through the short, which gives a purchase without a block at the clew.',
          path: [
            fast(off(clew, 0.5), 'The long leg starts at the clew.'),
            block([134, side(134), 21.5], 'Out through “a block or bolt in the side”.'),
            lead([132, 3, 27], 'Back through the thimble in the end of the short leg.'),
            belay([130, side(130), 22.5], 'And “belays round a timber-head in the side”.'),
          ],
          purchase: '2 to 1, less a good deal for the friction of the thimble.',
          belay: period('Timber-head, quarterdeck side', 'A timber-head in the side of the quarterdeck, each side (Steel).'),
          worked: 'Shifted over the mizen stay when the ship goes about.',
          rope: '3½ in.',
          sources: ['S 216', 'S74 36'],
        },
      ],
    });
  }

  // --- Mizen topmast staysail -------------------------------------------------
  {
    const collar = [99, 0, 80], masthead = [149.6, 0, 112];
    const nock = along(collar, masthead, 0.16), head = along(collar, masthead, 0.75), tack = [107, 0, 78.5], clew = [139, 0, 72];
    add({
      id: 'mizen-topmast-staysail', mast: 'mizen', title: 'The mizen topmast staysail', start: 'halliard',
      cloth: [[tack, nock, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'The stay it sets on', also: 'mizen topmast stay',
          does: 'A fair-weather sail, bent to the mizen topmast stay itself.',
          lead: 'The mizen topmast stay runs from the mizen topmast head to a collar on the mainmast close up under the main top. The sail’s fore end is drawn just abaft the top.',
          extra: [[masthead, collar]], cls: 'standing-rig', mirror: false,
          sources: ['S 216', 'S 201'],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'Bent to the head of the sail.'),
            lead([149.6, 0.6, 113.5], 'Through a sheave-hole in the mizen topmast above the rigging.'),
            guess(belay([152.6, 1.5, 26.3], 'It comes “down upon deck abaft the mast”. The fitting is not named.')),
          ],
          belay: inferred('Abaft the mizen mast', 'On deck abaft the mizen mast (Steel), which on a 74 is the poop. The fitting is not named; drawn at the bitts there.'),
          sources: ['S 216'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay towards the mainmast.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'To the head of the sail, up through the hanks.'),
            guess(lead(off(nock, -0.5), 'Down the stay to the nock. No block is mentioned.')),
            guess(bend([100.5, -1.5, 78])),
            belay([95.8, -3, 21.5], 'It “belays round the breast-rail” of the quarterdeck. How it passes the main top is not stated.'),
          ],
          belay: period('Quarterdeck breast-rail', 'The breast-rail at the fore end of the quarterdeck (Steel).'),
          sources: ['S 216'],
        },
        {
          id: 'tacks', group: 'sail', name: 'Tacks',
          does: 'Hold down the lower fore corner, a leg to each side.',
          path: [
            fast(off(tack, 0.5), 'Doubled, from the tack of the sail.'),
            lead([102, 9, 83], 'Through thimbles in the main topmast shrouds (Steel). Lever says the main shrouds.'),
            belay([101, 9.6, 78.6], '“Belaying in the top.”'),
          ],
          belay: period('In the main top', 'In the main top, each side (Steel). Lever takes them to the main shrouds, into the main top or below.', 'aloft'),
          sources: ['S 216', 'L 62'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Trim the sail, one each side.',
          path: [
            fast(off(clew, 0.5), 'Doubled, a leg from the clew to each side.'),
            lead([154.7, 12.7, 45], 'Through thimbles in the mizen shrouds.'),
            belay([157, side(157), 29], 'To “a pin in the hand-rail on each side”.'),
          ],
          belay: period('Pin in the poop hand-rail', 'A belaying pin in the hand-rail at the ship’s side abreast the mizen shrouds, each side (Steel).'),
          worked: 'Shifted over the mizen stay when the ship goes about.',
          sources: ['S 216'],
        },
      ],
    });
  }

  // --- Mizen topgallant staysail ----------------------------------------------
  {
    const fore = [98.2, 0, 138], masthead = [148.6, 0, 136.5];
    const nock = along(fore, masthead, 0.12), head = along(fore, masthead, 0.75), tack = [104.2, 0, 127], clew = [138, 0, 118];
    add({
      id: 'mizen-topgallant-staysail', mast: 'mizen', title: 'The mizen topgallant staysail', start: 'halliard',
      cloth: [[tack, nock, head, clew]],
      lines: [
        {
          id: 'stay', group: 'sail', name: 'The stay it sets on', also: 'mizen topgallant stay',
          does: 'The smallest and least used. Steel says ships carry it “sometimes”. It bends to the mizen topgallant stay.',
          lead: 'The mizen topgallant stay runs from the mizen topgallant masthead to the main topmast head. With the heights estimated for this drawing it comes out nearly level.',
          extra: [[masthead, fore]], cls: 'standing-rig', mirror: false,
          sources: ['S 216', steel(85, 4, 'sailmaking')],
        },
        {
          id: 'halliard', group: 'sail', name: 'Halliard',
          does: 'Hoists the head of the sail.',
          mirror: false,
          path: [
            fast(off(head, 0.5), 'Bent to the head of the sail.'),
            lead([148.6, 0.6, 137.5], 'Through the hole in the mizen topgallant mast above the hounds.'),
            belay([158.5, side(158.5), 29], 'Down on deck to “a pin in the handrail”. Which side is not stated.'),
          ],
          belay: period('Pin in the poop hand-rail', 'A belaying pin in the hand-rail (Steel). The side is not stated; drawn to starboard.'),
          sources: ['S 216'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head down the stay towards the main topmast.',
          mirror: false,
          path: [
            fast(off(head, -0.5), 'To the head of the sail, up through the hanks.'),
            guess(lead(off(nock, -0.5), 'Along the stay to the nock.')),
            belay([104.8, -3, 81.5], 'Down to the main top, where it “belays round the top-rail”.'),
          ],
          belay: period('Main top rail', 'Round the rail at the after side of the main top (Steel).', 'aloft'),
          sources: ['S 216'],
        },
        {
          id: 'tacks', group: 'sail', name: 'Tacks',
          does: 'Hold down the lower fore corner, a leg to each side.',
          path: [
            fast(off(tack, 0.5), 'Doubled, from the tack of the sail.'),
            guess(lead([99.6, 3.2, 126], 'To the main topmast shrouds. The height is a guess.')),
            belay([101, 8, 78.6], 'And down into the main top.'),
          ],
          belay: period('In the main top', 'In the main top, each side (Steel).', 'aloft'),
          sources: ['S 216'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Trim the sail, one each side.',
          path: [
            fast(off(clew, 0.5), 'Doubled, a leg from the clew to each side.'),
            lead([150.8, 4.5, 60], 'Through thimbles in the mizen shrouds near the catharpins, just under the mizen top.'),
            belay([156.5, 20.5, 27.5], 'Down the shrouds to “a pin in the shroud-rack”, a rack of pins seized across the shrouds near the deck.'),
          ],
          belay: period('Pin in the mizen shroud-rack', 'A belaying pin in a rack on the mizen shrouds, each side (Steel). Lever has them “to the foremost mizen shroud, or to the fife-rail”.'),
          sources: ['S 216', 'L 62'],
        },
      ],
    });
  }

  // ===== The mizen and driver ================================================

  const throat = [151.5, 0, 60.3], peak = [178, 0, 80], capAft = [150.5, 0, 78];
  const onGaff = (t) => along([151, 0, 60], peak, t);
  const boomEnd = [193, 0, 37], onBoom = (t) => along([151, 0, 33], boomEnd, t);

  // --- Mizen (the brailed, loose-footed standing sail) --------------------------
  {
    const head = [177, 0, 79.3], tack = [151.5, 0, 30], clew = [181, 0, 37.6];
    const leech = (t) => along(head, clew, t);
    const horse = [185, 0, 31.5];
    const span = [onGaff(0.35), [158, 0, 72.5], onGaff(0.62)];
    add({
      id: 'mizen', mast: 'mizen', title: 'The mizen', start: 'brails-throat',
      cloth: [[tack, throat, head, clew]],
      lines: [
        {
          id: 'gaff', group: 'yard', name: 'The standing gaff',
          does: 'The gaff spreads the head of the sail. Its fore end has jaws that clasp the after side of the mast, held in by a parral of trucks. In a man-of-war of this date it is usually a standing gaff: it is slung in place and neither hoists nor lowers, and the sail is taken in by brailing it up to the gaff and the mast.',
          lead: 'Lever: “The Gaff is sometimes slung”, by slings from an eyebolt at the jaws up between the trestle-trees and round the masthead; by a span on the gaff, taken to a pendent hooked to an eyebolt in the after part of the mizen cap; and by a peak tye, a pendent from the peak end set up with a lanyard to a strap at the mizen topmast head.',
          extra: [[throat, [150, 0, 69]], span, [[158, 0, 72.5], capAft], [peak, [149.4, 0, 112.5]]],
          cls: 'standing-rig', mirror: false,
          notes: ['Steel’s rule makes a gaff five-eighths the length of its boom, and the boom the length of the main topsail yard. His table gives a 74 neither, because in 1794 she still had the mizen yard. The gaff here is drawn to that rule, about 34 feet.'],
          sources: ['L 43', steel(40, 1, 'mastmaking'), steel(2, 1, 'mastmaking')],
        },
        {
          id: 'lacing', group: 'sail', name: 'Earings and lacing',
          does: 'Fasten the sail to its spar and its mast. Unlike a square sail, the mizen is fixed along two edges.',
          lead: 'The two upper corners are secured by a peek earing and a nock earing. The head is laced round the gaff, and the fore leech is laced round the mast. Where the gaff hoists, the fore leech is seized to hoops round the mast instead.',
          rope: 'Steel’s table still lists it as “Lacing Mizen to Yard”.',
          sources: ['S 217', 'L 63', 'S74 36'],
        },
        {
          id: 'tack', group: 'sail', name: 'Tack',
          does: 'Holds the lower fore corner down at the foot of the mast.',
          lead: 'A lanyard to an eyebolt in the deck abaft the mizen mast.',
          sources: ['S 217'],
        },
        {
          id: 'sheet', group: 'sail', name: 'Sheet',
          does: 'Hauls the clew aft to the taffrail. The mizen is loose-footed: nothing holds its foot but the tack at one end and this sheet at the other. The boom under it belongs to the driver.',
          mirror: false,
          path: [
            block(off(horse, 0.5), 'It reeves through a block that travels on a rope horse “at the fore part of the taffarel”. Where the standing part is made fast is not stated.'),
            block(off(clew, 0.5), 'Up through a block hooked to the clew of the sail.'),
            block([185.2, 1, 31.4], 'Back down through the block on the horse.'),
            belay([182, side(182), 29.5], 'It “belays round a cleat on the side”. Which side is not stated.'),
          ],
          extra: [[[185, -5, 31.5], [185, 5, 31.5]]],
          purchase: 'About 2 to 1 as described.',
          belay: period('Cleat, aft', 'A cleat on the ship’s side by the taffrail (Steel). The side is not stated; drawn to starboard.'),
          worked: 'To set the sail the brails are let go and the sheet hauled aft; Lever speaks of “the Mizen hauled out”. That order of work is inferred from the gear. To take it in, “ease off the mizen sheet, and brail up briskly”.',
          rope: '4½ in.',
          sources: ['S 217', steel(336, 10, 'working ships'), 'L 63', 'S74 36'],
        },
        {
          id: 'vangs', group: 'yard', name: 'Vangs', also: 'vang pendents and falls',
          does: 'Hold the peak of the gaff from swinging. Steel calls them “the braces that keep steady the peek”. There is one each side, down to the quarters. The weather vang takes the pull of the sail; the lee one is eased.',
          path: [
            fast(off(peak, 0.5), 'The bight of the pendents goes over the peak end, a leg hanging down each side.'),
            block([183, 9, 52], 'Each leg has a double block in its lower end.'),
            block([187.3, side(187.3), 30.5], 'The fall goes to a single block at an eyebolt in “the upper part of the quarter-piece” each side.'),
            belay([186.2, 11.5, 31.3], 'It “belays to a cleat nailed on the taffarel fife-rail”.'),
          ],
          purchase: 'A double and a single block: 3 to 1 as described.',
          belay: period('Taffrail cleat', 'A cleat nailed on the fife-rail of the taffrail, each side (Steel).'),
          worked: 'Trimmed with the sheet. With a standing gaff the peak is also where the mizen topsail braces lead, so the vangs steady those too.',
          rope: 'Pendents 4½ in.',
          notes: ['Vangs belong to a gaff that stays up. “When the Gaff is rigged to hoist, there are no Vangs” (Lever).'],
          sources: ['S 207', 'S 208', 'L 43', 'S74 36'],
        },
        {
          id: 'brails-throat', group: 'sail', name: 'Throat brails',
          does: 'Brails are how this sail is taken in. They run from the after edge of the sail, the leech, up to blocks on the gaff and down to the deck, a pair to each position: one rope on each side of the sail. Hauled, they gather the sail forward and up against the mast and gaff, where it hangs in a bundle. The throat brails pull the leech in to the jaws of the gaff. They are the heaviest, and Steel says they “should have a whip purchase”.',
          path: [
            guess(fast(off(leech(0.75), 0.5), 'From a cringle on the after leech. Steel does not say how far down; drawn three-quarters of the way.')),
            block([152.6, 0.7, 60.8], 'To the throat block, next the mast.'),
            guess(belay([151.6, 2.6, 26.3], '“The throat-brails lead down by the mast.” The fitting is not named.')),
          ],
          belay: inferred('Foot of the mizen mast', 'On the poop at the foot of the mizen mast, each side. Steel says they “lead down by the mast” and names no fitting.'),
          worked: '“Man well the lee brails, and in particular the throat brails … ease off the mizen sheet, and brail up briskly, taking in at the same time the slack of the weather brail” (Steel). Lever: “the lee throat brail is well manned and hauled up, then the other brails, and the weather ones are gathered in”.',
          rope: '3 in.',
          sources: ['S 217', steel(336, 10, 'working ships'), 'L 63', 'L 85', 'S74 36'],
        },
        {
          id: 'brails-middle', group: 'sail', name: 'Middle brails',
          does: 'Gather the middle of the leech up to the middle of the gaff.',
          path: [
            guess(fast(off(leech(0.5), 0.5), 'From a cringle half-way down the leech. The height is a guess.')),
            block(off(onGaff(0.5), 0.7), 'To the middle block, half-way to the peek.'),
            belay([166.5, 22, 26.5], '“The middle-brails lead down to the after-mizen-shroud on each side.”'),
          ],
          belay: period('After mizen shroud', 'The aftermost mizen shroud, each side (Steel). How it is made fast there is not stated.'),
          sources: ['S 217', 'S74 36'],
        },
        {
          id: 'brails-peak', group: 'sail', name: 'Peak brails', also: 'peek brails',
          does: 'Gather the top of the leech up under the peak of the gaff.',
          path: [
            guess(fast(off(leech(0.25), 0.5), 'From a cringle near the top of the leech. The height is a guess.')),
            block(off(onGaff(0.88), 0.7), 'To the peak block, three or four feet inside the peak.'),
            belay([177, side(177), 29.5], '“And the peek-brails to the fife-rail on each quarter.”'),
          ],
          belay: period('Quarter fife-rail', 'The fife-rail on each quarter, at the after end of the poop (Steel).'),
          notes: ['Steel’s table for a 74 also lists a foot brail, which his text does not describe.'],
          sources: ['S 217', 'S74 36'],
        },
        {
          id: 'fancy-line', group: 'sail', name: 'Fancy line',
          does: 'Lifts the slack of the lee brails clear of the sail when it is set. Each brail has a twin on the other side, and the one to leeward lies across the belly of the sail; left alone it would “girt the lee side of the sail”.',
          lead: 'A line through a block at the peak, ending in a span whose legs carry thimbles that ride on the throat and middle brails. Hauling it lifts the bights of those brails. Where it belays is not stated.',
          sources: ['S 217', 'L 63'],
        },
      ],
    });
  }

  // --- The older rig: a mizen yard ----------------------------------------------
  {
    const lower = [122.1, 0, 38.6], upper = [189.5, 0, 88.6];
    const slings = [151, 0, 60];
    add({
      id: 'mizen-yard', alternative: true, mast: 'mizen', title: 'The mizen yard (to about 1800)', start: 'jeers',
      cloth: [[[151.5, 0, 30], throat, [188, 0, 87.5], [186, 0, 34]]],
      spars: [{ a: lower, b: upper, w: 1.1 }],
      lines: [
        {
          id: 'jeers', group: 'yard', name: 'Jeers',
          does: 'Hang the yard. The mizen yard is the old lateen yard, 84 feet long in Steel’s 74, crossing the mast on a slant with a third of its length before the mast. By 1794 the sail was set only on the part abaft the mast, but ships of the line kept the whole spar.',
          mirror: false,
          path: [
            block(off(slings, 0.5), 'A block is lashed between the cleats on the yard.'),
            block([150, 0.7, 68], 'The jeer reeves between it and a double block at the mizen masthead.'),
            belay([156, 23.5, 22.4], 'The fall comes to the mizen chains on the starboard side, is made fast to an eyebolt there once the yard is up, and the rest is stopped to the lanyards of the shrouds.'),
          ],
          belay: period('Mizen chains, starboard', 'An eyebolt in the starboard mizen chains (Steel). It is made fast and left: the yard is hoisted once.'),
          notes: ['The yard is drawn over the gaff, at the gaff’s angle, so that the two can be compared. Its real angle and where it was slung are my estimates. Ignore the driver boom in this drawing: a 74 with a mizen yard had none.'],
          sources: ['S 207', 'L 42', 'S74 36'],
        },
        {
          id: 'derrick', group: 'yard', name: 'Derrick',
          does: 'Holds the peak of the yard up, as a peak halliard does for a gaff.',
          mirror: false,
          path: [
            fast(off(upper, -0.5), 'Its end goes over the peak.'),
            block([150.4, -0.7, 78], 'To a double block at the mizen cap.'),
            block(off(along(slings, upper, 0.5), -0.6), 'Down to a single block on the yard between slings and peek.'),
            block([150.6, -1, 77.7], 'Back to the block at the cap.'),
            belay([156, -23.5, 22.4], 'The fall “makes fast in the mizen-channel on the larboard-side”.'),
          ],
          belay: period('Mizen channel, larboard', 'In the larboard mizen channel (Steel).'),
          sources: ['S 207', 'S74 36'],
        },
        {
          id: 'bowlines', group: 'yard', name: 'Bowlines',
          does: 'Control the lower, forward end of the yard, as the vangs control the peak. Hauling one pulls the fore end of the yard to that side.',
          path: [
            block(off(lower, 0.5), 'Through a block at the lower end of the yard.'),
            guess(belay([152, 20, 27], 'To an eyebolt or the mizen shrouds each side. Drawn to the foremost mizen shroud.')),
          ],
          belay: inferred('Mizen shrouds', 'An eyebolt at the side or the mizen shrouds, each side (Steel). Which, and where, are not stated.'),
          sources: ['S 207', 'S74 36'],
        },
      ],
    });
  }

  // --- The alternative: a gaff that hoists ----------------------------------------
  {
    const head = [177, 0, 79.3];
    add({
      id: 'hoisting-gaff', alternative: true, mast: 'mizen', title: 'A gaff that hoists', start: 'throat-halliard',
      cloth: [[[151.5, 0, 30], throat, head, [181, 0, 37.6]]],
      lines: [
        {
          id: 'throat-halliard', group: 'yard', name: 'Throat halliards',
          does: 'The alternative to slinging the gaff. “Often, it is hoisted like a Brig’s Main-gaff” (Lever), and then two halliards lift it: one at the jaws and one at the peak. The throat halliards lift the jaws up the mast. The sail’s fore leech is then seized to hoops that slide on the mast, instead of being laced to it.',
          mirror: false,
          path: [
            block([150.7, 0.6, 65.5], 'A double block hangs under the mizen trestle-trees.'),
            block([151.7, 0.6, 61], 'The fall reeves between it and a block hooked to the eyebolt at the throat of the gaff.'),
            guess(belay([151.4, 2.6, 26.3], 'The fall comes down to the deck. Lever does not say where it belays.')),
          ],
          belay: inferred('Foot of the mizen mast', 'Not stated. Lever says that large ships sometimes have throat and peak tyes with halliard purchases to eyebolts in the deck. A modern kit plan of Victory uses cleats on the poop each side of the mizen mast.'),
          sources: ['L 43'],
        },
        {
          id: 'peak-halliard', group: 'yard', name: 'Peak halliards',
          does: 'Lift the peak of the gaff and set its angle.',
          mirror: false,
          path: [
            fast(off(peak, -0.5), 'They are “commonly reeved like the Derrick Fall” of a mizen yard: the end goes over the peak.'),
            block([150.4, -0.7, 78], 'To a double block at the masthead.'),
            block(off(onGaff(0.55), -0.6), 'Down to a block on the gaff.'),
            block([150.6, -1, 77.7], 'Back to the masthead block.'),
            guess(belay([151.4, -2.6, 26.3], 'The fall comes down to the deck. Lever does not say where it belays.')),
          ],
          belay: inferred('Foot of the mizen mast', 'Not stated; see the throat halliards.'),
          sources: ['L 43'],
        },
        {
          id: 'peak-downhauler', group: 'yard', name: 'Peak downhauler',
          does: 'Pulls the peak down when the gaff is lowered. It takes the place of the vangs: “When the Gaff is rigged to hoist, there are no Vangs, nor Blocks for the Mizen Topmast and Mizen Top-gallant Braces, which then lead forwards” (Lever).',
          mirror: false,
          path: [
            block(off(peak, 0.5), 'Through a block at the peak end.'),
            guess(belay([185.5, 3, 30], 'Down to the deck aft. Where it belays is not stated.')),
          ],
          belay: inferred('Taffrail', 'Not stated. Drawn at the taffrail under the peak.'),
          sources: ['L 43'],
        },
      ],
    });
  }

  // --- Driver, or spanker, on its boom ----------------------------------------------
  {
    const yardIn = [171.6, 0, 75.6], yardOut = [186, 0, 86.2];
    const nockCringle = [151.8, 0, 59.4], tack = [152.4, 0, 34], clew = [192, 0, 37.5];
    const yardThird = along(yardIn, yardOut, 0.33), yardMid = along(yardIn, yardOut, 0.5);
    add({
      id: 'driver', mast: 'mizen', title: 'The driver, or spanker', start: 'sheet',
      cloth: [[tack, nockCringle, yardOut, clew]],
      spars: [{ a: yardIn, b: yardOut, w: 0.5 }],
      lines: [
        {
          id: 'boom', group: 'yard', name: 'The driver boom', also: 'spanker boom',
          does: 'Spreads the foot of the driver out beyond the taffrail. Lees dates the boom on the mizen to 1793. Steel’s table of 1794 gives a 74 no driver boom at all, only ships of 50 guns and under; by 1808 Lever takes it for granted.',
          lead: 'The heel has a goose-neck hooked to an eye on a hoop round the mizen mast, or jaws that rest on a shoulder bolted to the mast. Boom horses, footropes for the men, run from the boom end to just above the taffrail.',
          notes: ['Steel’s rule: the driver boom is as long as the main topsail yard, 70 feet in his 74. The boom in this drawing is about 42 feet and is likely too short.'],
          sources: ['S 208', steel(40, 1, 'mastmaking'), 'L 44', LEES + ' (p. 159)'],
        },
        {
          id: 'topping-lifts', group: 'yard', name: 'Topping lifts',
          does: 'Hold the outer end of the boom up. There is one each side of the sail, so there is always a lift to windward: Lever prefers that plan because “there is no occasion to dip the Peak on either Tack”. The lee lift is slacked so that it does not cut into the sail.',
          path: [
            fast(off(boomEnd, 0.5), 'The bight goes over the boom end with a clove hitch against the shoulder, a leg leading up each side.'),
            block([150, 1.3, 70], 'Each leg reeves through a single block lashed either side of the mizen masthead.'),
            block([152.5, 12, 46], 'It has a double block in its lower end. The height is not stated.'),
            block([155, 23.5, 22.4], 'The fall goes to a single block hooked in the mizen channel.'),
            belay([150.6, 2.8, 26.8], 'It “belays to a cleat on each side the mizen-mast”.'),
          ],
          purchase: 'A double and a single block on the end of the lift: 3 to 1 as described.',
          belay: period('Cleat beside the mizen mast', 'A cleat on each side of the mizen mast (Steel).'),
          worked: 'The weather lift is set up and the lee one eased on each tack. Lever adds crane lines on the lifts “for over-hauling the Lee Topping Lift”.',
          notes: ['Lever calls this the “more common” method and gives two others.'],
          sources: ['S 208', 'L 44'],
        },
        {
          id: 'boom-sheet', group: 'yard', name: 'Boom sheet',
          does: 'Holds the boom down and in, and sets its angle to the wind. This is the sheet in the modern sense. Lever’s “sheet rope”, further on, is a different thing.',
          mirror: false,
          path: [
            block(off(onBoom(0.79), 0.5), 'A double block is strapped to the boom over the horse.'),
            block([184.4, 0.5, 26.6], 'The fall reeves between it and a double block that travels on a horse on the deck. Lever’s is an iron horse.'),
            guess(belay([180.5, 3, 26.3], 'The fall leads in on deck. The fitting is not named.')),
          ],
          extra: [[[184.4, -4, 26.2], [184.4, 4, 26.2]]],
          purchase: 'Two double blocks: 4 to 1.',
          belay: inferred('Poop, aft', 'On deck near the horse (Lever). The fitting is not named.'),
          worked: 'Eased as the ship bears away, hauled in as she comes to the wind.',
          sources: ['L 44'],
        },
        {
          id: 'boom-guys', group: 'yard', name: 'Boom guys', also: 'guy pendents',
          does: 'Steady the boom sideways. The lee guy is taken forward when the ship is going large, to stop the boom swinging in as she rolls.',
          path: [
            fast(off(onBoom(0.7), 0.5), 'A pendent hooks to a thimble in a strap on the boom.'),
            block([176, 9, 33], 'A luff tackle is on its lower end.'),
            guess(block([168, side(168), 29.3], 'Hooked “where most wanted”. Drawn to the side of the poop.')),
            guess(belay([165.5, side(165.5), 29.3], 'Belayed near by.')),
          ],
          purchase: 'A luff tackle: 3 or 4 to 1 according to which block moves.',
          belay: inferred('Poop side', 'No fixed place: the guys are luff tackles “used where most wanted” (Steel).'),
          sources: ['S 208'],
        },
        {
          id: 'halliards', group: 'sail', name: 'Head halliards', also: 'outer, middle and inner halliards',
          does: 'Hoist the head of the driver up to the gaff. This is the mark of a temporary sail. The mizen’s head is laced to the gaff and stays there; the driver’s is sent up from the deck on “four or five pair of haliards, that reeve through blocks made fast with tails round the yard or gaff” (Steel), so the whole sail can be set and struck without a man going aloft. The outer part of the head is longer than the gaff and is laced to a short driver yard, because, Lever says, “the Gaff is not of sufficient Squareness to spread the Head”.',
          mirror: false,
          path: [
            fast(off(yardThird, 0.5), 'The outer halliards are bent to the driver yard a third of its length from the inner end.'),
            block([178, 0.7, 80.4], 'Through a block at the gaff end.'),
            guess(belay([179, 4, 26.3], 'Down to the deck. Where they belay is not stated.')),
          ],
          belay: inferred('Under the peak', 'Not stated by Steel or Lever. Drawn straight down from the gaff end.'),
          worked: '“The Spanker is set like a lower Studding Sail, by hauling out the Sheet Rope to the Boom End, hoisting on the outer Halliards, then the inner and Throat ones, and hauling the Tack forwards, or to Windward” (Lever).',
          rope: 'Steel’s table: “Driver Hallyards, 2 Pair”, 3½ in.',
          notes: ['The middle and inner halliards go to cringles on the head of the sail, through blocks on the gaff. They are not drawn.'],
          sources: ['S 217', 'L 66', 'L 81', 'S74 37'],
        },
        {
          id: 'throat-halliard', group: 'sail', name: 'Throat halliards',
          does: 'Hoist the upper fore corner of the driver, the nock, up to the jaws of the gaff.',
          mirror: false,
          path: [
            block([150.3, -0.6, 68.5], 'A double block at the masthead.'),
            block(off(nockCringle, -0.6), 'And a single block hooked to the nock cringle of the sail.'),
            guess(belay([151.4, -2.6, 26.3], 'The fall comes down by the mast. Where it belays is not stated.')),
          ],
          belay: inferred('Foot of the mizen mast', 'Not stated. Drawn at the foot of the mast.'),
          sources: ['S 217', 'L 66'],
        },
        {
          id: 'sheet', group: 'sail', name: 'Sheet rope: the outhaul', also: 'sheet (Steel); sheet rope (Lever); clew outhaul (modern)',
          does: 'Hauls the clew of the driver out to the end of the boom. Steel calls it the sheet, because it does to this sail what a sheet does to any other: it spreads the clew. It is not the rope that controls the boom.',
          mirror: false,
          path: [
            fast(off(clew, 0.5), 'It “bends to the clue of the sail”. Lever clinches it to a traveller on the boom.'),
            lead(off(boomEnd, 0.5), 'Through “a block or sheave-hole at the outer end of the boom”.'),
            block([190.4, 0.7, 34.6], '“A luff-tackle is cats-pawed to the other end of the sheet.”'),
            block([188, 0.9, 31.8], '“The inner block hooks to the taffarel.”'),
            guess(belay([184, 4.5, 26.4], '“And the fall leads in upon the quarter-deck”: on a 74, the poop. The fitting is not named.')),
          ],
          purchase: 'A luff tackle: 3 to 1 as rigged here.',
          belay: inferred('At the taffrail', 'In on deck from the taffrail (Steel). The fitting is not named.'),
          worked: 'Hauled out first when the sail is set.',
          sources: ['S 217', 'L 66', 'S74 37'],
        },
        {
          id: 'tack', group: 'sail', name: 'Tack',
          does: 'Holds the lower fore corner down and forward.',
          lead: 'A luff tackle from the tack cringle to an eyebolt in the deck, or to the throat of the boom.',
          sources: ['S 217', 'L 66', 'S74 37'],
        },
        {
          id: 'downhauler', group: 'sail', name: 'Downhauler',
          does: 'Pulls the head of the sail, on its driver yard, down from the gaff when the halliards are let go.',
          mirror: false,
          path: [
            block(off(yardMid, 0.5), 'Through a block at the middle of the driver yard.'),
            belay([186.6, 2.5, 31.5], 'It “leads down the taffarel”.'),
          ],
          belay: period('Taffrail', 'At the taffrail (Steel). The fitting is not named.'),
          sources: ['S 217', 'S74 37'],
        },
      ],
    });
  }

  // ===== Under the bowsprit ==================================================

  // --- Spritsail --------------------------------------------------------------
  {
    const yx = -36, yz = 42, half = 31;
    const arm = [yx, half, yz], clew = [-27, 27, 20];
    const cap = [-40, 0, 46.5];
    const guyBlock = [-12, 19, 30];
    add({
      id: 'spritsail', mast: 'fore', title: 'The spritsail', start: 'braces',
      cloth: [[[yx, -29, yz - 0.5], [yx, 29, yz - 0.5], clew, [-27, -27, 20]]],
      spars: [{ a: [yx, -half, yz], b: arm, w: 0.9 }],
      lines: [
        {
          id: 'slings', group: 'yard', name: 'Slings and halliards',
          does: 'Hang the yard under the bowsprit. The spritsail yard is 62 feet long in Steel’s 74, the same as the fore topsail yard, and it hangs athwart the bowsprit, under it.',
          lead: 'Slings go round the bowsprit before the saddle, and Lever adds a parral over the saddle. Steel also describes halliards, a long-tackle block under the cap and a single block on the yard, but says they are “now generally left off”; when the halliards are taken in, preventer slings hook to the eyebolt under the cap.',
          notes: ['Exactly where on the bowsprit the yard hangs is my estimate.'],
          sources: ['S 196', 'L 40', 'S74 31', 'X Steel 1794, p. 49, dimensions of masts and yards|https://maritime.org/doc/steel/large/pg049.htm'],
        },
        {
          id: 'lifts', group: 'yard', name: 'Lifts',
          does: 'Hold the yardarms up, keep the yard level, or cock one yardarm higher than the other. That last use matters more here than on any other yard.',
          path: [
            fast(off(cap, 0.6), 'The standing part starts at an eyebolt in the bowsprit cap.'),
            block([yx, half - 0.5, yz + 0.3], 'Out to the lift block at the yardarm.'),
            block([-39.6, 1.3, 46.2], 'Back to a block in the end of a span round the bowsprit cap.'),
            bend([-10, 5, 31]),
            belay([9, side(9), 22], 'It “leads in upon the fore-castle”. Lever has it “belayed to a timber-head on the fore-castle”.'),
          ],
          extra: [[[yx, 15.5, yz], [-37.5, 0.5, 45]]],
          purchase: '2 to 1: a whip, with the moving block at the yardarm.',
          belay: period('Timber-head, fore end of forecastle', 'A timber-head on the forecastle, each side (Lever). Steel gives only the deck.'),
          worked: 'Steel: “They are used for the spritsail-topsail-sheets, and to keep the yard level, or to raise one yard-arm higher than the other.”',
          rope: '3½ in., 58 fathoms.',
          notes: ['The short dark line is the standing lift, which runs from a quarter of the way out on the yard to a strap round the bowsprit inside the bees. It carries the yard’s weight when the running lifts are in use as sprit topsail sheets.'],
          sources: ['S 196', 'L 40', 'S74 31'],
        },
        {
          id: 'braces', group: 'yard', name: 'Braces',
          does: 'Swing the yard. Every other yard is braced from the next mast aft. This one is before all the masts and below the bowsprit, so its braces go up and aft to the fore top and then down to the forecastle. Because they lead upwards, hauling one brace also lifts that yardarm.',
          path: [
            guess(fast([19, 0.9, 71.5], 'Steel makes the standing part fast to the fore-stay collar. That could be the stay’s collar at the masthead or the one on the bowsprit; it is drawn at the masthead.')),
            block([yx + 1, half - 1.2, yz + 1], 'To a block on a pendent at the yardarm.'),
            block([16, 4, 68.6], 'Up to a double block “made fast under the fore-top”.'),
            block([26.5, 4, 68.6], 'Through another at the after part of the top.'),
            belay([52.4, 7, 21.5], '“And down to the breast-work at the aft part of the fore-castle.”'),
          ],
          extra: [[arm, [yx + 1, half - 1.2, yz + 1]]],
          purchase: '2 to 1 at the yardarm.',
          belay: period('Forecastle breast-work', 'The breast-work at the after end of the forecastle, each side (Steel). Lever: “a pin or cleat on the fore-castle”.'),
          worked: 'On a wind, “the Spritsail Yard is topped up by the lee Brace” (Lever).',
          rope: '3½ in., 75 fathoms.',
          sources: ['S 196', 'L 40', 'L 58', 'S74 31'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Hold the clews of the sail aft and down. There is nothing below this sail to sheet it to but the bows of the ship.',
          path: [
            guess(fast([3, 7.5, 17.5], 'The standing part is made fast to an eyebolt in the bow. Where on the bow is not stated.')),
            block(clew, 'Through a block at the clew. Lever fixes that block with a knot of its own, the spritsail sheet knot.'),
            guess(belay([13, side(13), 20], 'The hauling part comes inboard. Where is not stated.')),
          ],
          purchase: '2 to 1 where the sheet is double. Steel also allows a single sheet.',
          belay: inferred('Forecastle, fore end', 'Inboard on the forecastle (Steel). The place and fitting are not given.'),
          rope: 'Cabled, 5 in.',
          sources: ['S 219', 'L 58', 'S74 31'],
        },
        {
          id: 'clewlines', group: 'sail', name: 'Clewlines', also: 'clue-lines (Steel)',
          does: 'Haul the clews up to the yard to take the sail in.',
          path: [
            fast(clew, 'From the clew of the sail.'),
            block([yx, 3.5, yz - 0.3], 'To a block on the yard about three feet outside the slings.'),
            bend([-10, 4, 31]),
            guess(belay([10, 6.5, 19.2], 'They “lead in upon the forecastle”. The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). The fitting is not named.'),
          rope: '2½ in.',
          sources: ['S 219', 'L 58', 'S74 31'],
        },
        {
          id: 'buntlines', group: 'sail', name: 'Buntlines',
          does: 'Haul the foot of the sail up to the bowsprit.',
          path: [
            fast([-27.5, 9, 19.6], 'From cringles in the foot of the sail.'),
            lead([-35, 1, 43.6], 'Through a thimble in a strap round the bowsprit. Lever has small blocks each side of the bowsprit.'),
            bend([-10, 2, 31]),
            guess(belay([10, 2.5, 19.2], 'In to the forecastle. The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). The fitting is not named.'),
          rope: '2 in.',
          sources: ['S 219', 'L 58', 'S74 31'],
        },
        {
          id: 'reefs', group: 'sail', name: 'Reefs and water-holes',
          does: 'The spritsail’s two reef bands are “put on diagonally”, from the leech near the clew up to the head a cloth or two in from the earing. That is so the sail can be reefed along one side when the yard is cocked up. It also has a hole near each clew, “to let the Water off, that it may not lodge in the Bag of the Sail” (Lever).',
          lead: 'Each reef band runs from low on one leech up to the head near the same yardarm, so the two bands of a pair cross the outer corners of the sail.',
          extra: [[[-28, 27.2, 22.5], [yx, 25, yz - 0.5]]],
          sources: [steel(117, 4, 'sailmaking'), 'L 58', 'F SPRITSAIL'],
        },
        {
          id: 'jib-guys', group: 'occasional', name: 'Jibboom guys', also: 'guy pendents and falls',
          does: 'These are why the yard outlived its sail. The jibboom sticks out far beyond the bowsprit cap and has to be held sideways against the pull of the jib. A guy from its end straight back to the bows would make too narrow an angle to be any use. Led through a thimble on the spritsail yard first, it is spread wide: the yard is the spreader. Lever: “these are for supporting the Boom to Windward”.',
          cls: 'standing-rig',
          path: [
            fast([-72, 0.4, 60], 'The pendents go over the jibboom end.'),
            lead([yx, 22, yz + 0.2], '“The inner ends reeve through a thimble, on the quarters of the spritsail-yard.”'),
            block(guyBlock, 'Each is turned “into the strap of a double block”.'),
            block([8, side(8) + 0.4, 21.8], 'Its fall goes to a single block that “hooks to an eye-bolt, near the cat-head”.'),
            guess(belay([11.5, side(11.5), 22], 'It “leads in upon the fore-castle”. The fitting is not named.')),
          ],
          purchase: 'A double and a single block: 3 to 1 as described.',
          belay: inferred('Forecastle, by the cathead', 'On the forecastle near the cathead, each side (Steel). The fitting is not named.'),
          worked: 'Set up afresh whenever the yard is moved: coming on a wind, “The Spritsail is reefed, the Spritsail Yard topped up with the lee Brace, the Jib Guys set up” (Lever).',
          rope: 'Guy pendents, one pair, 4½ in.',
          notes: ['Lever adds travelling guys, spliced to the jib’s traveller and led through a second thimble on the yard, which support the jib’s tack wherever it is on the boom.'],
          sources: ['S 195', 'L 31', 'L 83', 'S74 31'],
        },
      ],
    });
  }

  // --- Sprit topsail ----------------------------------------------------------
  {
    const yx = -60, yz = 53.7, half = 20.25;
    const arm = [yx, half, yz], clew = [-36.6, 29.5, 42.6];
    add({
      id: 'sprit-topsail', mast: 'fore', title: 'The sprit topsail', start: 'halliard',
      cloth: [[[yx, -18.5, yz - 0.3], [yx, 18.5, yz - 0.3], clew, [-36.6, -29.5, 42.6]]],
      spars: [{ a: [yx, -half, yz], b: arm, w: 0.6 }, { a: [-36, -31, 42], b: [-36, 31, 42], w: 0.9 }],
      lines: [
        {
          id: 'halliard', group: 'yard', name: 'Halliard',
          does: 'Hoists the yard, though “hoist” here means outwards. The sprit topsail yard hangs under the jibboom and slides along it: “the sail is drawn out toward the extremity of the boom, in light winds, as any other topsail-yard is hoisted upon its mast” (Falconer).',
          mirror: false,
          path: [
            block([-68, 0.4, 57.7], 'A block is lashed under the outer part of the jibboom.'),
            block([yx, 0.4, yz + 0.3], 'The halliard reeves between it and a block on the yard: a gun-tackle purchase.'),
            lead([-18, 0.5, 34.6], 'The fall comes in over a saddle on the bowsprit.'),
            belay([6.5, 0.6, 22.5], 'To “the rack over the bowsprit”.'),
          ],
          purchase: 'A gun tackle: 2 to 1.',
          belay: period('Rack over the bowsprit', 'The rack over the bowsprit, at the fore end of the forecastle (Steel).'),
          notes: ['In East Indiamen, Lever says, the sail “is often set flying, with a very short Yard”, on a traveller on a jack-stay along the jibboom.'],
          sources: ['S 197', 'L 41', 'L 59', 'F SPRITSAIL', 'S74 31'],
        },
        {
          id: 'parrel', group: 'yard', name: 'Parrel', also: 'parral (Steel)',
          does: 'Holds the yard to the jibboom while letting it slide.',
          lead: 'A parral with ribs and trucks, round the jibboom.',
          sources: ['S 197', 'L 41'],
        },
        {
          id: 'braces', group: 'yard', name: 'Braces',
          does: 'Swing the yard. Single, and led like the spritsail’s.',
          path: [
            fast(arm, 'From the yardarm.'),
            block([16, 5.2, 68.4], 'Up to a block under the fore top, as the spritsail braces.'),
            block([26.5, 5.2, 68.4], 'Through another at the after part of the top.'),
            belay([52.4, 10, 21.5], 'Down to “the aft-part of the forecastle”. The fitting is not named.'),
          ],
          purchase: 'None: single.',
          belay: period('After part of forecastle', 'The after part of the forecastle, each side (Steel). The fitting is not named.'),
          sources: ['S 197', 'L 41', 'S74 31'],
        },
        {
          id: 'lifts', group: 'yard', name: 'Lifts',
          does: 'Hold the yardarms. Single.',
          path: [
            fast(arm, 'From the yardarm.'),
            lead([-72, 0.6, 60.2], 'Through a thimble at the jibboom end.'),
            bend([-39.6, 1.6, 47.4]),
            belay([6.5, 2, 22.5], 'In to the rack over the bowsprit.'),
          ],
          purchase: 'None: single.',
          belay: period('Rack over the bowsprit', 'The rack over the bowsprit (Steel).'),
          sources: ['S 197', 'L 41', 'S74 31'],
        },
        {
          id: 'sheets', group: 'sail', name: 'Sheets',
          does: 'Spread the clews to the spritsail yardarms, exactly as an ordinary topsail’s clews are sheeted to the yard below it.',
          path: [
            fast(clew, 'From the clew of the sail.'),
            lead([-36, 30.6, 42], 'To the spritsail yardarm.'),
            block([-34, 1.6, 42.6], 'In along the yard to a block lashed each side of the bowsprit.'),
            bend([-10, 5, 31]),
            guess(belay([10, 8, 19.2], 'In to the forecastle. The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle (Steel). The fitting is not named.'),
          notes: ['The spritsail’s running lifts can be unhooked from the cap and hooked to the sprit topsail’s clews to serve as its sheets (Steel, Lever).'],
          sources: ['S 196', 'S 219', 'L 59', 'S74 31'],
        },
        {
          id: 'clewlines', group: 'sail', name: 'Clewlines', also: 'clue-lines (Steel)',
          does: 'Haul the clews up to the yard. The sail has no reefs and is laced to its yard.',
          path: [
            fast(clew, 'From the clew of the sail.'),
            guess(block([yx, 3, yz - 0.2], 'To a block on the yard near the slings, as the spritsail’s.')),
            bend([-39.6, 2.4, 47.4]),
            guess(belay([10, 5, 19.2], 'In to the forecastle. The fitting is not named.')),
          ],
          belay: inferred('Forecastle, fore end', 'On the forecastle, as the spritsail’s. The fitting is not named.'),
          sources: ['S 219', 'L 59', 'S74 31'],
        },
      ],
    });
  }
})();
