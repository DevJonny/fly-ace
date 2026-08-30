import { writable, get } from 'svelte/store';
import { saveToDrive, loadFromDrive, isAuthenticated } from './driveSync.js';

const STORAGE_KEY = 'fly-marks-data';

function createFuselagesStore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved ? JSON.parse(saved) : [];

  const { subscribe, set, update } = writable(initial);

  // Auto-sync function
  const triggerSync = async (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (isAuthenticated) {
      await saveToDrive(data);
    }
  };

  return {
    subscribe,
    addFuselage: (name, aircraftType = 'green', pilotGender = 'male') => {
      update(list => {
        const newList = [...list, { id: crypto.randomUUID(), name, aircraftType, pilotGender, markings: { fly: 0, wasp: 0, hornet: 0 } }];
        triggerSync(newList);
        return newList;
      });
    },
    removeFuselage: (id) => {
      update(list => {
        const newList = list.filter(f => f.id !== id);
        triggerSync(newList);
        return newList;
      });
    },
    addMarking: (id, type) => {
      update(list => {
        const newList = list.map(f => {
          if (f.id === id) {
            return {
              ...f,
              markings: {
                ...f.markings,
                [type]: (f.markings[type] || 0) + 1
              }
            };
          }
          return f;
        });
        triggerSync(newList);
        return newList;
      });
    },
    syncFromDrive: async () => {
      const driveData = await loadFromDrive();
      if (driveData && Array.isArray(driveData)) {
        set(driveData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(driveData));
      } else if (driveData === null) {
        // If there's no drive file yet but we are authenticated, save our local data to drive
        const localData = get(fuselages);
        if (localData.length > 0) {
          triggerSync(localData);
        }
      }
    }
  };
}

export const fuselages = createFuselagesStore();
