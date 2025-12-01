import { downloadVersionJar } from "./mojang/piston-data.js";

const jar = await downloadVersionJar("1.21.10", "client")
await jar.analyze();
console.log(jar.items);
