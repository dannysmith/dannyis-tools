// The reading order for the standing rigging. Steps name a line in
// js/standing.js or carry prose of their own; `sail` picks the framing of the
// drawing (see the foot of standing.js). An <svg data-inset="…"> in a step or
// an intro is a close-up that js/ship.js draws once the page is built.

(function () {
  const S = 'standing';
  const mark = (...ids) => ids.map((id) => [S, id]);
  const inset = (name, label, caption) => `<figure class="inset"><svg data-inset="${name}" role="img" aria-label="${label}"></svg><figcaption>${caption}</figcaption></figure>`;
  const STAYS = ['fore-stay', 'main-stay', 'main-preventer-stay', 'mizen-stay', 'fore-topmast-stays', 'main-topmast-stay', 'main-topmast-preventer-stay', 'mizen-topmast-stay', 'fore-topgallant-stay', 'main-topgallant-stay', 'mizen-topgallant-stay'];

  window.RIGDATA.STORY = [
    {
      id: 'shrouds',
      title: 'Shrouds: a mast is held up one storey at a time',
      sail: S,
      intro: `
        <p>You know these names already. This part puts the ropes in order and adds what the novels leave out: what each one is set up to, how many there were, and which details changed between 1794 and 1815.</p>
        <p>Standing rigging is drawn dark and the piece being described in red. None of it is hauled on in working the ship. It is set up taut when she is rigged, and then looked after. The drawings show the mainmast; the other two are rigged the same way with fewer or lighter ropes.</p>`,
      groups: [
        {
          title: 'From the ship’s side to the masthead',
          intro: 'A lower mast stands on its step and is held at its head. From each side and from behind, the holding is done by the shrouds.',
          steps: [
            { line: 'lower-shrouds', views: ['aft'] },
            { sail: 'standing-chains', line: 'deadeyes', views: ['aft'] },
            {
              sail: 'standing-ship', views: ['side', 'plan'], mark: mark('lower-shrouds', 'deadeyes'),
              html: `
                <h4>The foot of a shroud, close up</h4>
                ${inset('deadeye', 'Three shrouds where they meet the channel, seen from outboard', 'Seen from outboard. A sketch to show the parts, not drawn to scale.')}
                <p>From the side the shrouds of each mast fan out aft along the channel, which is why they hold the mast from behind as well as from the side. On the deck plan the channels are the brown strips outside the hull abreast each mast.</p>`,
            },
            { sail: 'standing-ship', line: 'ratlines' },
          ],
        },
        {
          title: 'Round the top',
          intro: 'The top is a platform, not a strong point. Its rim spreads the topmast’s shrouds, but their pull has to be passed on downwards.',
          steps: [
            { sail: 'standing-top', line: 'futtock-shrouds', views: ['aft'] },
            { sail: 'standing-top', line: 'catharpins', views: ['aft'] },
          ],
        },
        {
          title: 'Above the top',
          intro: 'The same arrangement is repeated twice more, lighter each time.',
          steps: [
            { line: 'topmast-shrouds', views: ['aft'] },
            { line: 'topgallant-shrouds', views: ['aft'] },
            {
              sail: 'standing-ship', views: ['side', 'plan'], mark: mark('lower-shrouds', 'topmast-shrouds', 'topgallant-shrouds'),
              html: `
                <h4>How many shrouds a side</h4>
                <table class="counts">
                  <thead><tr><td></td><th scope="col">Fore</th><th scope="col">Main</th><th scope="col">Mizen</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">Lower mast</th><td>9</td><td>9</td><td>6</td></tr>
                    <tr><th scope="row">Topmast</th><td>6</td><td>6</td><td>4</td></tr>
                    <tr><th scope="row">Topgallant mast</th><td>3</td><td>3</td><td>2</td></tr>
                  </tbody>
                </table>
                <p>These are not as firm as they look. Steel’s rigging table for a 74 says “7 Pair” of lower shrouds on the fore and main masts and lists 18 deadeyes for them, and the two cannot both be right. The numbers here follow the deadeyes, for the reasons given under the lower shrouds. The topgallant figures are his “3 Pair” read as three a side; no count for the mizen topgallant mast was read from the table itself. To settle it one would count the chain-plates on the draught of a particular ship.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'stays',
      title: 'Stays and backstays: each mast leans on the one ahead',
      sail: 'standing-ship',
      intro: `
        <p>A stay holds a mast from forward. Each is set up to the mast in front of it, so the load is handed forward along the ship until it reaches the bowsprit. A backstay holds an upper mast from aft and comes down to the ship’s side.</p>
        <p>Most stays have a second beside them. Steel calls it a preventer stay and Lever a spring stay, and they are the same rope: in this period “spring stay” is not a third stay. Steel defines them as “subordinate stays to support their respective stays, and supply their places in case of any accident”, which in a warship means shot.</p>
        <p>The numbers on the drawing follow each stay from its masthead to the place where it is set up, marked in green.</p>`,
      groups: [
        {
          title: 'The lower stays',
          steps: [{ line: 'fore-stay' }, { line: 'main-stay' }, { line: 'main-preventer-stay' }, { line: 'mizen-stay' }],
        },
        {
          title: 'The topmast stays',
          intro: 'One storey up, and one mast further forward at the lower end.',
          steps: [{ line: 'fore-topmast-stays' }, { line: 'main-topmast-stay' }, { line: 'main-topmast-preventer-stay' }, { line: 'mizen-topmast-stay' }],
        },
        {
          title: 'The topgallant stays',
          steps: [{ line: 'fore-topgallant-stay' }, { line: 'main-topgallant-stay' }, { line: 'mizen-topgallant-stay' }, { line: 'flagstaff-stays' }],
        },
        {
          title: 'Backstays',
          intro: 'The lower masts have their shrouds abaft them. The upper masts have nothing abaft them at their own height, so their support from aft comes all the way down to the channels. The numbers follow the mainmast’s.',
          steps: [
            { line: 'standing-backstays' },
            { line: 'breast-backstays' },
            { line: 'shifting-backstays' },
            { line: 'topgallant-backstays' },
            {
              mark: mark('standing-backstays', 'shifting-backstays'),
              html: `
                <h4>Two more that come and go</h4>
                <p><b>Travelling backstays</b>, for bad weather. A span goes round the topmast under the parrel of the topsail yard and is set up in the chains with a luff tackle; tricing lines move it up and down with the yard. Lever gives the reason: a double-reefed topsail pulls on the mast well below its head, away from the point “where the rigging immediately counteracted it”. The travelling backstay puts the support where the yard is.</p>
                <p><b>Preventer backstays</b>, for running. “Preventer Backstays should be now got up, as the Strain on the Masts comes from abaft. The Runners, hitched round the Topmast Heads, will answer this Purpose” (Lever).</p>
                <p>Neither is drawn. A “flying topgallant backstay” on an iron outrigger from the topmast cap appears in Lever’s 1819 appendix and is too late for this ship.</p>
                <p class="refs"><a href="https://maritime.org/doc/steel/part7.htm#pg235">Steel 1794, p. 235</a>; <a href="https://archive.org/details/youngseaofficers00leve_0">Lever 1819, pp. 81, 85 and appendix</a>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'bowsprit',
      title: 'The bowsprit: where the stays end',
      sail: 'standing-ship',
      intro: `
        <p>Follow the stays forward and they arrive here. The fore stay and the fore topmast stay end on the bowsprit and the fore topgallant stay on the jibboom; the main topmast leans on the foremast head and the main topgallant mast on the fore topmast. Steel puts it in one clause: “the fore-mast and upper part of the main-mast are stayed and supported by the bowsprit”.</p>
        <p>So the bowsprit and the jibboom are being pulled upwards, and sideways when the jib is drawing. The ropes in this part hold them down and in.</p>
        ${inset('head', 'The bowsprit and jibboom in profile, with their rigging named', 'The head in profile, to the same geometry as the pinned drawing. The spritsail yard is seen end-on. The flying jibboom, dashed, is a guess at its length and position.')}`,
      groups: [
        {
          title: 'Holding the bowsprit',
          steps: [{ line: 'gammoning' }, { line: 'bobstays' }, { line: 'bowsprit-shrouds' }],
        },
        {
          title: 'Holding the jibboom',
          intro: 'The jibboom is to the bowsprit what a topmast is to a lower mast, and it needs the same two kinds of support.',
          steps: [
            { line: 'jibboom-guys' },
            { line: 'martingale' },
            {
              mark: mark('jibboom-guys', 'martingale'),
              html: `
                <h4>The flying jibboom has the same again, lighter</h4>
                <p>Lees dates the flying jibboom to 1794, the same year as the dolphin striker, and gives it guys, a martingale and a stay of its own, with the boom lying on the starboard upper side of the jibboom. All of that was seen only as snippets of his book, without the rigging description, so it is not drawn on the pinned figure. Lever’s 1819 appendix has a “Flying Jib Martingale Guy” which “reeves through a Block at the end of the Flying Jib-boom”.</p>
                <p>Steel’s 1794 table for a 74 has no flying jib gear at all.</p>
                <p class="refs">Lees, <i>The Masting and Rigging of English Ships of War</i> (1979), pp. 32, 52, 125, 159, snippets only; <a href="https://archive.org/details/youngseaofficers00leve_0">Lever 1819, appendix</a>; <a href="https://maritime.org/doc/steel/tables/pages/031-ShipOf74Guns.htm">Steel, rigging table for a 74, p. 31</a>.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'why',
      title: 'Why it is rigged this way',
      sail: 'standing-ship',
      intro: `
        <p>The period books say what each rope is for in a phrase. Put together, with some plain mechanics, the phrases make a short argument. The mechanics are mine and not from a period source; the quotations are theirs.</p>`,
      groups: [
        {
          title: 'What pushes, and what holds',
          steps: [
            {
              mark: mark('standing-backstays', 'topgallant-backstays', 'lower-shrouds'),
              html: `
                <h4>With the wind aft, the masts are pushed forward</h4>
                <p>A square sail pushes on its yard, and the yard hands the push to the mast where it is slung or parrelled. With the wind abaft the beam that push is forward, and the ropes that lead aft take it: the shrouds, whose channels lie abaft the mast, and above all the backstays, which “assist the shrouds when strained by a press of sail” (Steel).</p>
                <p>More is put up for running. Lever: “Preventer Backstays should be now got up, as the Strain on the Masts comes from abaft.”</p>`,
            },
            {
              sail: S, views: ['aft'], mark: mark('lower-shrouds', 'topmast-shrouds', 'breast-backstays'),
              html: `
                <h4>Close-hauled, they are pushed sideways</h4>
                <p>On a wind the push is mostly to leeward. The weather shrouds and the weather breast backstay take it, and the lee ones go slack. Falconer divides the backstays on exactly this line: the breast backstay sustains the topmast “when the ship sails upon a wind”, the after backstays “when the wind is further aft”.</p>`,
            },
            {
              mark: mark(...STAYS),
              html: `
                <h4>The stays work when the push is from ahead</h4>
                <p>Stays hold a mast “on the fore part”. That is needed when a sail is taken aback, when the ship pitches into a head sea and the masts whip, and whenever jibs and staysails are set, because those sails hang on the stays and drag them aft and to leeward.</p>`,
            },
            {
              sail: 'standing-top', views: ['aft'], mark: mark('futtock-shrouds', 'catharpins', 'topmast-shrouds'),
              html: `
                <h4>Each storey passes its load to the one below</h4>
                <p>Each section of mast is a strut held at its head. The topmast’s shrouds do not reach the hull. They end at the rim of the top; the futtock shrouds carry their pull down into the lower shrouds; and the catharpins stop that pull from simply spreading the lower shrouds apart. The same happens a storey up at the crosstrees.</p>`,
            },
            {
              mark: mark('fore-stay', 'fore-topmast-stays', 'fore-topgallant-stay', 'gammoning', 'bobstays', 'martingale'),
              html: `
                <h4>And the last of it ends at the stem</h4>
                <p>The stays chain forward: mizen to mainmast, main to foremast and stem, fore to bowsprit and jibboom. The bowsprit and jibboom are levers being pulled upwards, so the last links are the ropes that hold them down. The bobstays are there “to counteract the force of the stays of the fore-mast, which draw it upwards”, and Steel goes on: “The Martingal-stay supports the jib-boom, as the bobstays support the bowsprit.”</p>
                <p>It follows that a ship which carries away her bowsprit has lost the forward support of her fore topmast, and with it that of her main topgallant mast.</p>`,
            },
          ],
        },
        {
          title: 'What it costs: how far the yards will brace',
          intro: 'All this rope stands where a yard wants to swing.',
          steps: [
            {
              sail: S, views: ['aft'], mark: mark('lower-shrouds'),
              html: `
                <h4>The lee shrouds stop the yard</h4>
                ${inset('brace', 'A slice across the mast at the height of the lower yard, seen from above', 'A slice at the height of the lower yard, seen from above, bow to the right. A sketch, not to scale: the angles are the ones Steel prints.')}
                <p>Braced up, a lower yard swings until its lee side comes against the foremost lee shroud. Steel’s seamanship chapters, which translate the French writer Bourdé, give the result: “In most ships the sails make with the keel an angle … of 40 degrees, or thereabouts, (some more, some less,) when close-hauled.” Bourdé wanted 30 degrees, to be had “as in every ship the two foremost shrouds of each lower mast can be suppressed”.</p>
                <p>Steel adds a footnote of his own. The advice “cannot be followed in the British navy”: the officers of the King’s Yard had decided “that the present number and dimensions of the rigging of ships could not be advantageously altered”, and a mast with its shrouds cast off could be lost if the ship were “suddenly taken a-back”. That is a period statement that the foremost lower shrouds are what stop the yard, and that the navy meant to keep them.</p>
                <p class="refs"><a href="https://maritime.org/doc/steel/">Steel 1794, p. 253</a>.</p>`,
            },
            {
              sail: 'standing-top', views: ['aft'], mark: mark('catharpins', 'lower-shrouds', 'breast-backstays'),
              html: `
                <h4>Three details that win a few degrees</h4>
                <p>The pair of shrouds that goes over the masthead first is the foremost pair. Steel: “By this method, the yards are braced to a greater degree of obliquity, when the sails are close hauled.”</p>
                <p>The catharpins pull the shrouds in at the height of the yard, “to afford room to brace the yards sharp”.</p>
                <p>The breast backstay ends in a tackle, not a deadeye, so the lee one can be let go.</p>
                <h4>What it adds up to</h4>
                <p>Elsewhere Steel calls 35 degrees “the usual angle when near to the wind”. Lever’s figures come to the same: with the wind six points on the bow his yards are “not much more than three points from” it, which leaves them about three points, 34 degrees, from the keel.</p>
                <p>A sail needs the wind some way off its own plane before it will draw. Add that to the 35 or 40 degrees the yard makes with the keel and you arrive at the limit every novel mentions: “A square rigged vessel when close hauled … can approach no nearer to it than six points” (Lever). The sum is my arithmetic, not a period one, but the conclusion is theirs. The standing rigging that holds the masts up is also what keeps a ship of the line from pointing higher. <a href="handling.html">Steering and theory</a> takes it from there.</p>
                <p class="refs"><a href="https://maritime.org/doc/steel/part7.htm#pg197">Steel 1794, p. 197</a>, and p. 281; <a href="https://archive.org/details/youngseaofficers00leve_0">Lever 1819, pp. 75, 78</a>.</p>`,
            },
          ],
        },
      ],
    },
  ];
})();
