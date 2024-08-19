const { readFile, writeFile } = require("fs/promises");
const bcrypt = require("./airline-backend/node_modules/bcrypt");
const saltRounds = 12;

(async () => {
	const fileContent = await readFile("./db_schema_group19-new.sql", {
		encoding: "utf-8",
	});
	const lines = fileContent.split("\n");

	await Promise.all(
		lines.map((line, i) => {
			if (line.startsWith("INSERT INTO User")) {
				const insertValues = line.split("(")[1].split(")")[0].split("','");
				const password = insertValues[2];

				return new Promise((resolve) => {
					const id = `hashing ${password}`;
					console.time(id);
					bcrypt.hash(password, saltRounds, function (err, hash) {
						console.timeEnd(id);
						lines[i] = line.replace(password, `${hash}`);
						console.log(`hash for ${password} == ${hash.length} length`)
						resolve();
					});
				});
			} else if (line.startsWith("INSERT INTO Admin")) {
				const insertValues = line.split("(")[1].split(")")[0].split("','");
				let password = insertValues[insertValues.length - 1].slice(0, -1);
				insertValues[insertValues.length - 1] = password;

				const id = `hashing ${password}`;

				console.time(id);
				return new Promise((resolve) => {
					bcrypt.hash(password, saltRounds, function (err, hash) {
						console.timeEnd(id);
						lines[i] = line.replace(password, `${hash}`);
						resolve();
					});
				});
			}
		})
	);
	await writeFile("db_schema_group19-hashed-passwords.sql", lines.join("\n"));
})();
