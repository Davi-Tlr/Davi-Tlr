<p align="center">
  <img src="./assets/banner.svg" width="100%" alt="Davi Lucas, software developer" />
</p>

<img align="right" width="130" src="./eu.png" alt="me" />

I fly, so I built a flight planner. I run a D&D table, so I built the room
it meets in. Nothing off the shelf fit either one, so the data model, the
interface and the server are mine in both, and the next one will be whatever
problem I find interesting enough to solve.

The rest of the week is a development internship at Banco do Brasil. That part
is further down.

<sub><i>home → RPG → code → break something → understand why → ⟳</i></sub>

<br clear="both" />

<p align="center">
  <img src="./assets/divider.svg" width="70%" alt="" />
</p>

<!-- ─────────────  NavGate · GIF left  ───────────── -->

<table>
<tr>
<td width="36%" valign="middle">

<img src="./assets/navgate.gif" width="100%" alt="NavGate: airfield search, METAR/TAF, route planning and aeronautical charts" />

</td>
<td width="64%" valign="middle">

## [NavGate](https://github.com/Davi-Tlr/NavGate)

**A VFR flight planner for Brazilian pilots, on Android.**

The paid ones charge in dollars and are built for someone else's airspace.
This one pulls charts from DECEA's WMS, METAR and TAF off the NOAA feed,
solves route legs by Haversine, draws the terrain profile under the track,
and keeps 4,609 Brazilian airfields in local SQLite, so search still answers
with the phone in airplane mode. Six public services, no backend of my own,
so it costs nothing to keep running.

A single WMS request for all 46 WAC charts comes back 414, so they load in five
regional groups instead.

<img src="./assets/stack-navgate.svg" width="486" alt="React Native, TypeScript, Expo, MapLibre, SQLite" />

<p><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/metar-taf.jpg" alt="METAR and TAF" /><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/calculadora.jpeg" alt="Flight calculation" /><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/cartas-satelite.jpeg" alt="Charts over satellite" /><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/gps.jpeg" alt="GPS position" /></p>

<sub><i>Built as a university extension project at Estácio de Sá. A student pilot has used it in a real briefing; it does not replace official sources.</i></sub>

</td>
</tr>
</table>

<!-- ─────────────  Mazestream · GIF right  ───────────── -->

<table>
<tr>
<td width="55%" valign="middle">

## [Mazestream](https://github.com/Davi-Tlr/Mazestream)

**A screen sharing room you host yourself.**

Video over LiveKit, a whiteboard built on Konva, pointers that expire on
their own, and clips cut in the browser so the server never has to record
a thing. Two screens fit on stage at once, and the room has Free, Game,
RPG and Presentation layouts, because my table needed one that fit it.

One codebase ships as two distributions, local and self-hosted. `npm run verify`
builds and tests both, and the packages come out with SHA-256 checksums and the
commit they were built from. CI runs on Windows and Linux.

<img src="./assets/stack-mazestream.svg" width="419" alt="React, LiveKit, WebRTC, Docker, Node.js" />

<sub><i>Built with one other person, integrated by pull request. The LiveKit server, the packaging and the releases were my side of it.</i></sub>

</td>
<td width="45%" valign="middle">

<img src="./assets/mazestream.gif" width="100%" alt="A live Mazestream room with two screens on stage" />

</td>
</tr>
</table>

<!-- ─────────────  Day job  ───────────── -->

## The day job

I'm a dev intern at Banco do Brasil. Macros, automations, dashboards, reading
data, and figuring out how to explain my stuff to people who are never going to
open the code. I build a lot of cool apps: an RPA on Windows driving a 3270
terminal, already delivered, and an app distribution portal for my
department, still in the works on a Linux box I set up and keep alive.

<img src="./assets/stack-dayjob.svg" width="396" alt="Python, Flask, pandas, SQLite, Linux" />

<sub><i>Most of it lives in private repos, so you'll have to take my word for it.</i></sub>

<!-- ─────────────  The dungeon  ───────────── -->

## The dungeon

There is a dungeon in this repository too: roll the die below and the party
goes deeper, or loses a torch.

<!-- DICE:START -->
<table>
<tr>
<td width="50%" valign="middle">

<img src="./assets/descent.svg" width="100%" alt="The Forgotten Gaol of Ash: level 0 of 9" />

</td>
<td width="50%" valign="middle">

### The Forgotten Gaol of Ash

Somewhere on level 9 lies **the name of something that would rather keep it**.
They are at the entrance, packs checked, 3 torches lit.

A high roll takes them deeper. A low one costs light. When the last torch
goes out they climb back up empty-handed, and the dungeon keeps what it has.

<p align="center">
  <a href="https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d20&body=Press%20Create.%20The%20workflow%20rolls%20it%20and%20closes%20this%20issue.%0A"><img src="./assets/last-roll.svg" width="240" alt="Roll the d20. It last showed 17, for @Davi-Tlr" /></a>
</p>

**[Roll it](https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d20&body=Press%20Create.%20The%20workflow%20rolls%20it%20and%20closes%20this%20issue.%0A)** opens an issue with the title already filled in. Press Create and
that is the roll: a workflow throws the die, moves the party and answers you in the thread.

<sub>Want one without the wait? There is a real die at
<a href="https://davi-tlr.github.io/Davi-Tlr/?throw">the descent</a>, in the browser, but that run is yours alone.</sub>

<sub>**1** recovered &nbsp;·&nbsp; **0** lost &nbsp;·&nbsp; fastest descent: **4** rolls</sub>

<details>
<summary>the vault &nbsp;·&nbsp; 1 recovered</summary>
<br>
<sub><b>a ledger of debts nobody remembers owing</b> · The Forgotten Cistern of the Quiet King · by <a href="https://github.com/Davi-Tlr">@Davi-Tlr</a> in 4 rolls</sub>
</details>

</td>
</tr>
</table>

<sub>`d20` **17** · [@Davi-Tlr](https://github.com/Davi-Tlr) reached the floor of The Forgotten Cistern of the Quiet King and came back up with a ledger of debts nobody remembers owing<br>`d20` **10** · [@Davi-Tlr](https://github.com/Davi-Tlr) went down through water that came to the knee, and lost a torch to it<br>`d20` **4** · [@Davi-Tlr](https://github.com/Davi-Tlr) retreated up a level with something following, and did not look back<br>`d20` **15** · [@Davi-Tlr](https://github.com/Davi-Tlr) crossed the bridge over the underground river without waking anything</sub>

<!-- DICE:END -->

<p align="center">
  <img src="./assets/divider.svg" width="70%" alt="" />
</p>

<p align="center">
  <a href="https://linkedin.com/in/davitlr/">linkedin.com/in/davitlr</a>
  &nbsp;·&nbsp;
  <a href="mailto:davitlr.ti@gmail.com">davitlr.ti@gmail.com</a>
</p>
