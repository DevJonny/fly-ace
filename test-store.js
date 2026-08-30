import { fuselages } from './src/store.js';
const unsub = fuselages.subscribe(val => console.log(val));
fuselages.addFuselage("Test Plane");
fuselages.addMarking("test-id", "fly");
