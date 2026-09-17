<p align="center">
  <img src="./assets/banner.svg" width="100%" alt="Davi Lucas, software developer" />
</p>

<img align="right" width="130" src="./eu.png" alt="Davi Lucas" />

Nothing off the shelf fits, so I build it: the data model, the screen the
team actually uses, and the server it runs on. At work that means internal
applications, legacy systems that have to keep talking, and work that was
being done by hand.

Everything else here follows the same rule: I fly, so I built a
flight planner. I run an RPG table, so I built the room it meets in.

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

The 46 WAC charts used to fail silently in a single WMS request. It was an
undocumented URL limit on DECEA's server; splitting them into five sources
by region fixed it.

<img src="./assets/stack-navgate.svg" width="486" alt="React Native, TypeScript, Expo, MapLibre, SQLite" />

<p><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/metar-taf.jpg" alt="METAR and TAF" /><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/calculadora.jpeg" alt="Flight calculation" /><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/cartas-satelite.jpeg" alt="Charts over satellite" /><img width="24%" src="https://raw.githubusercontent.com/Davi-Tlr/NavGate/main/assets/screenshots/gps.jpeg" alt="GPS position" /></p>

<sub><i>Built as a university extension project at Estácio de Sá. A student pilot has used it in a real pre-flight briefing.</i></sub>

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

<sub><i>Built in a pair, integrated by pull request; the LiveKit server, the packaging and the releases are mine. That green is the editor theme of whoever was on screen, and it is not the app.</i></sub>

</td>
<td width="45%" valign="middle">

<img src="./assets/mazestream.gif" width="100%" alt="A live Mazestream room with two screens on stage" />

</td>
</tr>
</table>

<!-- ─────────────  Day job  ───────────── -->

<table>
<tr>
<td width="46%" valign="middle">

```
Hub GEFID    internal portal, every layer
             mine, DB2 integrations included

CBIOS        50 spreadsheets, two sectors,
             one ingestion, no code changes

3270         200+ unlocks, one at a time
             before

CETIP        198 registers, 40% duplicates,
             3h to under 1h

server       none for the interns; I asked
             for it, set it up, and run it
```

<img src="./assets/stack-dayjob.svg" width="396" alt="Python, Flask, pandas, SQLite, Linux" />

</td>
<td width="54%" valign="middle">

## The day job

I am a software development intern at Banco do Brasil, one of the largest
banks in the country. It runs on four tracks: the applications the area
works in, the legacy systems they have to keep talking to, the processes
that were still being done by hand, and the machine all of it sits on.

The two applications are the part I like most. A dashboard follows
decarbonization credits from issue to retirement, and its ingestion matches
fields by alias, so fifty spreadsheets from two different sectors land
without anyone touching the code. An internal portal on Flask and DB2
gathers the area's tools, and I drew the model and the architecture for it.

<sub><i>Most of it lives in private repositories.</i></sub>

</td>
</tr>
</table>

<br>

<!-- ─────────────  The table  ───────────── -->

<table>
<tr>
<td width="38%" valign="middle">

<img src="./Baldurs-Gate-II.gif" width="100%" alt="Baldur's Gate II" />

</td>
<td width="62%" valign="middle">

## The table

I've been running the same campaign long enough that it needed software
of its own: Foundry VTT modules, a streaming room, and a few things I
can't show here.

<sub><i>My players know this GitHub. No spoilers.</i></sub>

</td>
</tr>
</table>

<!-- DICE:START -->
<table>
<tr>
<td width="50%" valign="middle">

<img src="./assets/descent.svg" width="100%" alt="The Forgotten Gaol of Ash: level 1 of 9" />

</td>
<td width="50%" valign="middle">

### The Forgotten Gaol of Ash

Somewhere on level 9 lies **the name of something that would rather keep it**.
They are 8 levels short of it, with 3 torches still burning.

A high roll takes them deeper. A low one costs light. When the last torch
goes out they climb back up empty-handed, and the dungeon keeps what it has.

<p align="center">
  <a href="https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d20&body=Press%20Create.%20The%20workflow%20rolls%20it%20and%20closes%20this%20issue.%0A"><img src="./assets/last-roll.svg" width="240" alt="Roll the d20. It last showed 10, for @Davi-Tlr" /></a>
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

<sub>`d20` **10** · [@Davi-Tlr](https://github.com/Davi-Tlr) took the long corridor. Something breathed at the far end of it<br>`d20` **17** · [@Davi-Tlr](https://github.com/Davi-Tlr) reached the floor of The Forgotten Cistern of the Quiet King and came back up with a ledger of debts nobody remembers owing<br>`d20` **10** · [@Davi-Tlr](https://github.com/Davi-Tlr) went down through water that came to the knee, and lost a torch to it<br>`d20` **4** · [@Davi-Tlr](https://github.com/Davi-Tlr) retreated up a level with something following, and did not look back</sub>

<!-- DICE:END -->

<p align="center">
  <img src="./assets/divider.svg" width="70%" alt="" />
</p>

<p align="center">
  <sub>
    <a href="https://linkedin.com/in/davitlr/">linkedin.com/in/davitlr</a>
    &nbsp;·&nbsp;
    <a href="mailto:davitlr.ti@gmail.com">davitlr.ti@gmail.com</a>
  </sub>
</p>
