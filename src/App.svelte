<script>
  import { onMount } from 'svelte';
  import { fuselages } from './store.js';
  import { initDriveAuth, login, logout } from './driveSync.js';
  import Fuselage from './Fuselage.svelte';

  let isAuth = false;

  // Dialog State
  let showDialog = false;
  let newName = '';
  let newType = 'spitfire';
  let newGender = 'male';

  $: previewImage = `plane_${newType}_${newGender}.jpg`;

  onMount(() => {
    initDriveAuth((authStatus) => {
      isAuth = authStatus;
      if (isAuth) {
        fuselages.syncFromDrive();
      }
    });
  });

  function openDialog() {
    newName = '';
    newType = 'green';
    newGender = 'male';
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
  }

  function add() {
    if (newName.trim()) {
      fuselages.addFuselage(newName.trim(), newType, newGender);
      closeDialog();
    }
  }
</script>

<div class="max-w-4xl mx-auto p-4 py-8 md:py-12">
  <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b-4 border-stone-800 pb-6">
    <h1 class="text-4xl md:text-5xl font-black uppercase tracking-widest text-stone-800 flex items-center gap-4">
      <div class="relative inline-flex items-center justify-center w-12 h-12">
        <span class="text-4xl">🪰</span>
        <svg class="absolute inset-0 w-12 h-12 text-red-700 drop-shadow-md" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round">
          <circle cx="50" cy="50" r="40" />
          <line x1="22" y1="22" x2="78" y2="78" />
        </svg>
      </div>
      Fly Ace
    </h1>
    <div>
      {#if isAuth}
        <button on:click={logout} class="bg-stone-300 hover:bg-stone-400 border-2 border-stone-800 text-stone-800 font-bold px-4 py-2 rounded-sm shadow-[2px_2px_0_rgba(28,25,23,1)] transition-transform active:translate-y-1 active:shadow-none uppercase text-sm tracking-wider">
          Disconnect Drive
        </button>
      {:else}
        <button on:click={login} class="bg-[#4c5c44] hover:bg-[#3d4a36] border-2 border-stone-800 text-[#e6e4d5] font-bold px-4 py-2 rounded-sm shadow-[2px_2px_0_rgba(28,25,23,1)] transition-transform active:translate-y-1 active:shadow-none uppercase text-sm tracking-wider">
          Sync to Google Drive
        </button>
      {/if}
    </div>
  </header>

  <div class="mb-12 text-center">
    <button on:click={openDialog} class="bg-[#4c5c44] hover:bg-[#3d4a36] border-2 border-stone-900 text-[#e6e4d5] px-10 py-4 rounded-sm font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(28,25,23,1)] text-xl transition-transform active:translate-y-1 active:shadow-none">
      + Requisition Aircraft
    </button>
  </div>

  <div class="space-y-10">
    {#if $fuselages.length === 0}
      <div class="text-center text-stone-600 py-16 bg-stone-200 rounded-sm border-2 border-stone-400 border-dashed uppercase tracking-widest font-bold">
        NO AIRCRAFT DEPLOYED. REQUEST REQUISITION ABOVE.
      </div>
    {/if}
    {#each $fuselages as fuselage (fuselage.id)}
      <Fuselage {fuselage} />
    {/each}
  </div>
</div>

{#if showDialog}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-stone-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" on:click|self={closeDialog}>
    <div class="bg-stone-100 border-4 border-stone-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)] max-w-xl w-full flex flex-col">
      <div class="p-6 bg-stone-300 border-b-4 border-stone-800 flex justify-between items-center">
        <h2 class="text-2xl font-black uppercase tracking-widest text-stone-800">New Aircraft Form</h2>
        <button on:click={closeDialog} class="text-stone-800 hover:text-red-700 text-3xl font-black">&times;</button>
      </div>
      
      <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
        
        <div>
          <label class="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-2" for="name">Pilot Callsign / Plane Name</label>
          <input 
            id="name"
            type="text" 
            bind:value={newName} 
            placeholder="e.g. MEMPHIS BELLE"
            class="w-full bg-stone-50 border-2 border-stone-400 rounded-sm px-4 py-3 font-bold uppercase focus:border-stone-800 focus:outline-none focus:bg-white"
            on:keydown={e => e.key === 'Enter' && add()}
          />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">Aircraft Model</label>
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3 cursor-pointer p-3 bg-stone-200 border-2 border-stone-300 rounded-sm hover:border-stone-500 has-[:checked]:border-stone-800 has-[:checked]:bg-stone-300 font-bold text-sm">
                <input type="radio" bind:group={newType} value="spitfire" class="w-5 h-5 accent-stone-800" /> Supermarine Spitfire
              </label>
              <label class="flex items-center gap-3 cursor-pointer p-3 bg-stone-200 border-2 border-stone-300 rounded-sm hover:border-stone-500 has-[:checked]:border-stone-800 has-[:checked]:bg-stone-300 font-bold text-sm">
                <input type="radio" bind:group={newType} value="hurricane" class="w-5 h-5 accent-stone-800" /> Hawker Hurricane
              </label>
              <label class="flex items-center gap-3 cursor-pointer p-3 bg-stone-200 border-2 border-stone-300 rounded-sm hover:border-stone-500 has-[:checked]:border-stone-800 has-[:checked]:bg-stone-300 font-bold text-sm">
                <input type="radio" bind:group={newType} value="lancaster" class="w-5 h-5 accent-stone-800" /> Avro Lancaster (Bomber)
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">Pilot</label>
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3 cursor-pointer p-3 bg-stone-200 border-2 border-stone-300 rounded-sm hover:border-stone-500 has-[:checked]:border-stone-800 has-[:checked]:bg-stone-300 font-bold text-sm">
                <input type="radio" bind:group={newGender} value="male" class="w-5 h-5 accent-stone-800" /> Male
              </label>
              <label class="flex items-center gap-3 cursor-pointer p-3 bg-stone-200 border-2 border-stone-300 rounded-sm hover:border-stone-500 has-[:checked]:border-stone-800 has-[:checked]:bg-stone-300 font-bold text-sm">
                <input type="radio" bind:group={newGender} value="female" class="w-5 h-5 accent-stone-800" /> Female
              </label>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">Blueprint Preview</label>
          <div class="w-full aspect-[2.5/1] border-4 border-stone-800 overflow-hidden bg-stone-300">
            <img src={previewImage} alt="Preview" class="w-full h-full object-cover" />
          </div>
        </div>
        
      </div>

      <div class="p-6 bg-stone-300 border-t-4 border-stone-800 flex justify-end gap-4">
        <button on:click={closeDialog} class="px-6 py-3 border-2 border-stone-800 rounded-sm font-bold uppercase tracking-widest text-stone-800 hover:bg-stone-200 shadow-[2px_2px_0_rgba(28,25,23,1)] active:translate-y-1 active:shadow-none transition-transform">
          Cancel
        </button>
        <button on:click={add} class="px-6 py-3 border-2 border-stone-900 rounded-sm font-black uppercase tracking-widest text-[#e6e4d5] bg-[#4c5c44] hover:bg-[#3d4a36] shadow-[2px_2px_0_rgba(28,25,23,1)] disabled:opacity-50 active:translate-y-1 active:shadow-none transition-transform" disabled={!newName.trim()}>
          Approve
        </button>
      </div>
    </div>
  </div>
{/if}
