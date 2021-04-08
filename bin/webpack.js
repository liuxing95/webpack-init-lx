#!/usr/bin/env node

/**
 * 
 * @param {string} command process to run 
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
const runCommand = (command, args) => {
  // 启动一个子进程
  const cp = require('child_process')
  return new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: 'inherit',
      shell: true
    })

    executedCommand.on('error', error => {
      rejects(error)
    })

    executedCommand.on("exit", code => {
			if (code === 0) {
				resolve();
			} else {
				reject();
			}
		});
  })
}

/**
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
const isInstalled = packageName => {
  try {
    require.resolve(packageName)
    return true
  } catch(err) {
    return false
  }
}

/**
 * @param {CliOption} cli options
 * @returns {void}
 */
const runCli = cli => {
  const path = require('path')
  const pkgPath = require.resolve(`${cli.package}/package.json`);
  const pkg = require(pkgPath)
  console.log(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]))
  require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]))
}

/**
 * @typedef {Object} CliOption
 * @property {string} name display name
 * @property {string} package npm package name
 * @property {string} binName name of the executable file
 * @property {boolean} installed currently installed?
 * @property {string} url homepage
 */

/** @type {CliOption} */
const cli = {
	name: "webpack-cli",
	package: "webpack-cli",
	binName: "webpack-cli",
	installed: isInstalled("webpack-cli"),
	url: "https://github.com/webpack/webpack-cli"
};

if (!cli.installed) {
  // 如果没有安装过 webpack-cli
  const path = require('path');
  const fs = require('graceful-fs');
  const readLine = require('readline')

  const notify = "CLI for webpack must be installed.\n" + `  ${cli.name} (${cli.url})\n`;
  console.log(notify)

  console.error(notify)

  let packageManager

  if (fs.existsSync(path.resolve(__dirname, 'yarn.lock'))) {
    packageManager = "yarn";
  } else if (fs.existsSync(path.resolve(__dirname, "pnpm-lock.yaml"))) {
		packageManager = "pnpm";
	} else {
		packageManager = "npm";
	}
  
  const installOptions = [packageManager === "yarn" ? "add" : "install", "-D"];

  console.error(
		`We will use "${packageManager}" to install the CLI via "${packageManager} ${installOptions.join(
			" "
		)} ${cli.package}".`
	);

  const question = `Do you want to install 'webpack-cli' (yes/no): `;

  const questionInterface = readLine.createInterface({
    input: process.stdin,
		output: process.stderr
  })


  process.exitCode = 1;

  questionInterface.question(question, answer => {
    questionInterface.close()

    const normalizedAnswer = answer.toLowerCase().startsWith('y');
    if (!normalizedAnswer) {
			console.error(
				"You need to install 'webpack-cli' to use webpack via CLI.\n" +
					"You can also install the CLI manually."
			);

			return;
		}

    process.exitCode = 0;

		console.log(
			`Installing '${
				cli.package
			}' (running '${packageManager} ${installOptions.join(" ")} ${
				cli.package
			}')...`
		);

    runCommand(packageManager, installOptions.concat(cli.package))
			.then(() => {
				runCli(cli);
			})
			.catch(error => {
				console.error(error);
				process.exitCode = 1;
			});
  })
} else {
  runCli(cli)
}