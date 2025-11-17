import { downloadVersionJar } from "./mojang/piston-data.js";

const jar = await downloadVersionJar("1.21.10", "client")
for await (const recipe of jar.getRecipes()) {
  console.log(recipe.getAllInputs());
}
