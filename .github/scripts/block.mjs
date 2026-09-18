// The README block, in one place. The workflow writes it after every roll and
// the preview script renders it from the same state, so what gets reviewed is
// the same text that gets committed. No hand-editing the README to match.

import { escapeHtml } from './escape.mjs';

export const START_MARK = '<!-- DICE:START -->';
export const END_MARK = '<!-- DICE:END -->';

// Deliberately almost empty: the less there is on the issue page, the more
// obvious it is that Create is the only thing left to do.
const BODY = encodeURIComponent('Press Create. The workflow rolls it and closes this issue.\n');

export const ISSUE = `https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d20&body=${BODY}`;
export const PAGE = 'https://davi-tlr.github.io/Davi-Tlr/';

/**
 * @param state   the chronicle after the roll
 * @param journal newest entry first; journal[0] is the roll the die is showing
 */
export function renderBlock(state, journal) {
  const latestRoll = journal[0];

  const journalRows = journal.map(entry =>
    `\`d${entry.sides}\` **${entry.roll}** · [@${escapeHtml(entry.actor)}](https://github.com/${escapeHtml(entry.actor)}) ${escapeHtml(entry.text)}`
  ).join('<br>');

  const vaultRows = state.vault.length
    ? state.vault.map(item => `<b>${escapeHtml(item.relic)}</b> · ${escapeHtml(item.dungeon)} · by <a href="https://github.com/${escapeHtml(item.actor)}">@${escapeHtml(item.actor)}</a> in ${item.rolls} roll${item.rolls === 1 ? '' : 's'}`).join('<br>')
    : 'Empty. Nothing has been brought back yet.';

  const levelsToFloor = state.dungeon.floor - state.depth;
  const position = state.depth === 0
    ? `They are at the entrance, packs checked, ${state.torches} torches lit.`
    : `They are ${levelsToFloor} level${levelsToFloor === 1 ? '' : 's'} short of it, with ${state.torches} torch${state.torches === 1 ? '' : 'es'} still burning.`;

  return `${START_MARK}
<table>
<tr>
<td width="50%" valign="middle">

<img src="./assets/descent.svg" width="100%" alt="${escapeHtml(state.dungeon.name)}: level ${state.depth} of ${state.dungeon.floor}" />

</td>
<td width="50%" valign="middle">

### ${escapeHtml(state.dungeon.name)}

Somewhere on level ${state.dungeon.floor} lies **${escapeHtml(state.dungeon.relic)}**.
${position}${state.dungeon.attempts ? ` ${state.dungeon.attempts} expedition${state.dungeon.attempts === 1 ? ' has' : 's have'} already failed here.` : ''}

A high roll takes them deeper. A low one costs light. When the last torch
goes out they climb back up empty-handed, and the dungeon keeps what it has.

<p align="center">
  <a href="${ISSUE}"><img src="./assets/last-roll.svg" width="240" alt="Roll the d20. It last showed ${latestRoll.roll}, for @${escapeHtml(latestRoll.actor)}" /></a>
</p>

**[Roll it](${ISSUE})** opens an issue with the title already filled in. Press Create and
that is the roll: a workflow throws the die, moves the party and answers you in the thread.

<sub>Want one without the wait? There is a real die at
<a href="${PAGE}?throw">the descent</a>, in the browser, but that run is yours alone.</sub>

<sub>**${state.wins}** recovered &nbsp;·&nbsp; **${state.losses}** lost${state.best !== null ? ` &nbsp;·&nbsp; fastest descent: **${state.best}** rolls` : ''}</sub>

<details>
<summary>the vault &nbsp;·&nbsp; ${state.vault.length} recovered</summary>
<br>
<sub>${vaultRows}</sub>
</details>

</td>
</tr>
</table>

<sub>${journalRows}</sub>

${END_MARK}`;
}

/** Swap the block between the markers, leaving the rest of the README alone. */
export function spliceBlock(readme, block) {
  const startIndex = readme.indexOf(START_MARK);
  const endIndex = readme.indexOf(END_MARK);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`README is missing the ${START_MARK} / ${END_MARK} markers`);
  }
  return readme.slice(0, startIndex) + block + readme.slice(endIndex + END_MARK.length);
}
