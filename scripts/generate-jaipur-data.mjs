import fs from "fs";

const out = "data";

if (!fs.existsSync(out)) {
  fs.mkdirSync(out, { recursive: true });
}

function write(name, data) {
  fs.writeFileSync(
    `${out}/${name}.ts`,
`export const ${name} = ${JSON.stringify(data, null, 2)};\n`
  );
}

const hospitals = [];

const schools = [];

const colleges = [];

const malls = [];

const metro = [];

const railway = [];

const busStations = [];

write("hospitals", hospitals);
write("schools", schools);
write("colleges", colleges);
write("malls", malls);
write("metro", metro);
write("railway", railway);
write("busStations", busStations);

console.log("✅ Dataset files created.");
