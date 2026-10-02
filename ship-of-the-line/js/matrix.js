// Which square sail has which line. y = fitted, n = the sources say not
// fitted, ? = the sources disagree or are silent, '' = does not apply.
// Columns: fore course, main course, crossjack yard, fore, main and mizen
// topsails, topgallants (all three masts), royals set flying.

(function () {
  window.RIGDATA.MATRIX = {
    columns: [
      { name: 'Fore course', sail: 'fore-course' },
      { name: 'Main course', sail: 'main-course' },
      { name: 'Crossjack yard', sail: 'crossjack' },
      { name: 'Fore topsail', sail: 'fore-topsail' },
      { name: 'Main topsail', sail: 'main-topsail' },
      { name: 'Mizen topsail', sail: 'mizen-topsail' },
      { name: 'Topgallants', sail: 'main-topgallant' },
      { name: 'Royals', sail: 'main-royal' },
    ],
    rows: [
      ['Slings', 'yyy???nn', 'Lower yards hang by them. Steel’s table also lists a pair for the fore and main topsail yards without saying what for.'],
      ['Jeers', 'yyn     ', 'The crossjack is slung without jeers.'],
      ['Tye and halliards', '   yyyyy', 'Double tye and two halliards on the fore and main topsail yards; single on the mizen and the topgallants; halliards only on a royal.'],
      ['Truss pendents', 'yy?     ', 'Not listed for the crossjack in Steel’s table.'],
      ['Parrel', '   yyyyn', 'Ribs and trucks on topsail yards; lighter on topgallant yards.'],
      ['Lifts', 'yyyyyyyn', 'Running on the crossjack; single on topgallant yards.'],
      ['Braces', 'yyyyyyy?', 'Royal braces “sometimes” (Lever).'],
      ['Preventer braces', 'yyyyy?nn', 'In war only.'],
      ['Yard tackles', 'yynnnnnn', ''],
      ['Horses', 'yyyyyyy?', 'None mentioned for a flying royal yard.'],
      ['Stirrups', 'yy?yyynn', 'Steel’s table lists them for lower and topsail yards only.'],
      ['Flemish horses', 'nnnyyynn', '“The lower yards having none.”'],
      ['Sheets', 'yy yyyyn', 'A topsail’s run through the yard below; a royal’s clews are lashed.'],
      ['Tacks', 'yy nnnnn', 'To the boomkin on the fore, the chess-tree on the main.'],
      ['Clew garnets', 'yy nnnnn', ''],
      ['Clewlines', 'nn yyyyn', ''],
      ['Buntlines', 'yy yyy?n', 'Legs and falls on courses; two single on topsails; one with legs on a topgallant, in the text but not in Steel’s table.'],
      ['Leech-lines', 'yy ???nn', 'For topsails, in Steel’s table only.'],
      ['Slab-lines', 'yy nnnnn', ''],
      ['Bowlines and bridles', 'yy yyyyn', 'The main course’s and the mizen topsail’s cross to the opposite side.'],
      ['Reef tackles', 'nn yyynn', 'Topsails only in this period.'],
      ['Reef bands and points', 'yy yyynn', 'Up to four on the main topsail; two on the mizen in Lever.'],
      ['Head earings', 'yy yyyy?', ''],
      ['Robands', 'yy yyyyy', 'A topgallant sail “bends or laces to the yard”.'],
      ['Gaskets', 'yy yyyyn', 'A royal is furled in with the topgallant sail.'],
    ],
  };
})();
