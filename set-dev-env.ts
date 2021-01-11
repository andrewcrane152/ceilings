const { writeFile } = require("fs");
const { environment } = require("./src/environments/environment");

const prefix = process.env.DEV_PREFIX;
const targetPath = "./src/environments/environment.dev-generated.ts";

const newEnv = {
  ...environment,
  API_URL: prefix ? `${prefix}-api.3-form.com` : "dev-api.3-form.com:3000",
};

// `environment.ts` file structure
const envConfigFile = `export const environment = ${JSON.stringify(newEnv)};`;

console.log(
  "The file `environment.ts` will be written with the following content: \n"
);
console.log(envConfigFile);
writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment.ts file generated correctly at ${targetPath} \n`
    );
  }
});
