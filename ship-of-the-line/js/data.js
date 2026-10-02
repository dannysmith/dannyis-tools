// Geometry of Steel's 74-gun ship, and the registry the sail files add to.
//
// Coordinates are feet: [x, y, z] = [distance abaft the stem, distance to
// starboard of the centreline, height above the waterline]. Every view in the
// tutorial is a projection of these points, so a lead is entered once.
//
// A line's `path` is its lead on the starboard side, from where it is made
// fast to where it belays. Nodes with a `step` are numbered in the diagram and
// listed in the panel. `inferred: true` marks a position the period sources do
// not give; the segment leading to it is drawn dashed.

(function () {
  // Spar lengths are Steel's. Heights above the water are estimates.
  const MASTS = {
    fore: {
      key: 'fore', x: 19.6, topZ: 70, capZ: 84, crossZ: 122, tmCapZ: 128.7, tgHoundZ: 151, poleZ: 171,
      yardZ: 64, tyZ: 115, tgZ: 147.5, ryZ: 168, yardHalf: 42.5, tyHalf: 31, tgHalf: 20.25, ryHalf: 15.5,
      topHalf: 9.8, channelY: 21, channelZ: 16.6, railHalf: 17, railZ: 22.5, deckZ: 18, hullScale: 0.82,
      mastName: 'foremast', lowerYard: 'fore yard', deckName: 'forecastle',
      decks: [{ z: 18, name: 'Forecastle' }, { z: 10, name: 'Upper deck', below: true }],
    },
    main: {
      key: 'main', x: 97.8, topZ: 78, capZ: 93, crossZ: 136.5, tmCapZ: 143.6, tgHoundZ: 169.5, poleZ: 190,
      yardZ: 72, tyZ: 130, tgZ: 165.5, ryZ: 187, yardHalf: 48.5, tyHalf: 35, tgHalf: 23.25, ryHalf: 17.5,
      topHalf: 11, channelY: 25, channelZ: 16.6, railHalf: 21, railZ: 22.5, deckZ: 18, hullScale: 1,
      mastName: 'mainmast', lowerYard: 'main yard', deckName: 'quarterdeck',
      decks: [{ z: 18, name: 'Quarterdeck' }, { z: 10, name: 'Upper deck', below: true }],
    },
    mizen: {
      key: 'mizen', x: 149.6, topZ: 67, capZ: 78, crossZ: 111, tmCapZ: 116.5, tgHoundZ: 135.5, poleZ: 152,
      yardZ: 61, tyZ: 104, tgZ: 132, ryZ: 149.5, yardHalf: 31, tyHalf: 23.5, tgHalf: 15.75, ryHalf: 11.5,
      topHalf: 8.2, channelY: 23.5, channelZ: 22, railHalf: 19.6, railZ: 29, deckZ: 25, hullScale: 0.93,
      mastName: 'mizen mast', lowerYard: 'crossjack yard', deckName: 'poop',
      decks: [{ z: 25, name: 'Poop' }, { z: 18, name: 'Quarterdeck', below: true }],
    },
  };

  const G = {
    masts: MASTS,
    deck: { upper: 10, forecastle: 18, quarter: 18, poop: 25 },
    forecastleAft: 53,
    quarterdeckFore: 95,
    poopFore: 135.5,
    taffrail: 188,
    bowspritCap: [-40, 46],
    jibboomEnd: [-72, 60],
    gaffPeak: [178, 80],
    // Half-breadth of the ship at rail level, [x abaft the stem, feet out].
    breadth: [[0, 0], [5, 8.5], [14, 15.2], [30, 19.8], [50, 21], [110, 21], [140, 20], [165, 18], [184, 15.6], [188, 14.6]],
  };

  const TIERS = ['course', 'topsail', 'topgallant', 'royal'];

  // Height and half-length of the yard a sail of this tier hangs from.
  function yard(m, tier) {
    return {
      course: { z: m.yardZ, half: m.yardHalf },
      topsail: { z: m.tyZ, half: m.tyHalf },
      topgallant: { z: m.tgZ, half: m.tgHalf },
      royal: { z: m.ryZ, half: m.ryHalf },
    }[tier];
  }

  // Outline of a sail when set: head, clews and the roach of the foot.
  function shape(m, tier) {
    const y = yard(m, tier);
    if (tier === 'course') return { headY: y.half - 2.5, headZ: y.z - 1, clewY: y.half - 1.5, clewZ: 27, footCtrlZ: 29 };
    const below = yard(m, TIERS[TIERS.indexOf(tier) - 1]);
    const rise = { topsail: 18.7, topgallant: 8, royal: 3 }[tier];
    return { headY: y.half * 0.915, headZ: y.z - 0.8, clewY: below.half - (tier === 'topsail' ? 2.5 : 1.5), clewZ: below.z + 2.3, footCtrlZ: below.z + 2.3 + rise };
  }

  // Athwartship position of the leech at height z, and height of the foot at y.
  function leechY(s, z) {
    return s.headY + ((s.headZ - z) / (s.headZ - s.clewZ)) * (s.clewY - s.headY);
  }
  function footZ(s, y) {
    const t = (y / s.clewY + 1) / 2;
    return s.clewZ * ((1 - t) * (1 - t) + t * t) + s.footCtrlZ * 2 * t * (1 - t);
  }
  // Height a given fraction of the way down the sail from its head.
  function down(s, f) {
    return s.headZ - f * (s.headZ - s.clewZ);
  }
  // Athwartship position of the lower shrouds at height z.
  function shroudY(m, z) {
    return m.channelY - ((z - m.channelZ) / (m.topZ + 2 - m.channelZ)) * (m.channelY - 1.5);
  }

  // Half-breadth of the ship at rail level, x feet abaft the stem.
  function halfBreadth(x) {
    const i = G.breadth.findIndex(([bx]) => bx >= x);
    const [x0, b0] = G.breadth[i - 1], [x1, b1] = G.breadth[i];
    return b0 + ((x - x0) / (x1 - x0)) * (b1 - b0);
  }

  const GROUPS = [
    { id: 'yard', name: 'On the yard' },
    { id: 'sail', name: 'On the sail' },
    { id: 'occasional', name: 'Rigged when needed' },
  ];

  window.RIGDATA = { G, MASTS, TIERS, GROUPS, SAILS: [], yard, shape, leechY, footZ, down, shroudY, halfBreadth };
})();
