// The reading order for the fore-and-aft sails. Same format as story.js:
// chapters, each a run of steps that the pinned drawing follows.
//
//   { line }                  a line of the chapter's sail
//   { sail, line, title }     a line of another sail, under its own heading
//   { html, sail, mark }      prose; `mark` picks out several lines at once

(function () {
  // Every line of a sail, in the order given, as steps.
  const of = (sail, ids) => ids.map((line) => ({ sail, line }));
  const all = (sail, ids) => ids.map((line) => [sail, line]);

  window.RIGDATA.STORY = [
    {
      id: 'staysail',
      title: 'A staysail and its four ropes',
      sail: 'fore-staysail',
      intro: `
        <p>A square sail hangs from a yard across the ship and needs a dozen kinds of rope to manage it. A fore-and-aft sail lies along the ship, and the simplest of them, a staysail, needs four. It is a triangle of canvas hanging from one of the stays that hold a mast forward.</p>
        <p>Start with the plainest one on the ship, the fore staysail, which sets between the foremast head and the bowsprit. Then take the sail above it, which adds one idea. Everything else on this page is built out of these parts.</p>`,
      groups: [
        {
          title: 'The stay does the work of a yard',
          intro: 'The sail is not hoisted on a spar. Its leading edge is hung on a rope that is already there.',
          steps: [{ line: 'stay' }],
        },
        {
          title: 'One rope up, one rope down',
          intro: 'The head of the sail travels up and down the stay. A rope hauls it each way, and the two are never hauled together.',
          steps: [{ line: 'halliard' }, { line: 'downhauler' }],
        },
        {
          title: 'One corner fixed, one corner trimmed',
          intro: 'With the head up, the sail has two lower corners. The forward one is held where it is. The after one is what the wind pulls on, and it has the rope that needs men.',
          steps: [{ line: 'tack' }, { line: 'sheets' }],
        },
        {
          title: 'The same sail one stay higher',
          intro: 'The fore topmast staysail sets from the fore topmast head to the bowsprit end. It is the headsail a ship carries longest as the weather worsens. It has the same four ropes, with two differences: Steel gives it a stay of its own that is set up from the deck, and its tack is hauled out along the bowsprit instead of being lashed.',
          steps: of('fore-topmast-staysail', ['stay', 'halliard', 'downhauler', 'outhauler', 'sheets']),
        },
        {
          title: 'What that adds up to',
          steps: [
            {
              sail: 'fore-staysail',
              mark: all('fore-staysail', ['halliard', 'downhauler', 'sheets']),
              html: `
                <h4>Two pairs of opposites</h4>
                <p>Halliard against downhauler: up the stay and down it. Tack against sheet: the fore corner held, the after corner let out or hauled in. To set the sail, let go the downhauler, hoist on the halliard, haul aft the lee sheet. To take it in, do the reverse.</p>
                <h4>Nobody goes aloft</h4>
                <p>All four ropes end on the forecastle. That is the practical difference from a square sail, which has to be loosed and furled by men on its yard. A staysail goes up and comes down from the deck, and is only handled by hand to stow it.</p>`,
            },
            {
              sail: 'fore-topmast-staysail',
              mark: all('fore-topmast-staysail', ['stay', 'halliard']),
              html: `
                <h4>Larboard for one sail, starboard for the next</h4>
                <p>At the fore topmast head there is a cheek-block on each side. Steel reeves the fore topmast staysail’s stay and halliard through the larboard one, and the jib’s through the starboard one. On the deck plan the staysail’s halliard comes down the larboard side of the forecastle and the jib’s the starboard.</p>
                <h4>Where the sources go quiet</h4>
                <p>Steel’s running text does not rig the fore staysail at all; its leads here are Lever’s, and Lever leaves the halliard at “the side”. Neither author names a fitting for any downhauler. And they disagree about the fore topmast staysail’s stay: Steel gives it its own, Lever bends the sail to the fore topmast spring stay.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'jib',
      title: 'The jib: a sail whose tack travels',
      sail: 'jib',
      intro: `
        <p>The jib is the big headsail, set from the fore topmast head to the jibboom. Falconer calls it “a sail of great command with any side-wind”: it is a long way forward of the point the ship turns about, so it has great leverage on her head.</p>
        <p>It has the four ropes of any staysail. What makes it different is that its tack is not fixed. The jibboom is a light spar, and a ship needs to be able to bring the jib’s pull inboard as the wind rises without taking the sail in. So the tack rides on a ring that slides along the boom, and three more ropes are needed to move it.</p>`,
      groups: [
        {
          title: 'A tack on a ring',
          intro: 'First the ring, then the stay that is made fast to it, then the two ropes that pull the ring out and in.',
          steps: [{ line: 'tack' }, { line: 'stay' }, { line: 'outhauler' }, { line: 'inhauler' }],
        },
        {
          title: 'The usual four',
          intro: 'With the traveller in place and the stay taut, the jib is an ordinary staysail.',
          steps: [{ line: 'halliard' }, { line: 'downhauler' }, { line: 'sheets' }],
        },
        {
          title: 'Handling it',
          steps: [
            {
              mark: all('jib', ['outhauler', 'stay', 'halliard', 'sheets']),
              html: `
                <h4>To set it, work from the tack upwards</h4>
                <p>Neither Steel nor Lever gives a drill for setting a jib. From the leads, the order has to be: haul the traveller out with the outhauler, easing the inhauler and the fall of the stay; set the stay taut; hoist on the halliard; trim the lee sheet. That is my reading of the gear, not a quoted procedure.</p>
                <h4>To take it in, Steel does give the order</h4>
                <p>“Man well the down-haul, let go the haliards, ease off the sheet, and haul down briskly; and, when the sail is close down, ease away the out-haul, and haul the sail in to the bowsprit cap; then let it be stowed away in the fore staysail netting.”</p>
                <h4>Part-way in</h4>
                <p>Shortening sail on a wind, Lever’s first step is “The Jib is hauled one-third in”. With the traveller in the middle of the boom the jib’s pull comes on an unsupported part of the spar. Lever’s answer is a second, inner martingale stay from the traveller down through the dolphin striker, “very serviceable when the Jib is a third, or half in, as it acts immediately under the Stay”.</p>`,
            },
          ],
        },
        {
          title: 'One more sail outside it: the flying jib',
          intro: 'By 1805 a ship might carry a second jib beyond the first, on a boom of its own. It is drawn here because the reference ship is of that date, but almost every line of it is dashed.',
          steps: of('flying-jib', ['boom', 'stay', 'tack', 'halliard', 'downhauler', 'sheets']).concat([
            {
              sail: 'flying-jib',
              html: `
                <h4>How thin the evidence is</h4>
                <p>The date, 1794, is from James Lees’s modern book, seen here only as search snippets. Steel, writing in that year, rigs no flying jib and his table for a 74 has no gear for one. Moore in 1801 says the sail is “sometimes set”. Lever’s main text of 1808 has only the jib; the flying jibboom turns up in his appendix of 1819, and then only in passing, as the place a martingale guy leads to.</p>
                <p>So no period source read for this page describes how the flying jib was rigged. The stay, the traveller and the halliard’s hole in the pole head come from Lees’s snippets. The downhauler, the sheets and every belaying point are guesses by analogy with the jib. Lees’s own description (his pages 125 and 126) would settle it and has not been read.</p>`,
            },
          ]),
        },
      ],
    },
    {
      id: 'between',
      title: 'Staysails between the masts',
      sail: 'main-topmast-staysail',
      intro: `
        <p>Every stay that runs forward from the mainmast or the mizen mast can carry a sail too. A 74 has four between the foremast and mainmast and two or three between the mainmast and mizen. They draw with the wind on the beam or forward of it, and fill the spaces between the masts.</p>
        <p>They differ from the headsails in two ways. They are four-sided, with a short upright fore edge called the nock, so that they fill the space abaft the mast ahead. And they hang over other rigging: under each one is another stay, and the sheet has to get past it every time the ship goes about.</p>`,
      groups: [
        {
          title: 'The working one: the main topmast staysail',
          intro: 'This is the one set as a matter of routine with the wind forward of the beam. It is big enough to need brails as well as a downhauler.',
          steps: of('main-topmast-staysail', ['stay', 'halliard', 'downhauler', 'brails', 'tacks', 'sheets']),
        },
        {
          title: 'Going about',
          steps: [
            {
              sail: 'main-topmast-staysail',
              mark: all('main-topmast-staysail', ['sheets']),
              html: `
                <h4>The sheet has to go over the stay beneath</h4>
                <p>Look at the profile. The clew of the main topmast staysail hangs below the main stay, the heavy stay that runs from the main masthead down to the bows. On the starboard tack the sail lies to larboard of that stay, held by its larboard sheet. When the ship tacks, the sail has to end up on the other side of the stay, and the clew and its sheet cannot pass through it.</p>
                <p>So in going about the lee sheet is let go, the clew is lifted over the stay, and the other sheet is hauled aft on the new side. This is true of every staysail between the masts: each has its sheets passed over the stay below it. Lever says the sails had been cut so deep “that it is sometimes difficult in working, to get the sheets over the Main Stay”, and describes a downhauler led to the clew to trice it up for shifting over.</p>
                <p>The headsails have the same problem in a milder form. The jib’s sheets lie over the fore topmast stay and the fore topmast staysail’s over the fore stay.</p>`,
            },
          ],
        },
        {
          title: 'Below it: the main staysail',
          intro: 'Low down, along the main stay. A plain three-sided sail, the only one of this group without a nock. Steel says it is “seldom used in large vessels” and “seldom bent in ships but at sea”.',
          steps: of('main-staysail', ['stay', 'halliard', 'downhauler', 'tack', 'sheets']),
        },
        {
          title: 'Above it: the middle staysail',
          intro: 'A fair-weather sail between the fore topmast and the main topmast head. Its stay is the odd thing about it.',
          steps: of('middle-staysail', ['stay', 'tricing-line', 'halliard', 'downhauler', 'tacks', 'sheets']),
        },
        {
          title: 'Highest: the main topgallant staysail',
          intro: 'For light airs. Its gear stops in the fore top where it can, and the sail is stowed there.',
          steps: of('main-topgallant-staysail', ['stay', 'halliard', 'downhauler', 'tacks', 'sheets']),
        },
        {
          title: 'Abaft the mainmast: the mizen staysail',
          intro: 'The same pattern repeats between the mainmast and the mizen, a size smaller. The mizen staysail is the routine one. Like the main topmast staysail it is brailed.',
          steps: of('mizen-staysail', ['stay', 'halliard', 'downhauler', 'brails', 'tack', 'sheets']),
        },
        {
          title: 'The mizen topmast and topgallant staysails',
          intro: 'Fair-weather and light-weather sails. Their tacks go to the main top and their sheets to the mizen shrouds.',
          steps: of('mizen-topmast-staysail', ['stay', 'halliard', 'downhauler', 'tacks', 'sheets']).concat(
            of('mizen-topgallant-staysail', ['stay', 'halliard', 'downhauler', 'tacks', 'sheets']).map((s) => Object.assign(s, { title: { stay: 'Mizen topgallant staysail: its stay', halliard: 'Its halliard', downhauler: 'Its downhauler', tacks: 'Its tacks', sheets: 'Its sheets' }[s.line] }))
          ),
        },
        {
          title: 'What that adds up to',
          steps: [
            {
              sail: 'main-topmast-staysail',
              mark: all('main-topmast-staysail', ['halliard', 'downhauler', 'sheets']),
              html: `
                <h4>The head goes to the mast behind, the foot to the mast ahead</h4>
                <p>Every one of these sails is hoisted towards the after mast and hauled down towards the forward one. So the halliard comes down by the after mast and the downhauler, brails and tacks by the forward one: the main topmast staysail’s halliard is on the quarterdeck and its downhauler on the forecastle. The sheets go to the ship’s side in between.</p>
                <h4>The higher the sail, the more of it stays aloft</h4>
                <p>The main staysail’s tack is at the deck. The main topmast staysail’s tacks come down the fore shrouds. The middle and topgallant staysails’ tacks belay in the fore top, and the topgallant staysail’s stay and downhauler end there too. It is the same rule as on the square sails: light gear stops where one or two men can reach it.</p>
                <h4>Lee brail first</h4>
                <p>The brailed staysails are taken in from the lee side. Steel: “Man well the lee brail and downhaul, having a few hands to gather in the slack of the weather brail; then let go the haliards, ease off the sheet, and haul down and brail up as briskly as possible.”</p>`,
            },
            {
              sail: 'middle-staysail',
              html: `
                <h4>Which were set when</h4>
                <p>The main topmast staysail and the mizen staysail are ordinary working sails. The middle staysail and the mizen topmast staysail are for fair weather, the two topgallant staysails for light airs, and the mizen topgallant staysail was carried only “sometimes”. With the wind right aft none of them is any use: “the Driver, Jib, and Staysails are hauled down” (Lever), because the square sails take their wind.</p>
                <h4>Where the sources disagree or go quiet</h4>
                <ul>
                  <li>The main topmast staysail’s halliard is on the larboard side in Steel and the starboard in Lever.</li>
                  <li>The main topgallant staysail’s downhauler goes to the deck abaft the mainmast in Steel and into the fore top in Lever.</li>
                  <li>The mizen topmast staysail’s tacks go to the main topmast shrouds in Steel and the main shrouds in Lever.</li>
                  <li>Steel’s belaying points are those of the 20-gun ship in his plates, which has no poop. Where a rope comes down abreast the mizen mast, the deck it lands on in a 74 is my reading.</li>
                  <li>The outlines of the sails are drawn to look right. Steel’s tables of sail dimensions for a 74 were not read for this page, so the depth of each nock and the height of each clew are estimates.</li>
                  <li>The four-sided shape itself is dated to 1760 by Lees, from a snippet.</li>
                </ul>`,
            },
          ],
        },
      ],
    },
    {
      id: 'mizen',
      title: 'The mizen, the driver and the spanker',
      sail: 'mizen',
      intro: `
        <p>The fore-and-aft sail on the mizen mast is the one whose name causes most trouble, because between 1790 and 1810 the spar it hung from changed, the sail itself was replaced by another, and the words moved from one to the other.</p>
        <p>In 1805 there are two sails. The <b>mizen</b> is the standing sail: four-sided, laced to the gaff and the mast, with no boom, taken in by brails. The <b>driver</b>, which the same people also called the <b>spanker</b>, is a larger sail set in its place in fair weather, with its foot spread by a boom. Take the mizen first, then the two older and alternative ways of carrying it, then the boom and the driver, and last the dates.</p>`,
      groups: [
        {
          title: 'The standing sail',
          intro: 'A gaff that stays aloft, a sail fixed to it along two edges, and one rope to its free corner.',
          steps: [{ line: 'gaff' }, { line: 'lacing' }, { line: 'tack' }, { line: 'sheet' }],
        },
        {
          title: 'Steadying the peak',
          intro: 'The gaff is held up by its slings and tye, but nothing so far stops its outer end swinging from side to side.',
          steps: [{ line: 'vangs' }],
        },
        {
          title: 'Taking it in without lowering anything',
          intro: 'A staysail is hauled down. The mizen cannot be: its gaff does not come down and its head is laced on. Instead the after edge is drawn forward and upward, like a curtain pulled to one side. That is brailing.',
          steps: [{ line: 'brails-throat' }, { line: 'brails-middle' }, { line: 'brails-peak' }, { line: 'fancy-line' }],
        },
        {
          title: 'What came before: the mizen yard',
          intro: 'The gaff is the after half of something older. Until about 1800 a ship of the line carried the whole lateen yard, though the sail on it had long since been cut down to the part abaft the mast.',
          steps: of('mizen-yard', ['jeers', 'derrick', 'bowlines']).concat([
            {
              sail: 'mizen-yard',
              html: `
                <h4>From yard to gaff, in the sources’ own dates</h4>
                <ul>
                  <li><b>1769.</b> Falconer: the mizen is “extended sometimes by a gaff, and sometimes by a yard which crosses the mast obliquely”. The gaff is for small ships.</li>
                  <li><b>1794.</b> Steel defines a gaff as a pole projecting from the mizen mast of ships “except those of the line”. His table gives the 74 a mizen yard of 84 feet and no gaff. “The mizen-yard is not often used, except in ships above 50 guns, and in East-India ships.”</li>
                  <li><b>1798.</b> Nelson’s <i>Vanguard</i> still had her mizen yard at the Nile, and is said to have been the only ship there that did. This is from Longridge and a modern article, not a period source.</li>
                  <li><b>1801.</b> Moore still writes “the mizen-yard or gaff”.</li>
                  <li><b>1808.</b> Lever: “These Yards were formerly used by all Line of Battle Ships, and East Indiamen; but they are now entirely laid aside.”</li>
                </ul>
                <p>There is no single date. Lees puts the start of the change in large ships at about 1790. A forum summary that could not be opened speaks of captains writing for leave to make the change, which would mean it went ship by ship; that is unverified. For a 74 of 1805 a gaff is right; for one of 1793 a mizen yard is right.</p>
                <p>Lever explains why the long yard lasted after the sail had shrunk: “when it was reduced to its present shape, the whole Yard was still retained in large Ships”, as a spare spar that could be made into a jury fore yard.</p>`,
            },
          ]),
        },
        {
          title: 'The other way to rig a gaff',
          intro: 'Lever describes the gaff slung, as drawn so far, and then says that “often” it is rigged to hoist instead. A hoisting gaff changes more than its own gear.',
          steps: of('hoisting-gaff', ['throat-halliard', 'peak-halliard', 'peak-downhauler']).concat([
            {
              sail: 'hoisting-gaff',
              mark: all('hoisting-gaff', ['throat-halliard', 'peak-halliard']),
              html: `
                <h4>What a hoisting gaff takes away</h4>
                <p>A standing gaff is a fixed point high up abaft the mizen mast, and other gear uses it. The vangs hold its peak. The mizen topsail and topgallant braces lead to blocks at the peak and come down at the taffrail. A gaff that goes up and down can carry none of that: “there are no Vangs, nor Blocks for the Mizen Topmast and Mizen Top-gallant Braces, which then lead forwards”. Those braces go to the mainmast instead.</p>
                <p>Which a given ship had in 1805 cannot be told from these books. The drawing follows the standing gaff. Lees says the mizen topsail braces were led forward from 1806, which may mark the change; that is from a snippet.</p>`,
            },
          ]),
        },
        {
          title: 'The boom',
          intro: 'Now the spar under the foot. The mizen does not use it. It is there for the driver, and it needs holding up, down and sideways.',
          steps: of('driver', ['boom', 'topping-lifts', 'boom-sheet', 'boom-guys']),
        },
        {
          title: 'The driver, or spanker',
          intro: 'In 1805 this is still an extra sail, sent up in fair weather over a brailed-up mizen. Everything about its gear says “temporary”: it is hoisted to the gaff from the deck, and hauled out along the boom by a rope.',
          steps: of('driver', ['sheet', 'halliards', 'throat-halliard', 'tack', 'downhauler']),
        },
        {
          title: 'What each word meant when',
          steps: [
            {
              sail: 'driver',
              html: `
                <h4>Three sails, not two</h4>
                <p>James Lees, the modern authority, separates three things, and it helps to do the same.</p>
                <ul>
                  <li><b>The mizen.</b> The standing sail described above. Loose-footed, brailed. This is what an officer of 1805 means by “the mizen”.</li>
                  <li><b>The driver as first known.</b> A fair-weather extra, in effect a studding sail for the mizen. Falconer, 1769: “an oblong sail, occasionally hoisted to the mizen-peak, when the wind is very fair. The lower corners of it are extended by a boom or pole, which is thrust out across the ship, and projects over the lee-quarter.” Steel’s table of 1794 gives a 74 this one: “Driver Hallyards, 2 Pair; Sheets, 2; Tacks, 2; Downhaller”, and no driver boom.</li>
                  <li><b>The boomed driver.</b> A large gaff-and-boom sail set instead of the mizen. Steel calls it the “driver boomsail … occasionally hoisted to the mizen-yard or gaff, in light fair winds”. Lever in 1808: “The Driver or Spanker is now cut Mainsail Fashion: and, in this case, it is spread by a Boom”, and “The Spanker acts as a large Mizen”. But also, still: “The Studding Sails and Driver are for temporary Use.” This is the sail drawn here.</li>
                </ul>
                <h4>Driver and spanker are the same word</h4>
                <p>In these years the two names are synonyms for the fair-weather sail. Steel writes “the driver, or spanker”. Moore, 1801: “Spanker, a name sometimes given to a ship’s Driver.” Falconer in 1769 has no entry for spanker at all. Lever uses both on one page.</p>
                <p>The tidy modern rule, that the driver is the temporary sail and the spanker the permanent one, is Lees’s own convention, adopted “in differentiating between the two sails”. It is useful, but a lieutenant of 1805 would not have known it.</p>`,
            },
            {
              sail: 'driver',
              mark: all('driver', ['sheet', 'boom-sheet', 'topping-lifts']),
              html: `
                <h4>When the driver took over</h4>
                <ul>
                  <li><b>1793.</b> “Mizen sail fitted with a boom” (Lees).</li>
                  <li><b>1794.</b> Steel’s 74: mizen yard, brailed mizen, old-style driver set flying, no boom.</li>
                  <li><b>About 1800 to 1808.</b> Gaff, brailed mizen as the working sail, boom fitted, large driver set over it in fair weather. This stage is an inference from Lees, Moore and Lever; no one source describes a 74 in exactly this state.</li>
                  <li><b>1806 or 1810.</b> “Driver fitted as a permanent sail, replacing mizen sail.” Lees’s chronology puts this after 1806; his chapter on sails says 1810. Both are from snippets and they cannot be reconciled without the book.</li>
                </ul>
                <p>Once permanent, the boomed sail was laced to the gaff, hauled out along the boom, and taken in by brails like the mizen it replaced. Lees lists throat, peak, middle and foot brails for it. That description has not been read.</p>
                <h4>When it is taken in</h4>
                <p>With the wind right aft, Lever takes the driver in “because it will not stand well, or if it did, being so far aft, it would cause the Ship to steer wild”. In a rising breeze on the quarter it “may occasion her to gripe”, that is, to carry weather helm.</p>
                <h4>Two things called a sheet</h4>
                <p>On the drawing the rope from the clew through the boom end is what Steel calls the driver’s sheet and Lever the sheet rope. The tackle from the boom down to the deck is the boom sheet. In a period text “the driver sheet” is the first of these, not the second.</p>
                <h4>Where this drawing is weakest</h4>
                <p>The boom is drawn about 42 feet long; Steel’s rule would make it 70. Where the driver’s halliards belay is not stated by anyone. And the three boom fittings come from two books fourteen years apart.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'spritsail',
      title: 'The spritsail: a square sail in the wrong place',
      sail: 'spritsail',
      intro: `
        <p>Two sails on this page are not fore-and-aft at all. Under the bowsprit hangs a yard as long as the fore topsail yard, with a square sail on it, and beyond that, under the jibboom, a second smaller one. By 1805 they are on their way out.</p>
        <p>The plan view is the one to watch here. From the side the yard is seen end-on, as a dot under the bowsprit.</p>`,
      groups: [
        {
          title: 'A yard under the bowsprit',
          intro: 'It is rigged like any yard, with slings, lifts and braces. Only the directions are strange.',
          steps: [{ line: 'slings' }, { line: 'lifts' }, { line: 'braces' }],
        },
        {
          title: 'The sail',
          intro: 'Sheets to spread it, clewlines and buntlines to take it in, as on a course.',
          steps: [{ line: 'sheets' }, { line: 'clewlines' }, { line: 'buntlines' }, { line: 'reefs' }],
        },
        {
          title: 'Why it was awkward',
          steps: [
            {
              mark: all('spritsail', ['braces', 'lifts']),
              html: `
                <h4>It cannot be braced round</h4>
                <p>Any other square sail is turned to the wind by swinging its yard round the mast. This yard cannot swing far: the bowsprit and its rigging are in the way. So on a wind the yard is tilted instead. “When going by the Wind, the Spritsail Yard is topped up by the lee Brace … the Sail is then obliged to be reefed to prevent its dragging in the Water” (Lever). That is what the diagonal reef is for. With the lee yardarm cocked up and the lower corner reefed away, what is left of the foot lies roughly level.</p>
                <h4>It sets in the sea</h4>
                <p>It hangs under the bowsprit, close to the water, and is “liable to be immersed” when the ship pitches. Hence the holes cut in it to let the water out.</p>
                <h4>The yard is heavy and a long way forward</h4>
                <p>Lever, in 1819: “the great weight of a Yard, equal in size to the Fore Topsail Yard, lying so far out when a Ship is pitching … adds considerably to the Strain on the Bowsprit”. To reef or furl the sail, men go out on that yard, over the sea.</p>
                <h4>What it was still good for</h4>
                <p>It is a headsail that draws with the wind right aft, when the jib and staysails are becalmed. And Lever says it “would be found most essential, to wear a Ship, should any Accident happen to the Foremast”.</p>
                <p>The list of difficulties is my summary of what Steel, Lever and Falconer say in different places. None of them sets it out as a list.</p>`,
            },
          ],
        },
        {
          title: 'Why the yard stayed',
          intro: 'The sail was going. The yard had a second job that had nothing to do with it.',
          steps: [
            { line: 'jib-guys' },
            {
              mark: all('spritsail', ['jib-guys']),
              html: `
                <h4>Going out of use, by the dates</h4>
                <ul>
                  <li><b>1794.</b> Steel makes, rigs and bends the spritsail without comment, and lists it in the table for a 74.</li>
                  <li><b>1808.</b> Lever: “This Sail, as well as the Yard, are now in many Ships laid aside.”</li>
                  <li><b>1819.</b> Lever’s appendix: “When no Spritsail Yard is carried, the Jib-boom may be equally secured by Guys to an Outrigger or Boomkin … This method has I presume been followed by many Ships in the Royal Navy.”</li>
                  <li><b>1811 to 1830.</b> Lees: the yard “was relegated to a spreader”, and stayed as one until proper spreaders replaced it in 1850. From snippets, which give slightly different end dates.</li>
                </ul>
                <p>So a 74 of 1805 carries the yard and a spritsail, and the yard does two jobs: it always spreads the jibboom guys, and less and less often it sets a sail. The two jobs interfere. Topping the yard for the sail moves the thimbles the guys run through, which is why Lever’s order for coming on a wind ends with “the Jib Guys set up”. That every change of tack means doing it again is my inference from that passage.</p>`,
            },
          ],
        },
        {
          title: 'The sprit topsail',
          intro: 'A light-weather sail beyond the spritsail, under the jibboom, with its clews spread by the spritsail yard. The old upright sprit topmast on the bowsprit end was long gone; Falconer in 1769 says it “has of late been justly rejected”.',
          steps: of('sprit-topsail', ['halliard', 'parrel', 'braces', 'lifts', 'sheets', 'clewlines']).concat([
            {
              sail: 'sprit-topsail',
              html: `
                <h4>A topsail turned on its side</h4>
                <p>Compare it with a topsail on a mast. The jibboom is the mast, lying nearly flat. The yard is hoisted along it by a halliard. The clews are sheeted to the yard below, here the spritsail yard. Using the lower yard’s lifts as the upper sail’s sheets is the same economy that, until about 1790, made the topsail lifts serve as topgallant sheets.</p>
                <h4>How long it lasted, and a doubt</h4>
                <p>Steel rigs it in full and Lever in 1808 has a ship “set the Spritsail and Spritsail Topsail” when making sail with the wind abaft the beam. Lees says it was no longer issued from 1815; Longridge says <i>Victory</i>’s was abolished “a few years after Trafalgar”.</p>
                <p>The dolphin striker, which came in in 1794, hangs down from the bowsprit cap into the same space, with the martingale stay running through it to the jibboom end. Steel and Lever describe both on one bowsprit. John Harland, in a note of 1977 known here only from its abstract, doubted that the restored <i>Victory</i> should show both, “as the use of one would have compromised the other”.</p>
                <h4>Where the sources go quiet</h4>
                <p>Where the spritsail yard hangs on the bowsprit, how deep the sail is, and where its sheets come inboard are not given in what was read; they are drawn by eye. Steel’s “fore-stay collar”, where the spritsail brace is made fast, can be read two ways. And for most of this gear Steel says only that the rope “leads in upon the forecastle”.</p>`,
            },
          ]),
        },
      ],
    },
  ];
})();
