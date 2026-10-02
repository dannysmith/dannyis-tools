// The studding sails of a 74: fore lower, fore and main topmast, fore and main
// topgallant. Each is drawn set on the starboard side as the weather studding
// sail, abaft its square sail, with its boom rigged out. None of this gear is
// permanently rove; it is rigged for the occasion and unrove afterwards.
//
// Spar lengths are Steel's (1794, p. 49). How far each boom is rigged out, and
// so where its end comes, is not given by Steel or Lever and is an estimate.

(function () {
  const { MASTS, SAILS, shape, footZ } = window.RIGDATA;

  const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

  // Steel's booms and studding sail yards, in feet.
  const SPARS = {
    fore: { boom: 42.5, yard: 24.5, tgBoom: 31, tgYard: 17.75 },
    main: { boom: 48.5, yard: 27.25, tgBoom: 35, tgYard: 20 },
  };
  const LOWER = { boom: 53.75, yard: 31 };

  const TOTTEN = 'X Totten, Naval Text-Book (US Navy, 1862), §§487–498|https://archive.org/details/cu31924030898583';
  const NARES = 'X Nares, Seamanship (Royal Navy, 1860s)|https://archive.org/details/seamanshipinclu00naregoog';
  const DANA = 'X Dana, The Seaman’s Friend (American merchant service, 1841)|https://gutenberg.org/files/40958/40958-h/40958-h.htm';
  const STEEL_335 = 'X Steel 1794, p. 335|https://maritime.org/doc/steel/part10.htm#pg335';
  const STEEL_35 = 'X Steel 1794, p. 35|https://maritime.org/doc/steel/part1.htm#pg35';

  // The square sail a studding sail is set beside, as an outline only: the
  // polygon runs round the sail and back again, so it encloses nothing and
  // hides nothing behind it.
  function squareSail(m, tier) {
    const S = shape(m, tier), x = m.x - 2;
    const foot = [0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75].map((f) => [x, S.clewY * f, footZ(S, S.clewY * f)]);
    const round = [[x, -S.headY, S.headZ], [x, S.headY, S.headZ], [x, S.clewY, S.clewZ], ...foot, [x, -S.clewY, S.clewZ]];
    return round.concat([round[0]], round.slice(1).reverse());
  }

  const yardSpar = (m, z, half, w) => ({ a: [m.x - 1.5, -half, z], b: [m.x - 1.5, half, z], w });

  // Where the topmast studding sail boom lies when rigged out. Steel puts the
  // inner boom iron a third of the boom's length in from the yardarm; the heel
  // is drawn just inside it, which is as far as the boom can go.
  function topmastBoom(m) {
    const len = SPARS[m.key].boom, x = m.x - 2.2, z = m.yardZ + 0.8;
    const innerIron = m.yardHalf - len / 3;
    return { x, z, innerIron, heel: [x, innerIron - 1.5, z], end: [x, innerIron - 1.5 + len, z] };
  }

  // --- Topmast studding sail ----------------------------------------------
  function topmast(m) {
    const fore = m.key === 'fore', adj = m.key;
    const x0 = m.x, yx = m.x - 1.5, sx = m.x - 1.7;
    const L = SPARS[adj];
    const B = topmastBoom(m);
    const lower = m.lowerYard;

    const jewel = [yx, m.tyHalf + 0.4, m.tyZ - 0.9];
    const armIn = [sx, m.tyHalf + 0.3 - L.yard / 3, m.tyZ - 2.6];
    const armOut = [sx, armIn[1] + L.yard, m.tyZ - 4.6];
    const bend = lerp(armIn, armOut, 1 / 3);
    const tackClew = [sx, B.end[1] - 0.9, m.yardZ + 2.6];
    const sheetClew = [sx, m.yardHalf - 5, m.yardZ + 3.4];
    const leechThimble = lerp(armOut, tackClew, 0.5);

    const halliards = {
      id: 'halliards',
      group: 'sail',
      name: 'Halliards',
      also: 'haliards (Steel), halliards (Lever), halyards (modern)',
      does: 'Hoist the studding sail by its yard to the topsail yardarm and hold it there. The whole sail hangs from this one rope. A studding sail yard has no parrel, no lifts and no braces: it is a light spar that goes up and down with the sail bent to it.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: bend, mark: 'fast', step: 'Bent to the studding sail yard “about one third from the inner Arm, with a Fisherman’s Bend” (Lever). With two thirds of the yard outside the bend, the outer end hangs a little lower than the inner.' },
        { p: jewel, mark: 'block', step: 'Up through the jewel block at the very end of the topsail yard: a small block “strapt with a thimble through an eye-bolt in the extremities of the topsail-yards” (Steel).' },
        { p: [x0 - 0.3, 1.6, m.tmCapZ - 1.6], mark: 'block', step: 'In along the yard and up to “a block in the span round the topmast-head, under the cap” (Steel). Lever hooks the block to an eye-bolt in the topmast cap; it is the same place.' },
        { p: [x0 + 1.2, 3.4, m.topZ], mark: 'lead', inferred: true, step: 'Down the mast. Neither says how it passes the top; it is drawn through the lubber’s hole.' },
        fore
          ? { p: [24.5, 2.4, 19.5], mark: 'belay', step: '“The other end leads down upon deck, and belays to the bowline-bitts” (Steel).' }
          : { p: [102.6, 2.4, 19.5], mark: 'belay', inferred: true, step: 'On deck. Steel’s one sentence covers both masts and names only “the bowline-bitts”, which are on the forecastle. For the mainmast I have drawn the bitts abaft it on the quarterdeck, which is a guess.' },
      ],
      purchase: 'None. It is a single rope through two blocks, so the men haul the weight of the sail and its yard directly.',
      belay: fore
        ? { short: 'Bowline bitts', level: 'weather', status: 'period', text: 'The bowline bitts on the forecastle, which I take to be the pair abaft the foremast. Steel names them in his text, which is written round a 20-gun ship; nothing I read gives the point for a 74 separately.' }
        : { short: 'Quarterdeck, abaft the mast', level: 'weather', status: 'inferred', text: 'Not given for the mainmast. Drawn at the bitts abaft the mainmast on the quarterdeck, by analogy with the fore.' },
      worked: 'Hoisted in two stages when the sail is set: first far enough to bring the sail to the man on the ' + lower + ', and then, once the tack is out, all the way up. Lowered as the downhauler is hauled when the sail comes in. Afterwards the end is unrove from the jewel block, a figure-of-eight knot is cast in it and it is “rounded up to the Span Block at the Topmast Cap”, so that it cannot “prevent the Topsail Yard’s coming down” (Lever).',
      rope: fore ? '3½ in.' : null,
      notes: ['Steel’s definition: “Jewel-blocks. Small blocks, seized to eye-bolts in the extremities of the upper yards, for hoisting the studding-sails by the haliards.”'],
      sources: ['S 218', 'L 65', 'L 80', 'L 83', 'S74 33'],
    };

    const tack = {
      id: 'tack',
      group: 'sail',
      name: 'Tack',
      does: 'Hauls the outer lower corner of the sail out to the end of the boom. On a studding sail the tack is always the rope at the outer corner of the foot and the sheet the rope at the inner corner, whichever side the sail is set.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: tackClew, mark: 'fast', step: 'Bent “to the outer lower clue of the sail” (Steel).' },
        { p: [B.x, B.end[1] - 0.3, B.z + 0.7], mark: 'block', step: 'Out through the tack block, which is strapped to the upper side of the boom at its outer end.' },
        fore
          ? { p: [62, 20.6, 20.2], mark: 'block', step: 'Aft and down to “a block at the gangway” (Steel); Lever has “a Block lashed to a Timber Head in the Waist”. How far along the gangway is not said. From astern the rope is cut short here; it runs off towards you.' }
          : { p: [172, 17.4, 28.5], mark: 'block', step: 'Aft and down to “a block lashed upon the quarter” (Steel), the after corner of the ship. From astern the rope is cut short; it runs off towards you.' },
        fore
          ? { p: [65.5, 20.5, 20.7], mark: 'belay', step: '“And belay to a timber-head” (Steel).' }
          : { p: [166, 17.2, 26.6], mark: 'belay', inferred: true, step: 'It “leads in upon the after-part of the quarter-deck” (Steel). His ship has no poop; on a 74 I have drawn it on the poop at the side, which is a guess.' },
      ],
      purchase: 'None: a single rope.',
      belay: fore
        ? { short: 'Timber-head, gangway', level: 'weather', status: 'period', text: 'A timber-head at the gangway, in the waist. Steel and Lever agree on the place and the fitting.' }
        : { short: 'Poop, at the side', level: 'weather', status: 'inferred', text: 'Steel: “in upon the after-part of the quarter-deck through a block lashed upon the quarter”. Lever: “through a Block on the Quarter”. Neither names the fitting, and Steel’s 20-gun ship has no poop.' },
      worked: 'Hauled out before the sail is hoisted. Nares, half a century later, gives the reason: “The tack is hauled out first, as the sail then holding less wind brings less strain on the boom.” In taking in it is the last thing eased, after the downhauler has brought the yard down to the boom end.',
      rope: fore ? '3½ in.' : null,
      notes: [
        'The tack leads to the ship, not to the yard, so when the ' + lower + ' is braced forward the tack has to be eased by the same amount. Lever: “it is not always that the Tack can be eased in Proportion: if it be too much so, it is difficult to haul out again, and if not enough, the Boom is liable to be carried away by the Strain”.',
        'His cure, for ships on long voyages: “It is sometimes the Practice to lead the Topmast Studding Sail Tacks like Topsail Sheets”, through a block on the lower yard and another further in, so that the tack moves with the yard.',
      ],
      sources: ['S 218', 'L 64', 'L 65', 'L 81', NARES, 'S74 33'],
    };

    const sheetNote = 'Steel’s rigging text describes something different: the sheets “are doubled; the bight is put through the lower inner clue”, with a fore sheet and an after sheet. “The after-sheet of the fore-topmast-studdingsail leads in abaft the fore-shrouds. The main hauls in upon the waist. The fore-sheet of the fore-topmast-studdingsail leads in upon the forecastle; the after one before the shrouds.” The last clause contradicts the first. His seamanship pages (p. 335) speak of “the deck sheet” and “the yard sheet”, as Lever does, and the drawing follows that.';

    const deckSheet = {
      id: 'deck-sheet',
      group: 'sail',
      name: 'Deck sheet',
      also: 'the long leg of the sheet; “fore-sheet” in Steel’s rigging text',
      does: 'One of two ropes on the inner lower corner of the sail. The deck sheet is the long one, and its job is to get the sail down: when the sail is taken in, the men on deck gather it in by this rope. While the sail is set it has little to do.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: sheetClew, mark: 'fast', step: 'The sheet is bent to the inner clew “with a long and short Leg”. This is the long leg.' },
        fore
          ? { p: [14.5, 14.6, 20.6], mark: 'belay', inferred: true, step: '“The long Leg leads down before the lower Yard” (Lever) to the forecastle. Where it is made fast there is not said.' }
          : { p: [91, 19.6, 20.4], mark: 'belay', inferred: true, step: '“The long Leg leads down before the lower Yard” (Lever). Steel says the main one “hauls in upon the waist”. Where it is made fast is not said.' },
      ],
      purchase: 'None: a single rope.',
      belay: fore
        ? { short: 'Forecastle, at the side', level: 'weather', status: 'inferred', text: 'On the forecastle. Steel says it “leads in upon the forecastle” and Lever gathers the sail “on the Forecastle by the Deck Sheet”. Neither names a fitting.' }
        : { short: 'Waist, at the side', level: 'weather', status: 'inferred', text: 'Steel: the main “hauls in upon the waist”. Drawn at the after end of the gangway; which deck the men stood on, and what it was made fast to, is not said.' },
      worked: 'It leads down before the ' + lower + ' while the sail is set. To take the sail in with the wind on the quarter, “a hand is sent on the ' + (fore ? 'Fore' : 'Main') + ' Yard to pass the Deck Sheet abaft the Yard”, so that the sail comes down abaft the yard and clear of the ' + (fore ? 'foresail' : 'mainsail') + '. “When this Sail is taken in with the wind very large, it is hauled down forward, the Deck Sheet and Down-hauler being passed before the Yard” (Lever).',
      rope: fore ? '3 in.' : null,
      notes: [sheetNote],
      sources: ['L 65', 'L 83', 'S 218', STEEL_335, 'S74 33'],
    };

    const yardSheet = {
      id: 'yard-sheet',
      group: 'sail',
      name: 'Yard sheet',
      also: 'short sheet (later manuals)',
      does: 'The sheet that does the work while the sail is set. It holds the inner lower corner of the sail down to the ' + lower + ', so the foot is stretched between the yard at one end and the boom at the other.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [sx, sheetClew[1] - 1, sheetClew[2] - 1.3], mark: 'fast', step: 'The short leg of the sheet “has a Thimble spliced in its End, and the Yard Sheet … is bent to it” (Lever). A man on the ' + lower + ' bends it on as the sail comes up to him.' },
        { p: [yx, m.yardHalf * 0.75, m.yardZ + 1], mark: 'block', step: 'Through a block at the outer quarter of the ' + lower + '.' },
        { p: [yx, m.yardHalf * 0.2, m.yardZ + 1], mark: 'block', step: 'In along the yard to “a Block in the inner Quarter of the lower Yard”.' },
        { p: fore ? [x0 - 1.6, 5, 18.6] : [x0 - 1.4, 5, 18.6], mark: 'belay', inferred: true, step: 'Down to the deck, where “the Men on Deck” haul it (Lever). Where it is made fast is not said; it is drawn near the foot of the mast.' },
      ],
      purchase: 'None: a single rope.',
      belay: { short: 'On deck, near the mast', level: 'weather', status: 'inferred', text: 'Not given. Lever says only that it is hauled from the deck. The later manuals make the short sheet fast in the top instead.' },
      worked: 'Hauled once the sail is hoisted. It is the first thing eased when the sail is taken in: “ease off the yard sheet, and haul the yard close out to the tack block” (Steel). In small ships it has a second use. Before the sail is set it “is made fast to the Heel-lashing of the Boom, and the Men on Deck hauling upon it, launch it out” (Lever); a man-of-war uses a boom tackle for that.',
      notes: [sheetNote],
      sources: ['L 64', 'L 65', 'L 80', STEEL_335],
    };

    const downhauler = {
      id: 'downhauler',
      group: 'sail',
      name: 'Downhauler',
      also: 'downhaul, down-hauler, downhaller',
      does: 'Takes the sail in. It runs from the outer end of the studding sail yard, down the outer edge of the sail through a thimble, to a block at the outer lower corner, and then to the deck. Hauling it pulls the outer yardarm down the leech to the tack, and the sail folds up on itself at the boom end before anything is let go that might let it blow away.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [armOut[0], armOut[1] - 0.6, armOut[2] + 0.1], mark: 'fast', step: 'Made fast “to the topmast-studdingsail-yard, just within the earing” (Steel): the outer yardarm.' },
        { p: leechThimble, mark: 'lead', step: 'Down through a thimble in a cringle worked “half way up the outer Leech” (Lever). This keeps the rope to the edge of the sail, so that it gathers the leech as it comes.' },
        { p: [sx, tackClew[1] - 0.5, tackClew[2] + 0.6], mark: 'block', step: 'Through “a block lashed to the outer clue of the sail” (Steel), the tack clew at the boom end.' },
        fore
          ? { p: [56.5, 18, 20], mark: 'belay', inferred: true, step: 'It “leads into the waist” (Steel). The fitting is not named; it is drawn at the fore end of the gangway. From astern the rope is cut short.' }
          : { p: [99, 19.5, 19.6], mark: 'belay', inferred: true, step: 'In to the deck. Steel says the downhauler “leads into the waist” without distinguishing the masts; the main one is drawn at the fore end of the quarterdeck, which is a guess.' },
      ],
      purchase: 'None: a single light rope.',
      belay: fore
        ? { short: 'Waist (fitting not named)', level: 'weather', status: 'inferred', text: 'Steel: it “leads into the waist”. Neither he nor Lever names what it is made fast to.' }
        : { short: 'Quarterdeck, at the side', level: 'weather', status: 'inferred', text: 'Not given separately for the mainmast.' },
      worked: 'Slack while the sail is set. To take the sail in: “the Down-hauler is then manned, the Halliards are lowered, the Yard Sheet eased, and the Down-hauler hauled on, till the Yard Arm comes down to the Tack Clew: the Tack is then eased off, and the Sail hauled down” (Lever). Steel: “haul the yard close out to the tack block; then ease away the tack; and haul down both upon the deck sheet and downhaul”.',
      rope: fore ? '2 in.' : null,
      notes: ['Steel and Lever describe the same lead from opposite ends. Steel reeves it from the deck: through the clew block, through the thimble, made fast to the yard.'],
      sources: ['S 218', 'L 65', 'L 83', STEEL_335, 'S74 33'],
    };

    // The boom and what holds it.
    const boomTackle = {
      id: 'boom-tackle',
      group: 'yard',
      name: 'Boom tackle',
      also: 'in-and-out jigger (later manuals)',
      does: 'Runs the boom out along the ' + lower + ' and in again. The boom lives on the yard, lashed down, with its heel towards the mast. To rig it out, a tackle between the heel and the inner boom iron draws the heel outwards until the two blocks meet.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [B.x, B.innerIron, B.z + 0.5], mark: 'block', step: 'The single block is made fast “to the boom-iron” (Steel). He does not say which of the two; it has to be the inner one for the tackle to pull the heel outwards.' },
        { p: [B.x, B.heel[1], B.z + 0.5], mark: 'block', step: '“The strap of the double-block makes fast through a hole in the heel of the boom.” The boom is drawn rigged out, so the blocks have come together.' },
        { p: [yx, 3, m.yardZ + 1.2], mark: 'belay', inferred: true, step: '“And the fall leads along the yard.” Steel stops there. Whether the men on the yard haul it, or it goes to the deck, he does not say.' },
      ],
      purchase: 'A double and a single block, 8 inches, in Steel’s table for the 74: 3 or 4 to 1 depending on which block the fall leaves from.',
      belay: { short: 'On the yard', level: 'aloft', status: 'inferred', text: 'Not given. Steel says only that “the fall leads along the yard”.' },
      worked: 'At the order to rig out. “In Men of War, [the boom] is launched out by a Boom-tackle”; in small ships the yard sheet does the same job, and “when the Boom is small, it is first launched out by Hand” (Lever). To rig the boom in, the later manuals shift the tackle end for end.',
      notes: ['How far out the boom goes is not stated by Steel or Lever. The later manuals say it is rigged out “to the mark”. The drawing puts the heel just inside the inner iron, which is the furthest it can go and still be held by both.'],
      sources: ['S 218', 'L 64', 'L 80', 'S74 33', TOTTEN],
    };

    const heelLashing = {
      id: 'heel-lashing',
      group: 'yard',
      name: 'Boom irons and heel lashing',
      does: 'Hold the boom on the yard. The boom slides through two iron rings standing up from the ' + lower + ', and its inner end is lashed down to the yard so that it cannot slide out further or lift.',
      mirror: false,
      views: ['aft'],
      extra: [
        [B.heel, [yx, B.heel[1] - 0.4, m.yardZ]],
        [[B.x, B.innerIron, B.z + 1], [yx, B.innerIron, m.yardZ]],
        [[B.x, m.yardHalf, B.z + 1], [yx, m.yardHalf, m.yardZ]],
      ],
      lead: 'A boom iron is “two flat iron rings formed into one piece, one above the other … the lower ring is the largest, and is driven on the yard” (Steel). The outer one is on the very end of the yardarm. The inner one is a strap shrunk round the yard “at one-third the length of the topmast studding-sail boom” in from it. Both stand at 45 degrees, “between the upper and fore side” of the yard, so the boom lies on the yard’s forward upper quarter, clear of the sail bent below. Once the boom is out, “the Heel is secured by a Lashing” (Lever).',
      worked: 'Cast off to rig the boom out or in, and passed again as soon as it is in place. With the boom rigged in along the yard, the same lashing holds it there. Rigged in, the boom lies across the place where men stand to reef or furl the course, and the later manuals trice its heel up out of their way first.',
      notes: ['Lever: large ships have the inner iron; smaller vessels have a wooden saddle there instead.'],
      sources: [STEEL_35, 'L 33', 'L 64'],
    };

    const boomToppingLift = {
      id: 'boom-topping-lift',
      group: 'occasional',
      name: 'Boom topping lift',
      also: 'the top burton on the boom',
      does: 'Holds the outer end of the boom up. The boom is a light spar with more than half its length standing out beyond the yardarm, and it carries the tack of one sail and, on the foremast, the whole weight of another: the lower studding sail hangs from its end. Lever: “This answers the same purpose that the Lifts do to the lower Yards.”',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [B.x, B.end[1] - 0.6, B.z + 0.4], mark: 'fast', step: 'A “Topping-lift Pendent” goes over the boom end before the boom is run out, “having a Thimble spliced in the end”.' },
        { p: [B.x + 0.6, B.end[1] - 9, B.z + 10], mark: 'lead', inferred: true, step: 'The lower block of the top burton tackle hooks into the thimble. How long the pendent is, and so where this comes, is not given.' },
        { p: [x0 + 0.3, 2.6, m.crossZ - 5], mark: 'block', inferred: true, step: 'The burton’s upper block is on “its own Pendent”, which hangs from the topmast head. Its length is not given either.' },
        { p: [x0 + 1.6, 6.4, m.topZ + 1.2], mark: 'belay', inferred: true, step: 'The tackle is “bowsed taught”. Lever does not say where the fall goes. It is drawn to the top, where Steel sets up his version.' },
      ],
      purchase: 'A burton: Lever names its double block and its single one.',
      belay: { short: 'In the top', level: 'aloft', status: 'inferred', text: 'Not given by Lever. Steel’s topping lift “sets up in the top by its fall”.' },
      worked: 'Put on before the boom is rigged out and before any sail is set on it. Steel is firm about the order: “This should be done before the sail is set.”',
      notes: [
        'Steel’s version is different. In the rigging text: “On the middle of the boom is fastened a selvagee, or a strap with a thimble, to which is hooked the top-burton-tackle, to support the boom in the middle.” And under necessary ropes, a topping lift “to support the topmast-studdingsail-boom in a gale of wind, is a pendent clinched round the middle of the boom, then led up through a block lashed to the topmast-cap … and a tackle hooked therein; sets up in the top by its fall.” So Steel lifts the boom from its middle and Lever from its end. The drawing follows Lever.',
      ],
      sources: ['L 64', 'L 80', 'S 218', 'S 235'],
    };

    const boomBrace = {
      id: 'boom-brace',
      group: 'occasional',
      name: 'Boom brace',
      does: 'Holds the boom end back against the pull of the sails on it. Lever puts it on “for the better security of the Boom when it blows fresh”.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [B.x, B.end[1] - 1.2, B.z], mark: 'fast', step: '“Over the Boom end there is a Pendent, with a Block spliced in for a Brace to reeve through” (Lever).' },
        { p: [B.x + 3, B.end[1] - 2, B.z - 2], mark: 'block', step: 'The block at the end of the pendent.' },
        { p: fore ? [70, 20.6, 20.6] : [128, 20.6, 20.6], mark: 'belay', inferred: true, step: 'Lever does not say where the brace leads or where its standing part is made fast. It must go aft; it is drawn to the ship’s side abaft the mast as a guess. From astern the rope is cut short.' },
      ],
      purchase: 'A whip, if the standing part is made fast in the ship. That is my reading of a pendent with a block in it.',
      belay: { short: 'At the side, further aft', level: 'weather', status: 'inferred', text: 'Not given in anything I read.' },
      worked: 'Set taut once the sail is set. It has to be tended with the tack whenever the yards are braced.',
      notes: ['Steel’s rigging text does not mention a boom brace. Lever wants “a stout Brace always reeved” in ships that carry these sails in a fresh breeze.'],
      sources: ['L 64', 'L 81'],
    };

    const yardBurton = {
      id: 'yard-burton',
      group: 'occasional',
      name: 'Burton on the topsail yard',
      also: 'top-burton-tackle; preventer lift',
      does: 'Holds up the topsail yard on the side where the studding sail hangs. The studding sail and its yard hang from the very end of the topsail yard, which was not made to carry weight there. The burton “acts as a Preventer Lift, and keeps the Topsail Yard from sagging down by the Weight of the Topmast Studding Sail” (Lever).',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [yx, m.tyHalf * 0.5, m.tyZ + 0.6], mark: 'fast', step: 'The single block hooks “to a Selvagee on the Topsail Yard at the second quarter” (Lever). Steel has it “round the outer quarter”.' },
        { p: [x0 - 0.2, 2, m.tmCapZ + 0.3], mark: 'block', step: 'The double block hooks “to an Eye Bolt in the Topmast Cap”.' },
        { p: [x0 + 1.4, 4.4, m.topZ], mark: 'lead', inferred: true, step: 'Steel’s burtons are “swayed tight by their fall upon deck”. The way down is not described.' },
        { p: [x0 + 2.6, 5.6, 18.6], mark: 'belay', inferred: true, step: 'On deck near the mast. The place is not named.' },
      ],
      purchase: 'A burton, with a double block at the cap and a single one on the yard.',
      belay: { short: 'On deck, near the mast', level: 'weather', status: 'inferred', text: 'Steel: “swayed tight by their fall upon deck”. No fitting is named.' },
      worked: 'Hooked on and set up before the studding sail is hoisted, and taken off after it is in. Totten’s last order in taking in is “Take the burton off the topsail yard!”',
      notes: ['The other top burton goes to the boom as its topping lift. A topmast has a burton pendent on each side, so one side’s pair serves one side’s studding sail.'],
      sources: ['L 80', 'L 83', 'S 235', TOTTEN],
    };

    const lines = [halliards, tack, deckSheet, yardSheet, downhauler, boomTackle, heelLashing, boomToppingLift, boomBrace, yardBurton];

    return {
      id: `${adj}-topmast-studding-sail`,
      mast: adj,
      title: `The ${adj} topmast studding sail`,
      views: ['aft'],
      aftBox: [-(m.yardHalf + 3), -(m.tmCapZ + 5), m.yardHalf + 3 + B.end[1] + 6, m.tmCapZ + 5],
      cloth: [squareSail(m, 'topsail'), [armIn, armOut, tackClew, sheetClew]],
      spars: [
        yardSpar(m, m.yardZ, m.yardHalf, 1.3),
        yardSpar(m, m.tyZ, m.tyHalf, 1),
        { a: B.heel, b: B.end, w: 0.75 },
        { a: armIn, b: armOut, w: 0.45 },
      ],
      lines,
      start: 'halliards',
      notice: `
        <h2>What to notice</h2>
        <h3>The head hangs from the yard above and the foot is spread by the yard below</h3>
        <p>The studding sail’s own yard is hoisted to the end of the topsail yard. Its foot is spread by a boom run out from the ${lower}. So the topmast studding sail boom is on the lower yard: booms are named for the sail, not for the yard they lie on.</p>
        <h3>Tack outside, sheet inside</h3>
        <p>The tack goes to the boom end and then to the ship. The sheet has two legs: a short one to the ${lower}, which holds the clew while the sail is set, and a long one to the deck, which brings the sail in.</p>
        <h3>The downhauler folds the sail before it comes down</h3>
        <p>It runs from the outer yardarm down the leech to the tack clew. Hauled as the halliards are lowered, it brings the yard down to the boom end, and only then is the tack let go.</p>
        <h2>Where the sources go quiet</h2>
        <ul>
          <li><b>How far the boom is rigged out</b> is not stated. The drawing puts its heel at the inner boom iron.</li>
          <li><b>The sheets.</b> Steel’s rigging text has a fore and an after sheet; his seamanship pages and Lever have a deck sheet and a yard sheet.</li>
          <li><b>Belaying points</b> are named only for the halliards and the tack. The rest are “in the waist” or “on the forecastle” or nothing.</li>
          <li><b>The boom brace</b> has no lead in Lever and is not in Steel’s text at all.</li>
        </ul>`,
    };
  }

  // --- Topgallant studding sail -------------------------------------------
  function topgallant(m) {
    const fore = m.key === 'fore', adj = m.key;
    const x0 = m.x, yx = m.x - 1.5, sx = m.x - 1.7, bx = m.x - 2.1;
    const L = SPARS[adj];
    const boomZ = m.tyZ + 0.6;
    const heel = [bx, m.tyHalf - L.tgBoom / 3 - 1, boomZ];
    const end = [bx, heel[1] + L.tgBoom, boomZ];

    const jewel = [yx, m.tgHalf + 0.4, m.tgZ - 0.8];
    const armIn = [sx, m.tgHalf + 0.3 - L.tgYard / 3, m.tgZ - 2.2];
    const armOut = [sx, armIn[1] + L.tgYard, m.tgZ - 3.6];
    const bend = lerp(armIn, armOut, 1 / 3);
    const tackClew = [sx, end[1] - 0.8, m.tyZ + 2.2];
    const sheetClew = [sx, m.tyHalf - 3.5, m.tyZ + 2.8];
    const top = (y, dz) => [x0 + 1.4, y, m.topZ + (dz || 1)];

    const halliards = {
      id: 'halliards',
      group: 'sail',
      name: 'Halliard',
      also: 'haliard (Steel), halliards (Lever)',
      does: 'Hoists the topgallant studding sail by its yard to the end of the topgallant yard. It is the topmast studding sail’s halliard over again, one mast section higher and with lighter rope.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: bend, mark: 'fast', step: 'Bent to the studding sail yard “about one third from the inner Arm” (Lever).' },
        { p: jewel, mark: 'block', step: 'Through the jewel block “at the extremities of the topgallant-yards” (Steel).' },
        { p: [x0 - 0.3, 1.2, m.tgHoundZ + 1.5], mark: 'block', step: 'Through “a block seized round the head of the topgallant-mast, above the hounds, or rigging” (Steel). Lever has it in a span.' },
        { p: top(3), mark: 'belay', step: '“The other end leads down the mast into the top, and belays there” (Steel).' },
      ],
      purchase: 'None: a single rope.',
      belay: { short: `In the ${adj} top`, level: 'aloft', status: 'period', text: `In the ${adj} top. Steel gives the place and not the fitting.` },
      worked: 'Hoisted by the men in the top once the tack is out. When the sail is in, the end is unrove from the jewel block and “rounded up to the Span Block at the Top Gallant Mast Head”, so that it “may not impede the lowering of the Top Gallant Yard” (Lever).',
      rope: fore ? '2 in.' : null,
      notes: [],
      sources: ['S 219', 'L 65', 'L 82', 'S74 34'],
    };

    const tack = {
      id: 'tack',
      group: 'sail',
      name: 'Tack',
      does: 'Hauls the outer lower corner out to the end of the topgallant studding sail boom, which is run out along the topsail yard.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: tackClew, mark: 'fast', step: 'Bent “to the outer lower-clue of the sail” (Steel).' },
        { p: [bx, end[1] - 0.3, boomZ + 0.5], mark: 'lead', step: 'Through a thimble strapped to the end of the boom. There is no block: “there is no Rigging to this Boom, but a thimble … for the Top Gallant Studding Sail Tack” (Lever).' },
        { p: top(m.topHalf - 1.6), mark: 'belay', step: 'In and down to the top, where it is “belayed in the Top” (Lever). The drawing follows Lever. Steel takes it to the deck instead.' },
      ],
      purchase: 'None.',
      belay: { short: `In the ${adj} top`, level: 'aloft', status: 'period', text: fore ? 'In the fore top, according to Lever (1808). Steel (1794) leads the fore one aft to the main chains.' : 'In the main top, according to Lever (1808): “the Top-Gallant one is belayed in the Main Top”. Steel (1794) leads the main one to the quarter-piece, at the stern.' },
      worked: 'Rove through the thimble before the boom is run out, and its end taken into the top to be bent to the sail there. Hauled out before the sail is hoisted, and eased as the sail is hauled down.',
      rope: fore ? '2 in.' : null,
      notes: [
        'Steel and Lever disagree. Steel: it “leads aft the tack of the fore-topgallant-studdingsail to the main-chains. The main leads to the quarter-piece.” Lever, fourteen years later, stops both in their tops. A tack led to the deck has to be tended every time the yards are braced; one that stops in the top does not go so far.',
        'Steel’s sentence has the tack reeve “through a thimble in a strap round the outer end of the topmast-studdingsail-boom”. He must mean the topgallant studding sail boom, which he has just said “slides out at the extremities of the topsail-yards”.',
      ],
      sources: ['S 219', 'L 64', 'L 65', 'L 81', 'S74 34'],
    };

    const sheets = {
      id: 'sheets',
      group: 'sail',
      name: 'Sheets',
      does: 'Hold the inner lower corner. The sheet is one rope middled, so it has two ends: one made fast to the topsail yard, which holds the clew while the sail is set, and one led to the top, by which the sail is hauled down.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: sheetClew, mark: 'fast', step: 'The sheets “are doubled; the bight is put through the lower-inner-clue of the sail” (Steel), and the two ends passed through the bight.' },
        { p: [x0 + 0.8, m.topHalf - 0.6, m.topZ + 2.6], mark: 'belay', step: 'One end “leads into the top, and belays to the topmast-shrouds”.' },
      ],
      extra: [[sheetClew, [yx, m.tyHalf * 0.6, m.tyZ + 0.5]]],
      purchase: 'None.',
      belay: { short: 'Topmast shrouds, in the top', level: 'aloft', status: 'period', text: 'Hitched to the topmast shrouds, in the top. The other end “leads forward, and makes fast to the quarter of the topsail-yard” (Steel). Lever agrees: “one end is led into the Top, and the other made fast to the Topsail Yard.”' },
      worked: 'The sheet is what brings this sail in. The topgallant studding sails “are taken in by lowering the Halliards, hauling down upon the Sheet, and easing off the Tack” (Lever).',
      rope: fore ? '2 in.' : null,
      notes: [],
      sources: ['S 219', 'L 65', 'L 82', 'S74 34'],
    };

    const downhauler = {
      id: 'downhauler',
      group: 'occasional',
      name: 'Downhauler',
      does: 'Hauls the outer yardarm down, as on the topmast studding sail. On a sail this small it was often left off.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [armOut[0], armOut[1] - 0.5, armOut[2] + 0.1], mark: 'fast', step: 'It “makes fast to the outer yard-arm within the earing” (Steel).' },
        { p: top(5.6), mark: 'belay', step: '“And leads down into the top.” Steel gives no thimble or clew block for this one.' },
      ],
      purchase: 'None.',
      belay: { short: `In the ${adj} top`, level: 'aloft', status: 'period', text: 'In the top. The fitting is not named.' },
      worked: 'Hauled as the halliard is lowered.',
      rope: fore ? '1½ in.' : null,
      notes: ['Lever: “There is seldom any Down-hauler to this Sail; but if there be, it is bent like that of the Topmast Studding Sail.” Steel’s text describes one and his table for the 74 lists two, one a side.'],
      sources: ['S 219', 'L 65', 'S74 34'],
    };

    const heelLashing = {
      id: 'heel-lashing',
      group: 'yard',
      name: 'Boom iron and heel lashing',
      does: 'Hold the topgallant studding sail boom on the topsail yard. This boom has no tackle, no brace and no lift.',
      mirror: false,
      views: ['aft'],
      extra: [
        [heel, [yx, heel[1] - 0.4, m.tyZ]],
        [[bx, m.tyHalf, boomZ + 0.8], [yx, m.tyHalf, m.tyZ]],
      ],
      lead: 'The boom “rests in the Iron in the Topsail Yard Arm, and the Heel is secured to the Yard with a Lashing” (Lever). Steel says of topsail yards that “in the navy they are mostly fitted with a boom-ring, and a sprig-eye-bolt driven in the middle of their ends”.',
      worked: 'The boom “is rigged out by Hand, by Men on the Topsail Yard” (Lever), and the heel lashed. When the sail is in, the booms are “run in and lashed to the Topsail Yards by the Heel lashing, or lowered down on Deck”.',
      notes: ['How far out the boom goes is not stated. It is drawn in the same proportion as the boom below.'],
      sources: ['L 64', 'L 81', 'L 82', STEEL_35],
    };

    return {
      id: `${adj}-topgallant-studding-sail`,
      mast: adj,
      title: `The ${adj} topgallant studding sail`,
      views: ['aft'],
      aftBox: [-(m.tyHalf + 3), -(m.tgHoundZ + 7), m.tyHalf + 3 + end[1] + 6, m.tgHoundZ + 7 - (m.topZ - 9)],
      cloth: [squareSail(m, 'topgallant'), [armIn, armOut, tackClew, sheetClew]],
      spars: [
        yardSpar(m, m.tyZ, m.tyHalf, 1),
        yardSpar(m, m.tgZ, m.tgHalf, 0.7),
        { a: heel, b: end, w: 0.55 },
        { a: armIn, b: armOut, w: 0.35 },
      ],
      lines: [halliards, tack, sheets, downhauler, heelLashing],
      start: 'halliards',
      notice: `
        <h2>What to notice</h2>
        <h3>It is worked from the top</h3>
        <p>The halliard, the downhauler and one end of the sheet stop in the ${adj} top, and in Lever the tack does too. The sail is kept there, made up, and is set and taken in by the topmen without anyone on deck touching a rope.</p>
        <h3>The boom has no gear</h3>
        <p>It is run out by hand along the topsail yard and its heel lashed. A thimble at its end takes the tack.</p>
        <h2>Where the sources disagree</h2>
        <ul>
          <li><b>The tack.</b> To the deck in Steel (1794), to the top in Lever (1808). The drawing follows Lever.</li>
          <li><b>The downhauler.</b> In Steel’s text and table; “seldom any” in Lever.</li>
        </ul>`,
    };
  }

  // --- Fore lower studding sail -------------------------------------------
  function lowerSail() {
    const m = MASTS.fore;
    const x0 = m.x, yx = m.x - 1.5, sx = 16.2;
    const B = topmastBoom(m);
    const heel = [15, 16.6, 20.2];
    const end = [15, heel[1] + LOWER.boom, 23.2];
    const mid = lerp(heel, end, 0.5);
    const headIn = [sx, 39.5, 59], headOut = [sx, 39.5 + LOWER.yard, 59];
    const yardMid = lerp(headIn, headOut, 0.5);
    const tackClew = [15.6, end[1] - 1, 24.8];
    const sheetClew = [sx, 40.5, 25.6];

    const outerHalliards = {
      id: 'outer-halliards',
      group: 'sail',
      name: 'Outer halliards',
      does: 'Hoist the lower studding sail by its yard. They go up to a block under the end of the topmast studding sail boom, so the lower studding sail hangs from the boom of the sail above it, and that boom has to be out and supported before this sail can be set.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: yardMid, mark: 'fast', step: 'Bent “between the cleats of the studdingsail-yard” (Steel), “with a Fisherman’s Bend” (Lever). I take the cleats to be at the middle of the yard.' },
        { p: [B.x, B.end[1] - 0.8, B.z - 0.9], mark: 'block', inferred: true, step: 'Up to a block “put over the Boom end, or … lashed to it, hanging underneath” the topmast studding sail boom (Lever). The block is as Lever describes. How the yard hangs under it is my reconstruction: with Steel’s 31-foot yard and the tack at the lower boom’s end, the yard’s middle cannot be straight below the block, so the halliards are drawn slanting inwards.' },
        { p: [x0 - 0.8, 2.6, m.capZ - 0.6], mark: 'block', step: 'In to “a span-block that is round the lower cap” (Steel).' },
        { p: [x0 + 2.2, 4.6, 18.6], mark: 'belay', inferred: true, step: '“The other end leads down upon deck.” The place is not named; it is drawn on the forecastle abaft the mast.' },
      ],
      purchase: 'None: a single rope.',
      belay: { short: 'Forecastle, near the mast', level: 'weather', status: 'inferred', text: 'Steel says only that they lead “down upon deck”.' },
      worked: 'Hoisted after the tack is hauled out, and belayed before the inner halliards are touched. In taking in they go first: “lower away briskly the outer haliards, to spill the sail” (Steel).',
      rope: '3½ in.',
      notes: [
        'In merchant ships with a gored sail, narrower at the head than the foot, Lever hangs this block on “a short Pendent, which is retained to the Boom further in by a Salvagee strap”, to bring it over the yard.',
        'Lees dates to 1801 the practice of carrying the fore lower studding sail yard “from the end of the upper stunsail booms”. I have that at second hand and could not read what it replaced. Steel (1794) and Lever (1808) both describe the lead drawn here.',
      ],
      sources: ['S 217', 'L 64', 'L 80', 'L 81', 'S74 33'],
    };

    const innerHalliards = {
      id: 'inner-halliards',
      group: 'sail',
      name: 'Inner halliards',
      does: 'Haul the inner top corner of the sail up and in towards the fore yard. The outer halliards lift the sail; these “stretch the Head of the Sail” (Lever). Only the lower studding sail has two sets of halliards.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: headIn, mark: 'fast', step: 'Bent “to the upper inner cringle on the head of the sail” (Steel), with a sheet bend (Lever).' },
        { p: [yx, m.yardHalf * 0.75, m.yardZ - 1], mark: 'block', step: 'Up through “a tail-block made fast round the quarter of the lower yard” (Steel): the outer quarter of the fore yard in Lever.' },
        { p: [yx, 4, m.yardZ - 1], mark: 'block', step: 'In under the yard to “another block made fast round the yard near the mast” (Steel). Lever has it at the inner quarter.' },
        { p: [x0 - 2.6, 6, 18.6], mark: 'belay', inferred: true, step: '“And lead down upon deck.” The place is not named.' },
      ],
      purchase: 'None: a single rope.',
      belay: { short: 'Forecastle, near the mast', level: 'weather', status: 'inferred', text: 'Steel says only that they lead “down upon deck”.' },
      worked: 'Hoisted last in setting. In taking in they are kept fast until the sail has been hauled in over the forecastle: they hold it up out of the water while the sheet brings it inboard. Then “lower away the inner haliards as required” (Steel).',
      rope: '3 in.',
      notes: [],
      sources: ['S 217', 'L 64', 'L 81', STEEL_335, 'S74 33'],
    };

    const tack = {
      id: 'tack',
      group: 'sail',
      name: 'Tack',
      also: 'outhaul (Dana, 1841)',
      does: 'Hauls the outer lower corner of the sail out to the end of the lower studding sail boom.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: tackClew, mark: 'fast', step: 'Bent “to the outer clue on the foot of the sail” (Steel).' },
        { p: [end[0], end[1] - 0.4, end[2] + 0.5], mark: 'block', step: 'Through “a block lashed round the outer part of the boom”.' },
        { p: [100.5, 24.8, 17.4], mark: 'block', step: 'Aft, outside the ship, to “a block lashed to the main chains”. From astern the rope is cut short here.' },
        { p: [97, 21.8, 12.5], mark: 'lead', step: 'It comes in “through a port”, on the upper deck.' },
        { p: [92, 21.2, 12.2], mark: 'belay', step: '“And belay round a cleat in the waist” (Steel).' },
      ],
      extra: [[tackClew, [-37, 2.2, 44.5]]],
      purchase: 'None: a single rope.',
      belay: { short: 'Cleat in the waist', level: 'upper', status: 'period', text: 'A cleat in the waist, on the upper deck, the tack having come in through a port abreast the main chains. That is Steel. Lever leads it “through a Block at the Gangway”, a deck higher and further forward.' },
      worked: 'Hauled out first of all: “First, haul out the Tack, then hoist up the Yard with the outer Halliards” (Lever). Eased after the outer halliards are lowered when the sail comes in.',
      rope: '3½ in.',
      notes: [
        'Steel gives two tacks. “They are carried aft … The other is carried forward, and reeves through a block lashed to the bees of the bowsprit.” The forward one is drawn as a plain line to the bowsprit end. Lever has one tack, rove through the boom-end block, with one end in on the forecastle to be bent to the sail and the other through the block at the gangway.',
        'The main lower studding sail, issued until 1801, had its tack “through a block at the end of the boom, and through a block lashed to an eye-bolt in the buttock”, coming in “through a snatch-block lashed on the quarter” (Steel).',
      ],
      sources: ['S 218', 'L 64', 'L 81', 'S74 33', DANA],
    };

    const sheets = {
      id: 'sheets',
      group: 'sail',
      name: 'Sheets',
      does: 'Hold the inner lower corner of the sail in towards the ship, and bring the sail inboard when it is taken in.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: sheetClew, mark: 'fast', step: 'The sheets “are doubled; the bight is put over, and the ends through the inner clue on the foot of the sail” (Steel).' },
        { p: [37, 19.8, 22.4], mark: 'belay', inferred: true, step: '“One leads forward, the other aft.” That is all Steel says. The after one is drawn coming in abaft the fore shrouds, which is a guess.' },
      ],
      extra: [[sheetClew, [9.5, 13.4, 21.8]]],
      purchase: 'None.',
      belay: { short: 'Forecastle side (not named)', level: 'weather', status: 'inferred', text: 'Not given. “One leads forward, the other aft” (Steel).' },
      worked: 'Hauled taut last in setting. In taking in, the after sheet does the work: “lead one of the sheets clear aft, and man it well” (Steel); “the Sheet is stretched aft … the Sail is gathered in on the Forecastle” (Lever).',
      rope: '3 in.',
      notes: [],
      sources: ['S 218', 'L 64', 'L 82', STEEL_335, 'S74 33'],
    };

    const toppingLift = {
      id: 'topping-lift',
      group: 'yard',
      name: 'Topping lift',
      does: 'Holds the lower studding sail boom up. The boom is hooked to the ship’s side at its inner end and would otherwise drop into the sea. Hoisting on the topping lift is also the first move in swinging the boom out.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [mid[0], mid[1], mid[2] + 0.4], mark: 'fast', step: '“The end is clinched to the upper Strap in the middle of the Boom” (Lever). There are two straps with thimbles there, one above the boom and one below.' },
        { p: [x0 - 2, 6.5, m.topZ + 4], mark: 'block', inferred: true, step: 'Up through “a Block, spliced in a long Span, which goes round the lower Mast-head”. How long the span is, and so where the block hangs, is not given.' },
        { p: [x0 - 3.2, 3.4, 18.6], mark: 'belay', inferred: true, step: 'Down to the forecastle. Lever does not say where it is made fast.' },
      ],
      purchase: 'None in Lever’s description: a single rope through one block.',
      belay: { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'Not given.' },
      worked: '“To rig the Boom out. Hoist upon the Topping Lift, haul [out] the fore Guy, and ease the after one, when it will come across” (Lever).',
      notes: ['Steel’s rigging text gives the boom a guy and a tackle at its heel and no topping lift. His table for the 74 has “Guys Mast-Head, 2” in a section I have only at second hand; that may be the same rope under another name.'],
      sources: ['L 64', 'L 81', 'S 218'],
    };

    const foreGuy = {
      id: 'fore-guy',
      group: 'yard',
      name: 'Fore guy',
      does: 'Pulls the boom forward. With the after guy pulling the other way it fixes the boom’s angle to the ship, as a pair of braces fixes a yard. It needs something well forward and well out to pull from, and that is the spritsail yard under the bowsprit.',
      mirror: false,
      path: [
        { p: [mid[0], mid[1] + 0.9, mid[2]], mark: 'fast', step: '“Clinched to the middle of the Boom, just without the Strap” (Lever).' },
        { p: [-24, 22, 35], mark: 'block', step: 'Forward to a block “lashed on the outer quarter of the Spritsail Yard”, the yard slung under the bowsprit. It is drawn as a plain line across the bows.' },
        { p: [9.5, 8, 21.6], mark: 'belay', inferred: true, step: 'It “comes in upon the forecastle” (Steel). The fitting is not named.' },
      ],
      // The spritsail yard, which the shared drawing leaves out. As an extra it
      // shows in profile and plan only, where the guy is drawn.
      extra: [[[-24, -31, 35], [-24, 31, 35]]],
      purchase: 'None.',
      belay: { short: 'Forecastle (not named)', level: 'weather', status: 'inferred', text: 'Steel: it “comes in upon the forecastle”.' },
      worked: 'Hauled to swing the boom out; eased to swing it in. When the boom is stowed “the Block is taken off the Spritsail Yard” (Lever).',
      notes: ['Steel names only “the guy”, and it is this one. For the main boom Lever leads the fore guy “through a Block lashed to the fore Chains”.'],
      sources: ['L 64', 'L 81', 'L 82', 'S 218'],
    };

    const afterGuy = {
      id: 'after-guy',
      group: 'yard',
      name: 'After guy',
      does: 'Pulls the boom aft, against the fore guy. With the sail set it is the one under strain, since the sail is trying to carry the boom forward.',
      mirror: false,
      path: [
        { p: [mid[0], mid[1] + 1.6, mid[2]], mark: 'fast', step: '“Clinched close to” the fore guy, at the middle of the boom.' },
        { p: [55.5, 20.6, 20.8], mark: 'block', step: 'Aft to “a Block lashed round a Timber-head at the Gangway” (Lever).' },
        { p: [58.5, 20.2, 20.4], mark: 'belay', inferred: true, step: 'Made fast near by. Lever names the block and not the belaying point.' },
      ],
      purchase: 'None.',
      belay: { short: 'Gangway (not named)', level: 'weather', status: 'inferred', text: 'Not given. Its leading block is at a timber-head at the gangway.' },
      worked: 'Eased as the boom swings out; hauled to swing it “fore and aft” again, alongside the ship, where “it is then lashed in the Chains, the Geer coiled upon it, and secured” (Lever).',
      notes: ['For the main boom Lever leads the after guy “through a Block lashed to an Eye-bolt in the quarter Piece”.'],
      sources: ['L 64', 'L 81', 'L 82'],
    };

    const martingale = {
      id: 'martingale',
      group: 'yard',
      name: 'Martingale',
      does: 'Holds the boom down, “to keep the Boom from flying up, which is often the case when a Ship rolls in going large” (Lever). This is a second meaning of the word. It has nothing to do with the martingale under the bowsprit.',
      mirror: false,
      views: ['aft'],
      path: [
        { p: [mid[0], mid[1], mid[2] - 0.4], mark: 'fast', step: 'Bent to the lower strap at the middle of the boom.' },
        { p: [16, 18, 11.5], mark: 'block', step: 'Down and in to a block “lashed to an Eye-bolt in the Bends”, the thick planking of the ship’s side.' },
        { p: [13.5, 16, 22.6], mark: 'belay', step: '“It is set taught on the Forecastle, and belayed to a Timber Head.”' },
      ],
      purchase: 'None as Lever describes it.',
      belay: { short: 'Timber-head, forecastle', level: 'weather', status: 'period', text: 'A timber-head on the forecastle (Lever).' },
      worked: 'Set taut once the boom is out and topped to its height.',
      notes: [
        'That is merchant practice. “Men of War have a Tackle hooked to the Boom, to keep it down” (Lever), and he does not describe it further.',
        'Steel holds the boom down at its heel instead: “The inner end of the fore-boom is confined down with a tackle made fast round the inner end of the boom, and the lower block is hooked to an eye-bolt in the wale.”',
      ],
      sources: ['L 64', 'L 81', 'S 218'],
    };

    return {
      id: 'fore-lower-studding-sail',
      mast: 'fore',
      title: 'The fore lower studding sail',
      views: ['aft'],
      aftBox: [-(m.yardHalf + 3), -(m.capZ + 6), m.yardHalf + 3 + end[1] + 6, m.capZ + 6],
      cloth: [squareSail(m, 'course'), [headIn, headOut, tackClew, sheetClew]],
      spars: [
        yardSpar(m, m.yardZ, m.yardHalf, 1.3),
        { a: B.heel, b: B.end, w: 0.75 },
        { a: heel, b: end, w: 0.9 },
        { a: [sx, headIn[1] - 0.5, 59], b: [sx, headOut[1] + 0.5, 59], w: 0.5 },
      ],
      lines: [outerHalliards, innerHalliards, tack, sheets, toppingLift, foreGuy, afterGuy, martingale],
      start: 'outer-halliards',
      notice: `
        <h2>What to notice</h2>
        <h3>Its boom is on the ship, not on a yard</h3>
        <p>The lower studding sail boom hooks to an eye-bolt in the ship’s side by a goose-neck and swings out square. Steel and Lever call it the lower studding sail boom. “Swinging boom” is a later name.</p>
        <h3>It hangs from the boom of the sail above</h3>
        <p>The outer halliards go to a block under the end of the topmast studding sail boom. That is why that boom has a topping lift.</p>
        <h3>Two sets of halliards</h3>
        <p>The outer ones lift the yard. The inner ones pull the inner corner of the head up to the fore yard.</p>
        <h2>Where the sources go quiet</h2>
        <ul>
          <li><b>How the yard hangs.</b> The drawing of the yard and the slant of the outer halliards is a reconstruction.</li>
          <li><b>The tack.</b> Two in Steel, one forward and one aft; one in Lever.</li>
          <li><b>Holding the boom down.</b> A martingale in merchant ships, an undescribed tackle in men-of-war (Lever), a tackle at the heel (Steel).</li>
          <li><b>Belaying points</b> are named only for the tack and the martingale.</li>
        </ul>`,
    };
  }

  SAILS.push(lowerSail(), topmast(MASTS.fore), topgallant(MASTS.fore), topmast(MASTS.main), topgallant(MASTS.main));
})();
