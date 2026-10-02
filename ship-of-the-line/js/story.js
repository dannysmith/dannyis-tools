// The reading order for the square sails: chapters, each a run of steps that
// the pinned drawing follows. A step names a line of a sail (its description
// comes from that line's record) or carries prose of its own.
//
//   { sail, line }            a line; the drawing picks it out
//   { sail, line, title }     the same, under a different heading
//   { html, sail, views }     prose with no line selected

(function () {
  const brace = (sail, title) => ({ sail, line: 'braces', title });
  const bowline = (sail, title) => ({ sail, line: 'bowlines', title });
  const all = (ids, line) => ids.map((id) => [id, line]);
  const BRACED = ['fore-course', 'fore-topsail', 'fore-topgallant', 'main-course', 'main-topsail', 'main-topgallant', 'crossjack', 'mizen-topsail', 'mizen-topgallant'];
  const BOWLINED = BRACED.filter((id) => id !== 'crossjack');

  window.RIGDATA.STORY = [
    {
      id: 'topsail',
      title: 'One sail, every rope: the main topsail',
      sail: 'main-topsail',
      intro: `
        <p>Start with one sail and follow everything that touches it. The main topsail hangs from a yard 70 feet long that slides up and down the main topmast, and its lower corners are spread by the main yard beneath it, which is 97 feet long.</p>
        <p>Sixteen kinds of rope and fitting belong to it. They are easier to hold in the head sorted by the job they do than by where they are made fast, so that is the order here: hold the yard up, spread the sail, turn it, steady it, take it in, shorten it.</p>`,
      groups: [
        {
          title: 'Holding the yard up',
          intro: 'A topsail yard is not fixed. It is hoisted to set the sail and lowered on to the cap of the lower mast to reef or furl it. Three things hold it: a purchase to lift it, a collar to keep it against the mast, and a rope to each end to keep it level.',
          steps: [{ line: 'halliards' }, { line: 'parrel' }, { line: 'lifts' }],
        },
        {
          title: 'Spreading the sail',
          intro: 'With the head of the sail on its yard, the two lower corners, the clews, have to be hauled down and outwards. A topsail has no yard of its own to stretch its foot. It borrows the one below.',
          steps: [{ line: 'sheets' }],
        },
        {
          title: 'Turning the yard',
          intro: 'The yard pivots on the mast and is swung by a rope from each end. Those ropes need something abaft the yard to pull from, and on the mainmast that is the mizen mast.',
          steps: [{ line: 'braces' }, { line: 'preventer-braces' }],
        },
        {
          title: 'Holding the weather edge',
          intro: 'Braced sharp up with the wind before the beam, the windward edge of the sail is the first part to lift and shake. It is held forward by a rope led to the next mast ahead.',
          steps: [{ line: 'bowlines' }],
        },
        {
          title: 'Taking the sail in',
          intro: 'Everything so far spreads the sail. These pull the other way, gathering it up to its yard so the men can lay out and furl it.',
          steps: [{ line: 'clewlines' }, { line: 'buntlines' }, { line: 'leechlines' }],
        },
        {
          title: 'Shortening it',
          intro: 'A topsail is reefed as a matter of routine. Lever describes it in one breath, and names nearly every rope of the sail as he goes: “the Halliards are let fly, the Clew-lines hauled on, and the Weather Brace rounded in, to spill the Sail. The Reef Tackles are hauled out, and the Men go on the Yard … The Weather Earing is first hauled out by the Man at the Yard arm … The lee Earing is then passed in the same manner, the Sail hauled well on the Yard, and the Points made fast with Reef Knots.” Then the reef tackles are let go and the yard is hoisted again.',
          steps: [{ line: 'reef-tackles' }, { line: 'reefs' }],
        },
        {
          title: 'The men on the yard, and the sail on it',
          intro: 'Reefing and furling are done by men lying over the yard with their feet on a rope slung beneath it.',
          steps: [{ line: 'horses' }, { line: 'robands' }],
        },
        {
          title: 'When it blows',
          intro: 'Two more are rigged only when the weather calls for them.',
          steps: [{ line: 'rolling-tackle' }, { line: 'spilling-lines' }],
        },
        {
          title: 'What that adds up to',
          steps: [
            {
              views: ['side', 'plan'],
              html: `
                <h4>The sail is worked from four places</h4>
                <p>Look at where the green points fall on the deck plan. The halliards come down outside the ship to the main channels and are hauled along the quarterdeck. The sheets come down the mast to the bitts on the upper deck, a level below. The braces go aft to the mizen mast and are worked on the poop. The bowlines go forward to the foremast and are worked on the forecastle. An order like “let go and haul” sets men moving at three masts at once.</p>`,
            },
            {
              views: ['aft'],
              crop: 'mast',
              html: `
                <h4>Some lines pass through the top and some go round it</h4>
                <p>Clewlines, buntlines and the bowline come down through the lubber’s hole, the opening in the top beside the masthead, which Steel calls “the square of the top”. The halliards go down abaft the top and outside it, to the channels. That keeps the heaviest purchase on the mast clear of the light gear at its foot.</p>
                <h4>The lighter the job, the higher the line stops</h4>
                <p>The sheets and halliards, which need many men, come to the deck. The lifts and buntlines, which one or two men can handle, stop at the shrouds. On the topgallant sail above, the lifts and the buntline go no lower than the top.</p>
                <h4>What the sources leave open</h4>
                <p>Steel and Lever leave the clewlines and the reef-tackle falls at “upon deck” and the halliards at “on the quarter-deck”; those are drawn dashed, at guessed positions. Steel’s table lists leech-lines for the topsail that neither text describes. And neither book says how many men went to any rope.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'course',
      title: 'The main course: a sail whose yard stays put',
      sail: 'main-course',
      intro: `
        <p>The mainsail hangs under the topsail from the main yard. It looks like the same thing a size larger, and half its ropes have the same names. The differences come from two facts: its yard does not travel, and there is no yard below it for its clews.</p>`,
      groups: [
        {
          title: 'A yard that is hoisted once',
          intro: 'The main yard is swayed up into place and left there. So a course has no halliards. It is set by letting it fall from the yard and taken in by hauling it up to a yard that never moves.',
          steps: [{ line: 'jeers' }, { line: 'slings' }, { line: 'trusses' }, { line: 'lifts' }],
        },
        {
          title: 'Clews held down to the hull',
          intro: 'A topsail’s clews go to the yard below. A course has only the ship beneath it, so each clew has two ropes to the ship’s side: a tack leading forward and a sheet leading aft. On either tack the weather clew is held by its tack and the lee clew by its sheet, and the other two hang slack.',
          steps: [{ line: 'tacks' }, { line: 'sheets' }],
        },
        {
          title: 'Four ways of hauling it up',
          intro: 'Where the topsail has clewlines and two buntlines, the course has a rope for each part of the sail: the corners, the foot, the sides, and the middle of the foot.',
          steps: [{ line: 'clew-garnets' }, { line: 'buntlines' }, { line: 'leechlines' }, { line: 'slablines' }],
        },
        {
          title: 'Turning and steadying',
          intro: 'The main brace is as far aft as a rope can go. The bowline and the wartime preventer brace go the other way, to the forecastle.',
          steps: [{ line: 'braces' }, { line: 'preventer-braces' }, { line: 'bowlines' }],
        },
        {
          title: 'The rest of the yard',
          steps: [{ line: 'yard-tackles' }, { line: 'horses' }, { line: 'bending' }, { line: 'spilling-lines' }],
        },
        {
          title: 'What that adds up to',
          steps: [
            {
              views: ['side', 'plan'],
              html: `
                <h4>The heavy work is a deck down</h4>
                <p>The squares on the deck plan are belaying points on the upper deck, under the gangways and the quarterdeck, among the guns. The tacks and sheets come in there through sheave-holes in the ship’s side, and the clew garnets come to the bitts there.</p>
                <h4>Half its gear is worked from the forecastle</h4>
                <p>The bowlines cross at the foot of the foremast, the buntlines lead forward, and so do the preventer braces. The mainsail is not handled from round the mainmast.</p>
                <h4>What the sources leave open</h4>
                <p>The truss tackles lead to the deck in Steel (1794) and aloft in Lever (1808). The main sheet goes to the upper deck in Steel and to the quarterdeck in the restored <i>Victory</i>. Where the buntline falls and the jeer falls are made fast is not stated by either.</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'upper',
      title: 'Topgallants and royals: what gets left off',
      sail: 'main-topgallant',
      intro: `
        <p>Above the topsail the same pattern repeats with less and less of it. A topgallant sail is a topsail with everything single. A royal has almost nothing.</p>`,
      groups: [
        {
          title: 'The topgallant sail',
          intro: 'One tye where the topsail has two; lifts with no purchase; one buntline; no reefs. And much of its gear never reaches the deck.',
          steps: [{ line: 'halliards' }, { line: 'lifts' }, { line: 'sheets' }, { line: 'clewlines' }, { line: 'buntline' }, { line: 'braces' }, { line: 'bowlines' }, { line: 'horses' }, { line: 'bending' }, { line: 'yard-rope' }],
        },
        {
          title: 'The royal',
          intro: 'The royal is “set flying”. There is no separate royal mast: the topgallant mast has a long pole head above its rigging, and the royal yard is hoisted on that from the deck with the sail already bent to it. Steel’s table of rigging for a 74 does not list any royal gear at all.',
          steps: [{ sail: 'main-royal', line: 'halliards' }, { sail: 'main-royal', line: 'clews' }, { sail: 'main-royal', line: 'braces' }],
        },
      ],
    },
    {
      id: 'masts',
      title: 'The same sails on the other masts',
      sail: 'fore-topsail',
      intro: `
        <p>The fore topsail has the same sixteen things as the main topsail, and the foresail the same as the mainsail. Steel describes the gear of one mast and writes “as the fore-topsail” for the next. What changes from mast to mast is where the ropes that leave the mast go: the braces, which lead aft, and the bowlines, which lead forward.</p>`,
      groups: [
        {
          title: 'Where the braces go',
          intro: 'Every yard is braced from the next mast aft. The drawing shows all of them at once. Follow them from the bow.',
          rest: all(BRACED, 'braces'),
          steps: [
            brace('fore-course', 'Fore braces'),
            brace('fore-topsail', 'Fore topsail braces'),
            brace('fore-topgallant', 'Fore topgallant braces'),
            {
              rest: all(BRACED, 'braces'),
              views: ['side', 'plan'],
              sail: 'fore-topsail',
              html: `
                <h4>Not what you might expect</h4>
                <p>On the foremast the course is braced from furthest aft, the topsail from the after end of the forecastle and the topgallant from the belfry. The rule often given for later ships, that the higher sail belays further aft, is the reverse of what Steel describes.</p>`,
            },
            brace('main-course', 'Main braces'),
            brace('main-topsail', 'Main topsail braces'),
            brace('main-topgallant', 'Main topgallant braces'),
            brace('crossjack', 'Crossjack braces'),
            brace('mizen-topsail', 'Mizen topsail braces'),
            brace('mizen-topgallant', 'Mizen topgallant braces'),
          ],
        },
        {
          title: 'Where the bowlines go',
          intro: 'Bowlines lead to the next mast forward, and on the foremast to the bowsprit. Two of them cross to the opposite side.',
          rest: all(BOWLINED, 'bowlines'),
          steps: [
            bowline('fore-course', 'Fore bowlines'),
            bowline('fore-topsail', 'Fore topsail bowlines'),
            bowline('fore-topgallant', 'Fore topgallant bowlines'),
            bowline('main-course', 'Main bowlines'),
            bowline('main-topsail', 'Main topsail bowlines'),
            bowline('main-topgallant', 'Main topgallant bowlines'),
            bowline('mizen-topsail', 'Mizen topsail bowlines'),
            bowline('mizen-topgallant', 'Mizen topgallant bowlines'),
          ],
        },
        {
          title: 'Three more differences',
          intro: 'Beyond braces and bowlines, three things are forced by where a mast stands.',
          steps: [
            { sail: 'fore-course', line: 'tacks', title: 'The fore tack goes outside the ship' },
            { sail: 'crossjack', line: 'sheet-blocks', title: 'The mizen has a yard with no sail' },
            { sail: 'mizen-topsail', line: 'halliards', title: 'The mizen topsail has one halliard' },
          ],
        },
      ],
    },
  ];
})();
