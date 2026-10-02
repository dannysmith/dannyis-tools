// Tackles, yards and belaying: the drawings that are built by script.
//
//   - a tackle of any of the period purchases, drawn as blocks and parts of
//     rope, with the parts at the moving block counted (`drawTackle`);
//   - the worked tackle, the gallery of purchases and the labelled figures
//     that use it;
//   - the chart of rope size against purchase;
//   - one mast seen from astern with the gear that holds each yard.
//
// Page references written as "Steel p.176" or "Lever p.34" inside an element
// of class `refs` are turned into links.

(function () {
  const S = 18;          // spacing between the parts of a fall, in drawing units
  const R = S / 2;       // radius a rope turns on round a sheave
  const SHELL = R + 7;   // half-height of a block

  // ---- The purchases -------------------------------------------------------
  // A stage is one tackle: `f` sheaves in the block the fall leaves, `o` in the
  // other block (o = 0 for a whip, where the other end is the rope's own end).
  // The standing part is on the fall's block when f = o and on the other block
  // when f = o + 1, which covers every purchase here.
  // A variant says, for each stage, whether the fall's block is the one that
  // moves with the load. A second stage is clapped on the fall of the first.
  const PURCHASES = [
    {
      id: 'whip', name: 'Single whip', stages: [{ f: 1, o: 0 }],
      variants: [
        { label: 'Block made fast aloft', moving: [false] },
        { label: 'Block on the weight', moving: [true] },
      ],
      made: 'A rope rove through one single block. Lever: “reeving a Rope through a single Block”. Steel: “a small single tackle, formed by connecting the fall to a single block, or with two blocks, the one fixed, and the other moveable”.',
      adv: '1 with the block fixed, 2 with the block on the weight',
      advNote: 'inference from Steel’s rule',
      use: 'Everywhere light gear is doubled once. A brace is a whip: it runs through a block at the yard-arm and its standing part is made fast in the ship. So are the course sheets, the clew-garnets, the lower lifts and the whip-falls on the leech-lines and the jib halliards of large ships.',
      refs: 'Steel p.179, Steel p.202, Steel p.211; Lever, “Blocks, Tackles”; Falconer, WHIP',
    },
    {
      id: 'whip-upon-whip', name: 'Whip upon whip', stages: [{ f: 1, o: 0 }, { f: 1, o: 0 }],
      variants: [{ label: 'As Lever describes it', moving: [true, true] }],
      made: 'Lever: “if the Block of another Whip be strapped to the Fall of that”. Two single blocks and two ropes.',
      adv: '4',
      advNote: 'Steel, by implication',
      use: 'Steel recommends it for topsail and topgallant halliards that hoist with a single tye: it gives “the same purchase as a tackle, having a double and a single block, and with much less friction”, and it “will overhaul with great facility”.',
      refs: 'Steel p.180; Lever, “Blocks, Tackles”',
    },
    {
      id: 'gun-tackle', name: 'Gun-tackle purchase', stages: [{ f: 1, o: 1 }],
      variants: [
        { label: 'Fall from the fixed block', moving: [false] },
        { label: 'Fall from the moving block', moving: [true] },
      ],
      made: 'Two single blocks, the standing part made fast to the strap of the first block (Lever). The gun tackle itself has a single block at the carriage and “a single or double block, for 32-pounders” at the ship’s side (Steel).',
      adv: '2 or 3, depending on which block moves',
      advNote: 'inference from Steel’s rule',
      use: 'Running the guns out. In the rigging, the halliard of the sprit topsail yard is a gun-tackle purchase, and Lever sets up the outer martingale stay with “a gun-tackle or whip”.',
      refs: 'Steel p.232, Steel p.197; Lever p.60',
    },
    {
      id: 'luff', name: 'Luff tackle', stages: [{ f: 2, o: 1 }],
      variants: [
        { label: 'Weight on the single block', moving: [false] },
        { label: 'Weight on the double block', moving: [true] },
      ],
      made: 'Lever: “a double and single Block: each strapped with a Hook and Thimble”. The fall goes through the double block, the single, and the double again, and its end is made fast to the single block.',
      adv: '3 or 4',
      advNote: 'Steel’s own worked example', sure: true,
      use: 'The general-purpose tackle, “used occasionally at any [part] of the ship” (Steel). Topsail halliards are rove “like a Luff Tackle” (Lever). A luff tackle hooked to the lower bowline cringle gets the main tack down in a blow; rolling tackles on the topsail yards are luff tackles; a travelling backstay is set up with one.',
      refs: 'Steel p.176, Steel p.177; Lever p.38, Lever p.87',
    },
    {
      id: 'jigger', name: 'Jigger, or tail tackle', stages: [{ f: 2, o: 1 }],
      variants: [
        { label: 'Weight on the single block', moving: [false] },
        { label: 'Weight on the double block', moving: [true] },
      ],
      made: 'A luff tackle whose blocks are “strapped with Tails, instead of Hooks and Thimbles” (Lever), so that it can be clapped on to any rope.',
      adv: '3 or 4, as a luff tackle',
      advNote: 'as the luff tackle',
      use: 'Steel: “used for topping the main and fore yards by the lifts”. His table for a 74 lists two jigger tackles with the main lifts. The fore topgallant stay is set up with a jigger.',
      refs: 'Steel p.177, Steel p.206; Lever, “Blocks, Tackles”',
    },
    {
      id: 'luff-upon-luff', name: 'Luff upon luff', stages: [{ f: 2, o: 1 }, { f: 2, o: 1 }],
      variants: [
        { label: 'Both rove to most advantage', moving: [true, true] },
        { label: 'Both the other way up', moving: [false, false] },
      ],
      made: 'One luff tackle clapped on the fall of another.',
      adv: 'up to 16',
      advNote: 'inference: 4 × 4',
      use: 'Setting up the heaviest standing rigging: Steel uses it for the stays and the bobstays.',
      refs: 'Steel p.195, Steel p.200',
    },
    {
      id: 'burton', name: 'Burton (top-burton)', stages: [{ f: 2, o: 1 }],
      variants: [
        { label: 'Weight on the single block', moving: [false] },
        { label: 'Weight on the double block', moving: [true] },
      ],
      made: 'Steel: “composed of double and single blocks, and are used with pendents”. Falconer: “a sort of small tackle, formed by two blocks… till the rope becomes three or four fold”.',
      adv: '3 or 4',
      advNote: 'as the luff tackle',
      use: 'It hooks to the burton pendents at the topmast head, “to set up the shrouds, support the topsail-yards, &c.” With studding sails set, Lever hooks one to the topsail yard as a preventer lift and another to hold up the studding-sail boom.',
      refs: 'Steel p.177, Steel p.199; Lever p.80; Falconer, BURTON',
    },
    {
      id: 'runner', name: 'Runner and tackle', stages: [{ f: 1, o: 0 }, { f: 2, o: 1 }], thick: [true, false],
      variants: [
        { label: 'Tackle with the double block moving', moving: [true, true] },
        { label: 'Tackle with the single block moving', moving: [true, false] },
      ],
      made: 'Lever: “the same Purchase as a Luff Tackle, applied to a Runner”. The runner is a single thick rope; rove through a block on the load as a whip, it doubles whatever the tackle gives.',
      adv: '6 or 8 when the runner is rove as a whip',
      advNote: 'inference',
      use: 'Setting up the lanyards of the lower shrouds, from the pendents of tackles at the mast-head. The breast backstays set up with a runner and a tackle in the chains, and Lever sets up a travelling backstay the same way.',
      refs: 'Steel p.198, Steel p.200; Lever p.85',
    },
    {
      id: 'long-tackle', name: 'Long tackle', stages: [{ f: 2, o: 1 }],
      variants: [
        { label: 'Weight on the single block', moving: [false] },
        { label: 'Weight on the long-tackle block', moving: [true] },
      ],
      made: 'A long-tackle block and a single block. The long-tackle block has its two sheaves one above the other in one long shell, not side by side; it reeves exactly as a luff tackle. It is drawn here like a double block.',
      adv: '3 or 4, as a luff tackle',
      advNote: 'as the luff tackle',
      use: 'The main bowline tackle that heaves the bowline taut, the yard tackles, and the falls of the fore topmast stays.',
      refs: 'Steel p.177, Steel p.211',
    },
    {
      id: 'jeers', name: 'Jeers', stages: [{ f: 3, o: 2 }],
      variants: [{ label: 'One jeer of the pair', moving: [false] }],
      made: 'In large ships a treble block lashed at the lower mast-head and a double block lashed on the yard, on each side of the slings. Lever has the fall’s end made fast to the strap of the block on the yard.',
      adv: '5 for each jeer, and there are two',
      advNote: 'inference: five parts at the yard block',
      use: 'One job only: hoisting a lower yard. Once the yard is up it hangs by its slings and the jeers are eased. For a 74 Steel’s table gives 8-inch rope and 28-inch blocks.',
      refs: 'Steel p.203; Lever p.34',
    },
    {
      id: 'winding', name: 'Winding tackle', stages: [{ f: 4, o: 3 }],
      variants: [
        { label: 'Fourfold block on the weight', moving: [true] },
        { label: 'Fourfold block made fast', moving: [false] },
      ],
      made: 'Steel: a fourfold and a treble block, or a treble and a double.',
      adv: '6 to 8',
      advNote: 'the notes’ figure; by Steel’s rule a treble and double give 5 or 6, a fourfold and treble 7 or 8',
      use: 'The heaviest purchase in the ship. Steel’s entry mentions “the jear-capstan”, so its fall was hove on at a capstan. The notes this page is built from do not record what it lifted; from general knowledge, not checked against Steel, it hoisted in the heaviest weights such as guns.',
      refs: 'Steel p.178; Steel p.235',
    },
    {
      id: 'tye-halliards', name: 'Topsail tye and halliards', stages: [{ f: 1, o: 0 }, { f: 2, o: 1 }], thick: [true, false],
      variants: [{ label: 'One side of a 74’s topsail yard', moving: [true, true] }],
      made: 'Not a purchase with a name of its own, but the one a topsail yard hangs on. The tye is a thick rope rove through a block on the yard; a double block (the fly-block) is spliced into its lower end and the halliards are rove between that and a single block hooked in the channel.',
      adv: 'about 8 on each side',
      advNote: 'inference: a whip on the yard, then a luff purchase with the double block moving',
      use: 'Hoisting a topsail yard every time sail is made or a reef shaken out. A 74’s main topsail tye is 6-inch rope and its halliards 3½-inch.',
      refs: 'Steel p.205; Lever p.38',
    },
  ];

  const advantage = (st, moving) => st.f + st.o + (moving ? 1 : 0);
  const totalAdvantage = (p, v) => p.stages.reduce((a, st, i) => a * advantage(st, v.moving[i]), 1);

  // ---- Drawing one tackle ---------------------------------------------------
  const f1 = (n) => Math.round(n * 10) / 10;
  const line = (x1, y1, x2, y2, cls) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}"/>`;
  const badge = (x, y, n) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="7.5" class="fd-badge"/><text x="${f1(x)}" y="${f1(y)}" class="fd-num">${n}</text>`;
  const label = (x, y, text, cls, anchor) => `<text x="${f1(x)}" y="${f1(y)}" class="fd-lbl ${cls || ''}"${anchor ? ` text-anchor="${anchor}"` : ''}>${text}</text>`;

  // The geometry of one stage between a fixed point and a moving point on the
  // same vertical. Returns the rope as an SVG path up to where the fall leaves
  // its block, the ends of each part between the blocks, and the two blocks.
  function stage(st, fallMoves, x, yFix, yMov) {
    const n = st.f + st.o;
    const yFall = fallMoves ? yMov : yFix, yOther = fallMoves ? yFix : yMov;
    const standingOnFall = st.f === st.o;
    const yOf = (i) => (((i % 2 === 0) === standingOnFall) ? yOther : yFall);   // the block carrying sheave i
    const toward = (y) => Math.sign((y === yFall ? yOther : yFall) - y);        // from a block, the way to the other block
    const yStand = standingOnFall ? yFall : yOther;
    const bare = st.o === 0;                                                    // the standing end is the rope's own end
    const yBecket = bare ? yStand : yStand + toward(yStand) * SHELL;

    let d = `M${f1(x)},${f1(yBecket)}`;
    const parts = [];
    for (let i = 0; i < n; i++) {
      const y = yOf(i), sweep = toward(y) > 0 ? 1 : 0;
      parts.push({ x: x + i * S, y1: i === 0 ? yBecket : yOf(i - 1), y2: y });
      d += ` L${f1(x + i * S)},${f1(y)} A${R},${R} 0 0 ${sweep} ${f1(x + (i + 1) * S)},${f1(y)}`;
    }
    const blocks = [yFall, yOther].map((y) => {
      const idx = [];
      for (let i = 0; i < n; i++) if (yOf(i) === y) idx.push(i);
      if (!idx.length) return null;
      const hasBecket = !bare && y === yStand;
      const x1 = x + (hasBecket ? 0 : idx[0] * S) - 5, x2 = x + (idx[idx.length - 1] + 1) * S + 5;
      return { y, x1, x2, mid: (x1 + x2) / 2, sheaves: idx.map((i) => x + (i + 0.5) * S), fixed: y === yFix };
    }).filter(Boolean);

    return {
      n, d, parts, blocks, bare, yFall, yOther,
      fallStart: [x + n * S, yFall],
      fallDir: Math.sign(yOther - yFall),
      standEnd: [x, yBecket],
      block: (fixed) => blocks.find((b) => b.fixed === fixed),
    };
  }

  function blockSvg(b) {
    let s = `<rect x="${f1(b.x1)}" y="${f1(b.y - SHELL)}" width="${f1(b.x2 - b.x1)}" height="${2 * SHELL}" rx="7" class="fd-shell"/>`;
    for (const cx of b.sheaves) s += `<circle cx="${f1(cx)}" cy="${f1(b.y)}" r="${R - 1.5}" class="fd-sheave"/><circle cx="${f1(cx)}" cy="${f1(b.y)}" r="1.4" class="fd-pin"/>`;
    return s;
  }

  const arrow = (x, y, dir) => `<path d="M${f1(x - 5)},${f1(y - dir * 7)} L${f1(x)},${f1(y)} L${f1(x + 5)},${f1(y - dir * 7)}" class="fd-arrow"/>`;

  // Layouts: `full` for the worked tackle, `mini` for the gallery.
  const LAYOUT = {
    full: { w: 420, h: 470, beam: 26, ax: 170, axCompound: 46, aFix: 80, aMov: 330, hand: 428, bx: 262, deck: 446, bMov: 150, px: 28, pxCompound: 36 },
    mini: { w: 220, h: 216, beam: 10, ax: 78, axCompound: 22, aFix: 42, aMov: 142, hand: 204, bx: 132, deck: 208, bMov: 74, px: 0, pxCompound: 0 },
  };

  // Draws purchase `p` in variant `v` with the weight raised `lift` feet.
  // Returns { svg, w, h }.
  function drawTackle(p, v, lift, mode, opts) {
    const g = LAYOUT[mode], full = mode === 'full', o = opts || {};
    const compound = p.stages.length === 2;
    const px = compound ? g.pxCompound : g.px;
    const [sa, sb] = p.stages;
    const aMoves = v.moving[0];
    const ax = o.ax || (compound ? g.axCompound : g.ax - (sa.f + sa.o) * S / 2 + 20);
    const ropeCls = (i) => `fd-rope${p.thick && p.thick[i] ? ' thick' : ''}`;
    let under = '', rope = '', red = '', over = '', notes = '';

    // First stage: fixed above, the weight below.
    const aBareFixed = sa.o === 0 && aMoves;            // a whip with its block on the weight: the end goes to the beam
    const aFix = aBareFixed ? g.beam : g.aFix;
    const aMov = g.aMov - lift * px;
    const A = stage(sa, aMoves, ax, aFix, aMov);
    const beamEnd = compound ? g.w - 24 : ax + A.n * S - (aMoves ? 6 : -30);
    under += line(ax - 34, g.beam, beamEnd, g.beam, 'fd-beam');
    const aFixed = A.block(true), aMoving = A.block(false);
    if (aFixed) under += line(aFixed.mid, g.beam, aFixed.mid, aFixed.y - SHELL, 'fd-strap');
    const loadX = aMoving ? aMoving.mid : ax;
    const loadTop = aMov + (aMoving ? SHELL : 0) + 16;
    under += line(loadX, loadTop - 16, loadX, loadTop, 'fd-strap');
    under += `<rect x="${f1(loadX - 24)}" y="${f1(loadTop)}" width="48" height="${full ? 34 : 24}" class="fd-load"/>`;
    if (full) notes += label(loadX, loadTop + 21, 'weight', '', 'middle');
    rope += `<path d="${A.d}" class="${ropeCls(0)}"/>`;
    for (const b of A.blocks) under += blockSvg(b);
    if (A.bare) over += `<rect x="${f1(A.standEnd[0] - 3.5)}" y="${f1(A.standEnd[1] - 3.5)}" width="7" height="7" class="fd-fast"/>`;

    const count = (st, k) => line(st.parts[k].x, st.parts[k].y1, st.parts[k].x, st.parts[k].y2, 'fd-rope count');
    const number = (st, yMoving, yFixed, extra, from) => {
      let s = '';
      const y = yMoving + Math.sign(yFixed - yMoving) * (SHELL + 15);
      for (let k = 0; k < st.n + extra; k++) s += badge(st.parts[0].x + k * S, y, from + k);
      return s;
    };
    for (let k = 0; k < A.n; k++) red += count(A, k);
    if (full && !o.plain) notes += number(A, aMov, aFix, aMoves ? 1 : 0, 1);

    const [fx, fy] = A.fallStart;
    if (!compound) {
      const yEnd = aMoves ? aFix - (aBareFixed ? -40 : full ? 46 : 30) : g.hand;
      rope += line(fx, fy, fx, yEnd, ropeCls(0));
      if (aMoves) red += line(fx, fy, fx, yEnd, 'fd-rope count');
      over += arrow(fx, yEnd + (aMoves ? -3 : 3), aMoves ? -1 : 1);
      if (full && !o.plain) notes += label(fx + 12, aMoves ? yEnd + 4 : yEnd, 'haul');
      return { svg: under + rope + red + over + notes, w: g.w, h: g.h, a: A, ax, aMov, aFix };
    }

    // Second stage: clapped on the fall of the first, fixed at the deck.
    const bMoves = v.moving[1];
    const hauledA = advantage(sa, aMoves) * lift;
    const bBareFixed = sb.o === 0 && bMoves;
    const bFix = bBareFixed ? g.deck : g.deck - SHELL - 12;
    const bMov = g.bMov + hauledA * px;
    const B = stage(sb, bMoves, g.bx, bFix, bMov);
    under += line(g.bx - 40, g.deck, g.w - 10, g.deck, 'fd-deck');
    const bFixed = B.block(true), bMoving = B.block(false);
    if (bFixed) under += line(bFixed.mid, bFixed.y + SHELL, bFixed.mid, g.deck, 'fd-strap');
    const joint = [bMoving.mid, bMov - SHELL - 12];
    under += line(joint[0], joint[1], bMoving.mid, bMov - SHELL, 'fd-strap');
    rope += `<path d="${B.d}" class="${ropeCls(1)}"/>`;
    for (const b of B.blocks) under += blockSvg(b);
    if (B.bare) over += `<rect x="${f1(B.standEnd[0] - 3.5)}" y="${f1(B.standEnd[1] - 3.5)}" width="7" height="7" class="fd-fast"/>`;

    if (aMoves) {
      // The fall of the first stage rises from the moving block, turns over a
      // leading block at the beam, and comes down to the second stage.
      const lx = joint[0] - 7, ly = g.beam + 24;
      under += line(lx, g.beam, lx, ly, 'fd-strap');
      rope += `<path d="M${f1(fx)},${f1(fy)} L${f1(lx - 7)},${f1(ly)} A7,7 0 0 1 ${f1(lx + 7)},${f1(ly)} L${f1(joint[0])},${f1(joint[1])}" class="${ropeCls(0)}"/>`;
      red += line(fx, fy, lx - 7, ly, 'fd-rope count');
      over += `<circle cx="${f1(lx)}" cy="${f1(ly)}" r="5.5" class="fd-sheave"/><circle cx="${f1(lx)}" cy="${f1(ly)}" r="1.4" class="fd-pin"/>`;
      if (full && !o.plain) notes += label(lx - 14, ly - 10, 'leading block: adds nothing', '', 'end');
    } else {
      rope += line(fx, fy, joint[0], joint[1], ropeCls(0));
    }
    for (let k = 0; k < B.n; k++) red += count(B, k);
    const [gx, gy] = B.fallStart;
    const yEnd = bMoves ? g.deck - 4 : g.bMov - SHELL - (full ? 40 : 26);
    rope += line(gx, gy, gx, yEnd, ropeCls(1));
    if (bMoves) red += line(gx, gy, gx, yEnd, 'fd-rope count');
    over += arrow(gx, yEnd + (bMoves ? -2 : -3), bMoves ? 1 : -1);
    if (full && !o.plain) {
      notes += number(B, bMov, bFix, bMoves ? 1 : 0, 1);
      notes += label(gx + 12, bMoves ? yEnd - 8 : yEnd + 4, 'haul');
    }
    return { svg: under + rope + red + over + notes, w: g.w, h: g.h, a: A, b: B, ax, aMov, aFix, bMov, bFix, joint };
  }

  // ---- The worked tackle ----------------------------------------------------
  const feet = (ft) => {
    const inches = Math.round(ft * 12);
    return `${Math.floor(inches / 12)} ft ${inches % 12} in`;
  };

  function workedTackle(root) {
    const svg = root.querySelector('svg');
    const pick = root.querySelector('.purchases');
    const vary = root.querySelector('.variants');
    const slider = root.querySelector('input[type=range]');
    const readout = root.querySelector('.readout');
    const about = root.querySelector('.about-purchase');
    const caption = root.querySelector('figcaption');
    let p = PURCHASES.find((x) => x.id === 'luff'), vi = 1;

    pick.innerHTML = PURCHASES.map((x) => `<button type="button" data-id="${x.id}">${x.name}</button>`).join('');

    function draw() {
      const v = p.variants[vi];
      const compound = p.stages.length === 2;
      const lift = (compound ? 1 : 3) * slider.value / 100;
      const out = drawTackle(p, v, lift, 'full');
      svg.setAttribute('viewBox', `0 0 ${out.w} ${out.h}`);
      svg.innerHTML = out.svg;
      const adv = totalAdvantage(p, v);
      const sums = p.stages.map((st, i) => advantage(st, v.moving[i]));
      const sum = compound ? `${sums[0]} × ${sums[1]} = <b>${adv}</b>` : `<b>${adv}</b> ${adv === 1 ? 'part' : 'parts'}`;
      const haul = lift * adv;
      const widest = (compound ? 1 : 3) * 16;
      readout.innerHTML =
        `<p class="sum">${sum}</p>` +
        `<p>${compound ? 'The parts at each moving block, multiplied together.' : 'of the fall sustain the weight.'} A pull of 100 lb on the fall holds ${adv * 100} lb, friction not considered.</p>` +
        `<div class="gauge"><span>weight raised</span><span><i class="lift" style="width:${f1(100 * lift / widest)}%"></i></span><span>${feet(lift)}</span>` +
        `<span>rope hauled</span><span><i style="width:${f1(100 * haul / widest)}%"></i></span><span>${feet(haul)}</span></div>`;
      caption.innerHTML = `<b>${p.name}.</b> The red parts, numbered, are the ones that hold the moving block${compound ? ' of each tackle' : ''}. Sheaves that in life lie side by side on one pin are spread apart so that each part of the rope can be seen.`;
    }

    function choose(id, variant) {
      p = PURCHASES.find((x) => x.id === id);
      vi = variant || 0;
      for (const b of pick.children) b.setAttribute('aria-pressed', String(b.dataset.id === id));
      vary.innerHTML = p.variants.map((v, i) => `<button type="button" data-i="${i}" aria-pressed="${i === vi}">${v.label}</button>`).join('');
      about.innerHTML = `<h4>${p.name}</h4><p>${p.made}</p><p><b>Nominal advantage:</b> ${p.adv} <span class="mark${p.sure ? '' : ' infer'}">${p.advNote}</span></p><p><b>Where it is used:</b> ${p.use}</p><p class="refs">${p.refs}</p>`;
      linkRefs(about);
      draw();
    }

    pick.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) choose(b.dataset.id);
    });
    vary.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      vi = Number(b.dataset.i);
      for (const x of vary.children) x.setAttribute('aria-pressed', String(x === b));
      draw();
    });
    slider.addEventListener('input', draw);
    choose('luff', 1);
    return choose;
  }

  // ---- The gallery ----------------------------------------------------------
  function gallery(root, choose) {
    root.innerHTML = PURCHASES.map((p) => {
      const out = drawTackle(p, p.variants[0], 0, 'mini');
      return `<article class="card"><svg viewBox="0 0 ${out.w} ${out.h}" role="img" aria-label="${p.name}">${out.svg}</svg>` +
        `<div><h4>${p.name}</h4><p class="adv">Nominal advantage ${p.adv}</p><p><span class="mark${p.sure ? '' : ' infer'}">${p.advNote}</span></p><p>${p.made}</p><p>${p.use}</p>` +
        `<p class="refs">${p.refs}</p><button type="button" data-id="${p.id}">Work this tackle</button></div></article>`;
    }).join('');
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      choose(b.dataset.id);
      document.getElementById('worked').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---- The labelled figures -------------------------------------------------
  function leader(x1, y1, x2, y2, text, cls, anchor) {
    return line(x1, y1, x2, y2, 'fd-lead') + label(x2 + (anchor === 'end' ? -4 : 4), y2 + 4, text, cls, anchor);
  }

  // A luff tackle with the names of its parts.
  function partsFigure(svg) {
    const p = PURCHASES.find((x) => x.id === 'luff');
    const out = drawTackle(p, p.variants[0], 0, 'full', { plain: true, ax: 150 });
    const a = out.a, x = out.ax, mid = (out.aFix + out.aMov) / 2;
    let s = out.svg;
    s += leader(x - 2, out.aMov - SHELL - 2, x - 26, out.aMov - 60, 'standing part', 'strong', 'end');
    s += label(x - 30, out.aMov - 42, 'made fast to the', '', 'end') + label(x - 30, out.aMov - 28, 'single block', '', 'end');
    s += leader(x + S * 2 + 2, mid - 30, x + 120, mid - 54, 'running part', 'strong');
    s += label(x + 124, mid - 36, 'every part between') + label(x + 124, mid - 22, 'the two blocks');
    s += leader(x + S * 3 + 2, out.aMov + 40, x + 120, out.aMov + 30, 'fall, or leading part', 'strong');
    s += label(x + 124, out.aMov + 48, 'the part hauled upon');
    s += leader(a.block(true).x2, out.aFix, x + 120, out.aFix - 6, 'double block', 'strong');
    s += leader(a.block(false).x2, out.aMov, x + 120, out.aMov - 6, 'single block', 'strong');
    svg.setAttribute('viewBox', `0 0 ${out.w} ${out.h}`);
    svg.innerHTML = s;
  }

  // The topsail tye and halliards: thick rope aloft, a light tackle below.
  function tyeFigure(svg) {
    const p = PURCHASES.find((x) => x.id === 'tye-halliards');
    const out = drawTackle(p, p.variants[0], 0, 'full', { plain: true });
    let s = out.svg;
    const yardBlock = out.a.block(false), fly = out.b.block(false), chan = out.b.block(true);
    s += leader(out.ax - 2, out.aFix + 60, out.ax + 46, out.aFix + 74, 'tye, 6 in', 'strong');
    s += label(out.ax + 50, out.aFix + 92, 'standing part round');
    s += label(out.ax + 50, out.aFix + 106, 'the topmast head');
    s += leader(yardBlock.x2, out.aMov, yardBlock.x2 + 22, out.aMov - 22, 'tye-block on the yard', 'strong');
    s += leader(out.joint[0] - 14, 50, out.joint[0] - 60, 62, 'block at the topmast head', 'strong', 'end');
    s += leader(fly.x2, out.bMov, fly.x2 + 14, out.bMov - 16, 'fly-block', 'strong');
    s += leader(out.b.parts[1].x, (out.bMov + out.bFix) / 2, fly.x1 - 26, (out.bMov + out.bFix) / 2 + 12, 'halliards, 3½ in', 'strong', 'end');
    s += leader(chan.x1, out.bFix, chan.x1 - 26, out.bFix - 10, 'single block', 'strong', 'end');
    s += label(chan.x1 - 30, out.bFix + 8, 'hooked in the channel', '', 'end');
    s = s.replace('>weight<', '>yard<');
    svg.setAttribute('viewBox', `0 0 ${out.w} ${out.h}`);
    svg.innerHTML = s;
  }

  // ---- Rope size against purchase -------------------------------------------
  // Main mast of a 74. Sizes are circumferences in inches from Steel's table;
  // the parts are counted from the leads by Steel's rule.
  const GEAR = [
    { group: 'Light, and must run fast: single' },
    { name: 'Topsail buntline', size: 3, parts: 1 },
    { group: 'Lifts a clew or a yard-arm: doubled once' },
    { name: 'Topsail clew-line', size: 4, parts: 2 },
    { name: 'Main clew-garnet', size: 4, parts: 2 },
    { name: 'Main lift', size: 4.5, parts: 2, note: 'and a jigger' },
    { group: 'Lifts a whole yard: a thick rope and a tackle' },
    { name: 'Main jeers', size: 8, parts: 5, note: 'each of two' },
    { name: 'Topsail tye', size: 6, parts: 2 },
    { name: 'and its halliards', size: 3.5, parts: 4, note: '2 × 4 = 8 a side' },
    { group: 'Holds a great steady load: thick rope and a stopper' },
    { name: 'Main topsail sheet', size: 8.5, parts: 1 },
    { name: 'Main tack', size: 9.5, parts: 1, note: '2 if double' },
    { name: 'Main sheet', size: 7.5, parts: 2 },
  ];

  function gearChart(svg) {
    const w = 440, row = 28, x0 = 132, x1 = 236, bars = 296;
    let y = 0, s = '';
    for (const r of GEAR) {
      if (r.group) {
        s += label(0, y + 24, r.group, 'strong');
        y += 34;
        continue;
      }
      const cy = y + row / 2;
      s += label(x0 - 10, cy + 4, r.name, '', 'end');
      s += `<line x1="${x0}" y1="${cy}" x2="${x1}" y2="${cy}" class="fd-rope" style="stroke-width:${f1(r.size * 1.25)}px;stroke-linecap:butt"/>`;
      s += label(x1 + 8, cy + 4, `${String(r.size).replace('.5', '½')} in`);
      for (let k = 0; k < r.parts; k++) s += `<rect x="${bars + k * 11}" y="${cy - 7}" width="7" height="14" class="fd-fast"/>`;
      if (r.note) s += label(bars + r.parts * 11 + 6, cy + 4, r.note);
      y += row;
    }
    s += label(x0, y + 20, 'circumference') + label(bars, y + 20, 'parts taking the load');
    svg.setAttribute('viewBox', `0 0 ${w} ${y + 30}`);
    svg.innerHTML = s;
  }

  // ---- One mast from astern, with the gear that holds each yard --------------
  function yardFigure(svg) {
    const m = window.RIGDATA && window.RIGDATA.MASTS && window.RIGDATA.MASTS.main;
    if (!m) return;
    const k = 3, cx = 205, base = 596;
    const P = (y, z) => [cx + y * k, base - z * k];
    const pts = (list) => list.map(([y, z]) => P(y, z).map(f1).join(',')).join(' ');
    const poly = (list, cls, width) => `<polyline points="${pts(list)}" class="${cls}"${width ? ` style="stroke-width:${width}px"` : ''}/>`;
    const spar = (half, z, thick) => `<polygon points="${pts([[-half, z - thick * 0.3], [0, z - thick], [half, z - thick * 0.3], [half, z + thick * 0.3], [0, z + thick], [-half, z + thick * 0.3]])}" class="fd-wood"/>`;
    const mast = (z1, z2, w) => `<polygon points="${pts([[-w, z1], [w, z1], [w * 0.8, z2], [-w * 0.8, z2]])}" class="fd-wood"/>`;
    const blk = (y, z) => { const [X, Y] = P(y, z); return `<circle cx="${f1(X)}" cy="${f1(Y)}" r="3.4" class="fd-sheave"/>`; };
    const fast = (y, z) => { const [X, Y] = P(y, z); return `<rect x="${f1(X - 3)}" y="${f1(Y - 3)}" width="6" height="6" class="fd-fast"/>`; };
    const belay = (y, z, guess) => { const [X, Y] = P(y, z); return `<circle cx="${f1(X)}" cy="${f1(Y)}" r="4" class="fd-belay${guess ? ' guess' : ''}"/>`; };
    const num = (y, z, n, ty, tz) => {
      const [X, Y] = P(y, z);
      const to = ty === undefined ? '' : line(X, Y, ...P(ty, tz), 'fd-lead');
      return to + badge(X, Y, n);
    };

    let s = '';
    // Sails, faintly, and the hull at the mast.
    const sail = (h1, z1, h2, z2) => `<polygon points="${pts([[-h1, z1], [h1, z1], [h2, z2], [-h2, z2]])}" class="fd-sail" opacity="0.55"/>`;
    s += sail(m.ryHalf - 1, m.ryZ - 1, m.tgHalf - 0.5, m.tgZ + 1.5);
    s += sail(m.tgHalf - 1, m.tgZ - 1, m.tyHalf - 1, m.tyZ + 2);
    s += sail(m.tyHalf - 1.5, m.tyZ - 1.5, m.yardHalf - 2, m.yardZ + 2.5);
    s += sail(m.yardHalf - 2, m.yardZ - 2, m.yardHalf - 4, 32);
    s += `<polygon points="${pts([[-m.railHalf, m.railZ], [-m.railHalf, 6], [m.railHalf, 6], [m.railHalf, m.railZ], [m.railHalf - 1, m.railZ], [m.railHalf - 1, m.deckZ], [-m.railHalf + 1, m.deckZ], [-m.railHalf + 1, m.railZ]])}" class="fd-hull"/>`;
    for (const side of [-1, 1]) {
      s += poly([[side * m.railHalf, m.channelZ], [side * m.channelY, m.channelZ]], 'fd-woodline', 3);
      for (const j of [0, 1, 2]) s += poly([[side * 1.5, m.capZ - 6], [side * (m.channelY - j * 1.4), m.channelZ]], 'standing');
    }
    // Masts, top, caps, cross-trees.
    s += mast(m.deckZ, m.capZ, 1.6) + mast(m.topZ - 4, m.tmCapZ, 0.95) + mast(m.crossZ - 4, m.poleZ, 0.5);
    s += poly([[-m.topHalf, m.topZ], [m.topHalf, m.topZ]], 'fd-woodline', 4);
    s += poly([[-2.6, m.capZ], [2.6, m.capZ]], 'fd-woodline', 5);
    s += poly([[-5, m.crossZ], [5, m.crossZ]], 'fd-woodline', 3);
    s += poly([[-1.6, m.tmCapZ], [1.6, m.tmCapZ]], 'fd-woodline', 4);
    // Yards.
    s += spar(m.yardHalf, m.yardZ, 1) + spar(m.tyHalf, m.tyZ, 0.75) + spar(m.tgHalf, m.tgZ, 0.5) + spar(m.ryHalf, m.ryZ, 0.35);

    // 1 Jeers: treble block at the mast-head, double block on the yard, fall to the deck.
    s += poly([[3.2, m.capZ - 7], [3.4, m.yardZ + 1.5]], 'fd-rope thick');
    s += poly([[3.2, m.capZ - 7], [4.6, m.deckZ + 9]], 'fd-rope') + poly([[4.6, m.deckZ + 9], [3, m.deckZ + 1.5]], 'fd-rope guess');
    s += blk(3.2, m.capZ - 7) + blk(3.4, m.yardZ + 1.5) + belay(3, m.deckZ + 1.5, true) + num(10, 57, 1, 4.2, 57);
    // 2 Slings.
    s += poly([[-1.2, m.capZ - 3], [-1.2, m.yardZ + 1]], 'fd-tar', 3.2) + num(-11, m.capZ - 6, 2, -1.6, m.capZ - 8);
    // 3 Truss pendents and their falls.
    s += `<ellipse cx="${cx}" cy="${f1(base - m.yardZ * k)}" rx="9" ry="4.5" class="fd-tar"/>`;
    s += poly([[-2.6, m.yardZ - 1], [-3.8, m.deckZ + 3]], 'fd-rope') + blk(-3.6, m.deckZ + 12) + blk(-3.8, m.deckZ + 3) + num(-11, m.yardZ - 9, 3, -3.2, m.yardZ - 8);
    // 4 Lift.
    s += poly([[2.6, m.capZ - 0.5], [m.yardHalf - 1, m.yardZ + 1], [3.2, m.capZ - 3], [m.railHalf - 1, m.railZ - 1]], 'fd-rope');
    s += blk(m.yardHalf - 1, m.yardZ + 1) + blk(3.2, m.capZ - 3) + belay(m.railHalf - 1, m.railZ - 1) + num(30, m.yardZ + 15, 4, 30, m.yardZ + 9.5);
    // 5 Tye and 6 halliards.
    s += poly([[0.9, m.tmCapZ - 4], [1.6, m.tyZ + 1.2], [2.2, m.tmCapZ - 5], [15, 62]], 'fd-rope thick');
    s += poly([[15, 62], [m.channelY - 1, m.channelZ + 1.5]], 'fd-rope') + poly([[16.2, 62], [m.channelY, m.channelZ + 1.5]], 'fd-rope');
    s += poly([[m.channelY - 1, m.channelZ + 1.5], [m.railHalf - 3, m.deckZ + 1.5]], 'fd-rope guess');
    s += blk(1.6, m.tyZ + 1.2) + blk(2.2, m.tmCapZ - 5) + blk(15.6, 62) + blk(m.channelY - 0.5, m.channelZ + 1.5) + belay(m.railHalf - 3, m.deckZ + 1.5, true);
    s += num(-10, m.tmCapZ + 1, 5, 0.6, m.tmCapZ - 5) + num(28, 46, 6, 19.5, 45);
    // 7 Parrel.
    s += `<ellipse cx="${cx}" cy="${f1(base - m.tyZ * k)}" rx="6" ry="3.4" class="fd-tar"/>` + num(-9, m.tyZ - 7, 7, -1.6, m.tyZ - 1);
    // 8 Topsail lift.
    s += poly([[1.5, m.tmCapZ - 0.5], [m.tyHalf - 0.8, m.tyZ + 0.8], [4.2, m.crossZ + 1.5], [5.4, m.topZ + 1], [m.channelY - 3.4, m.channelZ + 2.5]], 'fd-rope');
    s += blk(m.tyHalf - 0.8, m.tyZ + 0.8) + blk(4.2, m.crossZ + 1.5) + belay(m.channelY - 3.4, m.channelZ + 2.5) + num(22, m.tyZ + 12.5, 8, 22, m.tyZ + 6.5);
    // 9 Topgallant tye and halliards, down the other side so they can be seen.
    s += poly([[0.3, m.tgZ + 0.6], [-0.6, m.tgHoundZ + 0.5], [-2.4, 112]], 'fd-rope') + poly([[-2.4, 112], [-2.6, m.topZ + 1.5], [-2.2, m.deckZ + 1.5]], 'fd-rope');
    s += blk(-2.4, 112) + blk(-2.6, m.topZ + 1.5) + belay(-2.2, m.deckZ + 1.5) + num(-10, 112, 9, -3.2, 112);
    // 10 Jack-block.
    s += blk(1.4, m.tgHoundZ + 3) + num(8, m.tgHoundZ + 5, 10, 2.4, m.tgHoundZ + 3.4);
    // 11 Royal halliards.
    s += poly([[0, m.ryZ + 0.4], [-0.5, m.poleZ - 0.8], [-1.6, m.tgZ + 6], [-6, m.topZ + 2], [-6.4, m.deckZ + 1.5]], 'fd-rope thin');
    s += belay(-6.4, m.deckZ + 1.5, true) + num(-7, m.poleZ - 1, 11, -0.8, m.poleZ - 1.5);
    // 12 Royal clews lashed to the topgallant yard-arms.
    s += fast(m.tgHalf - 0.6, m.tgZ + 1) + fast(-m.tgHalf + 0.6, m.tgZ + 1) + num(m.tgHalf + 4.5, m.tgZ + 1, 12);

    const [, yDeck] = P(0, m.deckZ);
    s += label(cx, yDeck + 22, m.deckName, '', 'middle');
    s += label(cx + m.channelY * k + 6, base - m.channelZ * k + 4, 'channel');
    svg.setAttribute('viewBox', `40 14 330 ${base - 14 - 14}`);
    svg.innerHTML = s;
  }

  // ---- Page references into links ------------------------------------------
  const LEVER = 'https://archive.org/details/youngseaofficers00leve_0';
  function linkRefs(root) {
    const scope = root || document;
    const boxes = scope.matches && scope.matches('.refs') ? [scope] : scope.querySelectorAll('.refs');
    for (const box of boxes) {
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('a')) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const html = node.textContent
          .replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/Steel p\.(\d+)(–\d+)?/g, (all, pg) => `<a href="https://maritime.org/doc/steel/part${Number(pg) <= 193 ? 6 : 7}.htm#pg${pg}">${all}</a>`)
          .replace(/Lever p\.\d+(–\d+)?/g, (all) => `<a href="${LEVER}">${all}</a>`);
        if (html === node.textContent) continue;
        const span = document.createElement('span');
        span.innerHTML = html;
        node.replaceWith(...span.childNodes);
      }
    }
  }

  // ---- Start ----------------------------------------------------------------
  const worked = document.getElementById('worked');
  const choose = worked && workedTackle(worked);
  const cards = document.getElementById('gallery');
  if (cards) gallery(cards, choose);
  const parts = document.getElementById('fig-parts');
  if (parts) partsFigure(parts);
  const tye = document.getElementById('fig-tye');
  if (tye) tyeFigure(tye);
  const chart = document.getElementById('fig-gear');
  if (chart) gearChart(chart);
  const yards = document.getElementById('fig-yards');
  if (yards) yardFigure(yards);
  linkRefs();
})();
