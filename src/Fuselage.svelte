<script>
  import { fuselages } from './store.js';
  export let fuselage;

  const markingTypes = [
    { id: 'fly', emoji: '🪰', label: 'Fly' },
    { id: 'wasp', emoji: '🐝', label: 'Wasp' },
    { id: 'hornet', emoji: '🦟', label: 'Hornet' },
  ];

  function addMark(type) {
    fuselages.addMarking(fuselage.id, type);
  }

  function remove() {
    fuselages.removeFuselage(fuselage.id);
  }

  // Create an array of all markings to display in order on the fuselage
  $: allMarkings = [
    ...Array(fuselage.markings?.fly || 0).fill('🪰'),
    ...Array(fuselage.markings?.wasp || 0).fill('🐝'),
    ...Array(fuselage.markings?.hornet || 0).fill('🦟')
  ];

  // Default to green male if older save data doesn't have aircraftType/pilotGender
  $: bgImage = `/plane_${fuselage.aircraftType || 'green'}_${fuselage.pilotGender || 'male'}.jpg`;
</script>

<div class="bg-stone-100 rounded-sm mb-12 relative overflow-hidden border-4 border-stone-800 shadow-[6px_6px_0_rgba(28,25,23,1)]">
  <div class="p-4 bg-stone-300 border-b-4 border-stone-800 flex justify-between items-center">
    <h2 class="text-2xl md:text-3xl font-black uppercase tracking-widest text-stone-900">{fuselage.name}</h2>
    <button on:click={remove} class="text-stone-800 hover:text-red-700 font-bold px-3 py-1 text-sm uppercase tracking-wider border-2 border-transparent hover:border-red-700 rounded-sm transition-colors" title="Decommission Aircraft">Decommission</button>
  </div>
  
  <!-- Fuselage Image Container -->
  <div class="relative w-full aspect-[4/3] sm:aspect-[2/1] md:aspect-[2.5/1] bg-stone-400 overflow-hidden border-b-4 border-stone-800">
    <!-- The generated image -->
    <img 
      src={bgImage} 
      alt="Airplane Fuselage" 
      class="absolute inset-0 w-full h-full object-cover {fuselage.aircraftType === 'blue' ? 'object-[20%_center] scale-[1.7]' : 'object-center'}" 
    />
    
    <!-- Overlay for Markings -->
    <div class="absolute inset-0 flex items-center justify-start pointer-events-none">
       <!-- Grid for the markings, simulating stencil painting on the side of the fuselage. -->
       <div class="grid grid-rows-3 grid-flow-col gap-x-1 sm:gap-x-2 gap-y-0 {fuselage.aircraftType === 'blue' ? 'ml-[18%] md:ml-[22%]' : 'ml-[8%] md:ml-[12%]'} h-auto justify-start content-start">
         {#each allMarkings as emoji}
           <span class="text-sm sm:text-base md:text-lg filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none flex items-center justify-center">{emoji}</span>
         {/each}
       </div>
    </div>
  </div>

  <!-- Controls -->
  <div class="p-4 md:p-6 bg-stone-200 flex flex-wrap gap-4 justify-center">
    {#each markingTypes as {id, emoji, label}}
      <button 
        on:click={() => addMark(id)}
        class="flex items-center gap-3 bg-stone-300 hover:bg-stone-400 border-2 border-stone-800 text-stone-900 px-6 py-3 rounded-sm font-black uppercase tracking-widest shadow-[3px_3px_0_rgba(28,25,23,1)] transition-transform active:translate-y-1 active:shadow-none"
      >
        <span class="text-2xl leading-none">{emoji}</span>
        <span>Log {label}</span>
      </button>
    {/each}
  </div>
</div>
