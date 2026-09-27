'use strict';
window.SKZCampaignData = {
  members: ['bangchan','leeknow','changbin','hyunjin','han','felix','seungmin','in'],
  worlds: [
    {id:'origins',name:'World 1: Origins & System Escape',tag:'HELLEVATOR / DISTRICT 9 / MIROH',accent:'#35e0d0',bg:'scene-hellevator.webp',previewEra:'hellevator',defaultChar:'bangchan',modes:[
      {id:'hellevator-shaft',name:'Hellevator Shaft Escape',family:'climb',bg:'scene-hellevator.webp',objective:'Climb to the extraction hatch. Reach the top before the rising laser grid catches you.',controls:'A/D or arrows move · Space jumps · land on moving lifts',max:1},
      {id:'district9-wall-breaker',name:'District 9 Wall Breaker',family:'breach',bg:'scene-district9.webp',objective:'Breach the security wall. Shoot drones and destroy each shield node while moving forward.',controls:'A/D or arrows move · Space jumps · J or click fires',max:3},
      {id:'miroh-maze-runner',name:'Miroh Maze Runner',family:'momentum',bg:'scene-miroh.webp',objective:'Keep your speed through the highway. Jump or dash over gaps and reach the finish.',controls:'A/D steer · Space jumps · Shift dashes',max:1}
    ]},
    {id:'anarchy',name:'World 2: Cyber Concrete & Anarchy',tag:'YELLOW WOOD / GO LIVE / IN LIFE',accent:'#f6c453',bg:'scene-miroh.webp',previewEra:'yellowwood',defaultChar:'hyunjin',modes:[
      {id:'yellow-wood-stealth',name:'Yellow Wood Stealth Run',family:'stealth',bg:'scene-miroh.webp',objective:'Collect five data chips and reach the exit without filling the searchlight alert meter.',controls:'A/D move · Space jumps · hold Down to crouch',max:5},
      {id:'gods-menu-rush',name:"God's Menu Kitchen Rush",family:'kitchen',bg:'scene-godsmenu.webp',objective:'Collect ingredients in order and deliver three dishes before the kitchen timer expires.',controls:'WASD or arrows move · E picks up or delivers',max:3},
      {id:'back-door-dash',name:'Back Door Phase Dash',family:'rhythm',bg:'scene-backdoor.webp',objective:'Survive the security chase by switching to the safe lane and phasing on the beat.',controls:'A/D change lanes · Space phases · follow the beat pulse',max:12}
    ]},
    {id:'identity',name:'World 3: Raw Power & Identity',tag:'GRRR/BEWARE / NOEASY / CHRISTMAS EVEL',accent:'#ab8cff',bg:'scene-grrr.webp',previewEra:'grrr',defaultChar:'han',modes:[
      {id:'shadow-forest-hunt',name:'Shadow Forest Hunt',family:'forest',bg:'scene-grrr.webp',objective:'Collect six energy shards and activate the forest beacon while avoiding shadow wolves.',controls:'WASD or arrows move · Space sends a decoy pulse',max:6},
      {id:'thunderous-clash',name:'Thunderous Soundwave Clash',family:'soundwave',bg:'scene-thunderous.webp',objective:'Cross the rooftops and clear ten incoming threats with sonic pulses.',controls:'A/D move · Space jumps · J fires a soundwave',max:10},
      {id:'christmas-evel-panic',name:'Christmas EveL Present Panic',family:'ice',bg:'scene-winter.webp',objective:'Slide over the ice, collect eight presents, and avoid rolling snowballs.',controls:'WASD or arrows steer · momentum continues after release',max:8}
    ]},
    {id:'matrix',name:'World 4: Cyber Matrix & Hearts',tag:'ODDINARY / MAXIDENT / SKZ-REPLAY',accent:'#8b7cf6',bg:'scene-maniac.webp',previewEra:'oddinary',defaultChar:'leeknow',modes:[
      {id:'maniac-gravity-inverter',name:'Maniac Gravity Inverter',family:'gravity',bg:'scene-maniac.webp',objective:'Flip gravity at terminal switches and reach the exit without touching the spikes.',controls:'A/D move · Space jumps · Q flips gravity · E uses terminal',max:3},
      {id:'case143-heart-defense',name:'Case 143 Heart Defense',family:'heart-defense',bg:'scene-maxident.webp',objective:'Match each falling monster shield with the right heart shot and clear three waves.',controls:'A/D move turret · 1/2/3 selects heart · Space or click fires',max:3},
      {id:'replay-cassette-rewind',name:'Replay Cassette Rewind',family:'memory',bg:'scene-cassette.webp',objective:'Repeat each button sequence, then rewind the hazard tape to restore all three logs.',controls:'Watch the sequence · use arrow keys to repeat · R rewinds a hazard',max:3}
    ]},
    {id:'celestial',name:'World 5: Celestial & Concert Arena',tag:'5-STAR / ROCK-STAR / ATE',accent:'#4fd8ff',bg:'scene-5star.webp',previewEra:'fivestar',defaultChar:'bangchan',modes:[
      {id:'s-class-constellation-climber',name:'S-Class Constellation Climber',family:'jetpack',bg:'scene-5star.webp',objective:'Boost between star platforms, refill fuel on landings, and reach the constellation gate.',controls:'A/D steer · hold Space to boost · land to refill fuel',max:1},
      {id:'lalalala-stage-blitz',name:'LALALALA Stage Blitz',family:'rhythm-runner',bg:'scene-rockstar.webp',objective:'Run the stage in time with the beat. Jump amplifiers and slide under pyrotechnics.',controls:'Space or Up jumps · Down slides · follow the visual beat',max:12},
      {id:'chk-chk-target-rush',name:'Chk Chk Boom Target Rush',family:'target-rush',bg:'scene-chk.webp',objective:'Auto-run through the street, tap eight reticles, and dash past the blockades.',controls:'Click or tap targets · A/D change lanes · Shift dashes',max:8}
    ]},
    {id:'horizons',name:'World 6: Next-Gen Horizons',tag:'HOP / GIANT / KARMA',accent:'#7cf9ff',bg:'scene-hop.webp',previewEra:'hop',defaultChar:'felix',modes:[
      {id:'quantum-dimension-switcher',name:'Quantum Dimension Switcher',family:'quantum',bg:'scene-hop.webp',objective:'Switch Blue and Pink dimensions to reveal platforms and reach the exit.',controls:'A/D move · Space jumps · Q switches dimensions',max:3},
      {id:'titan-mech-rampage',name:'Titan Mech Rampage',family:'titan',bg:'scene-giant.webp',objective:'Destroy four sentries, expose the core towers, and take down the mech defense.',controls:'WASD move · mouse aims · click or J fires · Space dashes',max:4},
      {id:'karma-arena-clash',name:'Karma Arena Clash',family:'karma',bg:'scene-karma.webp',objective:'Dodge expanding energy rings, collect six orbs, and trigger the arena blast.',controls:'WASD move · collect orbs · Space blasts when charged',max:6}
    ]},
    {id:'multiverse',name:'World 7: Cosmic Multiverse',tag:'DO IT / THIS & THAT / SYSTEM ERROR CORE',accent:'#ff63b4',bg:'scene-doit.webp',previewEra:'doit',defaultChar:'seungmin',modes:[
      {id:'do-it-power-charge',name:'Do It Power Charge',family:'doit-runner',bg:'scene-doit.webp',objective:'Keep your speed charge alive by collecting energy cells across the three-lane track.',controls:'A/D or arrows switch lanes · Space jumps · Shift dashes',max:1},
      {id:'this-that-dual-track-rush',name:'This & That Dual-Track Rush',family:'dual-track',bg:'scene-thisthat.webp',objective:'Switch between This and That tracks to dodge blockades and reach the endpoint.',controls:'Up/Down switches tracks · Space jumps',max:1},
      {id:'system-error-core-boss',name:'System Error Core Boss',family:'boss',bg:'scene-core.webp',objective:'Survive three boss phases. Jump, shoot, and swap dimensions to expose the core.',controls:'A/D move · Space jumps · J fires · Q swaps dimensions',max:3}
    ]}
  ]
};
